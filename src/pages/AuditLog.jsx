import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ActivityLog } from "@/entities/ActivityLog";
import { Search, Filter, Download, Shield, User, FileText, Database } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export default function AuditLog() {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  const setSampleLogs = useCallback(() => {
    const sampleData = [
      {
        id: "1",
        user_email: "admin@izulusentinel.com",
        action: "login",
        entity_type: "User",
        entity_id: "user_123",
        created_date: new Date(Date.now() - 3600000).toISOString(),
        severity: "low",
        success: true,
        ip_address: "192.168.1.100"
      },
      {
        id: "2",
        user_email: "analyst@izulusentinel.com",
        action: "create",
        entity_type: "Incident",
        entity_id: "inc_456",
        created_date: new Date(Date.now() - 7200000).toISOString(),
        severity: "medium",
        success: true,
        details: { title: "Security threat detected" }
      },
      {
        id: "3",
        user_email: "operator@izulusentinel.com",
        action: "update",
        entity_type: "TravelRoute",
        entity_id: "route_789",
        created_date: new Date(Date.now() - 10800000).toISOString(),
        severity: "low",
        success: true
      },
      {
        id: "4",
        user_email: "admin@izulusentinel.com",
        action: "delete",
        entity_type: "TeamMember",
        entity_id: "team_321",
        created_date: new Date(Date.now() - 14400000).toISOString(),
        severity: "high",
        success: true
      },
      {
        id: "5",
        user_email: "analyst@izulusentinel.com",
        action: "export",
        entity_type: "Report",
        entity_id: "report_654",
        created_date: new Date(Date.now() - 18000000).toISOString(),
        severity: "medium",
        success: true
      }
    ];
    setLogs(sampleData);
  }, []);

  const loadLogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await ActivityLog.list("-created_date", 100);
      setLogs(data);
    } catch (error) {
      console.error("Error loading audit logs:", error);
      // If user doesn't have access, show sample data
      setSampleLogs();
    }
    setIsLoading(false);
  }, [setSampleLogs]);

  const filterLogs = useCallback(() => {
    let filtered = [...logs];

    if (searchQuery) {
      filtered = filtered.filter(log =>
        log.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.entity_type?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (actionFilter !== "all") {
      filtered = filtered.filter(log => log.action === actionFilter);
    }

    if (severityFilter !== "all") {
      filtered = filtered.filter(log => log.severity === severityFilter);
    }

    setFilteredLogs(filtered);
  }, [logs, searchQuery, actionFilter, severityFilter]);

  useEffect(() => {
    loadLogs();
  }, [loadLogs]);

  useEffect(() => {
    filterLogs();
  }, [filterLogs]);

  const exportLogs = () => {
    const csv = [
      ["Timestamp", "User", "Action", "Entity Type", "Entity ID", "Severity", "Success", "IP Address"],
      ...filteredLogs.map(log => [
        format(new Date(log.created_date), "yyyy-MM-dd HH:mm:ss"),
        log.user_email,
        log.action,
        log.entity_type,
        log.entity_id || "",
        log.severity,
        log.success ? "Yes" : "No",
        log.ip_address || ""
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_log_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  const getActionIcon = (action) => {
    switch (action) {
      case "login":
      case "logout":
        return <User className="w-4 h-4" />;
      case "create":
      case "update":
      case "delete":
        return <Database className="w-4 h-4" />;
      case "export":
        return <Download className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: "bg-cyan-500/20 text-cyan-400",
      medium: "bg-amber-500/20 text-amber-400",
      high: "bg-orange-500/20 text-orange-400",
      critical: "bg-red-500/20 text-red-400"
    };
    return colors[severity] || colors.low;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-[#DC2626]" />
              Audit Trail
            </h1>
            <p className="text-gray-400">Complete activity log and security audit trail</p>
          </div>
          <Button
            onClick={exportLogs}
            variant="outline"
            className="border-[#2a2a2a] text-white"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Events</p>
                  <p className="text-3xl font-bold text-white">{logs.length}</p>
                </div>
                <Database className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Today</p>
                  <p className="text-3xl font-bold text-white">
                    {logs.filter(l => {
                      const today = new Date().toDateString();
                      return new Date(l.created_date).toDateString() === today;
                    }).length}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Severity</p>
                  <p className="text-3xl font-bold text-white">
                    {logs.filter(l => l.severity === "high" || l.severity === "critical").length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Unique Users</p>
                  <p className="text-3xl font-bold text-white">
                    {new Set(logs.map(l => l.user_email)).size}
                  </p>
                </div>
                <User className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Filter Logs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>

              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Action Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="create">Create</SelectItem>
                  <SelectItem value="update">Update</SelectItem>
                  <SelectItem value="delete">Delete</SelectItem>
                  <SelectItem value="export">Export</SelectItem>
                </SelectContent>
              </Select>

              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
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
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-16 bg-[#1a1a1a] rounded animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 bg-[#1a1a1a] rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-[#0f0f0f] rounded">
                          {getActionIcon(log.action)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-white capitalize">{log.action}</span>
                            <Badge variant="outline" className="text-xs">
                              {log.entity_type}
                            </Badge>
                            <Badge className={getSeverityColor(log.severity)}>
                              {log.severity}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-400 space-y-1">
                            <div>User: {log.user_email}</div>
                            {log.entity_id && <div>Entity ID: {log.entity_id}</div>}
                            {log.ip_address && <div>IP: {log.ip_address}</div>}
                            {log.details && (
                              <div className="text-xs text-gray-500">
                                {JSON.stringify(log.details)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-gray-500">
                        {format(new Date(log.created_date), "MMM d, yyyy")}
                        <br />
                        {format(new Date(log.created_date), "HH:mm:ss")}
                      </div>
                    </div>
                  </div>
                ))}

                {filteredLogs.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    No audit logs found
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}