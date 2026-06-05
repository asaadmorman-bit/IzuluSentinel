import React, { useState, useEffect } from "react";
import { TeamMember } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Shield, MapPin, Phone, Mail, Clock } from "lucide-react";
import { format } from "date-fns";

import TeamMemberCard from "../components/team/TeamMemberCard";
import TeamMemberDetailModal from "../components/team/TeamMemberDetailModal";
import AddTeamMemberModal from "../components/team/AddTeamMemberModal";

export default function Team() {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setIsLoading(true);
    const data = await TeamMember.list("-last_check_in");
    setMembers(data);
    setIsLoading(false);
  };

  const handleMemberAdded = () => {
    setShowAddModal(false);
    loadMembers();
  };

  const activeMembers = members.filter(m => m.status === "active" || m.status === "on_mission");
  const onMission = members.filter(m => m.status === "on_mission");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Users className="w-8 h-8 text-orange-500" />
              Team Management
            </h1>
            <p className="text-slate-400">Personnel tracking and coordination</p>
          </div>
          <Button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Team Member
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Personnel</p>
                  <p className="text-3xl font-bold text-white">{members.length}</p>
                </div>
                <Users className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-emerald-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Active/Available</p>
                  <p className="text-3xl font-bold text-white">{activeMembers.length}</p>
                </div>
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">On Mission</p>
                  <p className="text-3xl font-bold text-white">{onMission.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <TeamMemberCard
                key={member.id}
                member={member}
                onClick={() => setSelectedMember(member)}
              />
            ))}
          </div>
        )}

        {!isLoading && members.length === 0 && (
          <Card className="border-orange-500/20 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-4">No team members added</p>
              <Button
                onClick={() => setShowAddModal(true)}
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                Add Your First Team Member
              </Button>
            </CardContent>
          </Card>
        )}

        <TeamMemberDetailModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
        />

        <AddTeamMemberModal
          open={showAddModal}
          onClose={() => setShowAddModal(false)}
          onMemberAdded={handleMemberAdded}
        />
      </div>
    </div>
  );
}