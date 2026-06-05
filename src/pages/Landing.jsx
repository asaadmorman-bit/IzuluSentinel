import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { 
  Shield, 
  Zap, 
  Brain, 
  Radio,
  Target,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Lock,
  Globe,
  AlertTriangle,
  FileText,
  Cpu,
  Network,
  Eye,
  Bell,
  MapPin,
  Crosshair,
  Activity,
  Home,
  Smartphone,
  Phone,
  Rss,
  Thermometer,
  Wind,
  UserCheck,
  ShieldAlert,
  ShieldCheck,
  WifiOff,
  GitMerge,
} from "lucide-react";

// --- Zero Trust Simulation helpers ---
const CROWD_THRESHOLD = 75;
const THERMAL_THRESHOLD = 72;
const ENV_THRESHOLD = 68;

function randomWalk(prev, min, max, step = 4) {
  const delta = (Math.random() - 0.5) * step * 2;
  return Math.min(max, Math.max(min, Math.round(prev + delta)));
}

export default function Landing() {
  const [crowd, setCrowd] = useState(58);
  const [thermal, setThermal] = useState(45);
  const [envRisk, setEnvRisk] = useState(52);
  const [ztAlerts, setZtAlerts] = useState([]);
  const ztRef = useRef(ztAlerts);
  ztRef.current = ztAlerts;

  useEffect(() => {
    const interval = setInterval(() => {
      setCrowd(prev => {
        const next = randomWalk(prev, 30, 99, 5);
        if (next >= CROWD_THRESHOLD && prev < CROWD_THRESHOLD) {
          setZtAlerts(a => [{ id: Date.now(), type: 'Crowd Flow', score: next, ts: new Date().toLocaleTimeString() }, ...a].slice(0, 5));
        }
        return next;
      });
      setThermal(prev => {
        const next = randomWalk(prev, 20, 99, 6);
        if (next >= THERMAL_THRESHOLD && prev < THERMAL_THRESHOLD) {
          setZtAlerts(a => [{ id: Date.now(), type: 'Thermal Signature', score: next, ts: new Date().toLocaleTimeString() }, ...a].slice(0, 5));
        }
        return next;
      });
      setEnvRisk(prev => {
        const next = randomWalk(prev, 20, 99, 4);
        if (next >= ENV_THRESHOLD && prev < ENV_THRESHOLD) {
          setZtAlerts(a => [{ id: Date.now(), type: 'Environmental Risk', score: next, ts: new Date().toLocaleTimeString() }, ...a].slice(0, 5));
        }
        return next;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  const handleGetStarted = async () => {
    const isAuthenticated = await base44.auth.isAuthenticated();
    if (isAuthenticated) {
      window.location.href = "/Dashboard";
    } else {
      base44.auth.redirectToLogin("/Dashboard");
    }
  };

  const handleTryDemo = () => {
    window.location.href = "/Dashboard?demo=true";
  };

  const features = [
    {
      icon: Brain,
      title: "AI Security Analyst",
      description: "GPT-4 powered threat analysis, correlation, and automated response recommendations",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: Radio,
      title: "Event Security Intelligence",
      description: "Real-time social media monitoring and geolocation-based threat detection for venues",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Crosshair,
      title: "Weapons Detection Integration",
      description: "Advanced AI-powered weapons screening with Evolv integration and real-time alerts",
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      icon: Zap,
      title: "Autonomous Response",
      description: "Automated IP blocking, asset isolation, and incident escalation based on threat intelligence",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    },
    {
      icon: MapPin,
      title: "Advanced Geofencing",
      description: "Multi-trigger geofence alerts with threat feed correlation and automated responses",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Network,
      title: "Threat Intelligence Hub",
      description: "AI-enriched multi-source intelligence with predictive analytics and regional context",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    }
  ];

  const useCases = [
    {
      title: "Corporate Security",
      description: "Protect executives, facilities, and personnel with comprehensive threat intelligence and automated response",
      icon: Shield,
      benefits: ["Executive Protection", "Facility Security", "24/7 Monitoring"]
    },
    {
      title: "Event Security",
      description: "Secure stadiums, concerts, and large gatherings with real-time social intelligence and weapons detection",
      icon: Radio,
      benefits: ["Social Media Monitoring", "Crowd Analytics", "Weapons Screening"]
    },
    {
      title: "Law Enforcement",
      description: "Intelligence-driven operations with AI-powered case management and threat correlation",
      icon: Target,
      benefits: ["Case Management", "Threat Correlation", "Evidence Analysis"]
    },
    {
      title: "Private Security Firms",
      description: "Multi-client security operations with role-based access and automated reporting",
      icon: Users,
      benefits: ["Client Management", "Automated Reports", "Team Coordination"]
    }
  ];

  const pricingPlans = [
    {
      name: "Residential",
      subtitle: "For Individuals & Families",
      price: "$19.99",
      period: "/month",
      description: "Essential home and family security monitoring",
      icon: Home,
      color: "blue",
      features: [
        "Home Security Monitoring",
        "Family Location Tracking (up to 5)",
        "Local Threat Alerts",
        "Smart Notifications",
        "Identity Monitoring",
        "Mobile App Access",
        "24/7 Priority Support"
      ],
      cta: "Start Free Trial",
      popular: false
    },
    {
      name: "Enterprise",
      subtitle: "For Organizations & Security Teams",
      price: "Custom",
      period: "pricing",
      description: "Complete security intelligence platform",
      icon: Shield,
      color: "red",
      features: [
        "Everything in Residential",
        "AI Security Analyst",
        "Event Security Monitoring",
        "Weapons Detection Integration",
        "Autonomous Response System",
        "Threat Intelligence Hub",
        "Advanced Geofencing",
        "Role-Based Access Control",
        "White Label Options",
        "Dedicated Security Advisor",
        "API & Integrations",
        "Custom SLA"
      ],
      cta: "Contact Sales",
      popular: true
    },
    {
      name: "Government",
      subtitle: "For Law Enforcement & Agencies",
      price: "Custom",
      period: "pricing",
      description: "Specialized tools for public safety operations",
      icon: Target,
      color: "purple",
      features: [
        "Everything in Enterprise",
        "Case Management System",
        "Evidence Chain of Custody",
        "Multi-Agency Collaboration",
        "Classified Intelligence Handling",
        "Court-Ready Reports",
        "FedRAMP Compliance Options",
        "On-Premise Deployment",
        "Dedicated Support Team",
        "Custom Training Programs"
      ],
      cta: "Schedule Demo",
      popular: false
    }
  ];

  const competitors = [
    {
      name: "Traditional SIEM",
      features: {
        "AI-Powered Analysis": false,
        "Event Security": false,
        "Weapons Detection": false,
        "Autonomous Response": false,
        "Social Intelligence": false,
        "Geofencing": false,
        "Cost": "$50k-$500k/year"
      }
    },
    {
      name: "Basic Threat Intel",
      features: {
        "AI-Powered Analysis": false,
        "Event Security": false,
        "Weapons Detection": false,
        "Autonomous Response": false,
        "Social Intelligence": false,
        "Geofencing": false,
        "Cost": "$10k-$50k/year"
      }
    },
    {
      name: "Izulu Sentinel",
      features: {
        "AI-Powered Analysis": true,
        "Event Security": true,
        "Weapons Detection": true,
        "Autonomous Response": true,
        "Social Intelligence": true,
        "Geofencing": true,
        "Cost": "Contact for pricing"
      },
      highlight: true
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-blue-600/20"></div>
        {/* Grid overlay */}
        <div className="absolute inset-0" style={{backgroundImage:'linear-gradient(rgba(34,211,238,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(34,211,238,0.04) 1px,transparent 1px)',backgroundSize:'48px 48px'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32">
          <div className="text-center space-y-8">
            <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/40 px-4 py-2">
              <Brain className="w-4 h-4 mr-2" />
              PhD Research · Predictive Physical Security Engine
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              iZulu Sentinel:
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Predictive Physical Security
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto">
              A doctoral research prototype exploring how predictive physical-sensor data — crowd dynamics, thermal signatures, and environmental risk — can autonomously trigger Zero Trust digital access control decisions in real time.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={handleGetStarted}
                className="bg-cyan-600 hover:bg-cyan-700 text-white px-8 py-6 text-lg"
              >
                Request a Pilot
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                className="border-cyan-700/50 text-cyan-300 hover:bg-cyan-900/30 px-8 py-6 text-lg"
                onClick={handleTryDemo}
              >
                View Live Demo
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>Real-Time Physical Sensing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>Zero Trust Integration</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-cyan-400" />
                <span>Autonomous Digital Response</span>
              </div>
            </div>

            {/* PhD Research / Non-Commercial / Patent Notice */}
            <div className="mt-10 max-w-3xl mx-auto border border-amber-500/30 bg-amber-500/5 rounded-xl px-6 py-5 text-left space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-amber-400" />
                <span className="text-amber-400 font-bold text-sm tracking-widest uppercase">Academic Research Platform — Patent Pending</span>
              </div>
              <p className="text-amber-200/80 text-sm leading-relaxed">
                <strong className="text-amber-300">This platform is strictly a PhD research artefact</strong> developed as part of doctoral research into <em>"The Sentinel Ecosystem: Autonomous Hyper-Convergence of Generative AI and Machine Learning for Self-Healing SIEM and Real-Time Predictive Physical Security."</em>
              </p>
              <p className="text-amber-200/60 text-sm leading-relaxed">
                It is <strong className="text-amber-300">not available for commercial use, redistribution, or deployment</strong> outside the research context. All concepts, architectures, methodologies, and implementations contained herein are protected under applicable intellectual property law.
              </p>
              <p className="text-amber-200/60 text-xs font-mono mt-1">
                Patent Pending · © 2026 Emerging Defense Solutions · All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Physical-Digital Bridge Dashboard ── */}
      <section className="py-20 px-4 bg-[#020817]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <Badge className="bg-cyan-500/15 text-cyan-400 border-cyan-500/30 px-3 py-1 mb-4">Research Prototype · Live Simulation</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Predictive Situational Awareness Dashboard</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">Physical sensor risk scores are continuously evaluated. When any score breaches its threshold, a Zero Trust digital access control event is automatically triggered and logged — bridging the physical and digital security domains.</p>
          </div>

          {/* Sensor Widgets */}
          <div className="grid md:grid-cols-3 gap-5 mb-8">
            {/* Crowd Flow */}
            <div className="border border-cyan-500/20 bg-[#050d1a] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-cyan-500/15 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-cyan-400" />
                  </div>
                  <span className="text-sm font-semibold text-cyan-300">Crowd Flow Dynamics</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-cyan-500 font-mono">LIVE</span>
                </div>
              </div>
              <div className="text-5xl font-bold font-mono text-white mb-1">{crowd}<span className="text-2xl text-gray-500">%</span></div>
              <div className="w-full bg-[#0d1f30] rounded-full h-2 mt-3 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{width:`${crowd}%`, background: crowd >= CROWD_THRESHOLD ? '#ef4444' : '#22d3ee'}}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>0%</span>
                <span className={crowd >= CROWD_THRESHOLD ? 'text-red-400 font-bold' : 'text-gray-500'}>Threshold: {CROWD_THRESHOLD}%</span>
                <span>100%</span>
              </div>
              {crowd >= CROWD_THRESHOLD && (
                <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded px-2.5 py-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[11px] text-red-400 font-mono">THRESHOLD BREACHED</span>
                </div>
              )}
            </div>

            {/* Thermal */}
            <div className="border border-orange-500/20 bg-[#0e0804] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-orange-500/15 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                  </div>
                  <span className="text-sm font-semibold text-orange-300">Thermal Signatures</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-orange-500 font-mono">LIVE</span>
                </div>
              </div>
              <div className="text-5xl font-bold font-mono text-white mb-1">{thermal}<span className="text-2xl text-gray-500">%</span></div>
              <div className="w-full bg-[#1a0e06] rounded-full h-2 mt-3 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{width:`${thermal}%`, background: thermal >= THERMAL_THRESHOLD ? '#ef4444' : '#fb923c'}}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>0%</span>
                <span className={thermal >= THERMAL_THRESHOLD ? 'text-red-400 font-bold' : 'text-gray-500'}>Threshold: {THERMAL_THRESHOLD}%</span>
                <span>100%</span>
              </div>
              {thermal >= THERMAL_THRESHOLD && (
                <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded px-2.5 py-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[11px] text-red-400 font-mono">THRESHOLD BREACHED</span>
                </div>
              )}
            </div>

            {/* Environmental Risk */}
            <div className="border border-green-500/20 bg-[#040e06] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-green-500/15 rounded-lg flex items-center justify-center">
                    <Wind className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm font-semibold text-green-300">Environmental Risk Score</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                  <span className="text-[10px] text-green-500 font-mono">LIVE</span>
                </div>
              </div>
              <div className="text-5xl font-bold font-mono text-white mb-1">{envRisk}<span className="text-2xl text-gray-500">%</span></div>
              <div className="w-full bg-[#0a150b] rounded-full h-2 mt-3 mb-2">
                <div
                  className="h-2 rounded-full transition-all duration-700"
                  style={{width:`${envRisk}%`, background: envRisk >= ENV_THRESHOLD ? '#ef4444' : '#4ade80'}}
                />
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 font-mono">
                <span>0%</span>
                <span className={envRisk >= ENV_THRESHOLD ? 'text-red-400 font-bold' : 'text-gray-500'}>Threshold: {ENV_THRESHOLD}%</span>
                <span>100%</span>
              </div>
              {envRisk >= ENV_THRESHOLD && (
                <div className="mt-3 flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded px-2.5 py-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-[11px] text-red-400 font-mono">THRESHOLD BREACHED</span>
                </div>
              )}
            </div>
          </div>

          {/* Zero Trust Alert Log */}
          <div className="border border-[#1a2a3a] bg-[#02080f] rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-[#1a2a3a]">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-300">Zero Trust Access Control — Event Log</span>
              </div>
              <Badge className="bg-cyan-500/10 text-cyan-400 border-cyan-500/20 text-[10px]">AUTO-TRIGGERED</Badge>
            </div>
            <div className="p-4 min-h-[80px]">
              {ztAlerts.length === 0 ? (
                <div className="flex items-center gap-3 text-gray-600 text-sm">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  <span>All physical risk scores within normal bounds — digital access unrestricted.</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {ztAlerts.map((a) => (
                    <div key={a.id} className="flex items-center gap-3 bg-red-500/5 border border-red-500/15 rounded px-3 py-2">
                      <WifiOff className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />
                      <span className="text-[11px] text-red-300 font-mono flex-1">
                        [{a.ts}] ZERO TRUST TRIGGER — <strong>{a.type}</strong> breached at <strong>{a.score}%</strong> · Digital access control lockdown initiated.
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <p className="text-center text-xs text-gray-600 mt-4 font-mono">Scores update every ~1.8s · Thresholds: Crowd {CROWD_THRESHOLD}% · Thermal {THERMAL_THRESHOLD}% · Environmental {ENV_THRESHOLD}%</p>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 px-4 bg-[#050505]">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Security teams don't have a signal problem.
            <br />
            <span className="text-[#DC2626]">They have a clarity problem.</span>
          </h2>
          <div className="grid md:grid-cols-2 gap-6 mt-12 text-left">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-[#DC2626] mb-3" />
                <h3 className="text-white font-semibold mb-2">Fragmented Threat Signals</h3>
                <p className="text-gray-400 text-sm">Dozens of feeds, no unified view of what matters</p>
              </CardContent>
            </Card>
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-[#DC2626] mb-3" />
                <h3 className="text-white font-semibold mb-2">Alert Fatigue</h3>
                <p className="text-gray-400 text-sm">Delayed response and missed critical threats</p>
              </CardContent>
            </Card>
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-[#DC2626] mb-3" />
                <h3 className="text-white font-semibold mb-2">No Visibility</h3>
                <p className="text-gray-400 text-sm">Can't see what threatens critical services</p>
              </CardContent>
            </Card>
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <AlertTriangle className="w-8 h-8 text-[#DC2626] mb-3" />
                <h3 className="text-white font-semibold mb-2">Manual Correlation</h3>
                <p className="text-gray-400 text-sm">Hours spent connecting dots across tools</p>
              </CardContent>
            </Card>
          </div>
          <p className="text-lg text-gray-300 mt-8 italic">
            When critical services or executive safety are at stake, <strong className="text-white">minutes matter.</strong>
          </p>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Meet iZulu Sentinel
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unifies threat intelligence, AI-driven correlation, and autonomous response into a single, enterprise-ready platform.
          </p>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <CheckCircle className="w-10 h-10 text-emerald-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Correlates signals in real time</h3>
              <p className="text-gray-400">AI matches threats to your critical services automatically</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Brain className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Explains threats using AI</h3>
              <p className="text-gray-400">Clear, human-readable summaries in seconds</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Target className="w-10 h-10 text-[#DC2626] mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Prioritizes what matters most</h3>
              <p className="text-gray-400">Business-critical threats surface first</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Zap className="w-10 h-10 text-amber-400 mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Delivers actionable alerts instantly</h3>
              <p className="text-gray-400">Right information, right team, right time</p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-2xl font-semibold text-white">
            No noise. <span className="text-[#DC2626]">Just intelligence.</span>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-[#050505]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Rss className="w-8 h-8 text-blue-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Ingest</h3>
              <p className="text-sm text-gray-400">Signals from internal systems and external feeds</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Correlate</h3>
              <p className="text-sm text-gray-400">AI identifies patterns and intent</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-cyan-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Explain</h3>
              <p className="text-sm text-gray-400">Clear, human-readable threat summaries</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Respond</h3>
              <p className="text-sm text-gray-400">Automated or guided actions</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">Alert</h3>
              <p className="text-sm text-gray-400">Real-time notifications to the right teams</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Why iZulu Sentinel
            </h2>
            <p className="text-xl text-gray-400">
              Built for enterprise scale, designed for critical services
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Built for Your Industry
            </h2>
            <p className="text-xl text-gray-400">
              Tailored solutions for diverse security operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {useCases.map((useCase, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#DC2626]/20 rounded-lg flex items-center justify-center">
                      <useCase.icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                    <CardTitle className="text-white">{useCase.title}</CardTitle>
                  </div>
                  <p className="text-gray-400">{useCase.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              How We Compare
            </h2>
            <p className="text-xl text-gray-400">
              See why leading organizations choose Izulu Sentinel
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  <th className="text-left text-white p-4">Feature</th>
                  {competitors.map((comp, idx) => (
                    <th key={idx} className={`text-center p-4 ${comp.highlight ? 'bg-[#DC2626]/10' : ''}`}>
                      <span className={comp.highlight ? 'text-[#DC2626] font-bold' : 'text-gray-400'}>
                        {comp.name}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.keys(competitors[0].features).map((feature, idx) => (
                  <tr key={idx} className="border-b border-[#1a1a1a]">
                    <td className="text-white p-4">{feature}</td>
                    {competitors.map((comp, compIdx) => (
                      <td key={compIdx} className={`text-center p-4 ${comp.highlight ? 'bg-[#DC2626]/10' : ''}`}>
                        {typeof comp.features[feature] === 'boolean' ? (
                          comp.features[feature] ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-gray-600 rounded-full mx-auto" />
                          )
                        ) : (
                          <span className={comp.highlight ? 'text-[#DC2626] font-semibold' : 'text-gray-400'}>
                            {comp.features[feature]}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-2">99.9%</div>
              <div className="text-gray-400">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-2">&lt;100ms</div>
              <div className="text-gray-400">Alert Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-2">24/7</div>
              <div className="text-gray-400">Threat Monitoring</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-[#DC2626] mb-2">AI-First</div>
              <div className="text-gray-400">Intelligence Platform</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Explore the Research Platform
          </h2>
          <p className="text-xl text-gray-400 mb-4">
            This is a PhD research prototype — not available for commercial use.
          </p>
          <p className="text-sm text-amber-400/80 mb-8 font-mono">Patent Pending · Academic Use Only</p>
          <Button
            onClick={handleGetStarted}
            className="bg-cyan-700 hover:bg-cyan-800 text-white px-8 py-6 text-lg"
          >
            Access Research Dashboard
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1a1a1a] py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#DC2626] rounded flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">Izulu Sentinel</span>
              </div>
              <p className="text-gray-400 text-sm">
                Next-generation security intelligence platform powered by AI
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>AI Security Analyst</li>
                <li>Threat Intelligence</li>
                <li>Event Security</li>
                <li>Autonomous Response</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Industries</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>Corporate Security</li>
                <li>Law Enforcement</li>
                <li>Event Security</li>
                <li>Private Security</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>About Us</li>
                <li>Contact</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[#1a1a1a] text-center text-gray-500 text-sm space-y-1">
            <p className="text-amber-500/70 text-xs font-mono uppercase tracking-widest">⚠ PhD Research Platform · Not for Commercial Use · Patent Pending</p>
            <p>Owned, built and maintained by Emerging Defense Solutions</p>
            <p className="mt-1">© 2026 Izulu Sentinel. All rights reserved. Unauthorized use or reproduction is strictly prohibited.</p>
            <p className="text-xs text-gray-700 mt-2">The Sentinel Ecosystem: Autonomous Hyper-Convergence of Generative AI and Machine Learning for Self-Healing SIEM and Real-Time Predictive Physical Security</p>
          </div>
        </div>
      </footer>
    </div>
  );
}