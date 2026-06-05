import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Construction } from "lucide-react";

export default function ComingSoon({ title, description }) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8 flex items-center justify-center">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f] max-w-2xl w-full">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 bg-[#DC2626]/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Construction className="w-10 h-10 text-[#DC2626]" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">{title || "Coming Soon"}</h1>
          <p className="text-gray-400 text-lg mb-6">
            {description || "This feature is currently under development and will be available soon."}
          </p>
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-[#DC2626] rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-500">In Development</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}