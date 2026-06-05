import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Mail, Shield, Clock, Award } from "lucide-react";
import { format } from "date-fns";

export default function TeamMemberDetailModal({ member, onClose }) {
  if (!member) return null;

  return (
    <Dialog open={!!member} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-slate-900 border-orange-500/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-full flex items-center justify-center border-2 border-orange-500/30">
              <span className="text-2xl font-bold text-orange-400">
                {member.full_name?.charAt(0) || "?"}
              </span>
            </div>
            <div>
              <DialogTitle className="text-2xl">{member.full_name}</DialogTitle>
              <p className="text-slate-400 capitalize">{member.role?.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="capitalize">
              {member.status?.replace(/_/g, ' ')}
            </Badge>
            {member.clearance_level && (
              <Badge className="bg-orange-500/20 text-orange-400">
                <Shield className="w-3 h-3 mr-1" />
                {member.clearance_level?.replace(/_/g, ' ')}
              </Badge>
            )}
          </div>

          {member.current_assignment && (
            <div>
              <h3 className="font-semibold mb-2">Current Assignment</h3>
              <p className="text-slate-300 p-3 bg-slate-800/30 rounded-lg">{member.current_assignment}</p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4">
            {member.location && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <MapPin className="w-4 h-4" />
                  Location
                </div>
                <p className="text-white">{member.location}</p>
                {member.latitude && member.longitude && (
                  <p className="text-sm text-slate-400">
                    {member.latitude.toFixed(4)}, {member.longitude.toFixed(4)}
                  </p>
                )}
              </div>
            )}

            {member.last_check_in && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Clock className="w-4 h-4" />
                  Last Check-in
                </div>
                <p className="text-white">{format(new Date(member.last_check_in), "MMM d, yyyy")}</p>
                <p className="text-sm text-slate-400">{format(new Date(member.last_check_in), "h:mm a")}</p>
              </div>
            )}

            {member.contact_phone && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Phone className="w-4 h-4" />
                  Phone
                </div>
                <p className="text-white">{member.contact_phone}</p>
              </div>
            )}

            {member.contact_email && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Mail className="w-4 h-4" />
                  Email
                </div>
                <p className="text-white">{member.contact_email}</p>
              </div>
            )}
          </div>

          {member.specializations && member.specializations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" />
                Specializations
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.specializations.map((spec, idx) => (
                  <Badge key={idx} variant="secondary">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {member.certifications && member.certifications.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Certifications</h3>
              <ul className="space-y-1">
                {member.certifications.map((cert, idx) => (
                  <li key={idx} className="text-slate-300 text-sm">• {cert}</li>
                ))}
              </ul>
            </div>
          )}

          {member.languages && member.languages.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Languages</h3>
              <div className="flex flex-wrap gap-2">
                {member.languages.map((lang, idx) => (
                  <Badge key={idx} variant="outline">
                    {lang}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Personnel ID: {member.id} • Added: {format(new Date(member.created_date), "MMM d, yyyy")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}