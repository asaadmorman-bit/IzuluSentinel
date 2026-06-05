import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Clock,
  Users,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  Activity,
  Calendar,
} from "lucide-react";
import { isWithinInterval, parseISO, startOfDay, endOfDay, differenceInHours } from "date-fns";
import ShiftCard from "@/components/shifts/ShiftCard";
import ReplacementModal from "@/components/shifts/ReplacementModal";
import CreateShiftModal from "@/components/shifts/CreateShiftModal";

const TABS = ["today", "upcoming", "completed"];

export default function ShiftManagement() {
  const [shifts, setShifts] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("today");
  const [replacementShift, setReplacementShift] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [s, m] = await Promise.all([
        base44.entities.Shift.list("-start_time", 100),
        base44.entities.TeamMember.list(),
      ]);
      setShifts(s);
      setMembers(m);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Categorise shifts
  const now = new Date();
  const todayStart = startOfDay(now);
  const todayEnd = endOfDay(now);

  const categorised = {
    today: shifts.filter((s) => {
      try {
        return isWithinInterval(parseISO(s.start_time), { start: todayStart, end: todayEnd }) &&
               s.status !== "completed" && s.status !== "cancelled";
      } catch { return false; }
    }),
    upcoming: shifts.filter((s) => {
      try { return parseISO(s.start_time) > todayEnd && s.status === "scheduled"; }
      catch { return false; }
    }),
    completed: shifts.filter((s) => s.status === "completed" || s.status === "cancelled"),
  };

  // Stats
  const activeShifts = shifts.filter((s) => s.status === "active");
  const replacementsNeeded = shifts.filter((s) => s.status === "replacement_needed");
  const totalHoursToday = categorised.today.reduce((acc, s) => {
    try { return acc + Math.max(0, differenceInHours(parseISO(s.end_time), parseISO(s.start_time))); }
    catch { return acc; }
  }, 0);

  // Actions
  const handleMarkUnavailable = async (shift) => {
    await base44.entities.Shift.update(shift.id, { status: "replacement_needed" });
    setShifts((prev) => prev.map((s) => s.id === shift.id ? { ...s, status: "replacement_needed" } : s));
  };

  const handleOpenReplacement = (shift) => setReplacementShift(shift);

  const handleConfirmReplacement = async (shift, member) => {
    await base44.entities.Shift.update(shift.id, {
      status: "scheduled",
      replacement_member_id: member.id,
      replacement_member_name: member.full_name,
    });
    setShifts((prev) =>
      prev.map((s) =>
        s.id === shift.id
          ? { ...s, status: "scheduled", replacement_member_id: member.id, replacement_member_name: member.full_name }
          : s
      )
    );
    setReplacementShift(null);
  };

  const handleCreate = async (data) => {
    const created = await base44.entities.Shift.create(data);
    setShifts((prev) => [created, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Calendar className="w-6 h-6 text-[#DC2626]" />
              Shift Management
            </h1>
            <p className="text-gray-400 text-sm mt-1">Track duty hours, rotations, and auto-suggest replacements</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={load}
              disabled={loading}
              className="border-[#1a1a1a] text-gray-300 hover:bg-[#1a1a1a] h-8"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              size="sm"
              className="bg-[#DC2626] hover:bg-[#B91C1C] h-8"
              onClick={() => setShowCreate(true)}
            >
              <Plus className="w-3 h-3 mr-1" /> New Shift
            </Button>
          </div>
        </div>

        {/* Replacement alert banner */}
        {replacementsNeeded.length > 0 && (
          <div className="flex items-center gap-3 px-4 py-3 bg-red-950/20 border border-red-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="flex-1 text-sm text-red-300">
              <strong>{replacementsNeeded.length} shift(s)</strong> need a replacement — personnel marked unavailable.
            </div>
            <Button
              size="sm"
              className="bg-red-700 hover:bg-red-600 h-7 text-xs"
              onClick={() => setReplacementShift(replacementsNeeded[0])}
            >
              Resolve Now
            </Button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Active Now", value: activeShifts.length, icon: Activity, color: "text-emerald-400" },
            { label: "Today's Shifts", value: categorised.today.length, icon: Calendar, color: "text-blue-400" },
            { label: "Hours Scheduled", value: `${totalHoursToday}h`, icon: Clock, color: "text-yellow-400" },
            { label: "Replacements Needed", value: replacementsNeeded.length, icon: AlertTriangle, color: replacementsNeeded.length > 0 ? "text-red-400" : "text-gray-500" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className="text-gray-500 text-xs">{label}</span>
              </div>
              <p className={`text-2xl font-bold font-mono ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Team availability */}
        <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-4">
          <h2 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-500" /> Team Availability
          </h2>
          <div className="flex flex-wrap gap-2">
            {members.length === 0 && <p className="text-gray-600 text-xs">No team members found.</p>}
            {members.map((m) => {
              const statusColor =
                m.status === "active" ? "bg-emerald-900/40 text-emerald-300 border-emerald-700"
                : m.status === "on_mission" ? "bg-blue-900/40 text-blue-300 border-blue-700"
                : m.status === "off_duty" ? "bg-gray-800 text-gray-400 border-gray-700"
                : "bg-red-900/40 text-red-300 border-red-700";
              return (
                <div key={m.id} className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1a1a1a] rounded px-2 py-1">
                  <div className={`w-1.5 h-1.5 rounded-full ${m.status === "active" ? "bg-emerald-400" : m.status === "unavailable" ? "bg-red-400" : "bg-gray-500"}`} />
                  <span className="text-white text-xs">{m.full_name}</span>
                  <Badge className={`text-[9px] border px-1 py-0 ${statusColor}`}>{m.status.replace("_", " ")}</Badge>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-[#1a1a1a]">
          {TABS.map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? "border-[#DC2626] text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              {t}
              <span className="ml-1.5 text-xs opacity-60">{categorised[t]?.length ?? 0}</span>
            </button>
          ))}
        </div>

        {/* Shift grid */}
        {loading && shifts.length === 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : categorised[tab]?.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Calendar className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No {tab} shifts.</p>
            {tab === "today" && (
              <button onClick={() => setShowCreate(true)} className="text-[#DC2626] text-xs mt-2 hover:underline">
                + Schedule one now
              </button>
            )}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categorised[tab].map((shift) => (
              <ShiftCard
                key={shift.id}
                shift={shift}
                onMarkUnavailable={handleMarkUnavailable}
                onReplace={handleOpenReplacement}
              />
            ))}
          </div>
        )}
      </div>

      <ReplacementModal
        open={!!replacementShift}
        onClose={() => setReplacementShift(null)}
        shift={replacementShift}
        members={members}
        onConfirm={handleConfirmReplacement}
      />

      <CreateShiftModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        members={members}
        onCreate={handleCreate}
      />
    </div>
  );
}