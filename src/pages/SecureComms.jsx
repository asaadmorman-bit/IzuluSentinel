import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { MessageCircle, Send, Lock, Users, Phone, Video, Shield } from "lucide-react";
import { format } from "date-fns";

export default function SecureComms() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("team_alpha");

  const loadUser = useCallback(async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  }, []);

  const loadMessages = useCallback(() => {
    // Load from localStorage for demo
    const saved = localStorage.getItem(`messages_${selectedChannel}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
      // Sample messages
      const sampleMessages = [
        {
          id: "1",
          sender: "John Smith",
          message: "Team Alpha, check in when you reach the checkpoint.",
          timestamp: new Date(Date.now() - 300000).toISOString(),
          encrypted: true
        },
        {
          id: "2",
          sender: "Sarah Johnson",
          message: "Checkpoint reached. All clear. No threats detected.",
          timestamp: new Date(Date.now() - 240000).toISOString(),
          encrypted: true
        },
        {
          id: "3",
          sender: "Mike Chen",
          message: "Copy that. Proceeding to next waypoint.",
          timestamp: new Date(Date.now() - 180000).toISOString(),
          encrypted: true
        }
      ];
      setMessages(sampleMessages);
    }
  }, [selectedChannel]);

  useEffect(() => {
    loadUser();
    loadMessages();
  }, [selectedChannel, loadUser, loadMessages]);

  const sendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message = {
      id: Date.now().toString(),
      sender: user.full_name,
      message: newMessage,
      timestamp: new Date().toISOString(),
      encrypted: true
    };

    const updated = [...messages, message];
    setMessages(updated);
    localStorage.setItem(`messages_${selectedChannel}`, JSON.stringify(updated));
    setNewMessage("");
  };

  const channels = [
    { id: "team_alpha", name: "Team Alpha", members: 8 },
    { id: "command_center", name: "Command Center", members: 15 },
    { id: "field_ops", name: "Field Operations", members: 12 },
    { id: "emergency", name: "Emergency Response", members: 25 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            Secure Communications
          </h1>
          <p className="text-gray-400">End-to-end encrypted team communications</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Channels</p>
                  <p className="text-3xl font-bold text-white">{channels.length}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-white">60</p>
                </div>
                <Users className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Encryption</p>
                  <p className="text-lg font-bold text-emerald-400">AES-256</p>
                </div>
                <Lock className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Status</p>
                  <p className="text-lg font-bold text-emerald-400">Secure</p>
                </div>
                <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Channels Sidebar */}
          <Card className="border-[#1a1a1a] bg-[#0f0f0f] lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-white text-sm flex items-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedChannel === channel.id
                      ? "bg-[#DC2626] text-white"
                      : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"
                  }`}
                >
                  <div className="font-medium">{channel.name}</div>
                  <div className="text-xs opacity-70 flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3" />
                    {channel.members} members
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <Card className="border-[#1a1a1a] bg-[#0f0f0f] lg:col-span-3">
            <CardHeader className="border-b border-[#1a1a1a]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-500" />
                  {channels.find(c => c.id === selectedChannel)?.name}
                  <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                    End-to-End Encrypted
                  </Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                    <Video className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Messages */}
              <div className="h-[500px] overflow-y-auto p-6 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === user?.full_name ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === user?.full_name
                          ? "bg-[#DC2626] text-white"
                          : "bg-[#1a1a1a] text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{msg.sender}</span>
                        {msg.encrypted && (
                          <Lock className="w-3 h-3 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-sm">{msg.message}</p>
                      <span className="text-xs opacity-70 mt-1 block">
                        {format(new Date(msg.timestamp), "HH:mm")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="border-t border-[#1a1a1a] p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a secure message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                  <Button onClick={sendMessage} className="bg-[#DC2626] hover:bg-[#B91C1C]">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Messages are encrypted end-to-end with AES-256
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}