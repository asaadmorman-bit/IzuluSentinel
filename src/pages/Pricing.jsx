import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Target, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Pricing() {
  const handleRequestPilot = async () => {
    const isAuthenticated = await base44.auth.isAuthenticated();
    if (isAuthenticated) {
      window.location.href = "/Contact";
    } else {
      base44.auth.redirectToLogin("/Contact");
    }
  };

  const tiers = [
    {
      name: "Sentinel Core",
      subtitle: "Small security teams / early pilots",
      price: "$3,000",
      period: "/month",
      features: [
        "Real-time threat monitoring",
        "AI correlation engine",
        "Threat dashboard",
        "Email alerts",
        "Up to 10 critical services",
        "Standard support"
      ],
      cta: "Start Pilot",
      icon: Shield,
      color: "blue"
    },
    {
      name: "Sentinel Enterprise",
      subtitle: "SOCs and critical services",
      price: "$15,000",
      period: "/month",
      features: [
        "Everything in Core",
        "Advanced correlation logic",
        "AI threat explanations",
        "Custom alert routing",
        "RBAC & audit logs",
        "Unlimited services",
        "SLA support",
        "24/7 monitoring"
      ],
      cta: "Request Demo",
      icon: Target,
      color: "red",
      popular: true
    },
    {
      name: "Sentinel Defense",
      subtitle: "Executive protection & high-risk enterprises",
      price: "Custom",
      period: "pricing",
      features: [
        "Everything in Enterprise",
        "Autonomous response actions",
        "Executive protection workflows",
        "Custom AI models",
        "Dedicated support engineer",
        "Threat intelligence customization",
        "On-premise deployment option",
        "White-glove onboarding"
      ],
      cta: "Contact Sales",
      icon: Zap,
      color: "purple"
    }
  ];

  const addOns = [
    { name: "Additional Data Feeds", price: "$1,500/month" },
    { name: "On-Premise Deployment", price: "$25,000 setup + $5,000/month" },
    { name: "Custom Integrations", price: "Custom pricing" },
    { name: "24/7 Managed Monitoring", price: "$10,000/month" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge className="bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50 px-4 py-2 mb-6">
            Enterprise Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Pricing Built for Enterprise Scale
          </h1>
          <p className="text-xl text-gray-400">
            From pilot programs to global deployments
          </p>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {tiers.map((tier, idx) => {
              const Icon = tier.icon;
              return (
                <Card 
                  key={idx} 
                  className={`border-[#1a1a1a] bg-[#0f0f0f] hover:shadow-2xl transition-all ${
                    tier.popular ? 'ring-2 ring-[#DC2626] transform scale-105' : ''
                  }`}
                >
                  {tier.popular && (
                    <div className="bg-[#DC2626] text-white text-center py-2 text-sm font-semibold">
                      RECOMMENDED
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 bg-${tier.color}-500/20 rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className={`w-8 h-8 text-${tier.color}-400`} />
                    </div>
                    <CardTitle className="text-2xl text-white mb-2">{tier.name}</CardTitle>
                    <p className="text-sm text-gray-500 mb-4">{tier.subtitle}</p>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-white">{tier.price}</span>
                      <span className="text-gray-400 ml-2">{tier.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-3">
                      {tier.features.map((feature, fIdx) => (
                        <div key={fIdx} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-300 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className={`w-full py-6 text-lg ${
                        tier.popular 
                          ? 'bg-[#DC2626] hover:bg-[#B91C1C] text-white' 
                          : 'bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white'
                      }`}
                      onClick={handleRequestPilot}
                    >
                      {tier.cta}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Add-Ons */}
      <section className="pb-20 px-4 bg-[#050505]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">Add-On Capabilities</h2>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-8">
              <div className="space-y-4">
                {addOns.map((addon, idx) => (
                  <div key={idx} className="flex items-center justify-between py-3 border-b border-[#1a1a1a] last:border-0">
                    <span className="text-white">{addon.name}</span>
                    <span className="text-gray-400 font-mono text-sm">{addon.price}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Positioning Statement */}
      <section className="py-20 px-4 bg-gradient-to-br from-[#DC2626]/20 to-purple-500/20">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            iZulu Sentinel is not another alerting tool.
          </h2>
          <p className="text-2xl text-gray-300 mb-8">
            It is a <span className="text-[#DC2626] font-semibold">decision engine</span> for enterprise defense.
          </p>
          <Button
            onClick={handleRequestPilot}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8 py-6 text-lg"
          >
            Request a Pilot
          </Button>
        </div>
      </section>
    </div>
  );
}