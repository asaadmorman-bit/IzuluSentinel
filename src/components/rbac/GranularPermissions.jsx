import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Settings, Shield } from "lucide-react";

export default function GranularPermissions({ users, currentUser, isAdmin }) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);

  const permissions = [
    { key: "view_threats", label: "View Threats", category: "Intelligence" },
    { key: "create_incidents", label: "Create Incidents", category: "Operations" },
    { key: "manage_assets", label: "Manage Assets", category: "Assets" },
    { key: "generate_reports", label: "Generate Reports", category: "Reporting" },
    { key: "manage_geofence", label: "Manage Geofences", category: "Security" },
    { key: "approve_responses", label: "Approve Responses", category: "Response" },
    { key: "access_ai_analyst", label: "Access AI Analyst", category: "AI Tools" },
    { key: "manage_team", label: "Manage Team", category: "Administration" }
  ];

  const updatePermissionMutation = useMutation({
    mutationFn: ({ userId, permissions }) =>
      base44.entities.User.update(userId, { custom_permissions: permissions }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users_rbac'] });
    }
  });

  if (!isAdmin) {
    return (
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardContent className="p-12 text-center">
          <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">Admin Only</h3>
          <p className="text-gray-400">Granular permission management requires administrator privileges</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Granular Permissions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-gray-400">
            Configure fine-grained permissions for individual users beyond their base role. Changes take effect immediately.
          </p>
        </div>

        <div>
          <label className="text-sm text-gray-400 mb-2 block">Select User</label>
          <Select
            value={selectedUser?.id || ""}
            onValueChange={(userId) => setSelectedUser(users.find(u => u.id === userId))}
          >
            <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Choose a user..." />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name} ({user.email})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedUser && (
          <div className="p-4 bg-[#1a1a1a] rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-white">{selectedUser.full_name}</h4>
                <p className="text-sm text-gray-400">Base Role: {selectedUser.role?.replace(/_/g, " ")}</p>
              </div>
              <Badge className="bg-cyan-500/20 text-cyan-400">
                Custom Permissions
              </Badge>
            </div>

            <div className="space-y-3">
              {permissions.map((perm) => (
                <div key={perm.key} className="flex items-center justify-between p-3 bg-[#0f0f0f] rounded">
                  <div>
                    <p className="text-white font-medium">{perm.label}</p>
                    <p className="text-xs text-gray-500">{perm.category}</p>
                  </div>
                  <Switch
                    checked={selectedUser.custom_permissions?.[perm.key] || false}
                    onCheckedChange={(checked) => {
                      const newPermissions = {
                        ...(selectedUser.custom_permissions || {}),
                        [perm.key]: checked
                      };
                      updatePermissionMutation.mutate({
                        userId: selectedUser.id,
                        permissions: newPermissions
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {!selectedUser && (
          <div className="text-center py-8">
            <Settings className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Select a user to manage their permissions</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}