import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Clock,
  User,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { format, differenceInHours, differenceInMinutes } from "date-fns";

const SHIFT_TYPE_COLOR = {
  day: "bg-yellow-900/40 text-yellow-300 border-yellow-700",
  evening: "bg-blue-900/40 text-blue-300 border-blue-700",
  night: "bg-purple-900/40 text-purple-300 border-purple-700",
  on_call: "bg-orange-900/40 text-orange-300 border-orange-700",
};

const STATUS_CONFIG = {
  scheduled: { label: "Scheduled", color: "text-gray-400", icon: Clock },
  active: { label: "Active", color: "text-emerald-400", icon: CheckCircle2 },
  completed: { label: "Completed", color: "text-blue-400", icon: CheckCircle2 },
  cancelled: { label: "Cancelled", color: "text-red-400", icon: XCircle },
  replacement_needed: { label: "Replacement Needed", color: "text-red-400", icon: AlertTriangle },
};

function durationLabel(start, end) {
  const h = differenceInHours(new Date(end), new Date(start));
  const m = differenceInMinutes(new Date(end), new Date(start)) % 60;
  return h > 0 ? `${h}h ${m > 0 ? m + "m" : ""}`.trim() : `${m}m`;
}

export default function ShiftCard({ shift, onMarkUnavailable, onReplace }) {
  const cfg = STATUS_CONFIG[shift.status] || STATUS_CONFIG.scheduled;
  const StatusIcon = cfg.icon;
  const isActive = shift.status === "active";
  const needsReplacement = shift.status === "replacement_needed";

  return (
    <div
      className={`bg-[#0f0f0f] border rounded-lg p-4 space-y-3 transition-all ${
        needsReplacement ? "border-red-800 bg-red-950/10" : "border-[#1a1a1a]"
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-white font-medium text-sm">{shift.shift_name}</p>
          <p className="text-gray-500 text-xs capitalize flex items-center gap-1 mt-0.5">
            <User className="w-3 h-3" />
            {shift.team_member_name}
            {shift.replacement_member_name && (
              <span className="text-yellow-400 ml-1">→ {shift.replacement_member_name}</span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <Badge className={`text-[10px] border ${SHIFT_TYPE_COLOR[shift.shift_type]}`}>
            {shift.shift_type.replace("_", " ")}
          </Badge>
          <span className={`text-[10px] flex items-center gap-0.5 ${cfg.color}`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>
      </div>

      {/* Time */}
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {format(new Date(shift.start_time), "MMM d, HH:mm")} – {format(new Date(shift.end_time), "HH:mm")}
        </span>
        <span className="text-gray-600">{durationLabel(shift.start_time, shift.end_time)}</span>
      </div>

      {/* Location */}
      {shift.location && (
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3" />
          {shift.location}
        </div>
      )}

      {/* Notes */}
      {shift.notes && <p className="text-xs text-gray-600 italic">{shift.notes}</p>}

      {/* Actions */}
      {(isActive || shift.status === "scheduled") && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs border-red-800 text-red-400 hover:bg-red-900/20 flex-1"
            onClick={() => onMarkUnavailable(shift)}
          >
            <XCircle className="w-3 h-3 mr-1" /> Mark Unavailable
          </Button>
          {needsReplacement && (
            <Button
              size="sm"
              className="h-7 text-xs bg-[#DC2626] hover:bg-[#B91C1C] flex-1"
              onClick={() => onReplace(shift)}
            >
              <RefreshCw className="w-3 h-3 mr-1" /> Find Replacement
            </Button>
          )}
        </div>
      )}
      {needsReplacement && (
        <Button
          size="sm"
          className="h-7 text-xs bg-[#DC2626] hover:bg-[#B91C1C] w-full"
          onClick={() => onReplace(shift)}
        >
          <RefreshCw className="w-3 h-3 mr-1" /> Find Replacement
        </Button>
      )}
    </div>
  );
}