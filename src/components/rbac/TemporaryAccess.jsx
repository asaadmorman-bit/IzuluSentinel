import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Clock, Plus } from "lucide-react";
import { format, addHours, addDays } from "date-fns";

export default function TemporaryAccess({ users, currentUser, isAdmin }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newGrant, setNewGrant] = useState({
    user_id: "",
    elevated_role: "command_staff",
    duration_hours: 24,
    reason: ""
  });

  const { data: tempAccess = [] } = useQuery({
    queryKey: ['temp_access'],
    queryFn: () => base44.entities.TemporaryAccess.list("-created_date", 50),
    enabled: isAdmin
  });

  const createAccessMutation = useMutation({
    mutationFn: (accessData) => {
      const expiresAt = addHours(new Date(), accessData.duration_hours);
      return base44.entities.TemporaryAccess.create({
        ...accessData,
        granted_by: currentUser.email,
        expires_at: expiresAt.toISOString(),
        status: "active"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temp_access'] });
      setShowCreateForm(false);
      setNewGrant({
        user_id: "",
        elevated_role: "command_staff",
        duration_hours: 24,
        reason: ""
      });
    }
  });

  const revokeAccessMutation = useMutation({
    mutationFn: (accessId) =>
      base44.entities.TemporaryAccess.update(accessId, {
        status: "revoked",
        revoked_by: currentUser.email,
        revoked_at: new Date().toISOString()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['temp_access'] });
    }
  });

  if (!isAdmin) {
    return (
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-12 text-center">
          <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Admin Only</h3>
          <p className="text-gray-400">Temporary access management requires administrator privileges</p>
        </CardContent>
      </Card>
    );
  }

  const activeAccess = tempAccess.filter(a => a.status === "active" && new Date(a.expires_at) > new Date());
  const expiredAccess = tempAccess.filter(a => a.status === "active" && new Date(a.expires_at) <= new Date());

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Temporary Elevated Access
          </CardTitle>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Grant Access
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <p className="text-sm text-gray-400">
            Grant temporary elevated permissions for specific time periods. Access automatically expires and is fully audited.
          </p>
        </div>

        {showCreateForm && (
          <div className="p-4 bg-[#1a1a1a] rounded-lg">
            <h4 className="font-semibold text-white mb-4">Grant Temporary Access</h4>
            <div className="grid gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Select User</label>
                <Select
                  value={newGrant.user_id}
                  onValueChange={(value) => setNewGrant({ ...newGrant, user_id: value })}
                >
                  <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                    <SelectValue placeholder="Choose user..." />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.full_name} - {user.role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Elevated Role</label>
                  <Select
                    value={newGrant.elevated_role}
                    onValueChange={(value) => setNewGrant({ ...newGrant, elevated_role: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="command_staff">Command Staff</SelectItem>
                      <SelectItem value="soc_analyst">SOC Analyst</SelectItem>
                      <SelectItem value="admin">Administrator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Duration (hours)</label>
                  <Input
                    type="number"
                    value={newGrant.duration_hours}
                    onChange={(e) => setNewGrant({ ...newGrant, duration_hours: parseInt(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Reason</label>
                <Input
                  value={newGrant.reason}
                  onChange={(e) => setNewGrant({ ...newGrant, reason: e.target.value })}
                  placeholder="e.g., Emergency incident response"
                  className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => createAccessMutation.mutate(newGrant)}
                disabled={!newGrant.user_id || !newGrant.reason}
                className="bg-[#DC2626] hover:bg-[#B91C1C]"
              >
                Grant Access
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateForm(false)}
                className="border-[#2a2a2a] text-white"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold text-white mb-3">Active Temporary Access ({activeAccess.length})</h4>
          <div className="space-y-2">
            {activeAccess.map((access) => {
              const user = users.find(u => u.id === access.user_id);
              return (
                <Card key={access.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-semibold">{user?.full_name}</span>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {access.elevated_role?.replace(/_/g, " ")}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400 mb-1">{access.reason}</p>
                        <p className="text-xs text-gray-500">
                          Expires: {format(new Date(access.expires_at), "PPp")}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => revokeAccessMutation.mutate(access.id)}
                        className="border-red-500 text-red-400"
                      >
                        Revoke
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {activeAccess.length === 0 && (
              <div className="text-center py-6">
                <p className="text-gray-400">No active temporary access grants</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}