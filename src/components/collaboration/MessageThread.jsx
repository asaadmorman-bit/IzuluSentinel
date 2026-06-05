import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Send, AlertCircle, MapPin, Paperclip, Pin } from "lucide-react";
import { format } from "date-fns";

export default function MessageThread({ messages, channelId, user }) {
  const [newMessage, setNewMessage] = useState("");
  const [messageType, setMessageType] = useState("text");
  const messagesEndRef = useRef(null);
  const queryClient = useQueryClient();

  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => base44.entities.TeamMessage.create(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_messages'] });
      setNewMessage("");
    }
  });

  const markAsReadMutation = useMutation({
    mutationFn: ({ id, readBy }) => base44.entities.TeamMessage.update(id, { read_by: readBy }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_messages'] });
    }
  });

  useEffect(() => {
    scrollToBottom();
    markMessagesAsRead();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const markMessagesAsRead = () => {
    if (!user) return;
    messages.forEach((msg) => {
      if (!msg.read_by?.includes(user.email)) {
        const updatedReadBy = [...(msg.read_by || []), user.email];
        markAsReadMutation.mutate({ id: msg.id, readBy: updatedReadBy });
      }
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !channelId || !user) return;

    sendMessageMutation.mutate({
      channel_id: channelId,
      channel_type: "incident",
      message: newMessage,
      message_type: messageType,
      priority: messageType === "alert" ? "urgent" : "normal",
      sender_name: user.full_name || user.email,
      sender_role: user.role || "security_personnel",
      read_by: [user.email]
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "urgent": return "border-l-red-500";
      case "high": return "border-l-orange-500";
      default: return "border-l-cyan-500";
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case "alert": return <AlertCircle className="w-4 h-4 text-red-400" />;
      case "location": return <MapPin className="w-4 h-4 text-cyan-400" />;
      case "status_update": return <Pin className="w-4 h-4 text-amber-400" />;
      default: return null;
    }
  };

  if (!channelId) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Select an Incident Channel</h3>
        <p className="text-gray-400">Choose a channel from the Incident Channels tab to start communicating</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Message Type Selector */}
      <div className="flex gap-2 p-3 bg-[#1a1a1a] rounded-lg">
        <Button
          size="sm"
          variant={messageType === "text" ? "default" : "ghost"}
          onClick={() => setMessageType("text")}
          className={messageType === "text" ? "bg-[#DC2626]" : "text-gray-400"}
        >
          Text
        </Button>
        <Button
          size="sm"
          variant={messageType === "alert" ? "default" : "ghost"}
          onClick={() => setMessageType("alert")}
          className={messageType === "alert" ? "bg-[#DC2626]" : "text-gray-400"}
        >
          <AlertCircle className="w-4 h-4 mr-1" />
          Alert
        </Button>
        <Button
          size="sm"
          variant={messageType === "status_update" ? "default" : "ghost"}
          onClick={() => setMessageType("status_update")}
          className={messageType === "status_update" ? "bg-[#DC2626]" : "text-gray-400"}
        >
          Status Update
        </Button>
      </div>

      {/* Messages */}
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-4">
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`p-4 rounded-lg border-l-4 ${getPriorityColor(message.priority)} ${
                    message.created_by === user?.email ? "bg-[#DC2626]/10" : "bg-[#1a1a1a]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getMessageTypeIcon(message.message_type)}
                      <span className="font-semibold text-white">{message.sender_name}</span>
                      {message.sender_role && (
                        <Badge variant="outline" className="text-xs">
                          {message.sender_role}
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(message.created_date), "HH:mm:ss")}
                    </span>
                  </div>

                  <p className="text-white mb-2">{message.message}</p>

                  {message.location && (
                    <div className="flex items-center gap-2 text-sm text-cyan-400 mt-2">
                      <MapPin className="w-4 h-4" />
                      {message.location.name || `${message.location.latitude}, ${message.location.longitude}`}
                    </div>
                  )}

                  {message.priority === "urgent" && (
                    <Badge className="mt-2 bg-red-500/20 text-red-400">
                      URGENT
                    </Badge>
                  )}

                  {message.is_pinned && (
                    <Badge className="mt-2 bg-amber-500/20 text-amber-400">
                      <Pin className="w-3 h-3 mr-1" />
                      Pinned
                    </Badge>
                  )}

                  <div className="text-xs text-gray-500 mt-2">
                    Read by {message.read_by?.length || 0} team member(s)
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder={`Send ${messageType === "alert" ? "urgent alert" : "message"}...`}
          className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim() || sendMessageMutation.isPending}
          className="bg-[#DC2626] hover:bg-[#B91C1C]"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}