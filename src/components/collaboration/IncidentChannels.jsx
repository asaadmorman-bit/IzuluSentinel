import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, MessageCircle, Users } from "lucide-react";
import { format } from "date-fns";

export default function IncidentChannels({ incidents, onSelectChannel, selectedChannel, user }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400";
      case "monitoring": return "bg-cyan-500/20 text-cyan-400";
      case "contained": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  if (incidents.length === 0) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">No Active Incidents</h3>
        <p className="text-gray-400">All clear - no incident channels active</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Active Incident Channels</h3>
        <Badge className="bg-[#DC2626]/20 text-[#DC2626]">
          {incidents.length} Active
        </Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {incidents.map((incident) => (
          <Card
            key={incident.id}
            className={`border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all cursor-pointer ${
              selectedChannel === incident.id ? "border-[#DC2626] border-2" : ""
            }`}
            onClick={() => onSelectChannel(incident.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                    <h4 className="font-bold text-white">{incident.title}</h4>
                  </div>
                  <Badge className={getSeverityColor(incident.severity)}>
                    {incident.severity}
                  </Badge>
                </div>

                {incident.description && (
                  <p className="text-sm text-gray-400 line-clamp-2">
                    {incident.description}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1 text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {incident.location_name || "Unknown"}
                  </div>
                  <div className="flex items-center gap-1 text-gray-400">
                    <Clock className="w-3 h-3" />
                    {format(new Date(incident.reported_date || incident.created_date), "MMM d, HH:mm")}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                  <Badge className={getStatusColor(incident.status)}>
                    {incident.status}
                  </Badge>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-[#DC2626] hover:text-white hover:bg-[#DC2626]"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectChannel(incident.id);
                    }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Open Channel
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedChannel && (
        <Card className="border-[#DC2626] bg-[#DC2626]/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">
                  Channel Active: {incidents.find(i => i.id === selectedChannel)?.title}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onSelectChannel(null)}
                className="border-[#2a2a2a] text-white"
              >
                Leave Channel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}