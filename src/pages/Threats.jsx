import React, { useState, useEffect, useCallback } from "react";
import { Incident } from "@/entities/all";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import ThreatCard from "../components/threats/ThreatCard";
import ThreatDetailModal from "../components/threats/ThreatDetailModal";

export default function Threats() {
  const [incidents, setIncidents] = useState([]);
  const [filteredIncidents, setFilteredIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState(null);

  useEffect(() => {
    loadIncidents();
  }, []);

  const filterIncidents = useCallback(() => {
    let filtered = [...incidents];

    if (searchQuery) {
      filtered = filtered.filter(i => 
        i.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        i.location_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(i => i.status === statusFilter);
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter(i => i.severity === severityFilter);
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(i => i.threat_type === typeFilter);
    }

    setFilteredIncidents(filtered);
  }, [incidents, searchQuery, statusFilter, severityFilter, typeFilter]);

  useEffect(() => {
    filterIncidents();
  }, [filterIncidents]);

  const loadIncidents = async () => {
    setIsLoading(true);
    const data = await Incident.list("-created_date");
    setIncidents(data);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Threat Intelligence Database
          </h1>
          <p className="text-slate-400">Comprehensive threat tracking and analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search threats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900/50 border-slate-800 text-white placeholder:text-slate-500"
            />
          </div>
          
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white">
              <SelectValue placeholder="Threat Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="civil_unrest">Civil Unrest</SelectItem>
              <SelectItem value="terrorism">Terrorism</SelectItem>
              <SelectItem value="crime">Crime</SelectItem>
              <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
              <SelectItem value="health">Health</SelectItem>
              <SelectItem value="cybersecurity">Cybersecurity</SelectItem>
              <SelectItem value="political">Political</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="bg-slate-900/50 border-slate-800 text-white">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severity</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredIncidents.map((incident) => (
              <ThreatCard
                key={incident.id}
                incident={incident}
                onClick={() => setSelectedIncident(incident)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredIncidents.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-400 text-lg">No threats found</p>
          </div>
        )}

        <ThreatDetailModal
          incident={selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      </div>
    </div>
  );
}