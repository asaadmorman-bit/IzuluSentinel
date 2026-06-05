import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Users } from "lucide-react";

export default function RoleDefinitions({ users }) {
  const roles = [
    {
      name: "admin",
      label: "Administrator",
      description: "Full system access and configuration",
      permissions: ["All permissions"],
      color: "bg-red-500/20 text-red-400"
    },
    {
      name: "command_staff",
      label: "Command Staff",
      description: "Strategic oversight and operations management",
      permissions: ["View all data", "Manage operations", "Create reports", "Manage team"],
      color: "bg-purple-500/20 text-purple-400"
    },
    {
      name: "soc_analyst",
      label: "SOC Analyst",
      description: "Threat analysis and intelligence monitoring",
      permissions: ["View threats", "Analyze intelligence", "Create incidents", "Generate reports"],
      color: "bg-cyan-500/20 text-cyan-400"
    },
    {
      name: "security_personnel",
      label: "Security Personnel",
      description: "Field operations and asset protection",
      permissions: ["View assigned assets", "Update status", "View threats", "Report incidents"],
      color: "bg-emerald-500/20 text-emerald-400"
    }
  ];

  const getRoleUserCount = (roleName) => {
    return users.filter(u => u.role === roleName).length;
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Role Definitions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {roles.map((role) => (
            <Card key={role.name} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white">{role.label}</h3>
                      <Badge className={role.color}>
                        <Users className="w-3 h-3 mr-1" />
                        {getRoleUserCount(role.name)} users
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-400">{role.description}</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-2">Key Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {role.permissions.map((perm, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {perm}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}