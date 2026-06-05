import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Shield, Zap, Crown, Building2, Radio } from "lucide-react";

export default function Subscription() {
  const [billingCycle, setBillingCycle] = useState("monthly");

  const plans = [
    {
      id: "security_team",
      name: "Security Team",
      icon: Shield,
      price: { monthly: 499, annually: 4990 },
      description: "For small security teams and private protection",
      features: [
        "Up to 15 security personnel",
        "5 protected assets/principals",
        "Real-time threat intelligence",
        "Global threat map",
        "Mobile operations app",
        "Email & SMS alerts",
        "Basic analytics & reports",
        "Standard support (24/7)"
      ],
      limits: {
        users: 15,
        assets: 5,
        checkpoints: 2,
        storage: "50 GB"
      },
      popular: false
    },
    {
      id: "executive_protection",
      name: "Executive Protection",
      icon: Crown,
      price: { monthly: 1499, annually: 14990 },
      description: "For corporate security and VIP protection",
      features: [
        "Up to 50 security personnel",
        "25 protected assets/principals",
        "All Security Team features",
        "AI threat prediction",
        "Route planning & optimization",
        "Drone fleet integration (5 units)",
        "SOCMINT monitoring",
        "Advanced analytics",
        "Weapons detection (2 checkpoints)",
        "Secure communications",
        "Priority support (24/7)",
        "Quarterly security briefings"
      ],
      limits: {
        users: 50,
        assets: 25,
        checkpoints: 2,
        storage: "500 GB"
      },
      popular: true
    },
    {
      id: "venue_security",
      name: "Venue & Stadium",
      icon: Building2,
      price: { monthly: 4999, annually: 49990 },
      description: "For stadiums, arenas, and large venues",
      features: [
        "Unlimited security personnel",
        "100+ protected assets",
        "All Executive Protection features",
        "Weapons detection (10 checkpoints)",
        "Evolv Technology integration",
        "Crowd monitoring & analytics",
        "Multi-venue management",
        "Law enforcement coordination",
        "Custom integrations",
        "Dedicated account manager",
        "On-site training",
        "99.9% SLA guarantee"
      ],
      limits: {
        users: "Unlimited",
        assets: "100+",
        checkpoints: 10,
        storage: "5 TB"
      },
      popular: false
    },
    {
      id: "enterprise",
      name: "Enterprise & Government",
      icon: Radio,
      price: { monthly: "Custom", annually: "Custom" },
      description: "For law enforcement, military, and large enterprises",
      features: [
        "Everything in Venue & Stadium",
        "Unlimited checkpoints",
        "Multi-system weapons detection",
        "Federal/State integration",
        "Command center deployment",
        "White-label options",
        "Custom threat feeds",
        "Outpost Zero integration",
        "Dedicated infrastructure",
        "24/7 dedicated support team",
        "Custom development",
        "Compliance certifications",
        "On-premise deployment option"
      ],
      limits: {
        users: "Unlimited",
        assets: "Unlimited",
        checkpoints: "Unlimited",
        storage: "Unlimited"
      },
      popular: false
    }
  ];

  const addOns = [
    {
      name: "Additional Weapons Detection Checkpoint",
      price: 299,
      unit: "per checkpoint/month"
    },
    {
      name: "Evolv Express Integration",
      price: 499,
      unit: "per system/month"
    },
    {
      name: "Drone Unit Integration",
      price: 199,
      unit: "per drone/month"
    },
    {
      name: "Additional Storage",
      price: 99,
      unit: "per 100 GB/month"
    },
    {
      name: "Advanced Threat Intelligence Feeds",
      price: 799,
      unit: "per month"
    },
    {
      name: "On-site Security Training",
      price: 2999,
      unit: "per day"
    }
  ];

  const getPrice = (plan) => {
    if (plan.price.monthly === "Custom") return "Custom Pricing";
    const price = billingCycle === "monthly" ? plan.price.monthly : plan.price.annually;
    return billingCycle === "monthly" ? `$${price.toLocaleString()}/mo` : `$${price.toLocaleString()}/yr`;
  };

  const getSavings = (plan) => {
    if (plan.price.monthly === "Custom") return "";
    const monthlyCost = plan.price.monthly * 12;
    const savings = monthlyCost - plan.price.annually;
    return `Save $${savings.toLocaleString()}/yr`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Enterprise Security Pricing
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            Comprehensive protection intelligence for security professionals
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 p-2 bg-[#1a1a1a] rounded-lg">
            <Button
              variant={billingCycle === "monthly" ? "default" : "ghost"}
              onClick={() => setBillingCycle("monthly")}
              className={billingCycle === "monthly" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "text-gray-400"}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === "annually" ? "default" : "ghost"}
              onClick={() => setBillingCycle("annually")}
              className={billingCycle === "annually" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "text-gray-400"}
            >
              Annual
              <Badge className="ml-2 bg-emerald-500/20 text-emerald-400">Save 17%</Badge>
            </Button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const PlanIcon = plan.icon;
            return (
              <Card
                key={plan.id}
                className={`border-[#1a1a1a] bg-[#0f0f0f] relative ${
                  plan.popular ? "border-[#DC2626] border-2" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#DC2626] text-white px-4 py-1">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-[#DC2626]/20 rounded-lg flex items-center justify-center">
                      <PlanIcon className="w-6 h-6 text-[#DC2626]" />
                    </div>
                    <div>
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mb-4">{plan.description}</p>
                  <div className="mb-4">
                    <div className="text-4xl font-bold text-white mb-1">
                      {getPrice(plan)}
                    </div>
                    {billingCycle === "annually" && plan.price.monthly !== "Custom" && (
                      <p className="text-sm text-emerald-400">{getSavings(plan)}</p>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 mb-6 p-3 bg-[#1a1a1a] rounded-lg">
                    <p className="text-xs text-gray-500 font-semibold">Plan Limits:</p>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-gray-500">Users:</span>
                        <span className="text-white ml-1">{plan.limits.users}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Assets:</span>
                        <span className="text-white ml-1">{plan.limits.assets}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Checkpoints:</span>
                        <span className="text-white ml-1">{plan.limits.checkpoints}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Storage:</span>
                        <span className="text-white ml-1">{plan.limits.storage}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    className={`w-full ${
                      plan.popular
                        ? "bg-[#DC2626] hover:bg-[#B91C1C]"
                        : "bg-[#1a1a1a] hover:bg-[#2a2a2a] border border-[#2a2a2a]"
                    }`}
                  >
                    {plan.price.monthly === "Custom" ? "Contact Sales" : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Add-ons */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Additional Services & Add-ons</CardTitle>
            <p className="text-gray-400 text-sm">Enhance your security operations with premium add-ons</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {addOns.map((addon, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="font-semibold text-white mb-2">{addon.name}</h3>
                  <p className="text-2xl font-bold text-[#DC2626] mb-1">${addon.price}</p>
                  <p className="text-xs text-gray-500">{addon.unit}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Volume Discounts */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Multi-Venue Discounts</h3>
                <p className="text-gray-400">
                  Operate multiple stadiums, facilities, or jurisdictions? Contact us for volume pricing.
                </p>
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    5-10 venues: 10% discount
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    10-25 venues: 15% discount
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    25+ venues: Custom enterprise pricing
                  </li>
                </ul>
              </div>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] whitespace-nowrap">
                <Zap className="w-4 h-4 mr-2" />
                Contact Sales Team
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Trust Badges */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-4 gap-6 text-center">
              <div>
                <Shield className="w-12 h-12 text-[#DC2626] mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">SOC 2 Certified</h4>
                <p className="text-xs text-gray-400">Enterprise security standards</p>
              </div>
              <div>
                <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">99.9% Uptime</h4>
                <p className="text-xs text-gray-400">SLA guarantee</p>
              </div>
              <div>
                <Building2 className="w-12 h-12 text-cyan-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">500+ Venues</h4>
                <p className="text-xs text-gray-400">Trusted worldwide</p>
              </div>
              <div>
                <Radio className="w-12 h-12 text-purple-400 mx-auto mb-3" />
                <h4 className="font-semibold text-white mb-1">Evolv Certified</h4>
                <p className="text-xs text-gray-400">Official integration partner</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* FAQ */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-gray-400 text-sm">
                Yes! We offer a 30-day free trial for Security Team and Executive Protection plans. 
                Contact sales for Venue & Enterprise trials with full feature access.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">How does weapons detection pricing work?</h4>
              <p className="text-gray-400 text-sm">
                Each plan includes a set number of checkpoint integrations. Additional checkpoints can be added 
                at $299/month per checkpoint. Evolv system integrations are $499/month per unit.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Can I upgrade or downgrade my plan?</h4>
              <p className="text-gray-400 text-sm">
                Yes, you can change plans at any time. Upgrades take effect immediately, and downgrades 
                take effect at the end of your current billing cycle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Do you offer government/law enforcement pricing?</h4>
              <p className="text-gray-400 text-sm">
                Yes, we offer special pricing for federal, state, and local law enforcement agencies. 
                Contact our government sales team for a custom quote.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}