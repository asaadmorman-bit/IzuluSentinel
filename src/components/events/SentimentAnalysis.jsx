import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, MessageSquare } from "lucide-react";

export default function SentimentAnalysis({ socialIntel, selectedEvent }) {
  if (!selectedEvent) {
    return (
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-12 text-center">
          <TrendingUp className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Event Selected</h3>
          <p className="text-gray-400">Select an event to view sentiment analysis</p>
        </CardContent>
      </Card>
    );
  }

  const sentimentCounts = {
    positive: socialIntel.filter(s => s.sentiment === "positive").length,
    neutral: socialIntel.filter(s => s.sentiment === "neutral").length,
    negative: socialIntel.filter(s => s.sentiment === "negative").length,
    threatening: socialIntel.filter(s => s.sentiment === "threatening").length
  };

  const total = socialIntel.length || 1;
  const overallScore = ((sentimentCounts.positive * 100 + sentimentCounts.neutral * 50 - sentimentCounts.negative * 50 - sentimentCounts.threatening * 100) / total).toFixed(1);

  const sourceCounts = socialIntel.reduce((acc, s) => {
    acc[s.source_type] = (acc[s.source_type] || 0) + 1;
    return acc;
  }, {});

  const topKeywords = socialIntel
    .flatMap(s => s.keywords_matched || [])
    .reduce((acc, keyword) => {
      acc[keyword] = (acc[keyword] || 0) + 1;
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Social Sentiment Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Event: {selectedEvent.event_name}</h4>
            <p className="text-sm text-gray-400">
              Real-time sentiment analysis of {socialIntel.length} social media posts
            </p>
          </div>

          {/* Overall Sentiment Score */}
          <div className="text-center">
            <p className="text-sm text-gray-400 mb-2">Overall Sentiment Score</p>
            <div className="text-6xl font-bold text-white mb-2">{overallScore}</div>
            <Badge className={
              parseFloat(overallScore) > 50 ? "bg-emerald-500/20 text-emerald-400" :
              parseFloat(overallScore) > 0 ? "bg-amber-500/20 text-amber-400" :
              "bg-red-500/20 text-red-400"
            }>
              {parseFloat(overallScore) > 50 ? "Positive" : 
               parseFloat(overallScore) > 0 ? "Mixed" : "Negative"}
            </Badge>
          </div>

          {/* Sentiment Breakdown */}
          <div>
            <h4 className="font-semibold text-white mb-3">Sentiment Distribution</h4>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Positive</span>
                  <span className="text-white font-semibold">{sentimentCounts.positive}</span>
                </div>
                <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(sentimentCounts.positive / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Neutral</span>
                  <span className="text-white font-semibold">{sentimentCounts.neutral}</span>
                </div>
                <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-gray-500 h-full"
                    style={{ width: `${(sentimentCounts.neutral / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Negative</span>
                  <span className="text-white font-semibold">{sentimentCounts.negative}</span>
                </div>
                <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-orange-500 h-full"
                    style={{ width: `${(sentimentCounts.negative / total) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-400">Threatening</span>
                  <span className="text-white font-semibold">{sentimentCounts.threatening}</span>
                </div>
                <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${(sentimentCounts.threatening / total) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Source Distribution */}
          <div>
            <h4 className="font-semibold text-white mb-3">Source Distribution</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {Object.entries(sourceCounts).map(([source, count]) => (
                <div key={source} className="p-3 bg-[#1a1a1a] rounded">
                  <div className="flex items-center justify-between">
                    <span className="text-white capitalize">{source}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Keywords */}
          {Object.keys(topKeywords).length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3">Trending Keywords</h4>
              <div className="flex flex-wrap gap-2">
                {Object.entries(topKeywords)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 10)
                  .map(([keyword, count]) => (
                    <Badge key={keyword} className="bg-cyan-500/20 text-cyan-400">
                      {keyword} ({count})
                    </Badge>
                  ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}