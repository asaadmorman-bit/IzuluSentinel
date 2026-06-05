import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie } from "lucide-react";

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Cookie className="w-8 h-8 text-[#DC2626]" />
            Cookie Policy
          </h1>
          <p className="text-gray-400">Last updated: January 2024</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6 md:p-8 space-y-6 text-gray-300">
            <section>
              <h2 className="text-xl font-bold text-white mb-3">1. What Are Cookies</h2>
              <p>
                Cookies are small text files stored on your device when you visit izulusentinel.com. 
                They help us provide you with a better experience by remembering your preferences 
                and security settings.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">2. How We Use Cookies</h2>
              <p className="mb-3">We use cookies for:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Authentication and security</li>
                <li>Remembering your preferences and settings</li>
                <li>Analyzing platform usage and performance</li>
                <li>Preventing fraud and enhancing security</li>
                <li>Providing personalized threat intelligence</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">3. Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Essential Cookies</h3>
                  <p className="text-sm">Required for platform functionality and security. Cannot be disabled.</p>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Performance Cookies</h3>
                  <p className="text-sm">Help us understand how you use the platform to improve performance.</p>
                </div>
                <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">Functional Cookies</h3>
                  <p className="text-sm">Remember your preferences and settings for a personalized experience.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">4. Managing Cookies</h2>
              <p>
                You can control cookies through your browser settings. However, disabling certain 
                cookies may limit platform functionality. For security reasons, some cookies are 
                essential and cannot be disabled.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-white mb-3">5. Contact Us</h2>
              <p className="mb-3">Questions about our cookie policy? Contact us at:</p>
              <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <p className="font-medium text-white">Izulu Sentinel</p>
                <p className="text-sm">Email: privacy@izulusentinel.com</p>
                <p className="text-sm">Website: izulusentinel.com</p>
              </div>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}