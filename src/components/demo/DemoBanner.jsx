import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, X } from "lucide-react";
import { useDemoMode } from "./DemoProvider";

export default function DemoBanner() {
  const { isDemoMode, exitDemoMode } = useDemoMode();

  if (!isDemoMode) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 px-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <div className="flex items-center gap-2">
            <Badge className="bg-white/20 text-white border-white/30">DEMO MODE</Badge>
            <span className="text-sm font-medium">
              You're experiencing Izulu Sentinel with sample data
            </span>
          </div>
        </div>
        <Button
          onClick={exitDemoMode}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-white/20"
        >
          Exit Demo
          <X className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}