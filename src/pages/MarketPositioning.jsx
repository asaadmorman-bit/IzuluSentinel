import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Store, TrendingUp, Target, Users, DollarSign } from "lucide-react";

export default function MarketPositioning() {
  const competitors = [
    {
      name: "Life Raft",
      strength: "Travel security",
      weakness: "Limited AI capabilities",
      marketShare: "15%"
    },
    {
      name: "International SOS",
      strength: "Global coverage",
      weakness: "High cost",
      marketShare: "22%"
    },
    {
      name: "WorldAware",
      strength: "Risk intelligence",
      weakness: "Complex interface",
      marketShare: "12%"
    }
  ];

  const ourAdvantages = [
    {
      title: "AI-Powered Prediction",
      description: "Advanced machine learning for threat forecasting",
      icon: TrendingUp
    },
    {
      title: "Real-Time Intelligence",
      description: "Live threat feeds and instant alerts",
      icon: Target
    },
    {
      title: "Comprehensive Platform",
      description: "All-in-one solution for protection intelligence",
      icon: Store
    },
    {
      title: "User-Friendly Interface",
      description: "Intuitive design for rapid decision making",
      icon: Users
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Store className="w-8 h-8 text-[#DC2626]" />
            Market Positioning
          </h1>
          <p className="text-gray-400">Competitive analysis and market differentiation</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Market Share Target</p>
                  <p className="text-3xl font-bold text-white">18%</p>
                </div>
                <Target className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Clients</p>
                  <p className="text-3xl font-bold text-white">127</p>
                </div>
                <Users className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Growth Rate</p>
                  <p className="text-3xl font-bold text-white">+45%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Contract Value</p>
                  <p className="text-3xl font-bold text-white">$18K</p>
                </div>
                <DollarSign className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Our Competitive Advantages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {ourAdvantages.map((advantage, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-[#DC2626]/20 rounded-lg">
                      <advantage.icon className="w-6 h-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white mb-2">{advantage.title}</h3>
                      <p className="text-sm text-gray-400">{advantage.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Competitive Landscape</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {competitors.map((competitor, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-white text-lg">{competitor.name}</h3>
                  <Badge className="bg-cyan-500/20 text-cyan-400">
                    {competitor.marketShare} market share
                  </Badge>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Key Strength</p>
                    <p className="text-sm text-emerald-400">{competitor.strength}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Weakness</p>
                    <p className="text-sm text-amber-400">{competitor.weakness}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Target Market Segments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { segment: "Enterprise Security", percentage: 40, clients: 48 },
                { segment: "NGOs & Aid Organizations", percentage: 35, clients: 52 },
                { segment: "Government Agencies", percentage: 25, clients: 27 }
              ].map((segment, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-3">{segment.segment}</h3>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs text-gray-400 mb-1">
                        <span>Focus</span>
                        <span>{segment.percentage}%</span>
                      </div>
                      <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                        <div 
                          className="bg-[#DC2626] h-2 rounded-full"
                          style={{ width: `${segment.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{segment.clients} active clients</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}