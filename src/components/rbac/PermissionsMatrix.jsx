import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, XCircle } from "lucide-react";

export default function PermissionsMatrix() {
  const permissions = [
    { module: "Threat Intelligence", admin: true, command: true, analyst: true, personnel: false },
    { module: "Geofence Alerts", admin: true, command: true, analyst: true, personnel: true },
    { module: "Asset Management", admin: true, command: true, analyst: false, personnel: true },
    { module: "Incident Creation", admin: true, command: true, analyst: true, personnel: false },
    { module: "Report Generation", admin: true, command: true, analyst: true, personnel: false },
    { module: "User Management", admin: true, command: false, analyst: false, personnel: false },
    { module: "System Settings", admin: true, command: false, analyst: false, personnel: false },
    { module: "Response Playbooks", admin: true, command: true, analyst: true, personnel: false },
    { module: "Event Security", admin: true, command: true, analyst: true, personnel: true },
    { module: "Social Intelligence", admin: true, command: true, analyst: true, personnel: false }
  ];

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Permissions Matrix
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#1a1a1a]">
                <th className="text-left text-gray-400 py-3 px-4">Module</th>
                <th className="text-center text-gray-400 py-3 px-4">Admin</th>
                <th className="text-center text-gray-400 py-3 px-4">Command Staff</th>
                <th className="text-center text-gray-400 py-3 px-4">SOC Analyst</th>
                <th className="text-center text-gray-400 py-3 px-4">Security Personnel</th>
              </tr>
            </thead>
            <tbody>
              {permissions.map((perm, idx) => (
                <tr key={idx} className="border-b border-[#1a1a1a] hover:bg-[#0a0a0a]">
                  <td className="text-white py-3 px-4">{perm.module}</td>
                  <td className="text-center py-3 px-4">
                    {perm.admin ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {perm.command ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {perm.analyst ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                  <td className="text-center py-3 px-4">
                    {perm.personnel ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 mx-auto" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-600 mx-auto" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Legend</h4>
          <div className="grid md:grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-gray-300">Full Access</span>
            </div>
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-gray-600" />
              <span className="text-gray-300">No Access</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}