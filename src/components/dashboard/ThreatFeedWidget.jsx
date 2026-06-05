import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rss, ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ThreatFeedWidget() {
  const { data: feeds = [], isLoading } = useQuery({
    queryKey: ['threatFeedsWidget'],
    queryFn: () => base44.entities.ThreatIntelligenceFeed.list('-created_date', 5),
    refetchInterval: 60000
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white flex items-center gap-2">
            <Rss className="w-5 h-5 text-[#DC2626]" />
            Threat Feed Highlights
          </CardTitle>
          <Link to={createPageUrl("Intel")}>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              View All
              <ExternalLink className="w-3 h-3 ml-2" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-[#0a0a0a] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : feeds.length === 0 ? (
          <div className="text-center py-8">
            <Rss className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-sm text-gray-400">No threat feeds available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {feeds.map((feed) => (
              <div key={feed.id} className="p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer">
                <div className="flex items-start justify-between gap-2 mb-2">
                  {feed.severity_level && (
                    <Badge className={getSeverityColor(feed.severity_level)}>
                      {feed.severity_level}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(feed.created_date), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-white font-medium line-clamp-2">
                  {feed.title || feed.feed_name}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}