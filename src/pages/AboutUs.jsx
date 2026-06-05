import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Target, Award, Heart, TrendingUp, Building, Zap } from "lucide-react";

export default function AboutUs() {
  const values = [
    {
      icon: Shield,
      title: "Veteran-Owned",
      description: "Founded and operated by veterans committed to service and protection",
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Users,
      title: "Family-Led Enterprise",
      description: "Built on family values and generational legacy",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Building,
      title: "Multi-Industry Portfolio",
      description: "Unified ecosystem across security, training, legal, and property services",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Heart,
      title: "Community-Centered",
      description: "Committed to protecting and empowering local communities",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    }
  ];

  const divisions = [
    {
      name: "Cyber Dojo Solutions",
      icon: Zap,
      category: "Cyber Division",
      description: "Advanced cybersecurity consulting, threat intelligence, and digital defense solutions protecting organizations from modern cyber threats.",
      color: "text-red-400"
    },
    {
      name: "Heritage Shield Defense Academy",
      icon: Shield,
      category: "Defense & Training Division",
      description: "Firearms training, defensive tactics, executive protection, and lifesaver programs preparing individuals and protectors to stand ready.",
      color: "text-amber-400"
    },
    {
      name: "Seals on Wheels",
      icon: Award,
      category: "Legal Division",
      description: "Mobile notary and legal document services bringing professional support directly to clients on their schedule.",
      color: "text-purple-400"
    },
    {
      name: "Mow Dojo",
      icon: TrendingUp,
      category: "Landscaping Division",
      description: "Professional landscaping and property maintenance services with precision, pride, and care for residential and commercial clients.",
      color: "text-emerald-400"
    }
  ];

  const stats = [
    { label: "Clients Protected", value: "500+", icon: Users },
    { label: "Client Satisfaction", value: "98%", icon: Award },
    { label: "Threats Prevented", value: "$2.5M+", icon: Shield },
    { label: "Training Sessions", value: "1,200+", icon: Target }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <Badge className="bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50 px-4 py-2 text-xs sm:text-sm">
            About Emerging Defense Solutions
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white">
            Strategic Headquarters for<br />
            Mission-Driven Companies
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            A unified S-Corporation bringing multiple businesses under one cohesive, disciplined, and future-focused structure
          </p>
        </div>

        {/* Mission & Vision */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-4 sm:p-6 md:p-8">
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  To protect, empower, and elevate communities by building a universe of innovative, purpose-driven companies that deliver security, service, leadership, and generational opportunity.
                </p>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                  To become the leading multi-industry enterprise ecosystem that transforms communities through technology, safety, service, and sustainable business growth.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Core Values */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Our Core Values</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {values.map((value, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                <CardContent className="p-4 sm:p-6">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 ${value.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <value.icon className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 ${value.color}`} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-white mb-2">{value.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Our Divisions */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Our Divisions</h2>
          <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
            {divisions.map((division, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <division.icon className={`w-8 h-8 sm:w-10 sm:h-10 ${division.color}`} />
                    <Badge variant="outline" className="text-xs">{division.category}</Badge>
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-white">{division.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xs sm:text-sm text-gray-400">{division.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">Our Impact</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {stats.map((stat, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardContent className="p-4 sm:p-6 text-center">
                  <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 text-[#DC2626] mx-auto mb-3" />
                  <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-gray-400">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Leadership */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-2xl sm:text-3xl text-white">Leadership Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-white">Asaad Morman</h3>
                <p className="text-[#DC2626] font-semibold text-sm sm:text-base">Co-Founder & CEO</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Acting CIO & CISO | Heritage Shield Defense Academy Lead
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg sm:text-xl font-bold text-white">Shauntze Morman</h3>
                <p className="text-[#DC2626] font-semibold text-sm sm:text-base">Co-Founder & CSO</p>
                <p className="text-xs sm:text-sm text-gray-400">
                  Chief Strategy Officer | Heritage Shield Lifesaver & 911 Consulting Lead
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-6 border-t border-[#1a1a1a]">
          <p className="text-gray-500 text-xs sm:text-sm">
            Owned, built and maintained by Emerging Defense Solutions
          </p>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">© 2026 All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}