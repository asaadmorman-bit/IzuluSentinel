import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { 
  Home, 
  Users, 
  MapPin, 
  Bell, 
  Shield, 
  Smartphone,
  AlertTriangle,
  Activity,
  Lock,
  Phone,
  CreditCard,
  CheckCircle,
  TrendingUp,
  Eye,
  Zap
} from "lucide-react";

export default function ResidentialSecurity() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    familyMembers: 0,
    monitoredDevices: 0,
    activeAlerts: 0,
    safetyScore: 0
  });

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      
      // Load user stats
      setStats({
        familyMembers: currentUser.family_members?.length || 0,
        monitoredDevices: currentUser.monitored_devices?.length || 0,
        activeAlerts: 0,
        safetyScore: 95
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const features = [
    {
      icon: Home,
      title: "Home Security Monitoring",
      description: "24/7 monitoring of your home with smart alerts for unusual activity",
      status: "active",
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/10"
    },
    {
      icon: Users,
      title: "Family Location Tracking",
      description: "Real-time location tracking for up to 5 family members",
      status: "active",
      color: "text-purple-400",
      bgColor: "bg-purple-500/10"
    },
    {
      icon: MapPin,
      title: "Local Threat Alerts",
      description: "Immediate alerts about threats in your neighborhood",
      status: "active",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    },
    {
      icon: Bell,
      title: "Smart Notifications",
      description: "Intelligent alerts that learn your patterns and preferences",
      status: "active",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Shield,
      title: "Identity Monitoring",
      description: "Dark web monitoring and credit alerts for the whole family",
      status: "premium",
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Smartphone,
      title: "Mobile Safety",
      description: "Track and secure all family mobile devices",
      status: "premium",
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    }
  ];

  const pricingTiers = [
    {
      name: "Basic",
      price: "$9.99",
      period: "/month",
      icon: Home,
      features: [
        "Home Security Monitoring",
        "3 Family Members",
        "Local Threat Alerts",
        "Mobile App Access"
      ],
      current: false
    },
    {
      name: "Premium",
      price: "$19.99",
      period: "/month",
      icon: Shield,
      features: [
        "Everything in Basic",
        "5 Family Members",
        "Identity Monitoring",
        "Mobile Device Security",
        "24/7 Priority Support",
        "Advanced Analytics"
      ],
      current: true,
      popular: true
    },
    {
      name: "Family Plus",
      price: "$29.99",
      period: "/month",
      icon: Users,
      features: [
        "Everything in Premium",
        "Unlimited Family Members",
        "Emergency Response",
        "White Glove Support",
        "Custom Alerts",
        "Family Safety Coach"
      ],
      current: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <Shield className="w-12 h-12 md:w-16 md:h-16 text-[#DC2626] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400 text-sm md:text-base">Loading your security dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Home className="w-6 h-6 md:w-8 md:h-8 text-[#DC2626]" />
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">
                Residential Security
              </h1>
            </div>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">
              Comprehensive protection for your family and home
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-xs sm:text-sm">
              <Phone className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              Emergency Contact
            </Button>
            <Button variant="outline" className="border-[#2a2a2a] text-white text-xs sm:text-sm">
              <CreditCard className="w-3 h-3 md:w-4 md:h-4 mr-2" />
              <span className="hidden sm:inline">Manage </span>Subscription
            </Button>
          </div>
        </div>

        {/* Stats Overview - Responsive Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-purple-400" />
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Family Members</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{stats.familyMembers}</p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Smartphone className="w-6 h-6 md:w-8 md:h-8 text-cyan-400" />
                <CheckCircle className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Monitored Devices</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{stats.monitoredDevices}</p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="w-6 h-6 md:w-8 md:h-8 text-amber-400" />
                <Activity className="w-3 h-3 md:w-4 md:h-4 text-gray-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Active Alerts</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white">{stats.activeAlerts}</p>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/20 to-[#0f0f0f]">
            <CardContent className="p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between mb-2">
                <Shield className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" />
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" />
              </div>
              <p className="text-xs sm:text-sm text-gray-400 mb-1">Safety Score</p>
              <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-emerald-400">{stats.safetyScore}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid - Responsive */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Your Security Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {features.map((feature, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                <CardContent className="p-4 md:p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 md:w-12 md:h-12 ${feature.bgColor} rounded-lg flex items-center justify-center`}>
                      <feature.icon className={`w-5 h-5 md:w-6 md:h-6 ${feature.color}`} />
                    </div>
                    <Badge className={`text-[10px] md:text-xs ${
                      feature.status === 'active' 
                        ? 'bg-emerald-500/20 text-emerald-400' 
                        : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {feature.status === 'active' ? 'Active' : 'Premium'}
                    </Badge>
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg font-bold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-400">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Pricing Tiers - Responsive */}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 md:mb-4">Subscription Plans</h2>
          <div className="grid md:grid-cols-3 gap-3 md:gap-6">
            {pricingTiers.map((tier, idx) => (
              <Card 
                key={idx}
                className={`border-[#1a1a1a] bg-[#0f0f0f] ${
                  tier.popular ? 'ring-2 ring-[#DC2626]' : ''
                } ${tier.current ? 'bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]' : ''}`}
              >
                {tier.popular && (
                  <div className="bg-[#DC2626] text-white text-center py-1.5 md:py-2 text-xs md:text-sm font-semibold">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader className="text-center pb-3 md:pb-4">
                  <div className={`w-12 h-12 md:w-16 md:h-16 bg-${tier.current ? 'red' : 'cyan'}-500/20 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4`}>
                    <tier.icon className={`w-6 h-6 md:w-8 md:h-8 text-${tier.current ? 'red' : 'cyan'}-400`} />
                  </div>
                  <CardTitle className="text-lg sm:text-xl md:text-2xl text-white mb-2">
                    {tier.name}
                  </CardTitle>
                  <div className="mb-3 md:mb-4">
                    <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">{tier.price}</span>
                    <span className="text-gray-400 text-sm md:text-base ml-2">{tier.period}</span>
                  </div>
                  {tier.current && (
                    <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                      Current Plan
                    </Badge>
                  )}
                </CardHeader>
                <CardContent className="space-y-4 md:space-y-6">
                  <div className="space-y-2 md:space-y-3">
                    {tier.features.map((feature, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 md:gap-3">
                        <CheckCircle className="w-4 h-4 md:w-5 md:h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300 text-xs sm:text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className={`w-full py-4 md:py-6 text-sm md:text-base ${
                      tier.current 
                        ? 'bg-[#1a1a1a] text-white cursor-default' 
                        : 'bg-[#DC2626] hover:bg-[#B91C1C] text-white'
                    }`}
                    disabled={tier.current}
                  >
                    {tier.current ? 'Current Plan' : tier.price === '$9.99' ? 'Downgrade' : 'Upgrade'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
          <CardContent className="p-4 md:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3 md:mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
              <Button variant="outline" className="border-[#2a2a2a] text-white h-auto py-3 md:py-4 flex-col gap-2">
                <Users className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs md:text-sm">Add Family</span>
              </Button>
              <Button variant="outline" className="border-[#2a2a2a] text-white h-auto py-3 md:py-4 flex-col gap-2">
                <Smartphone className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs md:text-sm">Add Device</span>
              </Button>
              <Button variant="outline" className="border-[#2a2a2a] text-white h-auto py-3 md:py-4 flex-col gap-2">
                <MapPin className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs md:text-sm">Set Geofence</span>
              </Button>
              <Button variant="outline" className="border-[#2a2a2a] text-white h-auto py-3 md:py-4 flex-col gap-2">
                <Eye className="w-5 h-5 md:w-6 md:h-6" />
                <span className="text-xs md:text-sm">View Activity</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}