import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Activity, Target, Shield, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function ResponseHistory({ responses, user }) {
  const [selectedResponse, setSelectedResponse] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "executing": return "bg-cyan-500/20 text-cyan-400";
      case "failed": return "bg-red-500/20 text-red-400";
      case "partially_completed": return "bg-amber-500/20 text-amber-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Response History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {responses.map((response) => (
              <Card
                key={response.id}
                className="border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all cursor-pointer"
                onClick={() => setSelectedResponse(response)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white">{response.playbook_name}</h3>
                          <Badge className={getStatusColor(response.status)}>
                            {response.status}
                          </Badge>
                          {response.success && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                          {response.success === false && (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                        </div>

                        <div className="grid md:grid-cols-4 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-400">Started</p>
                            <p className="text-white font-semibold">
                              {format(new Date(response.started_at), "MMM d, HH:mm")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Execution Time</p>
                            <p className="text-white font-semibold">
                              {response.total_execution_time || 0}s
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Trigger Source</p>
                            <p className="text-white font-semibold capitalize">
                              {response.trigger_source?.replace(/_/g, " ")}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400">Actions</p>
                            <p className="text-white font-semibold">
                              {response.executed_actions?.length || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {response.ip_blocks && response.ip_blocks.length > 0 && (
                            <Badge className="bg-red-500/20 text-red-400 text-xs">
                              <Target className="w-3 h-3 mr-1" />
                              {response.ip_blocks.length} IP(s) Blocked
                            </Badge>
                          )}
                          {response.assets_isolated && response.assets_isolated.length > 0 && (
                            <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                              <Shield className="w-3 h-3 mr-1" />
                              {response.assets_isolated.length} Asset(s) Isolated
                            </Badge>
                          )}
                          {response.incidents_created && response.incidents_created.length > 0 && (
                            <Badge className="bg-pink-500/20 text-pink-400 text-xs">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              {response.incidents_created.length} Incident(s)
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {responses.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Response History</h3>
                <p className="text-gray-400">Automated responses will appear here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedResponse && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedResponse(null)}
        >
          <Card
            className="border-[#1a1a1a] bg-[#0f0f0f] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Response Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedResponse(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] rounded">
                <h4 className="font-semibold text-white mb-2">Response Information</h4>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Playbook</p>
                    <p className="text-white">{selectedResponse.playbook_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Status</p>
                    <Badge className={getStatusColor(selectedResponse.status)}>
                      {selectedResponse.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedResponse.executed_actions && selectedResponse.executed_actions.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Executed Actions</h4>
                  <div className="space-y-2">
                    {selectedResponse.executed_actions.map((action, idx) => (
                      <div key={idx} className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-white font-semibold">{action.action_name}</span>
                          <Badge className={action.status === "success" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                            {action.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400">{action.result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedResponse.ip_blocks && selectedResponse.ip_blocks.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Blocked IPs</h4>
                  <div className="space-y-2">
                    {selectedResponse.ip_blocks.map((block, idx) => (
                      <div key={idx} className="p-3 bg-[#1a1a1a] rounded">
                        <code className="text-white">{block.ip_address}</code>
                        <p className="text-xs text-gray-400 mt-1">
                          Duration: {block.block_duration_hours}h • Reason: {block.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedResponse.assets_isolated && selectedResponse.assets_isolated.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Isolated Assets</h4>
                  <div className="space-y-2">
                    {selectedResponse.assets_isolated.map((asset, idx) => (
                      <div key={idx} className="p-3 bg-[#1a1a1a] rounded">
                        <p className="text-white font-semibold">{asset.asset_name}</p>
                        <p className="text-xs text-gray-400">
                          Level: {asset.isolation_level} • Reason: {asset.reason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}