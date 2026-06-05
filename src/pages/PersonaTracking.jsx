import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserCheck, Search, MapPin, Clock, AlertTriangle, Plus } from "lucide-react";

export default function PersonaTracking() {
  const [searchTerm, setSearchTerm] = useState("");

  const trackedPersonas = [
    {
      name: "John Smith",
      role: "CEO",
      status: "active",
      location: "Lagos, Nigeria",
      lastUpdate: "5 minutes ago",
      riskLevel: "medium",
      upcomingTravel: "Nairobi - Jan 20"
    },
    {
      name: "Sarah Johnson",
      role: "Executive VP",
      status: "in_transit",
      location: "OR Tambo Airport, JHB",
      lastUpdate: "12 minutes ago",
      riskLevel: "low",
      upcomingTravel: "Cape Town - Jan 18"
    },
    {
      name: "Michael Chen",
      role: "Regional Director",
      status: "active",
      location: "Nairobi, Kenya",
      lastUpdate: "1 hour ago",
      riskLevel: "low",
      upcomingTravel: "Dubai - Jan 25"
    },
    {
      name: "Emma Williams",
      role: "Operations Manager",
      status: "active",
      location: "Johannesburg, SA",
      lastUpdate: "30 minutes ago",
      riskLevel: "low",
      upcomingTravel: "None scheduled"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-emerald-500/20 text-emerald-400";
      case "in_transit":
        return "bg-cyan-500/20 text-cyan-400";
      case "at_risk":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case "high":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <UserCheck className="w-8 h-8 text-[#DC2626]" />
              Persona Tracking
            </h1>
            <p className="text-gray-400">Real-time monitoring of key personnel and executives</p>
          </div>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Persona
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tracked Personas</p>
                  <p className="text-3xl font-bold text-white">{trackedPersonas.length}</p>
                </div>
                <UserCheck className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">In Transit</p>
                  <p className="text-3xl font-bold text-white">
                    {trackedPersonas.filter(p => p.status === "in_transit").length}
                  </p>
                </div>
                <MapPin className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">At Risk</p>
                  <p className="text-3xl font-bold text-white">
                    {trackedPersonas.filter(p => p.riskLevel === "high" || p.riskLevel === "medium").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Upcoming Travel</p>
                  <p className="text-3xl font-bold text-white">
                    {trackedPersonas.filter(p => p.upcomingTravel !== "None scheduled").length}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search personas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {trackedPersonas.map((persona, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#DC2626]/50 transition-colors cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-14 h-14 bg-[#DC2626] text-white">
                    <AvatarFallback>{persona.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white text-lg">{persona.name}</h3>
                        <p className="text-sm text-gray-400">{persona.role}</p>
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getStatusColor(persona.status)}>
                          {persona.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline" className={getRiskColor(persona.riskLevel)}>
                          {persona.riskLevel} risk
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center gap-2 text-sm text-gray-300">
                        <MapPin className="w-4 h-4 text-[#DC2626]" />
                        <span>{persona.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        <span>Updated {persona.lastUpdate}</span>
                      </div>
                      {persona.upcomingTravel !== "None scheduled" && (
                        <div className="mt-3 p-2 bg-[#1a1a1a] rounded border border-[#2a2a2a]">
                          <p className="text-xs text-gray-400 mb-1">Upcoming Travel:</p>
                          <p className="text-sm text-cyan-400">{persona.upcomingTravel}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}