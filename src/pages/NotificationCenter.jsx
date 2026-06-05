
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Notification } from "@/entities/Notification";
import { User } from "@/entities/User";
import { Bell, X, Check, AlertTriangle, Info, CheckCircle, Filter, Search } from "lucide-react";
import { format } from "date-fns";

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setIsLoading(true);
    const data = await Notification.list("-created_date", 100);
    setNotifications(data);
    setIsLoading(false);
  };

  const markAsRead = async (id) => {
    await Notification.update(id, { read: true });
    loadNotifications();
  };

  const acknowledge = async (id) => {
    try {
      const user = await User.me();
      await Notification.update(id, { 
        acknowledged: true,
        acknowledged_by: user.email,
        acknowledged_at: new Date().toISOString()
      });
      loadNotifications();
    } catch (error) {
      console.error("Error acknowledging notification:", error);
    }
  };

  const deleteNotification = async (id) => {
    await Notification.delete(id);
    loadNotifications();
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.read;
    if (filter === "unacknowledged") return !n.acknowledged && n.action_required;
    return n.type === filter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;
  const actionRequiredCount = notifications.filter(n => n.action_required && !n.acknowledged).length;

  const getIcon = (type) => {
    switch(type) {
      case "critical": return AlertTriangle; // Changed from AlertCircle to AlertTriangle based on outline
      case "alert": return AlertTriangle;
      case "warning": return AlertTriangle;
      case "success": return CheckCircle;
      default: return Info;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Bell className="w-8 h-8 text-[#DC2626]" />
            Notification Center
          </h1>
          <p className="text-gray-400">Manage alerts and system notifications</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Total</p>
              <p className="text-2xl font-bold text-white">{notifications.length}</p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Unread</p>
              <p className="text-2xl font-bold text-cyan-400">{unreadCount}</p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Action Required</p>
              <p className="text-2xl font-bold text-red-400">{actionRequiredCount}</p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Critical</p>
              <p className="text-2xl font-bold text-amber-400">
                {notifications.filter(n => n.type === "critical").length}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            className={filter === "all" ? "bg-[#DC2626]" : "border-[#2a2a2a]"}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("unread")}
            variant={filter === "unread" ? "default" : "outline"}
            size="sm"
            className={filter === "unread" ? "bg-[#DC2626]" : "border-[#2a2a2a]"}
          >
            Unread ({unreadCount})
          </Button>
          <Button
            onClick={() => setFilter("unacknowledged")}
            variant={filter === "unacknowledged" ? "default" : "outline"}
            size="sm"
            className={filter === "unacknowledged" ? "bg-[#DC2626]" : "border-[#2a2a2a]"}
          >
            Action Required ({actionRequiredCount})
          </Button>
          <Button
            onClick={() => setFilter("critical")}
            variant={filter === "critical" ? "default" : "outline"}
            size="sm"
            className={filter === "critical" ? "bg-[#DC2626]" : "border-[#2a2a2a]"}
          >
            Critical
          </Button>
          <Button
            onClick={() => setFilter("alert")}
            variant={filter === "alert" ? "default" : "outline"}
            size="sm"
            className={filter === "alert" ? "bg-[#DC2626]" : "border-[#2a2a2a]"}
          >
            Alerts
          </Button>
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => {
            const Icon = getIcon(notification.type);
            return (
              <Card 
                key={notification.id} 
                className={`border-[#1a1a1a] ${notification.read ? 'bg-[#0a0a0a]' : 'bg-[#0f0f0f]'} transition-colors`}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-2 rounded-lg ${
                      notification.type === "critical" ? "bg-red-500/20" :
                      notification.type === "alert" || notification.type === "warning" ? "bg-amber-500/20" :
                      notification.type === "success" ? "bg-emerald-500/20" :
                      "bg-cyan-500/20"
                    }`}>
                      <Icon className={`w-5 h-5 ${
                        notification.type === "critical" ? "text-red-400" :
                        notification.type === "alert" || notification.type === "warning" ? "text-amber-400" :
                        notification.type === "success" ? "text-emerald-400" :
                        "text-cyan-400"
                      }`} />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-white">{notification.title}</h3>
                          <div className="flex gap-2 mt-1">
                            <Badge className="text-xs capitalize bg-gray-700 text-gray-300">
                              {notification.category}
                            </Badge>
                            <Badge className={`text-xs capitalize ${
                              notification.priority === "critical" || notification.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                              notification.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                              "bg-cyan-500/20 text-cyan-400"
                            }`}>
                              {notification.priority}
                            </Badge>
                            {!notification.read && (
                              <Badge className="text-xs bg-cyan-500/20 text-cyan-400">New</Badge>
                            )}
                            {notification.action_required && !notification.acknowledged && (
                              <Badge className="text-xs bg-red-500/20 text-red-400">Action Required</Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => markAsRead(notification.id)}
                              className="text-gray-400 hover:text-white"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          )}
                          {notification.action_required && !notification.acknowledged && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => acknowledge(notification.id)}
                              className="text-gray-400 hover:text-emerald-400"
                            >
                              {/* Changed from CheckCheck to Check based on the outline's icon imports */}
                              <Check className="w-4 h-4" /> 
                            </Button>
                          )}
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteNotification(notification.id)}
                            className="text-gray-400 hover:text-red-400"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <p className="text-gray-300 text-sm mb-2">{notification.message}</p>
                      
                      {notification.acknowledged && (
                        <p className="text-xs text-emerald-400 mb-2">
                          ✓ Acknowledged by {notification.acknowledged_by} at {format(new Date(notification.acknowledged_at), 'MMM d, HH:mm')}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{notification.created_date && format(new Date(notification.created_date), 'MMM d, yyyy HH:mm')}</span>
                        {notification.expires_at && (
                          <span>Expires: {format(new Date(notification.expires_at), 'MMM d, HH:mm')}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-20">
            <Bell className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
