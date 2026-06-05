import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Plus, 
  Search, 
  Filter,
  MapPin,
  Clock,
  User,
  ChevronRight,
  TrendingUp,
  Shield
} from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import IncidentDetailModal from "../components/incidents/IncidentDetailModal";
import ExportButton from "../components/shared/ExportButton";

export default function Incidents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIncident, setSelectedIncident] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => base44.entities.Incident.list('-created_date', 200),
    refetchInterval: 30000 // Refresh every 30 seconds
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const updateIncidentMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Incident.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['incidents']);
    }
  });

  const filteredIncidents = incidents.filter(incident => {
    const matchesSearch = !searchTerm || 
      incident.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.location_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || incident.severity === severityFilter;
    const matchesStatus = statusFilter === "all" || incident.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400 border-red-500/30";
      case "monitoring": return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "contained": return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "resolved": return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default: return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const stats = {
    total: incidents.length,
    active: incidents.filter(i => i.status === "active").length,
    critical: incidents.filter(i => i.severity === "critical").length,
    resolved24h: incidents.filter(i => 
      i.status === "resolved" && 
      new Date(i.updated_date) > new Date(Date.now() - 24 * 60 * 60 * 1000)
    ).length
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading incidents..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
              Incident Management
            </h1>
            <p className="text-sm text-gray-400">
              Track and manage security incidents across all assets
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton data={filteredIncidents} filename="incidents" />
            <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
              <Plus className="w-4 h-4 mr-2" />
              New Incident
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Total Incidents</p>
                  <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-gray-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Active Now</p>
                  <p className="text-2xl font-bold text-red-400 mt-1">{stats.active}</p>
                </div>
                <Shield className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Critical</p>
                  <p className="text-2xl font-bold text-orange-400 mt-1">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">Resolved (24h)</p>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">{stats.resolved24h}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search incidents..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-[#0a0a0a] border-[#2a2a2a] text-white"
                />
              </div>
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#0a0a0a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40 bg-[#0a0a0a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="monitoring">Monitoring</SelectItem>
                  <SelectItem value="contained">Contained</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Incidents List */}
        <div className="space-y-3">
          {filteredIncidents.length === 0 ? (
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-12 text-center">
                <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No incidents found</p>
              </CardContent>
            </Card>
          ) : (
            filteredIncidents.map((incident) => (
              <Card 
                key={incident.id} 
                className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all cursor-pointer group"
                onClick={() => setSelectedIncident(incident)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityColor(incident.severity)}>
                          {incident.severity}
                        </Badge>
                        <Badge className={getStatusColor(incident.status)}>
                          {incident.status}
                        </Badge>
                        {incident.verified && (
                          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                            Verified
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#DC2626] transition-colors">
                        {incident.title}
                      </h3>
                      
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                        {incident.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                        {incident.location_name && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {incident.location_name}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(incident.created_date), "MMM d, yyyy HH:mm")}
                        </div>
                        {incident.source && (
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {incident.source}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Detail Modal */}
        <IncidentDetailModal 
          incident={selectedIncident}
          open={!!selectedIncident}
          onClose={() => setSelectedIncident(null)}
        />
      </div>
    </div>
  );
}