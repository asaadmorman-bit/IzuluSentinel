import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, MapPin, Clock, ChevronRight } from "lucide-react";
import { format } from "date-fns";

export default function ActiveThreats({ threats }) {
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  const topThreats = threats.slice(0, 3);

  return (
    <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-red-400" />
            <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
              Active Threats Detected
            </h3>
          </div>
          <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs md:text-sm">
            {threats.length} Active
          </Badge>
        </div>

        <div className="grid gap-2 sm:gap-3 md:gap-4 md:grid-cols-3">
          {topThreats.map((threat) => (
            <Card key={threat.id} className="border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all group cursor-pointer">
              <CardContent className="p-3 md:p-4">
                <div className="space-y-2 md:space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <Badge className={`${getSeverityColor(threat.severity)} text-[10px] sm:text-xs`}>
                      {threat.severity}
                    </Badge>
                    <span className="text-[10px] sm:text-xs text-gray-500">
                      {format(new Date(threat.reported_date), "HH:mm")}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white mb-1 line-clamp-2 group-hover:text-red-400 transition-colors">
                      {threat.title}
                    </h4>
                    <p className="text-xs md:text-sm text-gray-400 line-clamp-2 md:line-clamp-3">
                      {threat.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a]">
                    <div className="flex items-center gap-1 md:gap-2 text-gray-400">
                      <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="text-[10px] sm:text-xs truncate max-w-[120px] sm:max-w-none">
                        {threat.location_name || "Unknown"}
                      </span>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="h-6 w-6 md:h-8 md:w-8 p-0 group-hover:bg-red-500/20"
                    >
                      <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 group-hover:text-red-400" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {threats.length > 3 && (
          <Button 
            variant="outline" 
            className="w-full mt-3 md:mt-4 border-[#2a2a2a] text-white hover:bg-[#1a1a1a] text-xs sm:text-sm"
          >
            View All {threats.length} Active Threats
            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 ml-2" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}