import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MapPin, Users, FileText, AlertTriangle, Calendar } from "lucide-react";
import { Incident, Asset, TravelRoute, IntelligenceReport, TeamMember } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function AdvancedSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedType, setSelectedType] = useState("all");

  const searchTypes = [
    { id: "all", name: "All", icon: Search },
    { id: "incidents", name: "Incidents", icon: AlertTriangle },
    { id: "assets", name: "Assets", icon: Users },
    { id: "routes", name: "Routes", icon: MapPin },
    { id: "reports", name: "Reports", icon: FileText },
    { id: "team", name: "Team", icon: Users }
  ];

  const performSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    const allResults = [];

    try {
      if (selectedType === "all" || selectedType === "incidents") {
        const incidents = await Incident.list("-created_date", 50);
        const filtered = incidents.filter(i =>
          i.title?.toLowerCase().includes(query.toLowerCase()) ||
          i.description?.toLowerCase().includes(query.toLowerCase()) ||
          i.location_name?.toLowerCase().includes(query.toLowerCase())
        );
        allResults.push(...filtered.map(r => ({ ...r, type: "incident" })));
      }

      if (selectedType === "all" || selectedType === "assets") {
        const assets = await Asset.list("-last_check_in", 50);
        const filtered = assets.filter(a =>
          a.name?.toLowerCase().includes(query.toLowerCase()) ||
          a.current_location?.toLowerCase().includes(query.toLowerCase())
        );
        allResults.push(...filtered.map(r => ({ ...r, type: "asset" })));
      }

      if (selectedType === "all" || selectedType === "routes") {
        const routes = await TravelRoute.list("-departure_time", 50);
        const filtered = routes.filter(r =>
          r.name?.toLowerCase().includes(query.toLowerCase()) ||
          r.start_location?.toLowerCase().includes(query.toLowerCase()) ||
          r.end_location?.toLowerCase().includes(query.toLowerCase())
        );
        allResults.push(...filtered.map(r => ({ ...r, type: "route" })));
      }

      if (selectedType === "all" || selectedType === "reports") {
        const reports = await IntelligenceReport.list("-report_date", 50);
        const filtered = reports.filter(r =>
          r.title?.toLowerCase().includes(query.toLowerCase()) ||
          r.content?.toLowerCase().includes(query.toLowerCase())
        );
        allResults.push(...filtered.map(r => ({ ...r, type: "report" })));
      }

      if (selectedType === "all" || selectedType === "team") {
        const team = await TeamMember.list("-last_check_in", 50);
        const filtered = team.filter(t =>
          t.full_name?.toLowerCase().includes(query.toLowerCase()) ||
          t.role?.toLowerCase().includes(query.toLowerCase())
        );
        allResults.push(...filtered.map(r => ({ ...r, type: "team" })));
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
    }

    setIsSearching(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      performSearch();
    }
  };

  const getResultIcon = (type) => {
    switch (type) {
      case "incident":
        return <AlertTriangle className="w-5 h-5 text-[#DC2626]" />;
      case "asset":
        return <Users className="w-5 h-5 text-cyan-500" />;
      case "route":
        return <MapPin className="w-5 h-5 text-purple-500" />;
      case "report":
        return <FileText className="w-5 h-5 text-emerald-500" />;
      case "team":
        return <Users className="w-5 h-5 text-amber-500" />;
      default:
        return <Search className="w-5 h-5 text-gray-400" />;
    }
  };

  const handleResultClick = (result) => {
    switch (result.type) {
      case "incident":
        navigate(createPageUrl("Incidents"));
        break;
      case "asset":
        navigate(createPageUrl("Dashboard"));
        break;
      case "route":
        navigate(createPageUrl("Routes"));
        break;
      case "report":
        navigate(createPageUrl("Intelligence"));
        break;
      case "team":
        navigate(createPageUrl("Team"));
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Search className="w-8 h-8 text-[#DC2626]" />
            Advanced Search
          </h1>
          <p className="text-gray-400">Search across all entities and records</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  placeholder="Search everything..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white h-12"
                />
              </div>
              <Button
                onClick={performSearch}
                disabled={isSearching || !query.trim()}
                className="bg-[#DC2626] hover:bg-[#B91C1C] h-12 px-8"
              >
                {isSearching ? "Searching..." : "Search"}
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {searchTypes.map((type) => (
                <Button
                  key={type.id}
                  variant={selectedType === type.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type.id)}
                  className={selectedType === type.id ? "bg-[#DC2626] hover:bg-[#B91C1C]" : "border-[#2a2a2a] text-gray-400"}
                >
                  <type.icon className="w-4 h-4 mr-2" />
                  {type.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {results.length > 0 && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">
                Search Results ({results.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {results.map((result, index) => (
                <div
                  key={index}
                  onClick={() => handleResultClick(result)}
                  className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    {getResultIcon(result.type)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white">
                          {result.title || result.name || result.full_name}
                        </h3>
                        <Badge variant="outline" className="text-xs capitalize">
                          {result.type}
                        </Badge>
                        {result.severity && (
                          <Badge className="bg-[#DC2626]/20 text-[#DC2626] text-xs">
                            {result.severity}
                          </Badge>
                        )}
                        {result.status && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                            {result.status}
                          </Badge>
                        )}
                      </div>
                      {(result.description || result.current_location) && (
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {result.description || result.current_location}
                        </p>
                      )}
                      {result.location_name && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {result.location_name}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {results.length === 0 && query && !isSearching && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No results found for "{query}"</p>
              <p className="text-gray-500 text-sm mt-2">
                Try different keywords or adjust your search filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}