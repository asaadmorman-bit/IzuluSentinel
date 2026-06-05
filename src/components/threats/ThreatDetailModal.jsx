import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, Shield, Users, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function ThreatDetailModal({ incident, onClose }) {
  if (!incident) return null;

  return (
    <Dialog open={!!incident} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{incident.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {incident.image_url && (
            <img
              src={incident.image_url}
              alt={incident.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}

          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {incident.threat_type?.replace(/_/g, ' ')}
            </Badge>
            <Badge variant={incident.severity === "critical" ? "destructive" : "secondary"}>
              {incident.severity} severity
            </Badge>
            <Badge>{incident.status}</Badge>
            {incident.verified && (
              <Badge className="bg-emerald-500/20 text-emerald-400">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {incident.description && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Threat Assessment
              </h3>
              <p className="text-slate-300">{incident.description}</p>
            </div>
          )}

          {incident.recommendation && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <h3 className="font-semibold mb-2 text-cyan-400">Security Recommendation</h3>
              <p className="text-slate-200">{incident.recommendation}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MapPin className="w-4 h-4" />
                Location
              </div>
              <p className="text-white">{incident.location_name || "Unknown"}</p>
              <p className="text-sm text-slate-400">
                {incident.latitude.toFixed(4)}, {incident.longitude.toFixed(4)}
              </p>
              {incident.radius_km && (
                <p className="text-sm text-slate-400">
                  Affected radius: {incident.radius_km} km
                </p>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                Reported
              </div>
              <p className="text-white">
                {format(new Date(incident.created_date), "MMMM d, yyyy")}
              </p>
              <p className="text-sm text-slate-400">
                {format(new Date(incident.created_date), "h:mm a")}
              </p>
            </div>

            {incident.source && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Shield className="w-4 h-4" />
                  Intelligence Source
                </div>
                <p className="text-white">{incident.source}</p>
              </div>
            )}

            {incident.casualties !== undefined && incident.casualties !== null && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Users className="w-4 h-4" />
                  Reported Casualties
                </div>
                <p className="text-white">{incident.casualties}</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Report ID: {incident.id} • Created by: {incident.created_by || "System"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}