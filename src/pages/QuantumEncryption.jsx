import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Zap, CheckCircle2, AlertTriangle } from "lucide-react";

export default function QuantumEncryption() {
  const encryptionStats = [
    { label: "Quantum-Safe Channels", value: "47", icon: Shield },
    { label: "Keys Rotated (24h)", value: "1,247", icon: Lock },
    { label: "Encryption Strength", value: "Post-Quantum", icon: Zap },
    { label: "Compliance Status", value: "NSA Suite B", icon: CheckCircle2 }
  ];

  const features = [
    {
      title: "Lattice-Based Cryptography",
      description: "NIST-approved post-quantum algorithm resistant to quantum computer attacks",
      status: "active"
    },
    {
      title: "Quantum Key Distribution (QKD)",
      description: "Physics-based key exchange that detects eavesdropping attempts",
      status: "active"
    },
    {
      title: "Perfect Forward Secrecy",
      description: "Compromise of one session key doesn't affect past or future sessions",
      status: "active"
    },
    {
      title: "Homomorphic Encryption",
      description: "Process encrypted data without decrypting it first",
      status: "beta"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            Quantum-Safe Encryption
          </h1>
          <p className="text-gray-400">Post-quantum cryptography protecting against future quantum computer threats</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {encryptionStats.map((stat, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <stat.icon className="w-8 h-8 text-[#DC2626]" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Why Quantum-Safe Encryption?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-amber-500/50">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">The Quantum Threat</h3>
                  <p className="text-gray-300 text-sm">
                    Quantum computers will break current RSA and ECC encryption within the next 10-15 years. 
                    Adversaries are already harvesting encrypted data today to decrypt in the future ("harvest now, decrypt later" attacks).
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-emerald-500/50">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                <div>
                  <h3 className="text-white font-semibold mb-2">Our Solution</h3>
                  <p className="text-gray-300 text-sm">
                    Izulu Sentinel implements NIST-approved post-quantum cryptographic algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium) 
                    that are mathematically proven to be resistant to quantum computer attacks.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Post-Quantum Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {features.map((feature, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <Badge className={feature.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}>
                    {feature.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-300">{feature.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Compliance & Certifications</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "NSA Commercial National Security Algorithm Suite 2.0",
                "NIST Post-Quantum Cryptography Standards",
                "FIPS 140-3 Certified Modules",
                "Common Criteria EAL4+ Evaluated",
                "ISO/IEC 27001:2022 Compliant"
              ].map((cert, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300 text-sm">{cert}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Encryption Algorithms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { name: "CRYSTALS-Kyber", type: "Key Encapsulation" },
                { name: "CRYSTALS-Dilithium", type: "Digital Signatures" },
                { name: "SPHINCS+", type: "Stateless Hash-Based Signatures" },
                { name: "AES-256-GCM", type: "Symmetric Encryption" },
                { name: "ChaCha20-Poly1305", type: "Stream Cipher" }
              ].map((algo, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg">
                  <p className="text-white font-medium">{algo.name}</p>
                  <p className="text-xs text-gray-400">{algo.type}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}