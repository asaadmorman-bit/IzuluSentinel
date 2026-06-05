import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";

const SHIFT_PRESETS = {
  day: { start: "07:00", end: "15:00" },
  evening: { start: "15:00", end: "23:00" },
  night: { start: "23:00", end: "07:00" },
  on_call: { start: "00:00", end: "23:59" },
};

function todayAt(time) {
  const d = new Date();
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  return d.toISOString().slice(0, 16);
}

export default function CreateShiftModal({ open, onClose, members, onCreate }) {
  const [form, setForm] = useState({
    shift_name: "",
    team_member_id: "",
    shift_type: "day",
    start_time: todayAt("07:00"),
    end_time: todayAt("15:00"),
    location: "",
    notes: "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const applyPreset = (type) => {
    const p = SHIFT_PRESETS[type];
    set("shift_type", type);
    set("start_time", todayAt(p.start));
    set("end_time", todayAt(p.end));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const member = members.find((m) => m.id === form.team_member_id);
    onCreate({
      ...form,
      team_member_name: member?.full_name || "",
      team_member_role: member?.role || "",
      status: "scheduled",
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-[#0f0f0f] border-[#1a1a1a] text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Plus className="w-4 h-4 text-[#DC2626]" /> New Shift
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Shift Name</Label>
            <Input
              required
              value={form.shift_name}
              onChange={(e) => set("shift_name", e.target.value)}
              placeholder="e.g. Alpha – Day Post 1"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Personnel</Label>
            <Select required value={form.team_member_id} onValueChange={(v) => set("team_member_id", v)}>
              <SelectTrigger className="bg-[#0a0a0a] border-[#2a2a2a] text-white">
                <SelectValue placeholder="Select team member" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f0f0f] border-[#2a2a2a]">
                {members.map((m) => (
                  <SelectItem key={m.id} value={m.id} className="text-white hover:bg-[#1a1a1a]">
                    {m.full_name} ({m.role?.replace("_", " ")})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Shift Type</Label>
            <div className="flex gap-2">
              {["day", "evening", "night", "on_call"].map((t) => (
                <button
                  type="button"
                  key={t}
                  onClick={() => applyPreset(t)}
                  className={`flex-1 py-1.5 rounded text-xs capitalize border transition-all ${
                    form.shift_type === t
                      ? "bg-[#DC2626] border-[#DC2626] text-white"
                      : "bg-[#0a0a0a] border-[#2a2a2a] text-gray-400 hover:border-[#3a3a3a]"
                  }`}
                >
                  {t.replace("_", " ")}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs">Start</Label>
              <Input
                type="datetime-local"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-xs"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-gray-400 text-xs">End</Label>
              <Input
                type="datetime-local"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
                className="bg-[#0a0a0a] border-[#2a2a2a] text-white text-xs"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Location / Post</Label>
            <Input
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder="e.g. Main Gate"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
            />
          </div>

          <div className="space-y-1">
            <Label className="text-gray-400 text-xs">Notes</Label>
            <Input
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Optional notes"
              className="bg-[#0a0a0a] border-[#2a2a2a] text-white"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="border-[#2a2a2a] text-gray-400">
              Cancel
            </Button>
            <Button type="submit" className="bg-[#DC2626] hover:bg-[#B91C1C]">
              Create Shift
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}