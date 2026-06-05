import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Search } from "lucide-react";
import { format } from "date-fns";

export default function AuditLog({ logs, currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");

  const getActionColor = (action) => {
    switch (action) {
      case "role_change": return "bg-purple-500/20 text-purple-400";
      case "permission_grant": return "bg-emerald-500/20 text-emerald-400";
      case "permission_revoke": return "bg-red-500/20 text-red-400";
      case "temp_access_grant": return "bg-cyan-500/20 text-cyan-400";
      case "temp_access_revoke": return "bg-amber-500/20 text-amber-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const filteredLogs = logs
    .filter(log => actionFilter === "all" || log.action === actionFilter)
    .filter(log =>
      searchQuery === "" ||
      log.target_user?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.performed_by?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          RBAC Audit Log
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <p className="text-sm text-gray-400">
            Comprehensive audit trail of all role and permission changes. All actions are logged with timestamps and user attribution.
          </p>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search logs..."
              className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Actions</SelectItem>
              <SelectItem value="role_change">Role Changes</SelectItem>
              <SelectItem value="permission_grant">Permission Grants</SelectItem>
              <SelectItem value="permission_revoke">Permission Revocations</SelectItem>
              <SelectItem value="temp_access_grant">Temp Access Grants</SelectItem>
              <SelectItem value="temp_access_revoke">Temp Access Revocations</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto">
          {filteredLogs.map((log) => (
            <Card key={log.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={getActionColor(log.action)}>
                        {log.action?.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-sm text-gray-400">
                        by <span className="text-white">{log.performed_by}</span>
                      </span>
                    </div>
                    <p className="text-white text-sm">
                      Target: <span className="font-semibold">{log.target_user}</span>
                    </p>
                    {log.details && (
                      <p className="text-xs text-gray-400 mt-1">{log.details}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(log.created_date), "MMM d, HH:mm")}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredLogs.length === 0 && (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No audit logs found</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}