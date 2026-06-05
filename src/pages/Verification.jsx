import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Shield, Mail, Smartphone, Lock } from "lucide-react";

export default function Verification() {
  const [verificationMethod, setVerificationMethod] = useState("email");

  const verificationMethods = [
    {
      id: "email",
      name: "Email Verification",
      icon: Mail,
      description: "Verify via email link",
      status: "verified"
    },
    {
      id: "phone",
      name: "Phone Verification",
      icon: Smartphone,
      description: "SMS verification code",
      status: "pending"
    },
    {
      id: "2fa",
      name: "Two-Factor Auth",
      icon: Lock,
      description: "Authenticator app",
      status: "not_configured"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <CheckSquare className="w-8 h-8 text-[#DC2626]" />
            Account Verification
          </h1>
          <p className="text-gray-400">Secure your account with multi-factor verification</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-white">Verification Status</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {verificationMethods.map((method) => (
              <div key={method.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-[#DC2626]/20 rounded-lg">
                      <method.icon className="w-5 h-5 text-[#DC2626]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white mb-1">{method.name}</h3>
                      <p className="text-sm text-gray-400">{method.description}</p>
                    </div>
                  </div>
                  <Badge className={
                    method.status === "verified"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : method.status === "pending"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-gray-500/20 text-gray-400"
                  }>
                    {method.status.replace('_', ' ')}
                  </Badge>
                </div>
                {method.status !== "verified" && (
                  <Button 
                    className="mt-3 bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                    size="sm"
                    onClick={() => setVerificationMethod(method.id)}
                  >
                    Configure
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {verificationMethod === "phone" && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Phone Verification</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white mb-2 block">Phone Number</Label>
                <Input 
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                Send Verification Code
              </Button>
            </CardContent>
          </Card>
        )}

        {verificationMethod === "2fa" && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300">
                Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
              </p>
              <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center">
                <p className="text-gray-800 text-sm">QR Code Placeholder</p>
              </div>
              <div>
                <Label className="text-white mb-2 block">Verification Code</Label>
                <Input 
                  type="text"
                  placeholder="Enter 6-digit code"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                Enable 2FA
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}