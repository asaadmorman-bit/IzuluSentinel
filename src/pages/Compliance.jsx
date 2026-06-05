import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle, FileText, Download, Shield } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export default function Compliance() {
  const frameworks = [
    {
      name: "ISO 27001",
      status: "compliant",
      score: 94,
      lastAudit: "2024-01-15",
      nextAudit: "2024-07-15"
    },
    {
      name: "GDPR",
      status: "compliant",
      score: 98,
      lastAudit: "2023-12-20",
      nextAudit: "2024-06-20"
    },
    {
      name: "SOC 2 Type II",
      status: "in_progress",
      score: 87,
      lastAudit: "2023-11-10",
      nextAudit: "2024-05-10"
    },
    {
      name: "POPIA",
      status: "compliant",
      score: 96,
      lastAudit: "2024-01-05",
      nextAudit: "2024-07-05"
    }
  ];

  const requirements = [
    { category: "Data Protection", completed: 45, total: 48 },
    { category: "Access Control", completed: 32, total: 35 },
    { category: "Incident Response", completed: 18, total: 20 },
    { category: "Risk Management", completed: 28, total: 30 },
    { category: "Audit & Monitoring", completed: 22, total: 25 }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            Compliance Management
          </h1>
          <p className="text-gray-400">Track regulatory compliance and security standards</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Frameworks</p>
                  <p className="text-3xl font-bold text-white">{frameworks.length}</p>
                </div>
                <FileText className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Compliant</p>
                  <p className="text-3xl font-bold text-white">
                    {frameworks.filter(f => f.status === "compliant").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">In Progress</p>
                  <p className="text-3xl font-bold text-white">
                    {frameworks.filter(f => f.status === "in_progress").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Score</p>
                  <p className="text-3xl font-bold text-white">94%</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">HIGH</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Compliance Frameworks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {frameworks.map((framework, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-white mb-1">{framework.name}</h3>
                      <p className="text-2xl font-bold text-[#DC2626]">{framework.score}%</p>
                    </div>
                    <Badge
                      className={
                        framework.status === "compliant"
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                          : "bg-amber-500/20 text-amber-400 border-amber-500/50"
                      }
                    >
                      {framework.status === "compliant" ? "Compliant" : "In Progress"}
                    </Badge>
                  </div>
                  <div className="mb-3">
                    <Progress value={framework.score} className="h-2" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Last Audit: {framework.lastAudit}</span>
                    <span>Next: {framework.nextAudit}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-3 border-[#2a2a2a] text-white bg-[#0a0a0a] hover:bg-[#1a1a1a]"
                  >
                    <Download className="w-3 h-3 mr-2" />
                    Download Report
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Compliance Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {requirements.map((req, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-white">{req.category}</h3>
                  <span className="text-sm text-gray-400">
                    {req.completed}/{req.total} completed
                  </span>
                </div>
                <Progress value={(req.completed / req.total) * 100} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}