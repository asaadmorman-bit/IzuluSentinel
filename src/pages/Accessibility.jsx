import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Type, Contrast, Keyboard, MousePointer } from "lucide-react";

export default function Accessibility() {
  const features = [
    {
      icon: Eye,
      title: "Screen Reader Support",
      description: "Full ARIA labels and semantic HTML for screen readers",
      status: "Implemented"
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Complete keyboard accessibility throughout the application",
      status: "Implemented"
    },
    {
      icon: Contrast,
      title: "High Contrast Mode",
      description: "Enhanced contrast ratios meeting WCAG AAA standards",
      status: "Implemented"
    },
    {
      icon: Type,
      title: "Adjustable Text Size",
      description: "Scalable text without loss of functionality",
      status: "Implemented"
    },
    {
      icon: MousePointer,
      title: "Focus Indicators",
      description: "Clear visual focus indicators for all interactive elements",
      status: "Implemented"
    }
  ];

  const standards = [
    {
      name: "WCAG 2.1 Level AA",
      status: "Compliant",
      description: "Web Content Accessibility Guidelines compliance"
    },
    {
      name: "Section 508",
      status: "Compliant",
      description: "US federal accessibility standards"
    },
    {
      name: "EN 301 549",
      status: "Compliant",
      description: "European accessibility standard"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Eye className="w-8 h-8 text-[#DC2626]" />
            Accessibility Statement
          </h1>
          <p className="text-gray-400">Our commitment to inclusive design and accessibility</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Our Commitment</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Izulu Sentinel is committed to ensuring digital accessibility for people with disabilities. 
              We are continually improving the user experience for everyone and applying the relevant 
              accessibility standards.
            </p>
            <p>
              Our platform is designed to be accessible to the widest possible audience, regardless of 
              technology or ability. We aim to comply with WCAG 2.1 Level AA standards and other 
              international accessibility guidelines.
            </p>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Accessibility Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#DC2626]/20 rounded-lg">
                    <feature.icon className="w-6 h-6 text-[#DC2626]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-white">{feature.title}</h3>
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        {feature.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Compliance Standards</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {standards.map((standard, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white mb-1">{standard.name}</h3>
                  <p className="text-sm text-gray-400">{standard.description}</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  {standard.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Feedback and Support</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              We welcome your feedback on the accessibility of Izulu Sentinel. Please let us know if you 
              encounter accessibility barriers:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full mt-2 flex-shrink-0"></span>
                <span>Email: accessibility@izulusentinel.com</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full mt-2 flex-shrink-0"></span>
                <span>We aim to respond to accessibility feedback within 3 business days</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}