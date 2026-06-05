
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Added from outline
import { LawEnforcementUnit } from "@/entities/LawEnforcementUnit"; // Updated from outline
import { Case } from "@/entities/Case"; // Updated from outline
import { Incident } from "@/entities/Incident"; // Added from outline (not used in current code but included as per outline)
import { Dispatch } from "@/entities/Dispatch"; // Added for consistency, as Dispatch was previously from entities/all and is used
import { Evidence } from "@/entities/Evidence"; // Added for consistency, as Evidence was previously from entities/all and is used
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
// Combined lucide-react imports: existing used icons + new ones from outline
import { Shield, FileText, Radio, Scale, AlertTriangle, Users, Activity, MapPin, Phone, Search } from "lucide-react";
import { format } from "date-fns"; // Added from outline

export default function LawEnforcement() {
  const [cases, setCases] = useState([]);
  const [units, setUnits] = useState([]);
  const [dispatches, setDispatches] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [casesData, unitsData, dispatchData, evidenceData] = await Promise.all([
        Case.list("-created_date", 20),
        LawEnforcementUnit.list("-last_check_in", 20),
        Dispatch.list("-created_date", 20),
        Evidence.list("-created_date", 10)
      ]);
      setCases(casesData);
      setUnits(unitsData);
      setDispatches(dispatchData);
      setEvidence(evidenceData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const activeCases = cases.filter(c => c.status === "active" || c.status === "open");
  const activeDispatches = dispatches.filter(d => d.status === "dispatched" || d.status === "en_route" || d.status === "on_scene");
  const availableUnits = units.filter(u => u.status === "available" || u.status === "on_duty");
  const criticalCases = cases.filter(c => c.priority === "critical" || c.priority === "urgent");

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#DC2626]" />
            Law Enforcement Command Center
          </h1>
          <p className="text-gray-400">Federal, State & Local Law Enforcement Operations</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Cases</p>
                  <p className="text-3xl font-bold text-white">{activeCases.length}</p>
                </div>
                <FileText className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Dispatches</p>
                  <p className="text-3xl font-bold text-white">{activeDispatches.length}</p>
                </div>
                <Radio className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Available Units</p>
                  <p className="text-3xl font-bold text-white">{availableUnits.length}</p>
                </div>
                <Users className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Evidence Items</p>
                  <p className="text-3xl font-bold text-white">{evidence.length}</p>
                </div>
                <Scale className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {criticalCases.length > 0 && (
          <Card className="border-[#DC2626]/30 bg-[#DC2626]/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                Critical Cases ({criticalCases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {criticalCases.map((case_) => (
                  <div key={case_.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-bold text-white">{case_.title}</h3>
                        <p className="text-sm text-gray-400">{case_.case_number}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className="bg-[#DC2626] text-white">{case_.priority}</Badge>
                        <Badge className="bg-cyan-500/20 text-cyan-400">{case_.lead_agency}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{case_.description}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                        {case_.case_type?.replace(/_/g, ' ')}
                      </Badge>
                      {case_.assigned_agents && case_.assigned_agents.length > 0 && (
                        <Badge variant="outline" className="text-xs border-gray-700 text-gray-400">
                          {case_.assigned_agents.length} agents assigned
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Radio className="w-5 h-5" />
                  Active Dispatches
                </CardTitle>
                <Link to={createPageUrl("DispatchCenter")}>
                  <Button size="sm" variant="outline" className="border-[#2a2a2a] text-gray-300">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {activeDispatches.slice(0, 5).map((dispatch) => (
                  <div key={dispatch.id} className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-white text-sm">{dispatch.call_number}</h4>
                        <p className="text-xs text-gray-400">{dispatch.location}</p>
                      </div>
                      <Badge className={
                        dispatch.priority === "priority_1" ? "bg-red-500/20 text-red-400" :
                        dispatch.priority === "priority_2" ? "bg-orange-500/20 text-orange-400" :
                        "bg-yellow-500/20 text-yellow-400"
                      }>
                        {dispatch.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300 mb-2">{dispatch.description}</p>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{dispatch.call_type?.replace(/_/g, ' ')}</span>
                      <span className="text-gray-500">{dispatch.units_assigned?.length || 0} units</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Unit Status
                </CardTitle>
                <Link to={createPageUrl("UnitTracking")}>
                  <Button size="sm" variant="outline" className="border-[#2a2a2a] text-gray-300">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {units.slice(0, 6).map((unit) => (
                  <div key={unit.id} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded">
                    <div>
                      <p className="text-white text-sm font-medium">{unit.unit_name}</p>
                      <p className="text-xs text-gray-400">{unit.agency} - {unit.unit_type?.replace(/_/g, ' ')}</p>
                    </div>
                    <Badge className={
                      unit.status === "available" ? "bg-emerald-500/20 text-emerald-400" :
                      unit.status === "dispatched" ? "bg-amber-500/20 text-amber-400" :
                      unit.status === "on_scene" ? "bg-red-500/20 text-red-400" :
                      "bg-gray-500/20 text-gray-400"
                    }>
                      {unit.status?.replace(/_/g, ' ')}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Link to={createPageUrl("CaseManagement")} className="block">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <FileText className="w-12 h-12 text-cyan-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Case Management</h3>
                <p className="text-gray-400">Manage investigations, suspects, and case files</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("EvidenceTracking")} className="block">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <Scale className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Evidence Tracking</h3>
                <p className="text-gray-400">Chain of custody and evidence management</p>
              </CardContent>
            </Card>
          </Link>

          <Link to={createPageUrl("InterAgencyCoordination")} className="block">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors cursor-pointer h-full">
              <CardContent className="p-6">
                <Activity className="w-12 h-12 text-emerald-500 mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Inter-Agency Coordination</h3>
                <p className="text-gray-400">Collaborate with federal, state, and local agencies</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
