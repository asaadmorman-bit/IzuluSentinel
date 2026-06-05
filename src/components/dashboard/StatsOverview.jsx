import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Shield, AlertTriangle, Users, Route, Activity, TrendingUp } from "lucide-react";

export default function StatsOverview({ 
  incidents, 
  assets, 
  routes, 
  activeThreats, 
  criticalThreats, 
  assetsAtRisk, 
  isLoading 
}) {
  const stats = [
    {
      label: "Active Threats",
      value: activeThreats,
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/20",
      change: "+12%",
      changeType: "increase"
    },
    {
      label: "Critical Incidents",
      value: criticalThreats,
      icon: Shield,
      color: "text-orange-400",
      bgColor: "bg-orange-500/20",
      change: "-8%",
      changeType: "decrease"
    },
    {
      label: "Assets at Risk",
      value: assetsAtRisk,
      icon: Users,
      color: "text-amber-400",
      bgColor: "bg-amber-500/20",
      change: "+5%",
      changeType: "increase"
    },
    {
      label: "Active Routes",
      value: routes?.length || 0,
      icon: Route,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/20",
      change: "3 active",
      changeType: "neutral"
    },
    {
      label: "Total Incidents",
      value: incidents?.length || 0,
      icon: Activity,
      color: "text-purple-400",
      bgColor: "bg-purple-500/20",
      change: "24h",
      changeType: "neutral"
    },
    {
      label: "Protected Assets",
      value: assets?.length || 0,
      icon: TrendingUp,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/20",
      change: "All secure",
      changeType: "neutral"
    }
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
        {[...Array(6)].map((_, idx) => (
          <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="animate-pulse">
                <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 bg-gray-700 rounded-lg mb-2 md:mb-3"></div>
                <div className="h-3 md:h-4 bg-gray-700 rounded mb-1 md:mb-2"></div>
                <div className="h-6 md:h-8 bg-gray-700 rounded"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
      {stats.map((stat, idx) => (
        <Card 
          key={idx} 
          className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all duration-200 cursor-pointer group"
        >
          <CardContent className="p-3 sm:p-4 md:p-5 lg:p-6">
            <div className="flex flex-col space-y-2 md:space-y-3">
              <div className="flex items-start justify-between">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                <span className={`text-[10px] sm:text-xs ${
                  stat.changeType === 'increase' ? 'text-red-400' : 
                  stat.changeType === 'decrease' ? 'text-emerald-400' : 
                  'text-gray-400'
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-[10px] sm:text-xs md:text-sm text-gray-400 mb-0.5 md:mb-1">
                  {stat.label}
                </p>
                <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  {stat.value}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}