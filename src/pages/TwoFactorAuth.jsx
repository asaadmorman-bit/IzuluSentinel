import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { User } from "@/entities/User";
import { Shield, Smartphone, Key, CheckCircle, XCircle, Copy, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function TwoFactorAuth() {
  const [user, setUser] = useState(null);
  const [isEnabled, setIsEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [backupCodes, setBackupCodes] = useState([]);
  const [step, setStep] = useState("setup"); // setup, verify, enabled
  const [error, setError] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setIsEnabled(userData.two_factor_enabled || false);
      if (userData.two_factor_enabled) {
        setStep("enabled");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const generateSecret = () => {
    // Generate a random secret key
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < 32; i++) {
      secret += chars[Math.floor(Math.random() * chars.length)];
    }
    setSecretKey(secret);

    // Generate QR code URL (using Google Charts API for demo)
    const qrUrl = `https://chart.googleapis.com/chart?chs=200x200&cht=qr&chl=otpauth://totp/IzuluSentinel:${user?.email}?secret=${secret}&issuer=IzuluSentinel`;
    setQrCode(qrUrl);

    // Generate backup codes
    const codes = [];
    for (let i = 0; i < 8; i++) {
      codes.push(Math.random().toString(36).substring(2, 10).toUpperCase());
    }
    setBackupCodes(codes);
  };

  const verifyAndEnable = async () => {
    // In production, this would verify with backend
    if (verificationCode.length === 6) {
      try {
        await User.updateMyUserData({
          two_factor_enabled: true,
          two_factor_secret: secretKey,
          backup_codes: backupCodes
        });
        setIsEnabled(true);
        setStep("enabled");
        setError("");
      } catch (error) {
        setError("Failed to enable 2FA. Please try again.");
      }
    } else {
      setError("Please enter a valid 6-digit code");
    }
  };

  const disable2FA = async () => {
    try {
      await User.updateMyUserData({
        two_factor_enabled: false,
        two_factor_secret: null
      });
      setIsEnabled(false);
      setStep("setup");
      setQrCode("");
      setSecretKey("");
      setBackupCodes([]);
    } catch (error) {
      setError("Failed to disable 2FA");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            Two-Factor Authentication
          </h1>
          <p className="text-gray-400">Add an extra layer of security to your account</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                2FA Status
              </CardTitle>
              {isEnabled ? (
                <Badge className="bg-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Enabled
                </Badge>
              ) : (
                <Badge className="bg-amber-500/20 text-amber-400">
                  <XCircle className="w-3 h-3 mr-1" />
                  Disabled
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-500 bg-red-500/10">
                <AlertDescription className="text-red-400">{error}</AlertDescription>
              </Alert>
            )}

            {step === "setup" && !isEnabled && (
              <div className="space-y-6">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Why enable 2FA?</h3>
                  <ul className="text-gray-400 text-sm space-y-1 list-disc list-inside">
                    <li>Protect your account from unauthorized access</li>
                    <li>Required for accessing sensitive security data</li>
                    <li>Industry standard for enterprise security</li>
                    <li>Compliance with security regulations</li>
                  </ul>
                </div>

                <Button
                  onClick={generateSecret}
                  className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Set Up Two-Factor Authentication
                </Button>

                {qrCode && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="text-center">
                      <h3 className="font-semibold text-white mb-4">Step 1: Scan QR Code</h3>
                      <div className="bg-white p-4 rounded-lg inline-block">
                        <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                      </div>
                      <p className="text-gray-400 text-sm mt-4">
                        Scan this QR code with your authenticator app<br />
                        (Google Authenticator, Authy, Microsoft Authenticator)
                      </p>
                    </div>

                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">Manual Entry Key:</span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(secretKey)}
                          className="text-gray-400 hover:text-white"
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy
                        </Button>
                      </div>
                      <code className="text-white font-mono text-sm">{secretKey}</code>
                    </div>

                    <div>
                      <h3 className="font-semibold text-white mb-3">Step 2: Enter Verification Code</h3>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          maxLength={6}
                          className="bg-[#1a1a1a] border-[#2a2a2a] text-white text-center text-xl tracking-widest"
                        />
                        <Button
                          onClick={verifyAndEnable}
                          className="bg-emerald-500 hover:bg-emerald-600"
                          disabled={verificationCode.length !== 6}
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Verify & Enable
                        </Button>
                      </div>
                    </div>

                    {backupCodes.length > 0 && (
                      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <h3 className="font-semibold text-amber-400 mb-3 flex items-center gap-2">
                          <Key className="w-4 h-4" />
                          Backup Recovery Codes
                        </h3>
                        <p className="text-gray-400 text-sm mb-3">
                          Save these codes in a secure location. Each code can be used once if you lose access to your authenticator.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-3">
                          {backupCodes.map((code, idx) => (
                            <code key={idx} className="bg-[#1a1a1a] p-2 rounded text-white font-mono text-sm">
                              {code}
                            </code>
                          ))}
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(backupCodes.join('\n'))}
                          className="w-full border-amber-500/30 text-amber-400"
                        >
                          <Copy className="w-3 h-3 mr-2" />
                          Copy All Codes
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {step === "enabled" && isEnabled && (
              <div className="space-y-6">
                <Alert className="border-emerald-500 bg-emerald-500/10">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <AlertDescription className="text-emerald-400">
                    Two-factor authentication is currently enabled and protecting your account.
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-[#1a1a1a] bg-[#1a1a1a]">
                    <CardContent className="p-4">
                      <Smartphone className="w-8 h-8 text-cyan-400 mb-2" />
                      <h3 className="font-semibold text-white mb-1">Authenticator App</h3>
                      <p className="text-gray-400 text-sm">Active and working</p>
                    </CardContent>
                  </Card>

                  <Card className="border-[#1a1a1a] bg-[#1a1a1a]">
                    <CardContent className="p-4">
                      <Key className="w-8 h-8 text-amber-400 mb-2" />
                      <h3 className="font-semibold text-white mb-1">Backup Codes</h3>
                      <p className="text-gray-400 text-sm">8 codes available</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 border-[#2a2a2a] text-white"
                    onClick={() => {
                      setStep("setup");
                      generateSecret();
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate Codes
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                    onClick={disable2FA}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Disable 2FA
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white text-sm">Security Best Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-400">
            <div className="flex gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Use a trusted authenticator app like Google Authenticator or Authy</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Store backup codes in a secure location (password manager, safe)</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Never share your 2FA codes or backup codes with anyone</span>
            </div>
            <div className="flex gap-3">
              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>Regenerate backup codes if you suspect they've been compromised</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}