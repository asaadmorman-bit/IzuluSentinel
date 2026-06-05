import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, CheckCircle, AlertTriangle, Lock, Users, Globe } from "lucide-react";

export default function ZeroTrust() {
  const accessPolicies = [
    {
      name: "Executive Access",
      resources: 12,
      users: 5,
      status: "active",
      lastUpdate: "2 hours ago"
    },
    {
      name: "Field Agents",
      resources: 8,
      users: 47,
      status: "active",
      lastUpdate: "1 day ago"
    },
    {
      name: "Analysts",
      resources: 15,
      users: 23,
      status: "active",
      lastUpdate: "3 hours ago"
    }
  ];

  const accessAttempts = [
    {
      user: "john.smith@company.com",
      resource: "Intelligence Database",
      action: "Read",
      result: "Granted",
      time: "5 minutes ago"
    },
    {
      user: "unknown@external.com",
      resource: "Admin Panel",
      action: "Write",
      result: "Denied",
      time: "12 minutes ago"
    },
    {
      user: "sarah.j@company.com",
      resource: "Threat Reports",
      action: "Read",
      result: "Granted",
      time: "1 hour ago"
    }
  ];

  const securityMetrics = [
    { label: "Active Policies", value: "47", icon: Shield },
    { label: "Protected Resources", value: "156", icon: Lock },
    { label: "Verified Users", value: "89", icon: Users },
    { label: "Network Segments", value: "12", icon: Globe }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#DC2626]" />
              Zero Trust Security
            </h1>
            <p className="text-gray-400">Never trust, always verify - comprehensive access control</p>
          </div>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            Configure Policies
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {securityMetrics.map((metric, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <metric.icon className="w-8 h-8 text-[#DC2626]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Access Policies</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {accessPolicies.map((policy, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{policy.name}</h3>
                    <p className="text-xs text-gray-400">Last updated: {policy.lastUpdate}</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {policy.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Protected Resources</p>
                    <p className="text-white font-medium">{policy.resources}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Authorized Users</p>
                    <p className="text-white font-medium">{policy.users}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Access Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {accessAttempts.map((attempt, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {attempt.result === "Granted" ? (
                      <CheckCircle className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    )}
                    <div>
                      <p className="text-sm font-medium text-white">{attempt.user}</p>
                      <p className="text-xs text-gray-400">
                        {attempt.action} access to {attempt.resource}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={
                      attempt.result === "Granted"
                        ? "bg-emerald-500/20 text-emerald-400 mb-1"
                        : "bg-red-500/20 text-red-400 mb-1"
                    }>
                      {attempt.result}
                    </Badge>
                    <p className="text-xs text-gray-500">{attempt.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Zero Trust Principles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: "Verify Explicitly",
                  description: "Always authenticate and authorize based on all available data points"
                },
                {
                  title: "Use Least Privilege",
                  description: "Limit user access with Just-In-Time and Just-Enough-Access"
                },
                {
                  title: "Assume Breach",
                  description: "Minimize blast radius and segment access. Verify end-to-end encryption"
                },
                {
                  title: "Continuous Monitoring",
                  description: "Monitor and measure security posture and behavior in real-time"
                }
              ].map((principle, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <h3 className="font-bold text-white mb-2">{principle.title}</h3>
                  <p className="text-sm text-gray-400">{principle.description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}