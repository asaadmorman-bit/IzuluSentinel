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
  FileText, 
  Search, 
  Plus, 
  ThumbsUp, 
  Eye,
  Brain,
  BookOpen,
  CheckCircle,
  Filter
} from "lucide-react";
import { format } from "date-fns";

export default function KnowledgeBase({ knowledgeBase, user }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [aiSearchResults, setAiSearchResults] = useState(null);
  const [newArticle, setNewArticle] = useState({
    title: "",
    category: "procedure",
    content: "",
    tags: []
  });

  const createArticleMutation = useMutation({
    mutationFn: async (articleData) => {
      // Generate AI summary
      const summaryPrompt = `Summarize this security knowledge article in 2-3 sentences:

Title: ${articleData.title}
Content: ${articleData.content}

Provide a concise, informative summary.`;

      let summary = "";
      try {
        const aiResponse = await base44.integrations.Core.InvokeLLM({
          prompt: summaryPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              summary: { type: "string" }
            }
          }
        });
        summary = aiResponse.summary;
      } catch (error) {
        console.error("AI summary error:", error);
      }

      return base44.entities.SecurityKnowledge.create({
        ...articleData,
        summary: summary,
        status: "published",
        version: 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
      setShowCreateForm(false);
      setNewArticle({ title: "", category: "procedure", content: "", tags: [] });
    }
  });

  const incrementViewMutation = useMutation({
    mutationFn: (articleId) => {
      const article = knowledgeBase.find(a => a.id === articleId);
      return base44.entities.SecurityKnowledge.update(articleId, {
        view_count: (article.view_count || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
    }
  });

  const voteHelpfulMutation = useMutation({
    mutationFn: (articleId) => {
      const article = knowledgeBase.find(a => a.id === articleId);
      return base44.entities.SecurityKnowledge.update(articleId, {
        helpful_votes: (article.helpful_votes || 0) + 1
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['knowledge_base'] });
    }
  });

  const performAISearch = async () => {
    if (!searchQuery.trim()) return;

    const searchPrompt = `You are a security knowledge base assistant. A user is searching for: "${searchQuery}"

Available knowledge articles:
${knowledgeBase.slice(0, 20).map(a => `- ${a.title} (${a.category}): ${a.summary}`).join('\n')}

Provide:
1. Most relevant articles (by ID or title)
2. Additional search terms to try
3. Related topics
4. Suggested actions`;

    try {
      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: searchPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            relevant_articles: {
              type: "array",
              items: { type: "string" }
            },
            search_suggestions: {
              type: "array",
              items: { type: "string" }
            },
            related_topics: {
              type: "array",
              items: { type: "string" }
            },
            summary: { type: "string" }
          }
        }
      });

      setAiSearchResults(aiResponse);
    } catch (error) {
      console.error("AI search error:", error);
    }
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    incrementViewMutation.mutate(article.id);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "procedure": return "bg-cyan-500/20 text-cyan-400";
      case "post_mortem": return "bg-purple-500/20 text-purple-400";
      case "best_practice": return "bg-emerald-500/20 text-emerald-400";
      case "playbook": return "bg-red-500/20 text-red-400";
      case "threat_intel": return "bg-amber-500/20 text-amber-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredArticles = knowledgeBase
    .filter(a => categoryFilter === "all" || a.category === categoryFilter)
    .filter(a => 
      searchQuery === "" || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Security Knowledge Base
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Article
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Knowledge Article</h4>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Title</label>
                  <Input
                    value={newArticle.title}
                    onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
                    placeholder="Article title..."
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Category</label>
                  <Select
                    value={newArticle.category}
                    onValueChange={(value) => setNewArticle({ ...newArticle, category: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procedure">Procedure</SelectItem>
                      <SelectItem value="post_mortem">Post-Mortem</SelectItem>
                      <SelectItem value="best_practice">Best Practice</SelectItem>
                      <SelectItem value="playbook">Playbook</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                      <SelectItem value="policy">Policy</SelectItem>
                      <SelectItem value="threat_intel">Threat Intel</SelectItem>
                      <SelectItem value="lesson_learned">Lesson Learned</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Content</label>
                  <Textarea
                    value={newArticle.content}
                    onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
                    placeholder="Article content..."
                    rows={8}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => createArticleMutation.mutate(newArticle)}
                    disabled={!newArticle.title || !newArticle.content || createArticleMutation.isPending}
                    className="bg-[#DC2626] hover:bg-[#B91C1C]"
                  >
                    Create Article
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

          {/* AI-Powered Search */}
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search knowledge base... (AI-powered)"
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <Button
              onClick={performAISearch}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Brain className="w-4 h-4 mr-2" />
              AI Search
            </Button>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue placeholder="Filter..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="procedure">Procedures</SelectItem>
                <SelectItem value="post_mortem">Post-Mortems</SelectItem>
                <SelectItem value="best_practice">Best Practices</SelectItem>
                <SelectItem value="playbook">Playbooks</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* AI Search Results */}
          {aiSearchResults && (
            <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <h4 className="font-semibold text-purple-400 mb-2 flex items-center gap-2">
                <Brain className="w-4 h-4" />
                AI Search Results
              </h4>
              <p className="text-sm text-gray-300 mb-3">{aiSearchResults.summary}</p>

              {aiSearchResults.search_suggestions && aiSearchResults.search_suggestions.length > 0 && (
                <div className="mb-3">
                  <h5 className="text-sm font-semibold text-white mb-1">Try searching for:</h5>
                  <div className="flex flex-wrap gap-2">
                    {aiSearchResults.search_suggestions.map((suggestion, idx) => (
                      <Badge key={idx} className="bg-purple-500/20 text-purple-300 cursor-pointer hover:bg-purple-500/30" onClick={() => setSearchQuery(suggestion)}>
                        {suggestion}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {aiSearchResults.related_topics && aiSearchResults.related_topics.length > 0 && (
                <div>
                  <h5 className="text-sm font-semibold text-white mb-1">Related Topics:</h5>
                  <div className="flex flex-wrap gap-2">
                    {aiSearchResults.related_topics.map((topic, idx) => (
                      <Badge key={idx} className="bg-cyan-500/20 text-cyan-300">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Articles Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all cursor-pointer"
                onClick={() => handleViewArticle(article)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-white">{article.title}</h3>
                        <Badge className={getCategoryColor(article.category)}>
                          {article.category}
                        </Badge>
                      </div>
                      {article.summary && (
                        <p className="text-sm text-gray-400 line-clamp-2">{article.summary}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {article.view_count || 0}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="w-4 h-4" />
                          {article.helpful_votes || 0}
                        </span>
                      </div>
                      <span>{format(new Date(article.created_date), "MMM d, yyyy")}</span>
                    </div>

                    {article.tags && article.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredArticles.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Articles Found</h3>
                <p className="text-gray-400">Try a different search or create a new article</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArticle(null)}
        >
          <Card
            className="border-[#1a1a1a] bg-[#0f0f0f] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-white mb-2">{selectedArticle.title}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(selectedArticle.category)}>
                      {selectedArticle.category}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      by {selectedArticle.created_by} • {format(new Date(selectedArticle.created_date), "PPP")}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedArticle(null)}
                  className="text-gray-400"
                >
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedArticle.summary && (
                <div className="p-3 bg-[#1a1a1a] rounded">
                  <p className="text-gray-300">{selectedArticle.summary}</p>
                </div>
              )}

              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{selectedArticle.content}</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[#1a1a1a]">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {selectedArticle.view_count || 0} views
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="w-4 h-4" />
                    {selectedArticle.helpful_votes || 0} helpful
                  </span>
                </div>
                <Button
                  size="sm"
                  onClick={() => voteHelpfulMutation.mutate(selectedArticle.id)}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Mark as Helpful
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}