import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, User as UserIcon, Mail, Shield } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
    } catch (error) {
      console.error("Error loading user:", error);
    }
    setIsLoading(false);
  };

  const handleLogout = async () => {
    await User.logout();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#DC2626]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            User Profile
          </h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Account Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-[#DC2626] to-[#B91C1C] rounded-full flex items-center justify-center">
                <UserIcon className="w-10 h-10 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{user?.full_name || "User"}</h2>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="text-white font-medium">{user?.email}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Shield className="w-4 h-4" />
                  Account Role
                </div>
                <p className="text-white font-medium capitalize">{user?.role || "user"}</p>
              </div>
            </div>

            <div className="pt-6 border-t border-[#1a1a1a]">
              <Button
                onClick={handleLogout}
                variant="destructive"
                className="gap-2 bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">About Izulu Sentinel</CardTitle>
          </CardHeader>
          <CardContent className="text-gray-300 space-y-4">
            <p>
              Izulu Sentinel is an enterprise-grade protection intelligence platform that provides 
              real-time threat monitoring, risk assessment, and security operations management 
              for organizations requiring advanced physical security capabilities.
            </p>
            <p>
              Our platform integrates AI-powered threat prediction, social media intelligence (SOCMINT), 
              route planning, and comprehensive situational awareness to keep your assets, personnel, 
              and operations secure.
            </p>
            <div className="pt-4 flex items-center justify-between border-t border-[#1a1a1a]">
              <div className="text-sm text-gray-400">
                © 2024 Izulu Sentinel. All rights reserved.
              </div>
              <a 
                href="https://izulusentinel.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-[#DC2626] hover:text-[#B91C1C] transition-colors"
              >
                izulusentinel.com
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}