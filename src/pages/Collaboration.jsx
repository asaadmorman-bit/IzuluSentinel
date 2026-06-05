import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  MessageCircle, 
  MapPin, 
  CheckSquare, 
  Users, 
  Radio,
  AlertTriangle,
  Clock,
  Activity
} from "lucide-react";

import MessageThread from "../components/collaboration/MessageThread";
import MapAnnotations from "../components/collaboration/MapAnnotations";
import TaskBoard from "../components/collaboration/TaskBoard";
import IncidentChannels from "../components/collaboration/IncidentChannels";

export default function Collaboration() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("channels");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await base44.auth.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const { data: incidents = [] } = useQuery({
    queryKey: ['active_incidents'],
    queryFn: () => base44.entities.Incident.filter({ status: { $in: ["active", "monitoring"] } }, "-created_date", 20),
    refetchInterval: 10000
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['team_messages', selectedChannel],
    queryFn: () => {
      if (!selectedChannel) return [];
      return base44.entities.TeamMessage.filter({ channel_id: selectedChannel }, "-created_date", 100);
    },
    enabled: !!selectedChannel,
    refetchInterval: 3000
  });

  const { data: annotations = [] } = useQuery({
    queryKey: ['map_annotations'],
    queryFn: () => base44.entities.MapAnnotation.list("-created_date", 100),
    refetchInterval: 5000
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['collaborative_tasks'],
    queryFn: () => base44.entities.CollaborativeTask.list("-created_date", 100),
    refetchInterval: 5000
  });

  const activeIncidents = incidents.filter(i => i.status === "active");
  const unreadMessages = messages.filter(m => !m.read_by?.includes(user?.email)).length;
  const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Radio className="w-10 h-10 text-[#DC2626]" />
              Team Collaboration Center
            </h1>
            <p className="text-gray-400">Real-time coordination for security operations</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Live Connection Active</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="bg-[#DC2626]/20 text-[#DC2626] flex items-center gap-2 px-4 py-2">
              <Users className="w-4 h-4" />
              {incidents.length} Active Operations
            </Badge>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Incidents</p>
                  <p className="text-2xl font-bold text-white">{activeIncidents.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Unread Messages</p>
                  <p className="text-2xl font-bold text-white">{unreadMessages}</p>
                </div>
                <MessageCircle className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Tasks</p>
                  <p className="text-2xl font-bold text-white">{pendingTasks}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Map Annotations</p>
                  <p className="text-2xl font-bold text-white">{annotations.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Collaboration Tabs */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 bg-[#1a1a1a] p-1">
                <TabsTrigger 
                  value="channels"
                  className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Incident Channels
                </TabsTrigger>
                <TabsTrigger 
                  value="messaging"
                  className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white"
                >
                  <Radio className="w-4 h-4 mr-2" />
                  Team Messaging
                </TabsTrigger>
                <TabsTrigger 
                  value="map"
                  className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Map Annotations
                </TabsTrigger>
                <TabsTrigger 
                  value="tasks"
                  className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white"
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Task Board
                </TabsTrigger>
              </TabsList>

              <TabsContent value="channels" className="mt-6">
                <IncidentChannels 
                  incidents={incidents}
                  onSelectChannel={setSelectedChannel}
                  selectedChannel={selectedChannel}
                  user={user}
                />
              </TabsContent>

              <TabsContent value="messaging" className="mt-6">
                <MessageThread 
                  messages={messages}
                  channelId={selectedChannel}
                  user={user}
                />
              </TabsContent>

              <TabsContent value="map" className="mt-6">
                <MapAnnotations 
                  annotations={annotations}
                  incidents={incidents}
                  user={user}
                />
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <TaskBoard 
                  tasks={tasks}
                  incidents={incidents}
                  user={user}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Secure End-to-End Encryption</h3>
                <p className="text-gray-400">
                  All communications are encrypted and logged for compliance. Messages are retained for 90 days.
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="border-[#2a2a2a] text-white">
                  <Activity className="w-4 h-4 mr-2" />
                  Activity Log
                </Button>
                <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
                  <Users className="w-4 h-4 mr-2" />
                  Invite Team
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}