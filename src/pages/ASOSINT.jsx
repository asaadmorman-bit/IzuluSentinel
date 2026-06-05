import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Globe,
  GitMerge,
  Cpu,
  Shield,
  BookOpen,
  Bot,
  LayoutTemplate,
  CheckCircle,
  ExternalLink,
  Brain,
  AlertTriangle,
  Target,
  Eye,
  Zap,
  ArrowRight,
  Search,
} from "lucide-react";

const modules = [
  {
    id: "global-threat-observatory",
    title: "Global Threat Observatory",
    description: "Real-time, multi-domain threat intelligence across cyber, physical, influence, and geopolitical domains.",
    icon: Globe,
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    use: "Live threat feeds for iZulu Sentinel correlation engine",
    url: "https://asosint.io/Modules",
    tags: ["Cyber", "Physical", "Geopolitical"]
  },
  {
    id: "fusion-center",
    title: "Fusion Center",
    description: "Unified intelligence analysis and correlation — connects signals across all domains into a single actionable picture.",
    icon: GitMerge,
    color: "text-purple-400",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    use: "Enriches threat triage with cross-domain context",
    url: "https://asosint.io/Modules",
    tags: ["Analysis", "Correlation", "HUMINT"]
  },
  {
    id: "scenario-engine",
    title: "Scenario Engine",
    description: "Strategic forecasting and planning tool for modeling threat scenarios before they materialize.",
    icon: Cpu,
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    use: "Feed predictive models and pre-incident planning",
    url: "https://asosint.io/Modules",
    tags: ["Forecasting", "Predictive", "Planning"]
  },
  {
    id: "red-blue-cell",
    title: "Red / Blue Cell Module",
    description: "Adversary simulation and defensive planning to pressure-test your security posture.",
    icon: Target,
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    use: "Validate response playbooks and SOC readiness",
    url: "https://asosint.io/Modules",
    tags: ["Red Team", "Blue Team", "TTPs"]
  },
  {
    id: "compliance-governance",
    title: "Compliance & Governance",
    description: "Policy, oversight, and regulatory alignment tools ensuring intelligence operations stay within legal boundaries.",
    icon: Shield,
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    use: "Audit trails and regulatory evidence for enterprise compliance",
    url: "https://asosint.io/Modules",
    tags: ["Compliance", "Audit", "Policy"]
  },
  {
    id: "training-portal",
    title: "Training Portal",
    description: "Role-based learning and certification for SOC analysts, investigators, and security personnel.",
    icon: BookOpen,
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    use: "Upskill analysts on OSINT tradecraft and decision-making",
    url: "https://asosint.io/Modules",
    tags: ["Training", "Certification", "SOC"]
  },
  {
    id: "agent-marketplace",
    title: "Agent Marketplace",
    description: "Specialized AI agents for every intelligence domain — deployable on demand.",
    icon: Bot,
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
    use: "Extend Sentinel with specialized domain-specific AI agents",
    url: "https://asosint.io/Modules",
    tags: ["AI Agents", "Automation", "OSINT"]
  },
  {
    id: "intel-program-builder",
    title: "Intelligence Program Builder",
    description: "Design full-spectrum intelligence programs aligned to your organization's threat profile and risk appetite.",
    icon: LayoutTemplate,
    color: "text-orange-400",
    bg: "bg-orange-500/10",
    border: "border-orange-500/20",
    use: "Structure your enterprise intelligence operations",
    url: "https://asosint.io/Modules",
    tags: ["Program Design", "Strategy", "Enterprise"]
  }
];

const decisionSupport = [
  {
    icon: Eye,
    title: "Threat Visibility",
    description: "ASOSINT's Global Threat Observatory surfaces signals that feed directly into Sentinel's correlation engine, giving analysts richer context before triage."
  },
  {
    icon: Brain,
    title: "AI-Augmented Analysis",
    description: "Fusion Center cross-correlates cyber, physical, and influence signals — reducing investigation time from hours to minutes."
  },
  {
    icon: Zap,
    title: "Faster Decisions",
    description: "Pre-built scenario models and red/blue cell outputs give SOC teams validated playbooks so responses are faster and more confident."
  },
  {
    icon: Search,
    title: "OSINT Knowledge Base",
    description: "ASOSINT's training portal and knowledge library equip analysts with the tradecraft needed to interpret and act on intelligence accurately."
  }
];

