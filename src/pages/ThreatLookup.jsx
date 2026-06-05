import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, MapPin, Calendar, AlertCircle, Shield } from "lucide-react";

export default function ThreatLookup() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState(null);

  const handleSearch = () => {
    // Demo search results
    setSearchResults({
      location: searchQuery || "Johannesburg, South Africa",
      threats: [
        {
          type: "Crime - Vehicle Hijacking",
          severity: "high",
          date: "2024-01-15",
          area: "Sandton CBD",
          description: "Increased vehicle hijacking incidents reported in business district",
          verified: true
        },
        {
          type: "Civil Unrest",
          severity: "medium",
          date: "2024-01-12",
          area: "Central Johannesburg",
          description: "Planned protest march scheduled for Friday afternoon",
          verified: true
        },
        {
          type: "Infrastructure",
          severity: "low",
          date: "2024-01-10",
          area: "Rosebank",
          description: "Power outages affecting commercial areas",
          verified: false
        }
      ],
      riskScore: 65,
      recommendation: "Exercise elevated caution. Avoid CBD areas during peak hours. Use secure transportation."
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Search className="w-8 h-8 text-[#DC2626]" />
            Threat Lookup
          </h1>
          <p className="text-gray-400">Search for threats by location, type, or keyword</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Enter location (e.g., Lagos, Nigeria)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>
              <Button 
                onClick={handleSearch}
                className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8"
              >
                Search
              </Button>
            </div>
          </CardContent>
        </Card>

        {searchResults && (
          <>
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-[#DC2626]" />
                    <h2 className="text-xl font-bold text-white">{searchResults.location}</h2>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-gray-400">Risk Score</p>
                      <p className="text-2xl font-bold text-amber-500">{searchResults.riskScore}/100</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <div className="flex items-start gap-2">
                    <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-amber-400 mb-1">Security Recommendation</p>
                      <p className="text-sm text-gray-300">{searchResults.recommendation}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Identified Threats ({searchResults.threats.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {searchResults.threats.map((threat, idx) => (
                  <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white">{threat.type}</h3>
                          {threat.verified && (
                            <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                              Verified
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {threat.area}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {threat.date}
                          </span>
                        </div>
                      </div>
                      <Badge className={
                        threat.severity === "high"
                          ? "bg-red-500/20 text-red-400"
                          : threat.severity === "medium"
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-blue-500/20 text-blue-400"
                      }>
                        {threat.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{threat.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}

        {!searchResults && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Start Your Threat Search</h3>
              <p className="text-gray-400">Enter a location to discover active threats and security concerns</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}