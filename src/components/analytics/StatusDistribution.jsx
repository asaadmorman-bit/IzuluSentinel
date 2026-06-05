import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = {
  active: "#ef4444",
  monitoring: "#f59e0b",
  contained: "#06b6d4",
  resolved: "#10b981",
};

export default function StatusDistribution({ incidents, isLoading }) {
  const data = React.useMemo(() => {
    const statuses = {};
    incidents.forEach(incident => {
      statuses[incident.status] = (statuses[incident.status] || 0) + 1;
    });
    return Object.entries(statuses).map(([name, value]) => ({
      name: name.replace(/_/g, ' '),
      value
    }));
  }, [incidents]);

  return (
    <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Status Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name.replace(' ', '_')] || "#94a3b8"} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}