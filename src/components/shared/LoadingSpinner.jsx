import React from "react";
import { Shield, Loader2 } from "lucide-react";

export default function LoadingSpinner({ message = "Loading...", fullScreen = false }) {
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-[#DC2626] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <div className="text-center">
        <Loader2 className="w-8 h-8 text-[#DC2626] animate-spin mx-auto mb-2" />
        <p className="text-sm text-gray-400">{message}</p>
      </div>
    </div>
  );
}