import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Truck, Plane, Phone, Video, FileCheck, Activity, AlertTriangle } from "lucide-react";

export default function ExecutiveProtectionIntegrations() {
  const [refreshing, setRefreshing] = useState(false);

  const protectionServices = [
    {
      name: "GardaWorld - Executive Protection",
      category: "Close Protection",
      status: "active",
      description: "Global executive protection and secure transport services",
      coverage: "150+ countries",
      responseTime: "< 15 minutes",
      teamSize: "5,000+ agents",
      certifications: ["ISO 9001", "SIA Licensed", "PSC.1 Compliant"],
      contact: "+1 514 281 2811",
      features: ["Armed Protection", "Secure Transport", "Advance Security", "Residential Security"]
    },
    {
      name: "Control Risks - Crisis Management",
      category: "Crisis Response",
      status: "active",
      description: "Crisis management and emergency response coordination",
      coverage: "Global 24/7",
      responseTime: "Immediate",
      teamSize: "1,000+ consultants",
      certifications: ["ISO 31000", "Crisis Response Certified"],
      contact: "+44 20 7970 2000",
      features: ["Kidnap Response", "Crisis Coordination", "Medical Evacuation", "Negotiation Support"]
    },
    {
      name: "International SOS",
      category: "Medical Security",
      status: "active",
      description: "Medical and travel security assistance",
      coverage: "90 countries",
      responseTime: "24/7 immediate",
      teamSize: "12,000+ staff",
      certifications: ["ISO 9001", "JCI Accredited"],
      contact: "+1 215 942 8000",
      features: ["Medical Evacuation", "Security Evacuations", "Travel Tracking", "Crisis Response"]
    },
    {
      name: "Pinkerton - Corporate Intelligence",
      category: "Intelligence",
      status: "active",
      description: "Corporate investigations and intelligence services",
      coverage: "Worldwide",
      responseTime: "< 2 hours",
      teamSize: "2,500+ investigators",
      certifications: ["ASIS Certified", "ISO 27001"],
      contact: "+1 800 724 1616",
      features: ["Background Checks", "Due Diligence", "Threat Assessment", "Executive Screening"]
    }
  ];

  const vehicleTracking = [
    {
      name: "Geotab Fleet Management",
      status: "active",
      vehicles: 24,
      lastUpdate: "Real-time",
      features: ["GPS Tracking", "Driver Behavior", "Maintenance Alerts", "Route Optimization"],
      integration: "Full API Access",
      alerts: "Geofence, Speed, Panic Button"
    },
    {
      name: "Verizon Connect",
      status: "active",
      vehicles: 18,
      lastUpdate: "Real-time",
      features: ["Live Location", "Video Telematics", "ELD Compliance", "Asset Tracking"],
      integration: "Full API Access",
      alerts: "Duress, Location, Maintenance"
    },
    {
      name: "Armored Car GPS - Streit Group",
      status: "active",
      vehicles: 6,
      lastUpdate: "Real-time",
      features: ["Ballistic Protection", "Run-flat Tires", "Emergency Comms", "Panic Systems"],
      integration: "Direct Integration",
      alerts: "Silent Alarm, Attack Detection, Glass Break"
    }
  ];

  const communicationSystems = [
    {
      name: "BlackBerry SecuSUITE",
      category: "Secure Communications",
      status: "active",
      encryption: "AES-256 / FIPS 140-2",
      users: 150,
      features: ["Encrypted Voice", "Secure Messaging", "Conference Calls", "Remote Wipe"],
      compliance: ["HIPAA", "GDPR", "Government Approved"]
    },
    {
      name: "Silent Circle - Secure Comms",
      category: "Executive Comms",
      status: "active",
      encryption: "End-to-End ZRTP",
      users: 85,
      features: ["Encrypted Voice/Video", "Burn Messages", "Secure File Transfer", "Screen Privacy"],
      compliance: ["NIST Approved", "Enterprise Ready"]
    },
    {
      name: "Motorola APX - Tactical Radio",
      category: "Field Communications",
      status: "active",
      encryption: "AES-256",
      users: 45,
      features: ["Push-to-Talk", "GPS Location", "Emergency Button", "Interoperability"],
      compliance: ["P25", "FirstNet Compatible"]
    }
  ];

  const backgroundCheckServices = [
    {
      name: "Sterling BackCheck",
      status: "active",
      checksCompleted: 1247,
      averageTime: "3-5 days",
      coverage: "Global",
      services: ["Criminal Records", "Employment Verification", "Education Check", "Credit Reports"],
      compliance: ["FCRA", "GDPR", "ISO 27001"]
    },
    {
      name: "HireRight",
      status: "active",
      checksCompleted: 892,
      averageTime: "2-4 days",
      coverage: "200+ countries",
      services: ["Background Screening", "Drug Testing", "Motor Vehicle Records", "Global Sanctions"],
      compliance: ["PBSA Accredited", "FCRA Compliant"]
    }
  ];

  const medicalEvacuation = [
    {
      name: "Global Rescue",
      status: "active",
      coverage: "Worldwide",
      responseTime: "< 60 minutes",
      aircraft: "Fixed Wing, Helicopter",
      medical: "Critical Care Transport",
      features: ["Field Rescue", "Hospital Transport", "Repatriation", "Security Extraction"],
      memberships: 45
    },
    {
      name: "REVA Air Ambulance",
      status: "active",
      coverage: "Global",
      responseTime: "< 2 hours",
      aircraft: "Learjet 45XR Medical",
      medical: "ICU Equipped",
      features: ["Air Ambulance", "Ground Ambulance", "Medical Escorts", "Organ Transport"],
      memberships: 28
    }
  ];

  const physicalSecurity = [
    {
      name: "Genetec Security Center",
      category: "Access Control",
      status: "active",
      sites: 12,
      users: 450,
      features: ["Badge Access", "Biometric Readers", "Visitor Management", "Integration Hub"],
      devices: "234 readers, 89 cameras"
    },
    {
      name: "Axis Communications - Video",
      category: "Surveillance",
      status: "active",
      cameras: 156,
      storage: "90 days",
      features: ["4K Resolution", "AI Analytics", "License Plate Recognition", "Perimeter Detection"],
      analytics: "Person Detection, Loitering, Crowd Detection"
    },
    {
      name: "Honeywell Building Management",
      category: "Facility Security",
      status: "active",
      buildings: 8,
      zones: 45,
      features: ["Intrusion Detection", "Fire Systems", "Environmental", "Emergency Lockdown"],
      integration: "Full BMS Integration"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#DC2626]" />
              Executive Protection Integrations
            </h1>
            <p className="text-gray-400">Comprehensive security services and vendor management</p>
          </div>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            Add Integration
          </Button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Shield className="w-8 h-8 text-cyan-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Protection Services</p>
              <p className="text-3xl font-bold text-white">{protectionServices.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Truck className="w-8 h-8 text-purple-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Tracked Vehicles</p>
              <p className="text-3xl font-bold text-white">48</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-emerald-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Security Personnel</p>
              <p className="text-3xl font-bold text-white">8,500+</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Activity className="w-8 h-8 text-amber-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Active Operations</p>
              <p className="text-3xl font-bold text-white">12</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="protection" className="w-full">
          <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a]">
            <TabsTrigger value="protection">Protection Services</TabsTrigger>
            <TabsTrigger value="vehicles">Vehicle Tracking</TabsTrigger>
            <TabsTrigger value="comms">Communications</TabsTrigger>
            <TabsTrigger value="background">Background Checks</TabsTrigger>
            <TabsTrigger value="medical">Medical Evac</TabsTrigger>
            <TabsTrigger value="physical">Physical Security</TabsTrigger>
          </TabsList>

          {/* Protection Services */}
          <TabsContent value="protection" className="space-y-4 mt-6">
            {protectionServices.map((service, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 mb-2">
                        <Shield className="w-5 h-5 text-[#DC2626]" />
                        {service.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{service.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        {service.status}
                      </Badge>
                      <Switch checked={true} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Coverage</p>
                      <p className="text-sm font-semibold text-white">{service.coverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Response Time</p>
                      <p className="text-sm font-semibold text-cyan-400">{service.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Team Size</p>
                      <p className="text-sm font-semibold text-white">{service.teamSize}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Contact</p>
                      <p className="text-sm font-semibold text-white">{service.contact}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, fIdx) => (
                        <Badge key={fIdx} variant="outline" className="text-xs border-[#2a2a2a]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Certifications:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.certifications.map((cert, cIdx) => (
                        <Badge key={cIdx} className="bg-cyan-500/20 text-cyan-400 text-xs">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="border-[#2a2a2a] text-white">
                      <Phone className="w-4 h-4 mr-2" />
                      Contact
                    </Button>
                    <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                      Request Service
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Vehicle Tracking */}
          <TabsContent value="vehicles" className="space-y-4 mt-6">
            {vehicleTracking.map((system, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 mb-2">
                        <Truck className="w-5 h-5 text-purple-500" />
                        {system.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{system.integration}</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {system.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Vehicles Tracked</p>
                      <p className="text-2xl font-bold text-white">{system.vehicles}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Update Frequency</p>
                      <p className="text-sm font-semibold text-cyan-400">{system.lastUpdate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Alert Types</p>
                      <p className="text-sm text-white">{system.alerts}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {system.features.map((feature, fIdx) => (
                        <Badge key={fIdx} variant="outline" className="text-xs border-[#2a2a2a]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                    <Truck className="w-4 h-4 mr-2" />
                    View Live Fleet
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Communications */}
          <TabsContent value="comms" className="space-y-4 mt-6">
            {communicationSystems.map((comm, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 mb-2">
                        <Phone className="w-5 h-5 text-cyan-500" />
                        {comm.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{comm.category}</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {comm.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Encryption</p>
                      <p className="text-sm font-semibold text-white">{comm.encryption}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Active Users</p>
                      <p className="text-2xl font-bold text-white">{comm.users}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Compliance</p>
                      <p className="text-sm text-emerald-400">{comm.compliance.join(", ")}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Capabilities:</p>
                    <div className="flex flex-wrap gap-2">
                      {comm.features.map((feature, fIdx) => (
                        <Badge key={fIdx} variant="outline" className="text-xs border-[#2a2a2a]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Background Checks */}
          <TabsContent value="background" className="space-y-4 mt-6">
            {backgroundCheckServices.map((service, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 mb-2">
                        <FileCheck className="w-5 h-5 text-amber-500" />
                        {service.name}
                      </CardTitle>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Checks Completed</p>
                      <p className="text-2xl font-bold text-white">{service.checksCompleted}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Average Time</p>
                      <p className="text-sm font-semibold text-cyan-400">{service.averageTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Coverage</p>
                      <p className="text-sm text-white">{service.coverage}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.services.map((s, sIdx) => (
                        <Badge key={sIdx} variant="outline" className="text-xs border-[#2a2a2a]">
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                    <FileCheck className="w-4 h-4 mr-2" />
                    Request Background Check
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Medical Evacuation */}
          <TabsContent value="medical" className="space-y-4 mt-6">
            {medicalEvacuation.map((service, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 mb-2">
                        <Plane className="w-5 h-5 text-red-500" />
                        {service.name}
                      </CardTitle>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {service.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Coverage</p>
                      <p className="text-sm font-semibold text-white">{service.coverage}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Response Time</p>
                      <p className="text-sm font-semibold text-red-400">{service.responseTime}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Aircraft</p>
                      <p className="text-sm text-white">{service.aircraft}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Members</p>
                      <p className="text-2xl font-bold text-white">{service.memberships}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Medical Capability</p>
                    <p className="text-white font-semibold">{service.medical}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Services:</p>
                    <div className="flex flex-wrap gap-2">
                      {service.features.map((feature, fIdx) => (
                        <Badge key={fIdx} variant="outline" className="text-xs border-[#2a2a2a]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                    <AlertTriangle className="w-4 h-4 mr-2" />
                    Request Emergency Evac
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Physical Security */}
          <TabsContent value="physical" className="space-y-4 mt-6">
            {physicalSecurity.map((system, idx) => (
              <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2 mb-2">
                        <Video className="w-5 h-5 text-purple-500" />
                        {system.name}
                      </CardTitle>
                      <p className="text-sm text-gray-400">{system.category}</p>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400">
                      {system.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">
                        {system.sites && `Sites: ${system.sites}`}
                        {system.cameras && `Cameras: ${system.cameras}`}
                        {system.buildings && `Buildings: ${system.buildings}`}
                      </p>
                      <p className="text-2xl font-bold text-white">
                        {system.sites || system.cameras || system.buildings}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Coverage</p>
                      <p className="text-sm text-white">
                        {system.users && `${system.users} users`}
                        {system.storage && system.storage}
                        {system.zones && `${system.zones} zones`}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Details</p>
                      <p className="text-sm text-white">
                        {system.devices || system.analytics || system.integration}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs text-gray-500">Features:</p>
                    <div className="flex flex-wrap gap-2">
                      {system.features.map((feature, fIdx) => (
                        <Badge key={fIdx} variant="outline" className="text-xs border-[#2a2a2a]">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}