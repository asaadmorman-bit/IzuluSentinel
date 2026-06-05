import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function IncidentTypeChart({ incidents, isLoading }) {
  const data = React.useMemo(() => {
    const types = {};
    incidents.forEach(incident => {
      types[incident.type] = (types[incident.type] || 0) + 1;
    });
    return Object.entries(types).map(([name, count]) => ({
      name: name.replace(/_/g, ' '),
      count
    }));
  }, [incidents]);

  return (
    <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-white">Incidents by Type</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="h-80 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="name" stroke="#94a3b8" angle={-45} textAnchor="end" height={100} />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                  color: "#fff"
                }}
              />
              <Bar dataKey="count" fill="#06b6d4" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}