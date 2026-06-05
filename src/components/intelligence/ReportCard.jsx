import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Calendar, Globe, Shield } from "lucide-react";
import { format } from "date-fns";

export default function ReportCard({ report, onClick }) {
  const getThreatLevelColor = (level) => {
    const colors = {
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
      severe: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      substantial: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
    };
    return colors[level] || colors.moderate;
  };

  const getClassificationColor = (classification) => {
    const colors = {
      restricted: "bg-red-500/20 text-red-400",
      confidential: "bg-orange-500/20 text-orange-400",
      internal: "bg-cyan-500/20 text-cyan-400",
      public: "bg-slate-500/20 text-slate-400"
    };
    return colors[classification] || colors.internal;
  };

  return (
    <Card
      onClick={onClick}
      className="border-orange-500/20 bg-slate-900/50 backdrop-blur-xl hover:bg-slate-900/70 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-orange-500/40"
    >
      <CardHeader>
        <div className="flex items-start justify-between mb-2">
          <Badge variant="outline" className="capitalize">
            {report.report_type?.replace(/_/g, ' ')}
          </Badge>
          <Badge className={getClassificationColor(report.classification)}>
            {report.classification}
          </Badge>
        </div>
        <CardTitle className="text-white text-xl">{report.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-slate-300 text-sm line-clamp-3">{report.content}</p>

        <div className="flex items-center gap-2">
          <Badge className={`${getThreatLevelColor(report.threat_level)} border`}>
            <Shield className="w-3 h-3 mr-1" />
            {report.threat_level} threat
          </Badge>
        </div>

        <div className="space-y-2 text-sm">
          {report.region && (
            <div className="flex items-center gap-2 text-slate-400">
              <Globe className="w-4 h-4" />
              <span>{report.region}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(report.report_date || report.created_date), "MMM d, yyyy")}</span>
          </div>
          {report.analyst && (
            <div className="flex items-center gap-2 text-slate-400">
              <FileText className="w-4 h-4" />
              <span>Analyst: {report.analyst}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}