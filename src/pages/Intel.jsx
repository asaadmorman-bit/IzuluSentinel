import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Brain, 
  Rss, 
  Search, 
  TrendingUp,
  Globe,
  Shield,
  AlertTriangle,
  Clock,
  Download
} from "lucide-react";
import { format } from "date-fns";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import ExportButton from "../components/shared/ExportButton";

export default function Intel() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("feeds");

  const { data: threatFeeds = [], isLoading: feedsLoading } = useQuery({
    queryKey: ['threatFeeds'],
    queryFn: () => base44.entities.ThreatIntelligenceFeed.list('-created_date', 100),
    refetchInterval: 60000
  });

  const { data: enrichedIntel = [], isLoading: intelLoading } = useQuery({
    queryKey: ['enrichedIntel'],
    queryFn: () => base44.entities.EnrichedThreatIntel.list('-created_date', 50)
  });

  const { data: analyses = [], isLoading: analysesLoading } = useQuery({
    queryKey: ['aiAnalyses'],
    queryFn: () => base44.entities.AIAnalysis.list('-created_date', 20)
  });

  const filteredFeeds = threatFeeds.filter(feed =>
    !searchTerm || 
    feed.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    feed.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    totalFeeds: threatFeeds.length,
    activeFeeds: threatFeeds.filter(f => f.is_active).length,
    highSeverity: threatFeeds.filter(f => f.severity_level === "high" || f.severity_level === "critical").length,
    last24h: threatFeeds.filter(f => 
      new Date(f.created_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  if (feedsLoading && intelLoading && analysesLoading) {
    return <LoadingSpinner message="Loading threat intelligence..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Threat Intelligence Hub
            </h1>
            <p className="text-sm text-gray-400">
              Real-time threat intelligence and AI-powered analysis
            </p>
          </div>
          <ExportButton 
            data={activeTab === 'feeds' ? filteredFeeds : activeTab === 'enriched' ? enrichedIntel : analyses} 
            filename={`threat-intel-${activeTab}`} 
          />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total Feeds</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.totalFeeds}</p>
                </div>
                <Rss className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Active Feeds</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.activeFeeds}</p>
                </div>
                <Globe className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">High Severity</p>
                  <p className="text-2xl font-bold text-orange-400 mt-1">{stats.highSeverity}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Last 24h</p>
                  <p className="text-2xl font-bold text-cyan-400 mt-1">{stats.last24h}</p>
                </div>
                <Clock className="w-8 h-8 text-cyan-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                placeholder="Search threat intelligence..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#0a0a0a] border-[#2a2a2a] text-white"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[#0f0f0f] border-[#1a1a1a]">
            <TabsTrigger value="feeds" className="data-[state=active]:bg-[#DC2626]">
              <Rss className="w-4 h-4 mr-2" />
              Threat Feeds
            </TabsTrigger>
            <TabsTrigger value="enriched" className="data-[state=active]:bg-[#DC2626]">
              <Brain className="w-4 h-4 mr-2" />
              Enriched Intel
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-[#DC2626]">
              <TrendingUp className="w-4 h-4 mr-2" />
              AI Analysis
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feeds" className="space-y-3">
            {filteredFeeds.map((feed) => (
              <Card key={feed.id} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {feed.severity_level && (
                          <Badge className={getSeverityColor(feed.severity_level)}>
                            {feed.severity_level}
                          </Badge>
                        )}
                        {feed.feed_type && (
                          <Badge variant="outline">{feed.feed_type}</Badge>
                        )}
                      </div>
                      
                      <h3 className="text-base font-bold text-white mb-2">
                        {feed.title || feed.feed_name}
                      </h3>
                      
                      {feed.description && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {feed.description}
                        </p>
                      )}

                      <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(feed.created_date), "MMM d, HH:mm")}
                        </div>
                        {feed.source && (
                          <div className="flex items-center gap-1">
                            <Globe className="w-3 h-3" />
                            {feed.source}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="enriched" className="space-y-3">
            {enrichedIntel.length === 0 ? (
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardContent className="p-12 text-center">
                  <Brain className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No enriched intelligence available</p>
                </CardContent>
              </Card>
            ) : (
              enrichedIntel.map((intel) => (
                <Card key={intel.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <h3 className="text-base font-bold text-white mb-2">
                      {intel.indicator || "Intelligence Item"}
                    </h3>
                    <p className="text-sm text-gray-400">{intel.context || intel.analysis}</p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="analysis" className="space-y-3">
            {analyses.length === 0 ? (
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardContent className="p-12 text-center">
                  <TrendingUp className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">No AI analyses available</p>
                </CardContent>
              </Card>
            ) : (
              analyses.map((analysis) => (
                <Card key={analysis.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <Badge className="mb-3 bg-purple-500/20 text-purple-400 border-purple-500/30">
                      AI Analysis
                    </Badge>
                    <h3 className="text-base font-bold text-white mb-2">
                      {analysis.analysis_type}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">{analysis.summary}</p>
                    <p className="text-xs text-gray-500">
                      {format(new Date(analysis.created_date), "MMM d, yyyy HH:mm")}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}