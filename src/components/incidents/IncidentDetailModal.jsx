import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { 
  MapPin, 
  Clock, 
  User, 
  Shield, 
  FileText,
  Save,
  X
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

export default function IncidentDetailModal({ incident, open, onClose }) {
  const [notes, setNotes] = useState("");
  const [newStatus, setNewStatus] = useState(incident?.status || "active");
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.Incident.update(incident.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['incidents']);
      toast.success("Incident updated");
      onClose();
    }
  });

  if (!incident) return null;

  const handleSave = () => {
    const updates = {};
    if (newStatus !== incident.status) {
      updates.status = newStatus;
    }
    if (notes) {
      updates.recommendation = incident.recommendation 
        ? `${incident.recommendation}\n\n${new Date().toISOString()}: ${notes}`
        : notes;
    }
    
    if (Object.keys(updates).length > 0) {
      updateMutation.mutate(updates);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "monitoring": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "contained": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "resolved": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-[#0f0f0f] border-[#1a1a1a] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge className={getSeverityColor(incident.severity)}>
                {incident.severity}
              </Badge>
              <Badge className={getStatusColor(incident.status)}>
                {incident.status}
              </Badge>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogTitle className="text-2xl text-white mt-4">{incident.title}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Description</h3>
            <p className="text-white">{incident.description}</p>
          </div>

          {/* Details Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Location:</span>
                <span className="text-white">{incident.location_name || "Unknown"}</span>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Clock className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Reported:</span>
                <span className="text-white">
                  {format(new Date(incident.created_date), "MMM d, yyyy HH:mm")}
                </span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Source:</span>
                <span className="text-white">{incident.source || "Unknown"}</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Shield className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Threat Type:</span>
                <span className="text-white capitalize">{incident.threat_type?.replace('_', ' ')}</span>
              </div>

              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">Verified:</span>
                <Badge className={incident.verified ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                  {incident.verified ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          {incident.recommendation && (
            <div>
              <h3 className="text-sm font-semibold text-gray-400 mb-2">Recommendations</h3>
              <div className="bg-[#0a0a0a] rounded-lg p-4">
                <p className="text-sm text-white whitespace-pre-wrap">{incident.recommendation}</p>
              </div>
            </div>
          )}

          {/* Update Status */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Update Status</h3>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="monitoring">Monitoring</SelectItem>
                <SelectItem value="contained">Contained</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Add Notes */}
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Add Notes</h3>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add analysis notes, updates, or recommendations..."
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white min-h-24"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1a1a1a]">
            <Button variant="outline" onClick={onClose} className="border-[#2a2a2a] text-white">
              Cancel
            </Button>
            <Button 
              onClick={handleSave}
              disabled={updateMutation.isPending}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Save className="w-4 h-4 mr-2" />
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}