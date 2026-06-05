import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { format, subDays } from "date-fns";

export default function SeverityTrendChart({ incidents, isLoading }) {
  const data = React.useMemo(() => {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayIncidents = incidents.filter(inc => {
        const incDate = new Date(inc.created_date);
        return incDate.toDateString() === date.toDateString();
      });

      last7Days.push({
        date: format(date, "MMM dd"),
        critical: dayIncidents.filter(i => i.severity === "critical").length,
        high: dayIncidents.filter(i => i.severity === "high").length,
        medium: dayIncidents.filter(i => i.severity === "medium").length,
        low: dayIncidents.filter(i => i.severity === "low").length,
      });
    }
    return last7Days;
  }, [incidents]);

  return (
    <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Severity Trend (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="date" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Legend />
              <Line type="monotone" dataKey="critical" stroke="#ef4444" strokeWidth={2} />
              <Line type="monotone" dataKey="high" stroke="#f59e0b" strokeWidth={2} />
              <Line type="monotone" dataKey="medium" stroke="#06b6d4" strokeWidth={2} />
              <Line type="monotone" dataKey="low" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}