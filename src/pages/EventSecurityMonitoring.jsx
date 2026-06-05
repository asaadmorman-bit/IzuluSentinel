
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Radio, 
  MapPin, 
  Users, 
  Shield,
  AlertTriangle,
  Activity,
  MessageSquare,
  TrendingUp
} from "lucide-react";

import EventList from "../components/events/EventList";
import LiveSocialMonitoring from "../components/events/LiveSocialMonitoring";
import EventThreatMap from "../components/events/EventThreatMap";
import SentimentAnalysis from "../components/events/SentimentAnalysis";

export default function EventSecurityMonitoring() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("events");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const hasAccess = currentUser?.role && ["admin", "command_staff", "soc_analyst", "security_personnel"].includes(currentUser.role);

  const { data: events = [] } = useQuery({
    queryKey: ['event_security'],
    queryFn: () => base44.entities.EventSecurity.list("-event_date", 100),
    refetchInterval: 30000,
    enabled: hasAccess
  });

  const { data: socialIntel = [] } = useQuery({
    queryKey: ['social_intel', selectedEvent?.id],
    queryFn: () => {
      if (!selectedEvent) return [];
      return base44.entities.SocialMediaIntel.filter(
        { event_id: selectedEvent.id },
        "-posted_at",
        200
      );
    },
    refetchInterval: 10000,
    enabled: !!selectedEvent && hasAccess
  });

  const upcomingEvents = events.filter(e => 
    new Date(e.event_date) > new Date() && 
    (e.security_status === "planning" || e.security_status === "monitoring")
  );

  const activeEvents = events.filter(e => 
    e.security_status === "active" || e.security_status === "incident"
  );

  const stats = {
    totalEvents: events.length,
    activeMonitoring: activeEvents.length,
    upcomingEvents: upcomingEvents.length,
    highThreat: events.filter(e => e.threat_level === "high" || e.threat_level === "critical").length,
    totalAlerts: events.reduce((sum, e) => sum + (e.real_time_alerts || 0), 0),
    socialIntelToday: socialIntel.filter(s => {
      const posted = new Date(s.posted_at);
      const today = new Date();
      return posted.toDateString() === today.toDateString();
    }).length
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                Event Security Monitoring requires security personnel privileges or higher.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Radio className="w-10 h-10 text-[#DC2626]" />
              Event Security & Social Intelligence
            </h1>
            <p className="text-gray-400">Real-time monitoring for sporting events, concerts, stadiums, and entertainment venues</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Live Social Monitoring Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            Real-Time Intelligence
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Events</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
                </div>
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Now</p>
                  <p className="text-2xl font-bold text-white">{stats.activeMonitoring}</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Upcoming</p>
                  <p className="text-2xl font-bold text-white">{stats.upcomingEvents}</p>
                </div>
                <Users className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Threat</p>
                  <p className="text-2xl font-bold text-white">{stats.highThreat}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Alerts</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAlerts}</p>
                </div>
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Social Intel Today</p>
                  <p className="text-2xl font-bold text-white">{stats.socialIntelToday}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Banner */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Geolocation Monitoring</h4>
                  <p className="text-sm text-gray-400">
                    Track threats within defined radius around venue
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Multi-Source Intelligence</h4>
                  <p className="text-sm text-gray-400">
                    Social media, news, dark web, blogs, forums
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Real-Time Analysis</h4>
                  <p className="text-sm text-gray-400">
                    AI-powered threat detection and sentiment analysis
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Rapid Response</h4>
                  <p className="text-sm text-gray-400">
                    Instant alerts for security teams on the ground
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-[#1a1a1a]">
            <TabsTrigger value="events" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Events
            </TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              Live Social
            </TabsTrigger>
            <TabsTrigger value="map" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Radio className="w-4 h-4 mr-2" />
              Threat Map
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Sentiment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="mt-6">
            <EventList
              events={events}
              user={currentUser}
              onSelectEvent={setSelectedEvent}
              selectedEvent={selectedEvent}
            />
          </TabsContent>

          <TabsContent value="social" className="mt-6">
            <LiveSocialMonitoring
              socialIntel={socialIntel}
              selectedEvent={selectedEvent}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="map" className="mt-6">
            <EventThreatMap
              events={events}
              socialIntel={socialIntel}
              selectedEvent={selectedEvent}
            />
          </TabsContent>

          <TabsContent value="sentiment" className="mt-6">
            <SentimentAnalysis
              socialIntel={socialIntel}
              selectedEvent={selectedEvent}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
