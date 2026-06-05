import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Search, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";

export default function BlockchainIntel() {
  const [address, setAddress] = useState("");

  const monitoredWallets = [
    {
      address: "0x742d...35a3",
      label: "Suspicious Actor 1",
      balance: "247.5 ETH",
      transactions: 1453,
      riskScore: 87,
      lastActivity: "2 hours ago"
    },
    {
      address: "0x8f3a...92b1",
      label: "Known Threat Group",
      balance: "12.3 BTC",
      transactions: 892,
      riskScore: 94,
      lastActivity: "1 day ago"
    },
    {
      address: "0x1c7e...44f8",
      label: "Ransomware Wallet",
      balance: "531.2 ETH",
      transactions: 2341,
      riskScore: 98,
      lastActivity: "5 hours ago"
    }
  ];

  const recentTransactions = [
    {
      hash: "0xab34...cd12",
      from: "0x742d...35a3",
      to: "0x8f3a...92b1",
      amount: "15.5 ETH",
      timestamp: "10 minutes ago",
      flagged: true
    },
    {
      hash: "0x9f21...8e44",
      from: "0x1c7e...44f8",
      to: "Exchange Wallet",
      amount: "50 ETH",
      timestamp: "1 hour ago",
      flagged: true
    },
    {
      hash: "0x5d88...3a91",
      from: "0x8f3a...92b1",
      to: "Mixer Service",
      amount: "0.8 BTC",
      timestamp: "3 hours ago",
      flagged: true
    }
  ];

  const blockchainStats = [
    { label: "Monitored Wallets", value: "1,247" },
    { label: "Flagged Transactions", value: "89" },
    { label: "Active Investigations", value: "12" },
    { label: "Total Value Tracked", value: "$2.3M" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Link2 className="w-8 h-8 text-[#DC2626]" />
            Blockchain Intelligence
          </h1>
          <p className="text-gray-400">Cryptocurrency transaction analysis and wallet tracking</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {blockchainStats.map((stat, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <p className="text-sm text-gray-400 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Enter wallet address or transaction hash..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8">
                Analyze
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Monitored Wallets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {monitoredWallets.map((wallet, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-sm text-cyan-400 font-mono">{wallet.address}</code>
                      <Badge variant="outline" className="text-xs">
                        {wallet.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">Last activity: {wallet.lastActivity}</p>
                  </div>
                  <Badge className={
                    wallet.riskScore >= 90 
                      ? "bg-red-500/20 text-red-400"
                      : wallet.riskScore >= 70
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }>
                    Risk: {wallet.riskScore}
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Balance</p>
                    <p className="text-white font-medium">{wallet.balance}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Transactions</p>
                    <p className="text-white font-medium">{wallet.transactions}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Risk Score</p>
                    <div className="w-full bg-[#2a2a2a] rounded-full h-2">
                      <div 
                        className="bg-[#DC2626] h-2 rounded-full"
                        style={{ width: `${wallet.riskScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
              Flagged Transactions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentTransactions.map((tx, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#DC2626]/30">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <code className="text-xs text-cyan-400 font-mono">{tx.hash}</code>
                    <p className="text-xs text-gray-400 mt-1">{tx.timestamp}</p>
                  </div>
                  {tx.flagged && (
                    <Badge className="bg-red-500/20 text-red-400">
                      Flagged
                    </Badge>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">From</p>
                    <code className="text-xs text-white font-mono">{tx.from}</code>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">To</p>
                    <code className="text-xs text-white font-mono">{tx.to}</code>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Amount</p>
                    <p className="text-white font-medium">{tx.amount}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}