import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Shield, 
  Users, 
  Settings, 
  Search,
  Clock,
  Lock,
  Unlock,
  FileText,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import RoleDefinitions from "../components/rbac/RoleDefinitions";
import PermissionsMatrix from "../components/rbac/PermissionsMatrix";
import UserManagement from "../components/rbac/UserManagement";
import GranularPermissions from "../components/rbac/GranularPermissions";
import TemporaryAccess from "../components/rbac/TemporaryAccess";
import AuditLog from "../components/rbac/AuditLog";

export default function RoleManagement() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const { data: users = [] } = useQuery({
    queryKey: ['users_rbac'],
    queryFn: () => base44.entities.User.list("-created_date", 200),
    enabled: currentUser?.role === "admin" || currentUser?.role === "command_staff"
  });

  const { data: rbacLogs = [] } = useQuery({
    queryKey: ['rbac_logs'],
    queryFn: () => base44.entities.RBACLog.list("-created_date", 100),
    refetchInterval: 10000,
    enabled: currentUser?.role === "admin" || currentUser?.role === "command_staff"
  });

  const isAdmin = currentUser?.role === "admin";
  const isCommandStaff = currentUser?.role === "command_staff";
  const hasAccess = isAdmin || isCommandStaff;

  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.account_status === "active").length,
    pendingReview: users.filter(u => {
      const lastReview = u.last_permission_review ? new Date(u.last_permission_review) : null;
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      return !lastReview || lastReview < ninetyDaysAgo;
    }).length,
    recentChanges: rbacLogs.filter(l => {
      const changeDate = new Date(l.created_date);
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      return changeDate > oneDayAgo;
    }).length
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                Role Management requires Administrator or Command Staff privileges.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-10 h-10 text-[#DC2626]" />
              Advanced Role & Permission Management
            </h1>
            <p className="text-gray-400">Granular access control with time-based permissions and comprehensive audit logs</p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className="bg-emerald-500/20 text-emerald-400">
                Your Role: {currentUser?.role?.replace(/_/g, " ").toUpperCase()}
              </Badge>
              <Badge className="bg-purple-500/20 text-purple-400">
                Clearance: {currentUser?.security_clearance?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Users</p>
                  <p className="text-2xl font-bold text-white">{stats.totalUsers}</p>
                </div>
                <Users className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Review</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingReview}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Recent Changes (24h)</p>
                  <p className="text-2xl font-bold text-white">{stats.recentChanges}</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert for pending reviews */}
        {stats.pendingReview > 0 && (
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-white mb-1">Permission Review Required</h4>
                  <p className="text-sm text-gray-400">
                    {stats.pendingReview} user(s) have not had their permissions reviewed in over 90 days. 
                    Regular reviews are recommended for security compliance.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 bg-[#1a1a1a]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="permissions" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Permissions
            </TabsTrigger>
            <TabsTrigger value="temporary" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Temporary Access
            </TabsTrigger>
            <TabsTrigger value="matrix" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Matrix
            </TabsTrigger>
            <TabsTrigger value="audit" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Audit Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <RoleDefinitions />
          </TabsContent>

          <TabsContent value="users" className="mt-6">
            <UserManagement 
              users={users}
              currentUser={currentUser}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="permissions" className="mt-6">
            <GranularPermissions
              users={users}
              currentUser={currentUser}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="temporary" className="mt-6">
            <TemporaryAccess
              users={users}
              currentUser={currentUser}
              isAdmin={isAdmin}
            />
          </TabsContent>

          <TabsContent value="matrix" className="mt-6">
            <PermissionsMatrix />
          </TabsContent>

          <TabsContent value="audit" className="mt-6">
            <AuditLog
              logs={rbacLogs}
              currentUser={currentUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}