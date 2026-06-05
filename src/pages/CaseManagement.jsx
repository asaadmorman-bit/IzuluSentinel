
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Case } from "@/entities/Case";
import { Evidence } from "@/entities/Evidence";
import { FileText, Plus, Search, Filter, X } from "lucide-react";
import { format } from "date-fns";

export default function CaseManagement() {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedCase, setSelectedCase] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCases();
  }, []);

  const loadCases = async () => {
    setIsLoading(true);
    const data = await Case.list("-created_date");
    setCases(data);
    setIsLoading(false);
  };

  const filterCases = useCallback(() => {
    let filtered = [...cases];

    if (searchQuery) {
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.case_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter(c => c.status === statusFilter);
    }

    if (priorityFilter !== "all") {
      filtered = filtered.filter(c => c.priority === priorityFilter);
    }

    setFilteredCases(filtered);
  }, [cases, searchQuery, statusFilter, priorityFilter]);

  useEffect(() => {
    filterCases();
  }, [filterCases]); // Now depends on the memoized filterCases function

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <FileText className="w-8 h-8 text-[#DC2626]" />
              Case Management
            </h1>
            <p className="text-gray-400">Manage investigations and case files</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search cases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-full md:w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priority</SelectItem>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="urgent">Urgent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-[#0f0f0f] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((case_) => (
              <Card 
                key={case_.id} 
                className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer"
                onClick={() => setSelectedCase(case_)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-white text-lg mb-1">{case_.title}</CardTitle>
                      <p className="text-sm text-gray-400">{case_.case_number}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Badge className={
                      case_.priority === "critical" || case_.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                      case_.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                      "bg-cyan-500/20 text-cyan-400"
                    }>
                      {case_.priority}
                    </Badge>
                    <Badge variant="outline" className="border-gray-700 text-gray-400 capitalize">
                      {case_.status}
                    </Badge>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {case_.lead_agency}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">{case_.description}</p>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Type:</span>
                      <span className="text-gray-300 capitalize">{case_.case_type?.replace(/_/g, ' ')}</span>
                    </div>
                    {case_.assigned_agents && case_.assigned_agents.length > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Agents:</span>
                        <span className="text-gray-300">{case_.assigned_agents.length}</span>
                      </div>
                    )}
                    {case_.created_date && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Opened:</span>
                        <span className="text-gray-300">{format(new Date(case_.created_date), 'MMM d, yyyy')}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredCases.length === 0 && (
          <div className="text-center py-20">
            <FileText className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No cases found</p>
          </div>
        )}

        {selectedCase && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedCase(null)}>
            <Card className="border-[#1a1a1a] bg-[#0a0a0a] max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="border-b border-[#1a1a1a]">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-white text-2xl mb-2">{selectedCase.title}</CardTitle>
                    <p className="text-gray-400">{selectedCase.case_number}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge className={
                        selectedCase.priority === "critical" || selectedCase.priority === "urgent" ? "bg-red-500/20 text-red-400" :
                        selectedCase.priority === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-cyan-500/20 text-cyan-400"
                      }>
                        {selectedCase.priority}
                      </Badge>
                      <Badge variant="outline" className="border-gray-700 text-gray-400 capitalize">
                        {selectedCase.status}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {selectedCase.lead_agency}
                      </Badge>
                      <Badge className="bg-amber-500/20 text-amber-400 capitalize">
                        {selectedCase.classification?.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedCase(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6 p-6">
                <div>
                  <h3 className="font-bold text-white mb-2">Description</h3>
                  <p className="text-gray-300">{selectedCase.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Case Type</p>
                    <p className="text-white font-medium capitalize">{selectedCase.case_type?.replace(/_/g, ' ')}</p>
                  </div>

                  <div className="p-3 bg-[#1a1a1a] rounded-lg">
                    <p className="text-xs text-gray-400 mb-1">Lead Agency</p>
                    <p className="text-white font-medium uppercase">{selectedCase.lead_agency}</p>
                  </div>

                  {selectedCase.location && (
                    <div className="p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Location</p>
                      <p className="text-white font-medium">{selectedCase.location}</p>
                    </div>
                  )}

                  {selectedCase.opened_date && (
                    <div className="p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-xs text-gray-400 mb-1">Opened Date</p>
                      <p className="text-white font-medium">{format(new Date(selectedCase.opened_date), 'MMM d, yyyy HH:mm')}</p>
                    </div>
                  )}
                </div>

                {selectedCase.assigned_agents && selectedCase.assigned_agents.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-3">Assigned Agents</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.assigned_agents.map((agent, idx) => (
                        <Badge key={idx} variant="outline" className="border-gray-700 text-gray-300">
                          {agent}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCase.assisting_agencies && selectedCase.assisting_agencies.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-3">Assisting Agencies</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedCase.assisting_agencies.map((agency, idx) => (
                        <Badge key={idx} className="bg-emerald-500/20 text-emerald-400">
                          {agency}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCase.suspects && selectedCase.suspects.length > 0 && (
                  <div>
                    <h3 className="font-bold text-white mb-3">Suspects</h3>
                    <div className="space-y-2">
                      {selectedCase.suspects.map((suspect, idx) => (
                        <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg">
                          <p className="font-semibold text-white">{suspect.name}</p>
                          {suspect.alias && <p className="text-sm text-gray-400">Alias: {suspect.alias}</p>}
                          {suspect.description && <p className="text-sm text-gray-300 mt-1">{suspect.description}</p>}
                          {suspect.status && (
                            <Badge className="mt-2 bg-amber-500/20 text-amber-400">{suspect.status}</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedCase.notes && (
                  <div>
                    <h3 className="font-bold text-white mb-2">Notes</h3>
                    <div className="p-4 bg-[#1a1a1a] rounded-lg">
                      <p className="text-gray-300 whitespace-pre-wrap">{selectedCase.notes}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
