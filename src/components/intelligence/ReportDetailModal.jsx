import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Shield, Globe, Calendar, FileText, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function ReportDetailModal({ report, onClose }) {
  if (!report) return null;

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

  return (
    <Dialog open={!!report} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl bg-slate-900 border-orange-500/20 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <DialogTitle className="text-2xl mb-2">{report.title}</DialogTitle>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="capitalize">
                  {report.report_type?.replace(/_/g, ' ')}
                </Badge>
                <Badge className={getThreatLevelColor(report.threat_level)}>
                  {report.threat_level} threat level
                </Badge>
                <Badge variant="secondary">{report.classification}</Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-orange-400" />
              Executive Summary
            </h3>
            <p className="text-slate-300 leading-relaxed">{report.content}</p>
          </div>

          {report.key_findings && report.key_findings.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Key Findings
              </h3>
              <ul className="space-y-2">
                {report.key_findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-orange-400 font-bold">{idx + 1}.</span>
                    <span className="text-slate-300">{finding}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {report.recommendations && report.recommendations.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2 text-lg">
                <Shield className="w-5 h-5 text-orange-400" />
                Security Recommendations
              </h3>
              <ul className="space-y-2">
                {report.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-3 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                    <span className="text-cyan-400 font-bold">→</span>
                    <span className="text-slate-200">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
            {report.region && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Globe className="w-4 h-4" />
                  Region
                </div>
                <p className="text-white font-medium">{report.region}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Calendar className="w-4 h-4" />
                Report Date
              </div>
              <p className="text-white font-medium">
                {format(new Date(report.report_date || report.created_date), "MMMM d, yyyy")}
              </p>
            </div>

            {report.analyst && (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <FileText className="w-4 h-4" />
                  Analyst
                </div>
                <p className="text-white font-medium">{report.analyst}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Shield className="w-4 h-4" />
                Classification
              </div>
              <p className="text-white font-medium capitalize">{report.classification}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <p className="text-xs text-slate-400">
              Report ID: {report.id} • Created: {format(new Date(report.created_date), "MMM d, yyyy HH:mm")}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}