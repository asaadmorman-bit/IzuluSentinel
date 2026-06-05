import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function AutomatedResponse({ analyses }) {
  const getActionColor = (action) => {
    if (action.includes("block")) return "bg-red-500/20 text-red-400";
    if (action.includes("isolate")) return "bg-orange-500/20 text-orange-400";
    if (action.includes("escalate")) return "bg-amber-500/20 text-amber-400";
    return "bg-cyan-500/20 text-cyan-400";
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Automated Response Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">AI-Driven Automated Actions</h4>
              <p className="text-sm text-gray-400">
                When AI analysis reaches high confidence levels, automated response actions can be executed immediately. 
                All actions are logged and can be rolled back if needed.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white capitalize">
                          {analysis.analysis_type?.replace(/_/g, " ")}
                        </h3>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          Confidence: {analysis.confidence_level}%
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{analysis.summary}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(analysis.created_date), "MMM d, HH:mm")}
                    </span>
                  </div>

                  {analysis.automated_actions_taken && analysis.automated_actions_taken.length > 0 && (
                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-semibold text-white">
                          Automated Actions Executed ({analysis.automated_actions_taken.length})
                        </span>
                      </div>
                      <div className="space-y-2">
                        {analysis.automated_actions_taken.map((action, idx) => (
                          <div key={idx} className="flex items-center justify-between p-2 bg-[#0f0f0f] rounded">
                            <div className="flex items-center gap-2">
                              {action.success ? (
                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                              ) : (
                                <XCircle className="w-4 h-4 text-red-400" />
                              )}
                              <span className="text-white text-sm">{action.action_name}</span>
                            </div>
                            <Badge className={getActionColor(action.action_type)}>
                              {action.action_type}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-amber-400" />
                        <span className="text-sm font-semibold text-white">
                          Recommended Manual Actions
                        </span>
                      </div>
                      <div className="space-y-1">
                        {analysis.recommended_actions
                          .filter(a => !a.automated)
                          .map((action, idx) => (
                            <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              <span>{action.action}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {analyses.length === 0 && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Automated Actions Yet</h3>
              <p className="text-gray-400">
                Automated responses will appear here when AI analysis triggers high-confidence actions
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}