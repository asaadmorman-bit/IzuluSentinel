import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export default function MetricCard({ title, value, icon: Icon, color, trend, subtitle }) {
  const colorClasses = {
    cyan: "from-cyan-500 to-blue-600 text-cyan-400",
    amber: "from-amber-500 to-orange-600 text-amber-400",
    emerald: "from-emerald-500 to-teal-600 text-emerald-400",
  };

  return (
    <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-slate-400">{title}</p>
          <div className={`p-2 rounded-lg bg-gradient-to-br ${colorClasses[color]}/20`}>
            <Icon className={`w-5 h-5 ${colorClasses[color].split(' ')[2]}`} />
          </div>
        </div>
        <p className="text-3xl font-bold text-white mb-1">{value}</p>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
        {trend && (
          <p className="text-sm text-emerald-400 mt-2">{trend}</p>
        )}
      </CardContent>
    </Card>
  );
}