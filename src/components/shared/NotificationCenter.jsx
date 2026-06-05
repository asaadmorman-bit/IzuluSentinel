import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, X, Check, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { formatDistanceToNow } from "date-fns";

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [] } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return base44.entities.Notification.filter(
        { recipients: { $in: [user.email] } },
        '-created_date',
        50
      );
    },
    refetchInterval: 30000
  });

  const acknowledgeMutation = useMutation({
    mutationFn: (notificationId) => {
      const notification = notifications.find(n => n.id === notificationId);
      return base44.entities.Notification.update(notificationId, {
        acknowledged: true,
        acknowledged_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['notifications']);
    }
  });

  const unreadCount = notifications.filter(n => !n.read && !n.acknowledged).length;

  const getIcon = (type) => {
    switch (type) {
      case "critical": return AlertTriangle;
      case "warning": return AlertTriangle;
      case "success": return CheckCircle;
      default: return Info;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case "critical": return "text-red-400";
      case "warning": return "text-amber-400";
      case "success": return "text-emerald-400";
      default: return "text-blue-400";
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-gray-400 hover:text-white">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#DC2626] text-white text-xs">
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 bg-[#0f0f0f] border-[#1a1a1a] p-0" align="end">
        <div className="p-4 border-b border-[#1a1a1a]">
          <h3 className="font-semibold text-white">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-gray-400 mt-1">{unreadCount} unread</p>
          )}
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center">
              <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-sm text-gray-400">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-[#1a1a1a]">
              {notifications.slice(0, 10).map((notification) => {
                const Icon = getIcon(notification.type);
                const color = getColor(notification.type);
                
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-[#1a1a1a] transition-colors ${
                      !notification.read && !notification.acknowledged ? 'bg-[#0a0a0a]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${color} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white mb-1">
                          {notification.title}
                        </p>
                        <p className="text-xs text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_date), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.acknowledged && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-gray-400 hover:text-white"
                          onClick={() => acknowledgeMutation.mutate(notification.id)}
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}