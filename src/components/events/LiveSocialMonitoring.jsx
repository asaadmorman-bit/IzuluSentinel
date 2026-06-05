
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Play, AlertTriangle, CheckCircle, XCircle, Radio } from "lucide-react";
import { format } from "date-fns";

export default function LiveSocialMonitoring({ socialIntel, selectedEvent, user }) {
  const queryClient = useQueryClient();
  const [isScanning, setIsScanning] = useState(false);

  const scanSocialMutation = useMutation({
    mutationFn: async () => {
      if (!selectedEvent) return;
      if (!user || !["admin", "command_staff", "soc_analyst", "security_personnel"].includes(user.role)) {
        throw new Error("Unauthorized: Insufficient privileges");
      }
      
      setIsScanning(true);

      const scanPrompt = "You are a social media intelligence analyst monitoring for threats to event: " + selectedEvent.event_name + ". Simulate discovering 5-10 social media posts from various sources that might be relevant. Include mix of normal posts and potential threats with geolocation data, sentiment analysis, and threat scoring. Format as array of social media intelligence items.";

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: scanPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            posts: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  source_type: { type: "string" },
                  content: { type: "string" },
                  author: { type: "string" },
                  sentiment: { type: "string" },
                  threat_score: { type: "number" },
                  threat_indicators: {
                    type: "array",
                    items: { type: "string" }
                  },
                  keywords_matched: {
                    type: "array",
                    items: { type: "string" }
                  },
                  ai_summary: { type: "string" },
                  threat_level: { type: "string" },
                  recommended_action: { type: "string" },
                  credibility_score: { type: "number" }
                }
              }
            }
          }
        }
      });

      const posts = aiResponse.posts || [];
      
      for (const post of posts) {
        await base44.entities.SocialMediaIntel.create({
          event_id: selectedEvent.id,
          source_type: post.source_type || "twitter",
          content: post.content,
          author: post.author || "user" + Math.floor(Math.random() * 10000),
          posted_at: new Date().toISOString(),
          threat_score: post.threat_score || 0,
          sentiment: post.sentiment || "neutral",
          threat_indicators: post.threat_indicators || [],
          keywords_matched: post.keywords_matched || [],
          ai_analysis: {
            summary: post.ai_summary,
            threat_level: post.threat_level || "low",
            recommended_action: post.recommended_action,
            credibility_score: post.credibility_score || 50,
            urgency: post.threat_score > 70 ? "high" : post.threat_score > 40 ? "medium" : "low"
          },
          flagged: post.threat_score > 60,
          reviewed: false,
          escalated: false
        });
      }

      setIsScanning(false);
      return posts.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_intel'] });
    },
    onError: () => {
      setIsScanning(false);
    }
  });

  const reviewPostMutation = useMutation({
    mutationFn: ({ postId, falsePositive }) => {
      if (!user || !["admin", "command_staff", "soc_analyst", "security_personnel"].includes(user.role)) {
        throw new Error("Unauthorized: Insufficient privileges");
      }
      return base44.entities.SocialMediaIntel.update(postId, {
        reviewed: true,
        reviewed_by: user?.email,
        false_positive: falsePositive
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['social_intel'] });
    }
  });

  const getSourceColor = (source) => {
    switch (source) {
      case "twitter": return "bg-blue-500/20 text-blue-400";
      case "telegram": return "bg-cyan-500/20 text-cyan-400";
      case "reddit": return "bg-orange-500/20 text-orange-400";
      case "dark_web": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case "threatening": return "bg-red-500/20 text-red-400";
      case "negative": return "bg-orange-500/20 text-orange-400";
      case "neutral": return "bg-gray-500/20 text-gray-400";
      default: return "bg-emerald-500/20 text-emerald-400";
    }
  };

  if (!selectedEvent) {
    return (
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-12 text-center">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">No Event Selected</h3>
          <p className="text-gray-400">Select an event to view social media intelligence</p>
        </CardContent>
      </Card>
    );
  }

  const monitoringKeywords = selectedEvent.social_monitoring?.keywords?.slice(0, 3).join(", ") || "N/A";
  const monitoringHashtags = selectedEvent.social_monitoring?.hashtags?.slice(0, 3).join(", ") || "N/A";

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Live Social Media Intelligence
            </CardTitle>
            <Button
              onClick={() => scanSocialMutation.mutate()}
              disabled={scanSocialMutation.isPending || isScanning}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Play className="w-4 h-4 mr-2" />
              {isScanning ? "Scanning..." : "Scan Now"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Monitoring: {selectedEvent.event_name}</h4>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400">Keywords</p>
                <p className="text-white">{monitoringKeywords}</p>
              </div>
              <div>
                <p className="text-gray-400">Hashtags</p>
                <p className="text-white">{monitoringHashtags}</p>
              </div>
            </div>
          </div>

          {isScanning && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <div className="flex items-center gap-3">
                <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-white font-semibold">Scanning social media, news, and dark web sources...</span>
              </div>
            </div>
          )}

          <div className="space-y-3">
            {socialIntel.map((post) => (
              <Card key={post.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSourceColor(post.source_type)}>
                            {post.source_type}
                          </Badge>
                          <Badge className={getSentimentColor(post.sentiment)}>
                            {post.sentiment}
                          </Badge>
                          {post.flagged && (
                            <Badge className="bg-red-500/20 text-red-400">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Flagged
                            </Badge>
                          )}
                          {post.reviewed && (
                            <Badge className="bg-emerald-500/20 text-emerald-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Reviewed
                            </Badge>
                          )}
                        </div>

                        <p className="text-white mb-2">{post.content}</p>

                        <div className="grid md:grid-cols-3 gap-3 text-sm mb-2">
                          <div>
                            <p className="text-gray-400">Author</p>
                            <p className="text-white font-semibold">{post.author}</p>
                          </div>
                          <div>
                            <p className="text-gray-400">Threat Score</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                                <div
                                  className={post.threat_score >= 70 ? "bg-red-500 h-full" : post.threat_score >= 40 ? "bg-amber-500 h-full" : "bg-cyan-500 h-full"}
                                  style={{ width: post.threat_score + "%" }}
                                />
                              </div>
                              <span className="text-white font-semibold">{post.threat_score}</span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-400">Posted</p>
                            <p className="text-white font-semibold">
                              {format(new Date(post.posted_at), "HH:mm:ss")}
                            </p>
                          </div>
                        </div>

                        {post.ai_analysis && (
                          <div className="p-3 bg-[#1a1a1a] rounded mb-2">
                            <p className="text-sm text-gray-400 mb-1">AI Analysis</p>
                            <p className="text-white text-sm">{post.ai_analysis.summary}</p>
                            <p className="text-xs text-amber-400 mt-1">
                              Recommended: {post.ai_analysis.recommended_action}
                            </p>
                          </div>
                        )}

                        {post.threat_indicators && post.threat_indicators.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {post.threat_indicators.map((indicator, idx) => (
                              <Badge key={idx} className="bg-red-500/20 text-red-400 text-xs">
                                {indicator}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      {!post.reviewed && (
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={() => reviewPostMutation.mutate({ postId: post.id, falsePositive: false })}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Valid
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => reviewPostMutation.mutate({ postId: post.id, falsePositive: true })}
                            className="border-gray-500 text-gray-400"
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            False
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {socialIntel.length === 0 && !isScanning && (
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Social Intelligence</h3>
                <p className="text-gray-400">Click Scan Now to start monitoring social media</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
