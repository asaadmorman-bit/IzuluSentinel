
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, MapPin, Users, Calendar, Radio, Shield, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function EventList({ events, user, onSelectEvent, selectedEvent }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    event_name: "",
    event_type: "concert",
    venue_name: "",
    venue_capacity: 0,
    expected_attendance: 0,
    event_date: "",
    geofence_radius: 5,
    location: {
      city: "",
      state: "",
      country: "",
      latitude: 0,
      longitude: 0
    }
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData) => {
      if (!user || !["admin", "command_staff", "soc_analyst", "security_personnel"].includes(user.role)) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      // Generate AI-powered security analysis
      const analysisPrompt = `You are a security expert for events. Analyze this event and provide security recommendations:

Event: ${eventData.event_name}
Type: ${eventData.event_type}
Venue: ${eventData.venue_name}
Capacity: ${eventData.venue_capacity}
Expected Attendance: ${eventData.expected_attendance}
Location: ${eventData.location.city}, ${eventData.location.country}

Provide:
1. Threat level assessment (low, medium, high, critical)
2. Social monitoring keywords (10-15)
3. Social monitoring hashtags (5-10)
4. Potential threat types
5. Security recommendations

Format as JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            threat_level: { type: "string" },
            keywords: {
              type: "array",
              items: { type: "string" }
            },
            hashtags: {
              type: "array",
              items: { type: "string" }
            },
            potential_threats: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      return base44.entities.EventSecurity.create({
        ...eventData,
        threat_level: aiResponse.threat_level || "medium",
        security_status: "planning",
        social_monitoring: {
          enabled: true,
          platforms: ["twitter", "facebook", "instagram", "reddit", "telegram"],
          keywords: aiResponse.keywords || [],
          hashtags: aiResponse.hashtags || []
        },
        detected_threats: [],
        real_time_alerts: 0,
        security_team: [user.email],
        last_intelligence_update: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event_security'] });
      setShowCreateForm(false);
      setNewEvent({
        event_name: "",
        event_type: "concert",
        venue_name: "",
        venue_capacity: 0,
        expected_attendance: 0,
        event_date: "",
        geofence_radius: 5,
        location: { city: "", state: "", country: "", latitude: 0, longitude: 0 }
      });
    }
  });

  const getThreatColor = (level) => {
    switch (level) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "incident": return "bg-red-500/20 text-red-400";
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "monitoring": return "bg-cyan-500/20 text-cyan-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Event Security Operations
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Event
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Event Security Operation</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Event Name</label>
                  <Input
                    value={newEvent.event_name}
                    onChange={(e) => setNewEvent({ ...newEvent, event_name: e.target.value })}
                    placeholder="e.g., Super Bowl LVIII"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Event Type</label>
                  <Select
                    value={newEvent.event_type}
                    onValueChange={(value) => setNewEvent({ ...newEvent, event_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sporting">Sporting Event</SelectItem>
                      <SelectItem value="concert">Concert</SelectItem>
                      <SelectItem value="festival">Festival</SelectItem>
                      <SelectItem value="conference">Conference</SelectItem>
                      <SelectItem value="appearance">Celebrity Appearance</SelectItem>
                      <SelectItem value="rally">Rally</SelectItem>
                      <SelectItem value="parade">Parade</SelectItem>
                      <SelectItem value="exhibition">Exhibition</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Venue Name</label>
                  <Input
                    value={newEvent.venue_name}
                    onChange={(e) => setNewEvent({ ...newEvent, venue_name: e.target.value })}
                    placeholder="e.g., Madison Square Garden"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Event Date & Time</label>
                  <Input
                    type="datetime-local"
                    value={newEvent.event_date}
                    onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Venue Capacity</label>
                  <Input
                    type="number"
                    value={newEvent.venue_capacity}
                    onChange={(e) => setNewEvent({ ...newEvent, venue_capacity: parseInt(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Expected Attendance</label>
                  <Input
                    type="number"
                    value={newEvent.expected_attendance}
                    onChange={(e) => setNewEvent({ ...newEvent, expected_attendance: parseInt(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">City</label>
                  <Input
                    value={newEvent.location.city}
                    onChange={(e) => setNewEvent({ 
                      ...newEvent, 
                      location: { ...newEvent.location, city: e.target.value }
                    })}
                    placeholder="e.g., New York"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Country</label>
                  <Input
                    value={newEvent.location.country}
                    onChange={(e) => setNewEvent({ 
                      ...newEvent, 
                      location: { ...newEvent.location, country: e.target.value }
                    })}
                    placeholder="e.g., United States"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Geofence Radius (km)</label>
                  <Input
                    type="number"
                    value={newEvent.geofence_radius}
                    onChange={(e) => setNewEvent({ ...newEvent, geofence_radius: parseFloat(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => createEventMutation.mutate(newEvent)}
                  disabled={!newEvent.event_name || !newEvent.event_date || createEventMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  {createEventMutation.isPending ? "Creating..." : "Create Event"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-[#2a2a2a] text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {events.map((event) => (
              <Card
                key={event.id}
                className={`border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all cursor-pointer ${
                  selectedEvent?.id === event.id ? "ring-2 ring-[#DC2626]" : ""
                }`}
                onClick={() => onSelectEvent(event)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg">{event.event_name}</h3>
                          <Badge className={getThreatColor(event.threat_level)}>
                            {event.threat_level} threat
                          </Badge>
                          <Badge className={getStatusColor(event.security_status)}>
                            {event.security_status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <div>
                              <p className="text-gray-400">Venue</p>
                              <p className="text-white font-semibold">{event.venue_name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-400" />
                            <div>
                              <p className="text-gray-400">Date</p>
                              <p className="text-white font-semibold">
                                {format(new Date(event.event_date), "MMM d, yyyy HH:mm")}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-emerald-400" />
                            <div>
                              <p className="text-gray-400">Attendance</p>
                              <p className="text-white font-semibold">
                                {event.expected_attendance?.toLocaleString() || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          {event.real_time_alerts > 0 && (
                            <Badge className="bg-red-500/20 text-red-400">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {event.real_time_alerts} alerts
                            </Badge>
                          )}
                          <Badge className="bg-purple-500/20 text-purple-400">
                            <Radio className="w-3 h-3 mr-1" />
                            {event.geofence_radius}km radius
                          </Badge>
                          {event.social_monitoring?.enabled && (
                            <Badge className="bg-cyan-500/20 text-cyan-400">
                              Social monitoring active
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {events.length === 0 && (
              <div className="text-center py-12">
                <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Events</h3>
                <p className="text-gray-400">Create your first event security operation</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
