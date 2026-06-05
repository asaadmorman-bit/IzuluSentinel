
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added
import { ProtectionDetail } from "@/entities/ProtectionDetail"; // Changed
import { SecurityPost } from "@/entities/SecurityPost"; // Changed
import { Asset } from "@/entities/Asset"; // Added
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Shield, Users, MapPin, Clock, Phone, Search, AlertTriangle } from "lucide-react"; // Updated icons
import { format } from "date-fns"; // Added

export default function PrivateSecurity() {
  const [protectionDetails, setProtectionDetails] = useState([]);
  const [securityPosts, setSecurityPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [detailsData, postsData] = await Promise.all([
        ProtectionDetail.list("-created_date", 20),
        SecurityPost.list("-created_date", 20)
      ]);
      setProtectionDetails(detailsData);
      setSecurityPosts(postsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const activeDetails = protectionDetails.filter(d => d.status === "active" || d.status === "in_transit");
  const criticalThreats = protectionDetails.filter(d => d.threat_level === "critical" || d.threat_level === "severe");
  const activePosts = securityPosts.filter(p => p.status === "active");
  const undermanned = securityPosts.filter(p => p.status === "undermanned");

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            Private Security Operations
          </h1>
          <p className="text-gray-400">Executive Protection & Security Guard Management</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Protection Details</p>
                  <p className="text-3xl font-bold text-white">{activeDetails.length}</p>
                </div>
                <Shield className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Threat Principals</p>
                  <p className="text-3xl font-bold text-white">{criticalThreats.length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Security Posts</p>
                  <p className="text-3xl font-bold text-white">{activePosts.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Undermanned Posts</p>
                  <p className="text-3xl font-bold text-white">{undermanned.length}</p>
                </div>
                <Users className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {criticalThreats.length > 0 && (
          <Card className="border-[#DC2626]/30 bg-[#DC2626]/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                High Threat Principals ({criticalThreats.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalThreats.map((detail) => (
                  <div key={detail.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white">{detail.principal}</h3>
                        <p className="text-sm text-gray-400">{detail.detail_name}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-[#DC2626] text-white">{detail.threat_level}</Badge>
                        <Badge className="bg-purple-500/20 text-purple-400">{detail.principal_type}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300">{detail.current_location || "Location unknown"}</span>
                    </div>
                    {detail.team_members && detail.team_members.length > 0 && (
                      <p className="text-xs text-gray-400 mt-2">{detail.team_members.length} team members assigned</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Executive Protection
                </CardTitle>
                <Link to={createPageUrl("ExecutiveProtection")}>
                  <Button size="sm" variant="outline" className="border-[#2a2a2a] text-gray-300">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {protectionDetails.slice(0, 5).map((detail) => (
                  <div key={detail.id} className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{detail.principal}</h4>
                        <p className="text-xs text-gray-400">{detail.protection_type?.replace(/_/g, ' ')}</p>
                      </div>
                      <Badge className={
                        detail.threat_level === "critical" || detail.threat_level === "severe" ? "bg-red-500/20 text-red-400" :
                        detail.threat_level === "substantial" ? "bg-orange-500/20 text-orange-400" :
                        "bg-cyan-500/20 text-cyan-400"
                      }>
                        {detail.threat_level}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{detail.current_location || "Unknown"}</span>
                      <span className="text-gray-500 capitalize">{detail.status?.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Security Posts
                </CardTitle>
                <Link to={createPageUrl("SecurityPostManagement")}>
                  <Button size="sm" variant="outline" className="border-[#2a2a2a] text-gray-300">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {securityPosts.slice(0, 6).map((post) => (
                  <div key={post.id} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded">
                    <div>
                      <p className="text-white text-sm font-medium">{post.post_name}</p>
                      <p className="text-xs text-gray-400">{post.facility || post.location}</p>
                    </div>
                    <Badge className={
                      post.status === "active" ? "bg-emerald-500/20 text-emerald-400" :
                      post.status === "undermanned" ? "bg-amber-500/20 text-amber-400" :
                      post.status === "emergency" ? "bg-red-500/20 text-red-400" :
                      "bg-gray-500/20 text-gray-400"
                    }>
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Link to={createPageUrl("ExecutiveProtection")} className="block">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Executive Protection</h3>
                <p className="text-gray-400">Close protection and VIP security operations</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("SecurityPostManagement")} className="block">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <MapPin className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Post Management</h3>
                <p className="text-gray-400">Manage security posts and guard schedules</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("GuardScheduling")} className="block">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <Clock className="w-12 h-12 text-purple-500 mb-4" /> {/* Changed icon from Calendar to Clock */}
                <h3 className="text-xl font-bold text-white mb-2">Guard Scheduling</h3>
                <p className="text-gray-400">Schedule and dispatch security personnel</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
