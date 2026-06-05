import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Filter, X, Save } from "lucide-react";

export default function AdvancedFilters({ onApply, onReset }) {
  const [filters, setFilters] = useState({
    dateRange: "all",
    severity: "all",
    status: "all",
    threatType: "all",
    radiusKm: [0, 100],
    verified: "all",
    keywords: ""
  });

  const [savedFilters, setSavedFilters] = useState([]);

  const handleApply = () => {
    onApply(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: "all",
      severity: "all",
      status: "all",
      threatType: "all",
      radiusKm: [0, 100],
      verified: "all",
      keywords: ""
    };
    setFilters(resetFilters);
    onReset();
  };

  const saveCurrentFilter = () => {
    const filterName = prompt("Name this filter preset:");
    if (filterName) {
      setSavedFilters([...savedFilters, { name: filterName, filters: {...filters} }]);
    }
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white text-sm flex items-center gap-2">
          <Filter className="w-4 h-4" />
          Advanced Filters
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-xs text-gray-400 mb-2 block">Keywords</label>
          <Input
            placeholder="Search in title, description..."
            value={filters.keywords}
            onChange={(e) => setFilters({...filters, keywords: e.target.value})}
            className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Date Range</label>
          <Select value={filters.dateRange} onValueChange={(value) => setFilters({...filters, dateRange: value})}>
            <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Severity Level</label>
          <Select value={filters.severity} onValueChange={(value) => setFilters({...filters, severity: value})}>
            <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Threat Type</label>
          <Select value={filters.threatType} onValueChange={(value) => setFilters({...filters, threatType: value})}>
            <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="terrorism">Terrorism</SelectItem>
              <SelectItem value="civil_unrest">Civil Unrest</SelectItem>
              <SelectItem value="crime">Crime</SelectItem>
              <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              <SelectItem value="political">Political</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Affected Radius (km): {filters.radiusKm[0]} - {filters.radiusKm[1]}</label>
          <Slider
            value={filters.radiusKm}
            onValueChange={(value) => setFilters({...filters, radiusKm: value})}
            max={100}
            step={1}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-xs text-gray-400 mb-2 block">Verification Status</label>
          <Select value={filters.verified} onValueChange={(value) => setFilters({...filters, verified: value})}>
            <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="unverified">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleApply} className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C]">
            Apply Filters
          </Button>
          <Button onClick={handleReset} variant="outline" className="border-[#2a2a2a]">
            <X className="w-4 h-4" />
          </Button>
          <Button onClick={saveCurrentFilter} variant="outline" className="border-[#2a2a2a]">
            <Save className="w-4 h-4" />
          </Button>
        </div>

        {savedFilters.length > 0 && (
          <div className="pt-2 border-t border-[#2a2a2a]">
            <p className="text-xs text-gray-400 mb-2">Saved Filters:</p>
            <div className="space-y-1">
              {savedFilters.map((saved, idx) => (
                <Button
                  key={idx}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilters(saved.filters)}
                  className="w-full justify-start text-xs text-gray-300"
                >
                  {saved.name}
                </Button>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}