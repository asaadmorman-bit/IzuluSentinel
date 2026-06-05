import React, { useState } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Send, Loader2, Sparkles } from "lucide-react";

export default function AIQuery() {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const exampleQueries = [
    "What are the current security risks in Johannesburg, South Africa?",
    "Analyze recent civil unrest patterns in major African cities",
    "Provide a threat assessment for executive travel to Lagos, Nigeria",
    "What are the cybersecurity threats facing financial institutions in Kenya?"
  ];

  const handleSubmit = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const result = await InvokeLLM({
        prompt: `You are a security intelligence analyst. Provide a professional threat assessment for the following query: ${query}`,
        add_context_from_internet: true
      });
      setResponse(result);
    } catch (error) {
      setResponse("Error processing query. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Brain className="w-8 h-8 text-[#DC2626]" />
            AI Intelligence Query
          </h1>
          <p className="text-gray-400">Ask questions about global threats, risks, and security intelligence</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#DC2626]" />
              Intelligence Assistant
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Ask about threats, security risks, geopolitical situations, or request threat assessments..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white min-h-32"
            />
            <Button
              onClick={handleSubmit}
              disabled={isLoading || !query.trim()}
              className="bg-[#DC2626] hover:bg-[#B91C1C] text-white w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Query Intelligence
                </>
              )}
            </Button>

            <div className="pt-4">
              <p className="text-sm text-gray-500 mb-3">Example queries:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, idx) => (
                  <Badge
                    key={idx}
                    variant="outline"
                    className="cursor-pointer hover:bg-[#DC2626]/20 border-[#2a2a2a] text-gray-400 hover:text-white"
                    onClick={() => setQuery(example)}
                  >
                    {example}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {response && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Intelligence Response</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300 whitespace-pre-wrap">{response}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}