export default function ASOSINT() {
  const [activeModule, setActiveModule] = useState(null);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 space-y-10">

      {/* Header */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">ASOSINT Integration</h1>
              <p className="text-gray-500 text-sm">asosint.io · Emerging Defense Solutions</p>
            </div>
          </div>
          <a href="https://asosint.io" target="_blank" rel="noopener noreferrer">
            <Button className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
              Open ASOSINT Platform
              <ExternalLink className="w-4 h-4" />
            </Button>
          </a>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f] mt-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-1">
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30 mb-3">Powered by ASOSINT</Badge>
                <h2 className="text-xl font-bold text-white mb-2">
                  The Future of Open-Sourced Intelligence
                </h2>
                <p className="text-gray-400 leading-relaxed">
                  ASOSINT is a unified intelligence ecosystem built by the same founders as iZulu Sentinel. 
                  It bridges cyber, physical, influence, and geopolitical threats into a single platform — 
                  enriching every decision made inside Sentinel with deeper OSINT context, validated scenarios, 
                  and domain-expert knowledge.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 md:min-w-[220px]">
                {[
                  { label: "Core Modules", value: "8" },
                  { label: "Intel Domains", value: "5+" },
                  { label: "AI Agents", value: "∞" },
                  { label: "Mission", value: "1" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-3 text-center">
                    <div className="text-2xl font-bold text-cyan-400">{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Decision Support */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          How ASOSINT Powers Sentinel Decision-Making
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {decisionSupport.map((item) => (
            <Card key={item.title} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-4">
                <item.icon className="w-6 h-6 text-cyan-400 mb-3" />
                <h3 className="font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Module Grid */}
      <div className="max-w-5xl mx-auto">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <LayoutTemplate className="w-5 h-5 text-amber-400" />
          ASOSINT Core Modules
        </h2>
        <p className="text-gray-500 text-sm mb-6">
          Click any module to see how it integrates with iZulu Sentinel — or launch it directly in ASOSINT.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {modules.map((mod) => (
            <Card
              key={mod.id}
              onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
              className={`border cursor-pointer transition-all duration-200 ${
                activeModule === mod.id
                  ? `${mod.border} bg-[#0f0f0f]`
                  : "border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#2a2a2a]"
              }`}
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 ${mod.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <mod.icon className={`w-5 h-5 ${mod.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <h3 className="font-semibold text-white text-sm">{mod.title}</h3>
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed mb-2">{mod.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {mod.tags.map((tag) => (
                        <span key={tag} className="text-[10px] bg-[#1a1a1a] text-gray-500 px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {activeModule === mod.id && (
                  <div className={`mt-4 pt-4 border-t ${mod.border}`}>
                    <div className="flex items-start gap-2 mb-3">
                      <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-400 font-medium mb-0.5">Sentinel Use Case</p>
                        <p className="text-xs text-gray-300">{mod.use}</p>
                      </div>
                    </div>
                    <a href={mod.url} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Button size="sm" className={`${mod.bg} ${mod.color} border ${mod.border} hover:opacity-80 text-xs gap-1`} variant="outline">
                        Launch in ASOSINT
                        <ExternalLink className="w-3 h-3" />
                      </Button>
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto">
        <Card className="border-cyan-500/20 bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
          <CardContent className="p-8 text-center">
            <Globe className="w-10 h-10 text-cyan-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Access the Full ASOSINT Platform</h3>
            <p className="text-gray-400 mb-6 max-w-xl mx-auto">
              Sign in to the ASOSINT Community Beta to unlock all modules, AI agents, and the full intelligence ecosystem — 
              purpose-built by Emerging Defense Solutions.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="https://asosint.io" target="_blank" rel="noopener noreferrer">
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white gap-2">
                  Go to asosint.io
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </a>
              <a href="https://asosint.io/Modules" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 gap-2">
                  Explore Modules
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}