import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Activity, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  FileText,
  Upload,
  Brain,
  Users,
  Target
} from "lucide-react";
import { format } from "date-fns";

export default function IncidentResponseBoard({ responseBoards, incidents, user }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newBoard, setNewBoard] = useState({
    incident_id: "",
    title: "",
    priority: "medium"
  });

  const createBoardMutation = useMutation({
    mutationFn: async (boardData) => {
      const incident = incidents.find(i => i.id === boardData.incident_id);
      
      // Generate AI recommendations
      const aiPrompt = `You are an incident response expert. Analyze this incident and provide immediate response recommendations:

Incident: ${incident?.title}
Type: ${incident?.threat_type}
Severity: ${incident?.severity}
Description: ${incident?.description}

Provide:
1. Immediate actions to take
2. Team roles needed
3. Evidence to collect
4. Communication plan

Format as JSON array of recommendation strings.`;

      let aiRecommendations = [];
      try {
        const aiResponse = await base44.integrations.Core.InvokeLLM({
          prompt: aiPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              recommendations: {
                type: "array",
                items: { type: "string" }
              }
            }
          }
        });
        aiRecommendations = aiResponse.recommendations || [];
      } catch (error) {
        console.error("AI recommendation error:", error);
      }

      return base44.entities.IncidentResponseBoard.create({
        ...boardData,
        incident_commander: user?.email,
        response_team: [user?.email],
        timeline: [{
          timestamp: new Date().toISOString(),
          event: "Response board created",
          actor: user?.email || user?.full_name,
          event_type: "created"
        }],
        ai_recommendations: aiRecommendations
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response_boards'] });
      setShowCreateForm(false);
      setNewBoard({ incident_id: "", title: "", priority: "medium" });
    }
  });

  const addTimelineEventMutation = useMutation({
    mutationFn: ({ boardId, event }) => {
      const board = responseBoards.find(b => b.id === boardId);
      const updatedTimeline = [
        ...(board.timeline || []),
        {
          timestamp: new Date().toISOString(),
          event: event,
          actor: user?.email || user?.full_name,
          event_type: "update"
        }
      ];
      return base44.entities.IncidentResponseBoard.update(boardId, {
        timeline: updatedTimeline
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response_boards'] });
    }
  });

  const uploadEvidenceMutation = useMutation({
    mutationFn: async ({ boardId, file, description }) => {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const board = responseBoards.find(b => b.id === boardId);
      
      const newEvidence = {
        title: file.name,
        description: description,
        file_url: file_url,
        uploaded_by: user?.email,
        uploaded_at: new Date().toISOString(),
        evidence_type: file.type
      };

      return base44.entities.IncidentResponseBoard.update(boardId, {
        evidence: [...(board.evidence || []), newEvidence]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response_boards'] });
    }
  });

  const generateAISummaryMutation = useMutation({
    mutationFn: async (boardId) => {
      const board = responseBoards.find(b => b.id === boardId);
      
      const summaryPrompt = `Analyze this incident response and provide a comprehensive summary:

Timeline Events: ${board.timeline?.length || 0}
Evidence Collected: ${board.evidence?.length || 0}
Actions Taken: ${board.actions_taken?.length || 0}

Timeline:
${board.timeline?.slice(-10).map(t => `- ${t.event} by ${t.actor}`).join('\n')}

Provide:
1. Current status summary
2. Key findings
3. Recommended next steps
4. Any gaps or concerns`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: summaryPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            next_steps: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      return base44.entities.IncidentResponseBoard.update(boardId, {
        ai_summary: aiResponse.summary,
        ai_recommendations: aiResponse.next_steps || []
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response_boards'] });
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400";
      case "monitoring": return "bg-cyan-500/20 text-cyan-400";
      case "resolved": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Incident Response Boards
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Response Board
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg mb-6">
              <h4 className="font-semibold text-white mb-4">Create New Response Board</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Select Incident</label>
                  <Select
                    value={newBoard.incident_id}
                    onValueChange={(value) => setNewBoard({ ...newBoard, incident_id: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue placeholder="Choose incident..." />
                    </SelectTrigger>
                    <SelectContent>
                      {incidents.filter(i => i.status === "active" || i.status === "monitoring").map((incident) => (
                        <SelectItem key={incident.id} value={incident.id}>
                          {incident.title} ({incident.severity})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Board Title</label>
                  <Input
                    value={newBoard.title}
                    onChange={(e) => setNewBoard({ ...newBoard, title: e.target.value })}
                    placeholder="Response board title..."
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Priority</label>
                  <Select
                    value={newBoard.priority}
                    onValueChange={(value) => setNewBoard({ ...newBoard, priority: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => createBoardMutation.mutate(newBoard)}
                    disabled={!newBoard.incident_id || !newBoard.title || createBoardMutation.isPending}
                    className="bg-[#DC2626] hover:bg-[#B91C1C]"
                  >
                    Create Board
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCreateForm(false)}
                    className="border-[#2a2a2a] text-white"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {responseBoards.map((board) => (
              <Card key={board.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg">{board.title}</h3>
                          <Badge className={getStatusColor(board.status)}>
                            {board.status}
                          </Badge>
                          <Badge className={getPriorityColor(board.priority)}>
                            {board.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            Commander: {board.incident_commander}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="w-4 h-4" />
                            Team: {board.response_team?.length || 0}
                          </span>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => generateAISummaryMutation.mutate(board.id)}
                        disabled={generateAISummaryMutation.isPending}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Brain className="w-4 h-4 mr-2" />
                        AI Summary
                      </Button>
                    </div>

                    {board.ai_summary && (
                      <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                        <h4 className="text-sm font-semibold text-purple-400 mb-1">AI Summary</h4>
                        <p className="text-sm text-gray-300">{board.ai_summary}</p>
                      </div>
                    )}

                    {board.ai_recommendations && board.ai_recommendations.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">AI Recommendations</h4>
                        <div className="space-y-1">
                          {board.ai_recommendations.slice(0, 3).map((rec, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{rec}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <p className="text-sm font-semibold text-white">Timeline</p>
                        </div>
                        <p className="text-xl font-bold text-white">{board.timeline?.length || 0} events</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <FileText className="w-4 h-4 text-purple-400" />
                          <p className="text-sm font-semibold text-white">Evidence</p>
                        </div>
                        <p className="text-xl font-bold text-white">{board.evidence?.length || 0} items</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                          <p className="text-sm font-semibold text-white">Actions</p>
                        </div>
                        <p className="text-xl font-bold text-white">{board.actions_taken?.length || 0} taken</p>
                      </div>
                    </div>

                    {board.timeline && board.timeline.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Recent Activity</h4>
                        <div className="space-y-2">
                          {board.timeline.slice(-5).reverse().map((event, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-2 bg-[#1a1a1a] rounded">
                              <Clock className="w-4 h-4 text-gray-500 flex-shrink-0 mt-1" />
                              <div className="flex-1">
                                <p className="text-sm text-white">{event.event}</p>
                                <p className="text-xs text-gray-500">
                                  {event.actor} • {format(new Date(event.timestamp), "MMM d, HH:mm:ss")}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {responseBoards.length === 0 && (
              <div className="text-center py-12">
                <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Response Boards</h3>
                <p className="text-gray-400">Create your first incident response board to start collaborating</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}