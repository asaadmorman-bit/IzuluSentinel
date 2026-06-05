import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Scale, Shield, Crown, Building2, Radio } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ComparisonTools() {
  const plans = {
    security_team: {
      name: "Security Team",
      price: "$499/mo",
      tagline: "Small teams & private protection",
      color: "cyan",
      icon: Shield
    },
    executive_protection: {
      name: "Executive Protection",
      price: "$1,499/mo",
      tagline: "Corporate & VIP security",
      color: "red",
      icon: Crown
    },
    venue_security: {
      name: "Venue & Stadium",
      price: "$4,999/mo",
      tagline: "Large venues & arenas",
      color: "purple",
      icon: Building2
    },
    enterprise: {
      name: "Enterprise",
      price: "Custom",
      tagline: "Law enforcement & government",
      color: "emerald",
      icon: Radio
    }
  };

  const features = [
    {
      category: "Core Operations",
      items: [
        { name: "Security Personnel", security_team: "Up to 15", executive_protection: "Up to 50", venue_security: "Unlimited", enterprise: "Unlimited" },
        { name: "Protected Assets/Principals", security_team: "5", executive_protection: "25", venue_security: "100+", enterprise: "Unlimited" },
        { name: "Weapons Detection Checkpoints", security_team: false, executive_protection: "2 included", venue_security: "10 included", enterprise: "Unlimited" },
        { name: "Real-time Threat Map", security_team: true, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Mobile Operations App", security_team: true, executive_protection: true, venue_security: true, enterprise: true },
        { name: "24/7 Support", security_team: "Standard", executive_protection: "Priority", venue_security: "Dedicated", enterprise: "White Glove" }
      ]
    },
    {
      category: "Weapons Detection & Security",
      items: [
        { name: "Evolv Technology Integration", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Multi-System Detection", security_team: false, executive_protection: false, venue_security: true, enterprise: true },
        { name: "Crowd Monitoring", security_team: false, executive_protection: false, venue_security: true, enterprise: true },
        { name: "Checkpoint Analytics", security_team: false, executive_protection: "Basic", venue_security: "Advanced", enterprise: "AI-Powered" },
        { name: "Law Enforcement Coordination", security_team: false, executive_protection: false, venue_security: true, enterprise: true }
      ]
    },
    {
      category: "Intelligence & AI",
      items: [
        { name: "AI Threat Prediction", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "SOCMINT Monitoring", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Predictive Analytics", security_team: false, executive_protection: "Basic", venue_security: "Advanced", enterprise: "Custom Models" },
        { name: "Threat Intelligence Feeds", security_team: "1 feed", executive_protection: "5 feeds", venue_security: "15 feeds", enterprise: "Unlimited" },
        { name: "MITRE ATT&CK Integration", security_team: false, executive_protection: true, venue_security: true, enterprise: true }
      ]
    },
    {
      category: "Operational Capabilities",
      items: [
        { name: "Route Planning & Optimization", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Drone Fleet Integration", security_team: false, executive_protection: "5 units", venue_security: "15 units", enterprise: "Unlimited" },
        { name: "Camera Systems Integration", security_team: "Basic", executive_protection: true, venue_security: true, enterprise: true },
        { name: "Command Center Deployment", security_team: false, executive_protection: false, venue_security: true, enterprise: true },
        { name: "Multi-Venue Management", security_team: false, executive_protection: false, venue_security: true, enterprise: true }
      ]
    },
    {
      category: "Communications & Collaboration",
      items: [
        { name: "Secure Communications", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Live Team Collaboration", security_team: true, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Emergency Protocols", security_team: "Basic", executive_protection: true, venue_security: true, enterprise: "Custom" },
        { name: "Panic Button / SOS", security_team: true, executive_protection: true, venue_security: true, enterprise: true }
      ]
    },
    {
      category: "Compliance & Security",
      items: [
        { name: "Two-Factor Authentication", security_team: true, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Zero Trust Architecture", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "Audit Trail", security_team: "Basic", executive_protection: true, venue_security: true, enterprise: "Advanced" },
        { name: "Compliance Reports", security_team: false, executive_protection: true, venue_security: true, enterprise: true },
        { name: "SOC 2 Compliance", security_team: false, executive_protection: false, venue_security: true, enterprise: true },
        { name: "On-Premise Deployment", security_team: false, executive_protection: false, venue_security: false, enterprise: true }
      ]
    },
    {
      category: "Customization & Enterprise",
      items: [
        { name: "White-Label Options", security_team: false, executive_protection: false, venue_security: false, enterprise: true },
        { name: "Custom Integrations", security_team: false, executive_protection: false, venue_security: "Limited", enterprise: true },
        { name: "API Access", security_team: false, executive_protection: "Limited", venue_security: true, enterprise: "Full" },
        { name: "Dedicated Account Manager", security_team: false, executive_protection: false, venue_security: true, enterprise: true },
        { name: "On-Site Training", security_team: false, executive_protection: "Optional", venue_security: true, enterprise: "Included" },
        { name: "Custom Development", security_team: false, executive_protection: false, venue_security: false, enterprise: true }
      ]
    },
    {
      category: "Storage & Limits",
      items: [
        { name: "Data Storage", security_team: "50 GB", executive_protection: "500 GB", venue_security: "5 TB", enterprise: "Unlimited" },
        { name: "Video Retention", security_team: "30 days", executive_protection: "90 days", venue_security: "1 year", enterprise: "Custom" },
        { name: "Historical Analytics", security_team: "6 months", executive_protection: "2 years", venue_security: "5 years", enterprise: "Unlimited" }
      ]
    }
  ];

  const renderValue = (value) => {
    if (typeof value === "boolean") {
      return value ? (
        <Check className="w-5 h-5 text-emerald-400 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-gray-600 mx-auto" />
      );
    }
    return <span className="text-white text-sm">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Scale className="w-8 h-8 text-[#DC2626]" />
            Security Plans Comparison
          </h1>
          <p className="text-gray-400">Compare features across all protection intelligence tiers</p>
        </div>

        {/* Plan Headers */}
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-1"></div>
          {Object.entries(plans).map(([key, plan]) => {
            const PlanIcon = plan.icon;
            return (
              <Card key={key} className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-[#DC2626]/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <PlanIcon className="w-6 h-6 text-[#DC2626]" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 text-xs mb-3">{plan.tagline}</p>
                  <div className="text-2xl font-bold text-white mb-4">{plan.price}</div>
                  <Badge className={`bg-${plan.color}-500/20 text-${plan.color}-400`}>
                    {key === "executive_protection" ? "Most Popular" : 
                     key === "enterprise" ? "Premium" : 
                     key === "venue_security" ? "Best Value" : "Starter"}
                  </Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Comparison */}
        {features.map((category) => (
          <Card key={category.category} className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">{category.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {category.items.map((feature, idx) => (
                  <div key={idx} className="grid grid-cols-5 gap-4 items-center py-3 border-b border-[#1a1a1a] last:border-0">
                    <div className="col-span-1">
                      <span className="text-gray-300 text-sm">{feature.name}</span>
                    </div>
                    <div className="text-center">
                      {renderValue(feature.security_team)}
                    </div>
                    <div className="text-center">
                      {renderValue(feature.executive_protection)}
                    </div>
                    <div className="text-center">
                      {renderValue(feature.venue_security)}
                    </div>
                    <div className="text-center">
                      {renderValue(feature.enterprise)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* CTA */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/20 to-[#0f0f0f]">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Ready to secure your operations?</h2>
            <p className="text-gray-400 mb-6">
              All plans include 30-day money-back guarantee and no setup fees
            </p>
            <div className="flex justify-center gap-4">
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] px-8 py-6 text-lg">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-[#2a2a2a] text-white px-8 py-6 text-lg">
                Contact Sales
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}