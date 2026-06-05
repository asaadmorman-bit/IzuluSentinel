import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Activity,
  Brain,
  Shield,
  Zap
} from "lucide-react";

import IncidentResponseBoard from "../components/collaboration/IncidentResponseBoard";
import AIAssistedMessaging from "../components/collaboration/AIAssistedMessaging";
import KnowledgeBase from "../components/collaboration/KnowledgeBase";

export default function AdvancedCollaboration() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("response_board");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const { data: responseBoards = [] } = useQuery({
    queryKey: ['response_boards'],
    queryFn: () => base44.entities.IncidentResponseBoard.list("-created_date", 50),
    refetchInterval: 5000
  });

  const { data: teamMessages = [] } = useQuery({
    queryKey: ['team_messages_collab'],
    queryFn: () => base44.entities.TeamMessage.list("-created_date", 100),
    refetchInterval: 3000
  });

  const { data: knowledgeBase = [] } = useQuery({
    queryKey: ['knowledge_base'],
    queryFn: () => base44.entities.SecurityKnowledge.list("-created_date", 100),
    refetchInterval: 10000
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents_collab'],
    queryFn: () => base44.entities.Incident.list("-created_date", 50),
    refetchInterval: 10000
  });

  const stats = {
    activeBoards: responseBoards.filter(b => b.status === "active").length,
    totalMessages: teamMessages.length,
    knowledgeArticles: knowledgeBase.filter(k => k.status === "published").length,
    teamMembers: new Set([
      ...responseBoards.flatMap(b => b.response_team || []),
      ...teamMessages.map(m => m.created_by)
    ]).size
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-10 h-10 text-[#DC2626]" />
              Advanced Collaboration Hub
            </h1>
            <p className="text-gray-400">Real-time incident response, AI-assisted messaging, and shared knowledge base</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Live Collaboration Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            AI-Powered
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Response Boards</p>
                  <p className="text-2xl font-bold text-white">{stats.activeBoards}</p>
                </div>
                <Activity className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Team Messages</p>
                  <p className="text-2xl font-bold text-white">{stats.totalMessages}</p>
                </div>
                <MessageSquare className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Knowledge Articles</p>
                  <p className="text-2xl font-bold text-white">{stats.knowledgeArticles}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Team Members</p>
                  <p className="text-2xl font-bold text-white">{stats.teamMembers}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Banner */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Incident Response Boards</h4>
                  <p className="text-sm text-gray-400">
                    Real-time collaborative response with timeline tracking, evidence collection, and AI-suggested actions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">AI-Assisted Messaging</h4>
                  <p className="text-sm text-gray-400">
                    Secure team communications with AI summaries, context extraction, and intelligent next-step suggestions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Knowledge Base</h4>
                  <p className="text-sm text-gray-400">
                    Shared repository of procedures, post-mortems, and best practices with AI-powered semantic search
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 bg-[#1a1a1a]">
            <TabsTrigger value="response_board" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Response Boards
            </TabsTrigger>
            <TabsTrigger value="messaging" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <MessageSquare className="w-4 h-4 mr-2" />
              AI Messaging
            </TabsTrigger>
            <TabsTrigger value="knowledge" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Knowledge Base
            </TabsTrigger>
          </TabsList>

          <TabsContent value="response_board" className="mt-6">
            <IncidentResponseBoard
              responseBoards={responseBoards}
              incidents={incidents}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="messaging" className="mt-6">
            <AIAssistedMessaging
              messages={teamMessages}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="knowledge" className="mt-6">
            <KnowledgeBase
              knowledgeBase={knowledgeBase}
              user={currentUser}
            />
          </TabsContent>
        </Tabs>

        {/* Features Overview */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Advanced Collaboration Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Zap className="w-5 h-5 text-amber-400" />
                  <h4 className="font-semibold text-white">Real-Time Sync</h4>
                </div>
                <p className="text-sm text-gray-400">
                  All updates propagate instantly across team members with live activity feeds and notifications
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Brain className="w-5 h-5 text-purple-400" />
                  <h4 className="font-semibold text-white">AI Context Understanding</h4>
                </div>
                <p className="text-sm text-gray-400">
                  AI analyzes conversations to extract key information, summarize discussions, and suggest relevant actions
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  <h4 className="font-semibold text-white">Secure & Compliant</h4>
                </div>
                <p className="text-sm text-gray-400">
                  End-to-end encryption, audit trails, and role-based access control for all collaboration features
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-cyan-400" />
                  <h4 className="font-semibold text-white">Automated Documentation</h4>
                </div>
                <p className="text-sm text-gray-400">
                  AI automatically generates incident reports, post-mortems, and knowledge articles from response activities
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}