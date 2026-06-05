import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Users, Search, Edit } from "lucide-react";
import { format } from "date-fns";

export default function UserManagement({ users, user }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const updateUserRoleMutation = useMutation({
    mutationFn: ({ userId, newRole }) =>
      base44.entities.User.update(userId, { role: newRole }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    }
  });

  const getRoleColor = (role) => {
    switch (role) {
      case "admin": return "bg-red-500/20 text-red-400";
      case "command_staff": return "bg-purple-500/20 text-purple-400";
      case "soc_analyst": return "bg-cyan-500/20 text-cyan-400";
      case "security_personnel": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredUsers = users
    .filter(u => roleFilter === "all" || u.role === roleFilter)
    .filter(u => 
      searchQuery === "" ||
      u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Users className="w-5 h-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="command_staff">Command Staff</SelectItem>
              <SelectItem value="soc_analyst">SOC Analyst</SelectItem>
              <SelectItem value="security_personnel">Security Personnel</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          {filteredUsers.map((u) => (
            <Card key={u.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-white">{u.full_name}</h4>
                      <Badge className={getRoleColor(u.role)}>
                        {u.role?.replace(/_/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{u.email}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Joined: {u.created_date ? format(new Date(u.created_date), "MMM d, yyyy") : "N/A"}
                    </p>
                  </div>
                  {user?.role === "admin" && (
                    <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No users found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}