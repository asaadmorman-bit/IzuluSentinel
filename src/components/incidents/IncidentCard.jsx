import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function IncidentCard({ incident, onClick }) {
  const severityColors = {
    critical: "bg-red-500/20 text-red-400 border-red-500/50",
    high: "bg-orange-500/20 text-orange-400 border-orange-500/50",
    medium: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
    low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
  };

  const statusColors = {
    active: "bg-red-500/20 text-red-400",
    monitoring: "bg-amber-500/20 text-amber-400",
    contained: "bg-cyan-500/20 text-cyan-400",
    resolved: "bg-emerald-500/20 text-emerald-400",
  };

  return (
    <Card
      onClick={onClick}
      className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-900/70 cursor-pointer transition-all duration-300 hover:scale-105"
    >
      <CardContent className="p-6">
        {incident.image_url && (
          <img
            src={incident.image_url}
            alt={incident.title}
            className="w-full h-40 object-cover rounded-lg mb-4"
          />
        )}
        
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-white text-lg">{incident.title}</h3>
          <Badge className={`${severityColors[incident.severity]} border`}>
            {incident.severity}
          </Badge>
        </div>

        {incident.description && (
          <p className="text-slate-300 text-sm mb-4 line-clamp-2">
            {incident.description}
          </p>
        )}

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="capitalize">
              {incident.type.replace(/_/g, ' ')}
            </Badge>
            <Badge className={statusColors[incident.status]}>
              {incident.status}
            </Badge>
          </div>

          {incident.location_name && (
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <MapPin className="w-4 h-4" />
              <span>{incident.location_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(incident.created_date), "MMM d, yyyy")}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}