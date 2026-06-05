import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, Brain, Sparkles, TrendingUp, CheckCircle } from "lucide-react";
import { format } from "date-fns";

export default function AIAssistedMessaging({ messages, user }) {
  const queryClient = useQueryClient();
  const [newMessage, setNewMessage] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("general");
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [showAISummary, setShowAISummary] = useState(false);
  const [aiSummary, setAiSummary] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const sendMessageMutation = useMutation({
    mutationFn: (messageData) => base44.entities.TeamMessage.create(messageData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['team_messages_collab'] });
      setNewMessage("");
      
      // Trigger AI suggestions after sending
      if (messages.length > 3) {
        generateAISuggestions();
      }
    }
  });

  const generateAISuggestions = async () => {
    const recentMessages = messages.slice(-10);
    
    const suggestionPrompt = `Analyze this security team conversation and provide intelligent suggestions:

Recent Messages:
${recentMessages.map(m => `${m.sender_name}: ${m.message}`).join('\n')}

Provide:
1. Next logical steps or actions
2. Related security procedures to reference
3. Team members who should be notified
4. Potential concerns or risks

Format as JSON array of suggestion objects.`;

    try {
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: suggestionPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  text: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAiSuggestions(aiResponse.suggestions || []);
    } catch (error) {
      console.error("AI suggestion error:", error);
    }
  };

  const generateConversationSummary = async () => {
    setShowAISummary(true);
    
    const channelMessages = messages.filter(m => m.channel_id === selectedChannel);
    
    const summaryPrompt = `Summarize this security team conversation:

Messages: ${channelMessages.length}
Participants: ${new Set(channelMessages.map(m => m.sender_name)).size}

Conversation:
${channelMessages.slice(-20).map(m => `${m.sender_name}: ${m.message}`).join('\n')}

Provide:
1. Key discussion points
2. Decisions made
3. Action items assigned
4. Unresolved questions
5. Recommended next steps`;

    try {
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: summaryPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
            key_points: {
              type: "array",
              items: { type: "string" }
            },
            action_items: {
              type: "array",
              items: { type: "string" }
            },
            next_steps: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      setAiSummary(aiResponse);
    } catch (error) {
      console.error("AI summary error:", error);
      setShowAISummary(false);
    }
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    sendMessageMutation.mutate({
      channel_id: selectedChannel,
      channel_type: "general",
      message: newMessage,
      message_type: "text",
      priority: "normal",
      sender_name: user.full_name || user.email,
      sender_role: user.role || "security_personnel",
      read_by: [user.email]
    });
  };

  const channelMessages = messages.filter(m => m.channel_id === selectedChannel);

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              AI-Assisted Team Messaging
            </CardTitle>
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={generateAISuggestions}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Brain className="w-4 h-4 mr-2" />
                Get AI Suggestions
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={generateConversationSummary}
                className="border-[#2a2a2a] text-white"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Summarize
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AI Summary */}
          {showAISummary && aiSummary && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-purple-400">AI Conversation Summary</h4>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowAISummary(false)}
                  className="text-gray-400"
                >
                  Close
                </Button>
              </div>
              
              <p className="text-sm text-gray-300 mb-3">{aiSummary.summary}</p>

              {aiSummary.key_points && aiSummary.key_points.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-white mb-2">Key Points:</h5>
                  <ul className="space-y-1">
                    {aiSummary.key_points.map((point, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {point}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSummary.action_items && aiSummary.action_items.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-white mb-2">Action Items:</h5>
                  <ul className="space-y-1">
                    {aiSummary.action_items.map((item, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <TrendingUp className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {aiSummary.next_steps && aiSummary.next_steps.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-2">Recommended Next Steps:</h5>
                  <ul className="space-y-1">
                    {aiSummary.next_steps.map((step, idx) => (
                      <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* AI Suggestions */}
          {aiSuggestions.length > 0 && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
              <h4 className="font-semibold text-cyan-400 mb-3 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Suggestions
              </h4>
              <div className="space-y-2">
                {aiSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-2 bg-[#1a1a1a] rounded flex items-start gap-2">
                    <Badge className="bg-cyan-500/20 text-cyan-400 text-xs capitalize">
                      {suggestion.type}
                    </Badge>
                    <p className="text-sm text-gray-300 flex-1">{suggestion.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="p-4">
              <div className="space-y-3 max-h-[500px] overflow-y-auto mb-4">
                {channelMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  channelMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-3 rounded-lg ${
                        message.created_by === user?.email
                          ? "bg-[#DC2626]/10 ml-12"
                          : "bg-[#1a1a1a] mr-12"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-1">
                        <span className="font-semibold text-white text-sm">
                          {message.sender_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {format(new Date(message.created_date), "HH:mm")}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{message.message}</p>
                      {message.priority === "urgent" && (
                        <Badge className="bg-red-500/20 text-red-400 text-xs mt-2">
                          URGENT
                        </Badge>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="flex gap-2">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessageMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
}