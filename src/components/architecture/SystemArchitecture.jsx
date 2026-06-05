import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Database, Server, Cloud, Mail, Code, Zap } from "lucide-react";

export default function SystemArchitecture() {
  const [activeFlow, setActiveFlow] = useState(null);
  const navigate = useNavigate();

  const components = [
    {
      id: "ecs-app",
      label: "API / Dashboard",
      description: "React App + Base44 SDK",
      icon: Server,
      color: "#2563EB",
      x: 200,
      y: 150,
      onClick: () => navigate(createPageUrl("Dashboard"))
    },
    {
      id: "ecs-worker",
      label: "Correlation Worker",
      description: "Deno Functions",
      icon: Zap,
      color: "#8B5CF6",
      x: 600,
      y: 150,
      onClick: () => navigate(createPageUrl("ThreatPrioritization"))
    },
    {
      id: "postgres",
      label: "Threat DB",
      description: "PostgreSQL (Base44)",
      icon: Database,
      color: "#16A34A",
      x: 200,
      y: 350,
      onClick: null
    },
    {
      id: "s3",
      label: "Artifacts / Logs",
      description: "S3 Storage",
      icon: Cloud,
      color: "#F59E0B",
      x: 600,
      y: 350,
      onClick: null
    },
    {
      id: "ses",
      label: "Alert Delivery",
      description: "Email (SES)",
      icon: Mail,
      color: "#DC2626",
      x: 1000,
      y: 150,
      onClick: () => setActiveFlow("alert")
    },
    {
      id: "terraform",
      label: "CI/CD & Infra",
      description: "Terraform",
      icon: Code,
      color: "#6B7280",
      x: 1000,
      y: 350,
      onClick: () => setActiveFlow("deploy")
    }
  ];

  const connections = [
    { from: "ecs-app", to: "postgres", type: "data" },
    { from: "ecs-worker", to: "postgres", type: "data" },
    { from: "ecs-worker", to: "ecs-app", type: "correlation" },
    { from: "ecs-worker", to: "ses", type: "alert" },
    { from: "terraform", to: "ecs-app", type: "deploy" },
    { from: "s3", to: "ecs-app", type: "logs" }
  ];

  return (
    <div className="relative w-full h-[600px] bg-[#020617] rounded-lg p-8 overflow-hidden">
      {/* Title */}
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white mb-2">System Architecture</h2>
        <p className="text-sm text-gray-400">Click components to navigate or trigger flows</p>
      </div>

      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {connections.map((conn, idx) => {
          const fromComp = components.find(c => c.id === conn.from);
          const toComp = components.find(c => c.id === conn.to);
          
          if (!fromComp || !toComp) return null;

          const isActive = activeFlow === "alert" && conn.type === "alert" ||
                          activeFlow === "deploy" && conn.type === "deploy";

          return (
            <motion.line
              key={idx}
              x1={fromComp.x + 80}
              y1={fromComp.y + 40}
              x2={toComp.x + 80}
              y2={toComp.y + 40}
              stroke={isActive ? "#DC2626" : "#374151"}
              strokeWidth={isActive ? 3 : 2}
              strokeDasharray={conn.type === "data" ? "0" : "5,5"}
              initial={{ pathLength: 0 }}
              animate={{ 
                pathLength: 1,
                stroke: isActive ? "#DC2626" : "#374151"
              }}
              transition={{ duration: 1, repeat: isActive ? Infinity : 0 }}
            />
          );
        })}
      </svg>

      {/* Components */}
      {components.map((comp) => {
        const Icon = comp.icon;
        return (
          <motion.div
            key={comp.id}
            className="absolute"
            style={{ left: comp.x, top: comp.y, zIndex: 2 }}
            whileHover={{ scale: comp.onClick ? 1.05 : 1 }}
            whileTap={{ scale: comp.onClick ? 0.95 : 1 }}
          >
            <Card
              className={`w-40 border-[#1a1a1a] bg-[#0f0f0f] ${
                comp.onClick ? 'cursor-pointer hover:border-[#2a2a2a]' : ''
              } transition-all`}
              onClick={comp.onClick}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center"
                    style={{ backgroundColor: `${comp.color}20` }}
                  >
                    <Icon className="w-4 h-4" style={{ color: comp.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-white truncate">{comp.label}</p>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500">{comp.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3">
        <div className="space-y-1 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-600" />
            <span>Data Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-gray-600" style={{ borderTop: '2px dashed #374151' }} />
            <span>Control Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-600" />
            <span>Active Flow</span>
          </div>
        </div>
      </div>
    </div>
  );
}