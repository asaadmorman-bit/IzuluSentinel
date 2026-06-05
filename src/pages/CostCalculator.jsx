import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, Users, MapPin, Shield, Check, Radio, Crosshair } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function CostCalculator() {
  const [securityPersonnel, setSecurityPersonnel] = useState(25);
  const [protectedAssets, setProtectedAssets] = useState(10);
  const [weaponsCheckpoints, setWeaponsCheckpoints] = useState(3);
  const [droneUnits, setDroneUnits] = useState(2);
  const [billingCycle, setBillingCycle] = useState("monthly");

  const pricing = {
    basePackage: 1499, // Executive Protection base
    additionalPersonnel: 29, // per person over 50
    protectedAsset: 49, // per asset
    weaponsCheckpoint: 299, // per checkpoint
    droneUnit: 199, // per drone
    evolvIntegration: 499 // per Evolv system
  };

  const calculateCost = () => {
    let monthlyCost = pricing.basePackage;
    
    // Additional personnel (over 50)
    if (securityPersonnel > 50) {
      monthlyCost += (securityPersonnel - 50) * pricing.additionalPersonnel;
    }
    
    // Protected assets (over 25 included)
    if (protectedAssets > 25) {
      monthlyCost += (protectedAssets - 25) * pricing.protectedAsset;
    }
    
    // Weapons detection checkpoints (2 included)
    if (weaponsCheckpoints > 2) {
      monthlyCost += (weaponsCheckpoints - 2) * pricing.weaponsCheckpoint;
    }
    
    // Drone units (5 included)
    if (droneUnits > 5) {
      monthlyCost += (droneUnits - 5) * pricing.droneUnit;
    }
    
    // Add Evolv integration per checkpoint
    monthlyCost += weaponsCheckpoints * pricing.evolvIntegration;
    
    return billingCycle === "annually" 
      ? Math.round(monthlyCost * 12 * 0.83) // 17% annual discount
      : monthlyCost;
  };

  const totalCost = calculateCost();
  const monthlyCost = billingCycle === "annually" ? Math.round(totalCost / 12) : totalCost;

  const features = {
    included: [
      "Real-time Threat Intelligence",
      "Global Threat Map",
      "AI Threat Prediction",
      "Route Planning & Optimization",
      "SOCMINT Monitoring",
      "Secure Communications",
      "Advanced Analytics",
      "Mobile Operations App",
      "Priority Support 24/7"
    ],
    enterprise: [
      "Unlimited Security Personnel",
      "Unlimited Protected Assets",
      "Unlimited Checkpoints",
      "Multi-Venue Management",
      "White-Label Options",
      "Dedicated Account Manager",
      "Custom Integrations",
      "On-Site Training",
      "99.9% SLA Guarantee"
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Calculator className="w-8 h-8 text-[#DC2626]" />
            Security Operations Cost Calculator
          </h1>
          <p className="text-gray-400">Estimate your monthly investment for comprehensive protection</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calculator */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Configure Your Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Billing Cycle */}
                <div>
                  <Label className="text-white mb-3 block">Billing Cycle</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={billingCycle === "monthly" ? "default" : "outline"}
                      onClick={() => setBillingCycle("monthly")}
                      className={billingCycle === "monthly" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "border-[#2a2a2a] text-white"}
                    >
                      Monthly
                    </Button>
                    <Button
                      variant={billingCycle === "annually" ? "default" : "outline"}
                      onClick={() => setBillingCycle("annually")}
                      className={billingCycle === "annually" ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "border-[#2a2a2a] text-white"}
                    >
                      Annually
                      <Badge className="ml-2 bg-emerald-500/20 text-emerald-400">Save 17%</Badge>
                    </Button>
                  </div>
                </div>

                {/* Security Personnel */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-white flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Security Personnel
                    </Label>
                    <span className="text-2xl font-bold text-white">{securityPersonnel}</span>
                  </div>
                  <Slider
                    value={[securityPersonnel]}
                    onValueChange={(value) => setSecurityPersonnel(value[0])}
                    min={5}
                    max={500}
                    step={5}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-400">
                    Base plan includes 50 users • ${pricing.additionalPersonnel}/additional user
                  </p>
                </div>

                {/* Protected Assets */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-white flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      Protected Assets/Principals
                    </Label>
                    <span className="text-2xl font-bold text-white">{protectedAssets}</span>
                  </div>
                  <Slider
                    value={[protectedAssets]}
                    onValueChange={(value) => setProtectedAssets(value[0])}
                    min={1}
                    max={200}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-400">
                    Base plan includes 25 assets • ${pricing.protectedAsset}/additional asset
                  </p>
                </div>

                {/* Weapons Detection */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-white flex items-center gap-2">
                      <Crosshair className="w-4 h-4" />
                      Weapons Detection Checkpoints
                    </Label>
                    <span className="text-2xl font-bold text-white">{weaponsCheckpoints}</span>
                  </div>
                  <Slider
                    value={[weaponsCheckpoints]}
                    onValueChange={(value) => setWeaponsCheckpoints(value[0])}
                    min={0}
                    max={50}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-400">
                    Base includes 2 checkpoints • ${pricing.weaponsCheckpoint}/additional + ${pricing.evolvIntegration}/Evolv system
                  </p>
                </div>

                {/* Drone Units */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <Label className="text-white flex items-center gap-2">
                      <Radio className="w-4 h-4" />
                      Drone Fleet Units
                    </Label>
                    <span className="text-2xl font-bold text-white">{droneUnits}</span>
                  </div>
                  <Slider
                    value={[droneUnits]}
                    onValueChange={(value) => setDroneUnits(value[0])}
                    min={0}
                    max={25}
                    step={1}
                    className="mb-2"
                  />
                  <p className="text-sm text-gray-400">
                    Base includes 5 drones • ${pricing.droneUnit}/additional drone
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cost Summary */}
          <div>
            <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f] sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <div className="text-5xl font-bold text-white mb-2">
                    ${monthlyCost.toLocaleString()}
                  </div>
                  <p className="text-gray-400">per month</p>
                  {billingCycle === "annually" && (
                    <p className="text-emerald-400 text-sm mt-2">
                      ${totalCost.toLocaleString()} billed annually
                    </p>
                  )}
                </div>

                <div className="space-y-2 pt-4 border-t border-[#1a1a1a]">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Base Package</span>
                    <span className="text-white">${pricing.basePackage.toLocaleString()}</span>
                  </div>
                  {securityPersonnel > 50 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Additional Personnel ({securityPersonnel - 50})</span>
                      <span className="text-white">${((securityPersonnel - 50) * pricing.additionalPersonnel).toLocaleString()}</span>
                    </div>
                  )}
                  {protectedAssets > 25 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Additional Assets ({protectedAssets - 25})</span>
                      <span className="text-white">${((protectedAssets - 25) * pricing.protectedAsset).toLocaleString()}</span>
                    </div>
                  )}
                  {weaponsCheckpoints > 2 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Extra Checkpoints ({weaponsCheckpoints - 2})</span>
                      <span className="text-white">${((weaponsCheckpoints - 2) * pricing.weaponsCheckpoint).toLocaleString()}</span>
                    </div>
                  )}
                  {weaponsCheckpoints > 0 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Evolv Integration ({weaponsCheckpoints})</span>
                      <span className="text-white">${(weaponsCheckpoints * pricing.evolvIntegration).toLocaleString()}</span>
                    </div>
                  )}
                  {droneUnits > 5 && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Additional Drones ({droneUnits - 5})</span>
                      <span className="text-white">${((droneUnits - 5) * pricing.droneUnit).toLocaleString()}</span>
                    </div>
                  )}
                </div>

                <Button className="w-full bg-[#DC2626] hover:bg-[#B91C1C] h-12">
                  Request Proposal
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  30-day money-back guarantee • No setup fees
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Included Features */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Included in Executive Protection Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {features.included.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  {feature}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Enterprise Features */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Need More? Consider Enterprise</CardTitle>
            <p className="text-gray-400 text-sm">For stadiums, multiple venues, and large-scale operations</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {features.enterprise.map((feature, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                  {feature}
                </div>
              ))}
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Contact Enterprise Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}