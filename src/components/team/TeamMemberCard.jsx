import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Shield } from "lucide-react";
import { format } from "date-fns";

export default function TeamMemberCard({ member, onClick }) {
  const statusColors = {
    active: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
    on_mission: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    off_duty: "bg-slate-500/20 text-slate-400 border-slate-500/50",
    unavailable: "bg-red-500/20 text-red-400 border-red-500/50"
  };

  const clearanceColors = {
    level_4: "bg-red-500/20 text-red-400",
    level_3: "bg-orange-500/20 text-orange-400",
    level_2: "bg-cyan-500/20 text-cyan-400",
    level_1: "bg-slate-500/20 text-slate-400"
  };

  return (
    <Card
      onClick={onClick}
      className="border-orange-500/20 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-900/70 cursor-pointer transition-all duration-300 hover:scale-105"
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center border border-orange-500/30">
              <span className="text-lg font-bold text-orange-400">
                {member.full_name?.charAt(0) || "?"}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-white">{member.full_name}</h3>
              <p className="text-sm text-slate-400 capitalize">{member.role?.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge className={`${statusColors[member.status]} border`}>
              {member.status?.replace(/_/g, ' ')}
            </Badge>
            {member.clearance_level && (
              <Badge className={clearanceColors[member.clearance_level]}>
                <Shield className="w-3 h-3 mr-1" />
                {member.clearance_level?.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>

          {member.current_assignment && (
            <div className="p-2 bg-slate-800/30 rounded text-sm text-slate-300">
              <span className="text-orange-400 font-medium">Assignment:</span> {member.current_assignment}
            </div>
          )}

          {member.location && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{member.location}</span>
            </div>
          )}

          {member.last_check_in && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Clock className="w-4 h-4" />
              <span>Last check-in: {format(new Date(member.last_check_in), "MMM d, HH:mm")}</span>
            </div>
          )}

          {member.specializations && member.specializations.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {member.specializations.slice(0, 3).map((spec, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}