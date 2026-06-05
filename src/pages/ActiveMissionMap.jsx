import ActiveMissionMap from "@/components/tactical/ActiveMissionMap";

export default function ActiveMissionMapPage() {
  return (
    <div className="h-screen w-full bg-black flex flex-col">
      {/* Minimal header */}
      <div className="flex items-center justify-between px-4 py-2 bg-[#050505] border-b border-[#1a1a1a] flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-white font-mono font-bold text-sm tracking-widest">ACTIVE MISSION MAP</span>
        </div>
        <span className="text-[10px] text-gray-600 font-mono">EP OVERWATCH · iZulu Sentinel</span>
      </div>

      {/* Full-screen map */}
      <div className="flex-1 relative">
        <ActiveMissionMap className="absolute inset-0 rounded-none" />
      </div>
    </div>
  );
}