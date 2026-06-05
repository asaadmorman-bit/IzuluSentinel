import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, User, Star } from "lucide-react";

const CLEARANCE_RANK = { level_1: 1, level_2: 2, level_3: 3, level_4: 4 };

function score(member, shift) {
  let s = 0;
  if (member.status === "active") s += 50;
  else if (member.status === "off_duty") s += 20;
  s += (CLEARANCE_RANK[member.clearance_level] || 0) * 5;
  if (member.role === shift.team_member_role) s += 15;
  if (member.location && shift.location && member.location === shift.location) s += 10;
  return s;
}

export default function ReplacementModal({ open, onClose, shift, members, onConfirm }) {
  if (!shift) return null;

  const candidates = members
    .filter((m) => m.id !== shift.team_member_id && m.status !== "unavailable" && m.status !== "on_mission")
    .map((m) => ({ ...m, _score: score(m, shift) }))
    .sort((a, b) => b._score - a._score)
    .slice(0, 5);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#DC2626]" />
            Suggested Replacements
          </DialogTitle>
          <p className="text-xs text-gray-500 mt-1">
            For: <span className="text-gray-300">{shift.shift_name}</span> · originally {shift.team_member_name}
          </p>
        </DialogHeader>

        <div className="space-y-2 mt-2">
          {candidates.length === 0 ? (
            <p className="text-gray-500 text-sm text-center py-6">No available replacements found.</p>
          ) : (
            candidates.map((m, i) => (
              <div
                key={m.id}
                className="flex items-center justify-between gap-3 p-3 bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg"
              >
                <div className="flex items-center gap-2 min-w-0">
                  {i === 0 && <Star className="w-3 h-3 text-yellow-400 flex-shrink-0" />}
                  <User className={`w-3 h-3 flex-shrink-0 ${i === 0 ? "text-yellow-400" : "text-gray-500"}`} />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{m.full_name}</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {m.role?.replace("_", " ")} · {m.clearance_level?.replace("_", " ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Badge
                    className={`text-[10px] border ${
                      m.status === "active"
                        ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                        : "bg-gray-800 text-gray-400 border-gray-700"
                    }`}
                  >
                    {m.status.replace("_", " ")}
                  </Badge>
                  <Button
                    size="sm"
                    className="h-7 text-xs bg-[#DC2626] hover:bg-[#B91C1C]"
                    onClick={() => onConfirm(shift, m)}
                  >
                    Assign
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}