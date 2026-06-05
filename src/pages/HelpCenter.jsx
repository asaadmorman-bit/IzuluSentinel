import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  HelpCircle, 
  Search, 
  BookOpen, 
  Video, 
  MessageCircle, 
  Mail,
  FileText,
  Shield,
  Map,
  Users,
  Zap,
  ChevronRight
} from "lucide-react";

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [
    {
      id: "getting-started",
      name: "Getting Started",
      icon: Zap,
      articles: [
        { title: "Quick Start Guide", views: 1234 },
        { title: "Understanding the Dashboard", views: 892 },
        { title: "Creating Your First Incident", views: 756 },
        { title: "Setting Up Alerts", views: 645 }
      ]
    },
    {
      id: "threat-intelligence",
      name: "Threat Intelligence",
      icon: Shield,
      articles: [
        { title: "Understanding Threat Levels", views: 543 },
        { title: "Using Threat Feeds", views: 432 },
        { title: "AI Query System Guide", views: 389 },
        { title: "MITRE ATT&CK Integration", views: 321 }
      ]
    },
    {
      id: "maps-tracking",
      name: "Maps & Tracking",
      icon: Map,
      articles: [
        { title: "Using the Threat Map", views: 678 },
        { title: "Asset Tracking Guide", views: 567 },
        { title: "Route Planning Tutorial", views: 456 },
        { title: "Geofencing Setup", views: 345 }
      ]
    },
    {
      id: "team-collaboration",
      name: "Team Collaboration",
      icon: Users,
      articles: [
        { title: "Team Management", views: 432 },
        { title: "Secure Communications", views: 398 },
        { title: "Role-Based Access Control", views: 287 },
        { title: "Sharing Intelligence Reports", views: 234 }
      ]
    },
    {
      id: "integrations",
      name: "Integrations & API",
      icon: Zap,
      articles: [
        { title: "API Documentation", views: 567 },
        { title: "Webhook Setup", views: 456 },
        { title: "Threat Feed Integration", views: 389 },
        { title: "Custom Integrations", views: 234 }
      ]
    },
    {
      id: "security-compliance",
      name: "Security & Compliance",
      icon: Shield,
      articles: [
        { title: "Two-Factor Authentication", views: 654 },
        { title: "Zero Trust Architecture", views: 543 },
        { title: "Compliance Reports", views: 432 },
        { title: "Audit Trail Guide", views: 321 }
      ]
    }
  ];

  const resources = [
    {
      title: "Video Tutorials",
      description: "Watch step-by-step video guides",
      icon: Video,
      count: "24 videos",
      color: "red"
    },
    {
      title: "Documentation",
      description: "Comprehensive technical docs",
      icon: FileText,
      count: "156 articles",
      color: "cyan"
    },
    {
      title: "Live Chat",
      description: "Chat with our support team",
      icon: MessageCircle,
      count: "Available 24/7",
      color: "emerald"
    },
    {
      title: "Email Support",
      description: "Get help via email",
      icon: Mail,
      count: "Response in 2hrs",
      color: "purple"
    }
  ];

  const faqs = [
    {
      question: "How do I add team members to my account?",
      answer: "Navigate to Team Management, click 'Add Team Member', and enter their details. They'll receive an invitation email."
    },
    {
      question: "What threat intelligence feeds are available?",
      answer: "We integrate with OSINT feeds, government advisories, weather alerts, crime statistics, and custom feeds. Enterprise plans get unlimited feeds."
    },
    {
      question: "Can I export my data?",
      answer: "Yes, you can export incidents, reports, and analytics in CSV, PDF, or JSON formats from the respective pages."
    },
    {
      question: "How does the AI Query system work?",
      answer: "Our AI Query system uses advanced language models with real-time internet context to answer security-related questions and provide threat intelligence."
    },
    {
      question: "Is my data encrypted?",
      answer: "Yes, all data is encrypted in transit (TLS 1.3) and at rest (AES-256). We also offer end-to-end encryption for communications."
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
            <HelpCircle className="w-10 h-10 text-[#DC2626]" />
            Help Center
          </h1>
          <p className="text-gray-400 text-lg mb-8">
            Find answers, learn best practices, and get support
          </p>

          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 bg-[#1a1a1a] border-[#2a2a2a] text-white text-lg"
            />
          </div>
        </div>

        {/* Resources */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          {resources.map((resource) => (
            <Card key={resource.title} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <CardContent className="p-6">
                <resource.icon className={`w-8 h-8 text-${resource.color}-400 mb-3`} />
                <h3 className="font-bold text-white mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{resource.description}</p>
                <Badge variant="outline" className="text-xs">{resource.count}</Badge>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Categories */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Browse by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <category.icon className="w-6 h-6 text-[#DC2626]" />
                    <h3 className="font-bold text-white">{category.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {category.articles.slice(0, 3).map((article, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-400 hover:text-white transition-colors">
                          {article.title}
                        </span>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-3">
                    {category.articles.length} articles
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Articles */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Popular Articles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {categories.flatMap(c => c.articles)
                .sort((a, b) => b.views - a.views)
                .slice(0, 10)
                .map((article, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#DC2626]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-[#DC2626] font-bold text-sm">{idx + 1}</span>
                      </div>
                      <span className="text-white">{article.title}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {article.views} views
                    </Badge>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQs */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg">
                <h3 className="font-bold text-white mb-2 flex items-start gap-2">
                  <HelpCircle className="w-5 h-5 text-[#DC2626] flex-shrink-0 mt-0.5" />
                  {faq.question}
                </h3>
                <p className="text-gray-400 ml-7">{faq.answer}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/20 to-[#0f0f0f]">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
            <p className="text-gray-400 mb-6">
              Our support team is available 24/7 to assist you
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
                <MessageCircle className="w-4 h-4 mr-2" />
                Start Live Chat
              </Button>
              <Button variant="outline" className="border-[#2a2a2a] text-white">
                <Mail className="w-4 h-4 mr-2" />
                Email Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}