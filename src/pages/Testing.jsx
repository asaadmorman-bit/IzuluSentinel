import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Play, Check, X, AlertTriangle } from "lucide-react";

export default function Testing() {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const testSuites = [
    {
      name: "Authentication Tests",
      tests: 12,
      passed: 12,
      failed: 0,
      duration: "1.2s"
    },
    {
      name: "Database Operations",
      tests: 24,
      passed: 23,
      failed: 1,
      duration: "3.4s"
    },
    {
      name: "API Endpoints",
      tests: 36,
      passed: 36,
      failed: 0,
      duration: "2.1s"
    },
    {
      name: "Integration Tests",
      tests: 18,
      passed: 17,
      failed: 1,
      duration: "5.2s"
    }
  ];

  const runTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTestResults([...testSuites]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <TestTube className="w-8 h-8 text-[#DC2626]" />
              System Testing
            </h1>
            <p className="text-gray-400">Automated test suite and system diagnostics</p>
          </div>
          <Button 
            onClick={runTests}
            disabled={isRunning}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            {isRunning ? (
              <>
                <AlertTriangle className="w-4 h-4 mr-2 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run All Tests
              </>
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Tests</p>
                  <p className="text-3xl font-bold text-white">
                    {testSuites.reduce((sum, suite) => sum + suite.tests, 0)}
                  </p>
                </div>
                <TestTube className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Passed</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {testSuites.reduce((sum, suite) => sum + suite.passed, 0)}
                  </p>
                </div>
                <Check className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Failed</p>
                  <p className="text-3xl font-bold text-red-400">
                    {testSuites.reduce((sum, suite) => sum + suite.failed, 0)}
                  </p>
                </div>
                <X className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                  <p className="text-3xl font-bold text-white">97.8%</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Test Suites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testSuites.map((suite, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{suite.name}</h3>
                    <p className="text-xs text-gray-400">Duration: {suite.duration}</p>
                  </div>
                  <Badge className={
                    suite.failed === 0
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-red-500/20 text-red-400"
                  }>
                    {suite.failed === 0 ? "Passed" : "Failed"}
                  </Badge>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <span className="text-gray-400">Total: </span>
                    <span className="text-white font-medium">{suite.tests}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Passed: </span>
                    <span className="text-emerald-400 font-medium">{suite.passed}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Failed: </span>
                    <span className="text-red-400 font-medium">{suite.failed}</span>
                  </div>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-2 mt-3">
                  <div 
                    className="bg-emerald-500 h-2 rounded-full"
                    style={{ width: `${(suite.passed / suite.tests) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">System Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {[
                { component: "API Server", status: "Operational", uptime: "99.9%" },
                { component: "Database", status: "Operational", uptime: "99.8%" },
                { component: "Auth Service", status: "Operational", uptime: "100%" }
              ].map((component, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <h3 className="font-semibold text-white mb-2">{component.component}</h3>
                  <div className="flex items-center justify-between">
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {component.status}
                    </Badge>
                    <span className="text-sm text-gray-400">{component.uptime} uptime</span>
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