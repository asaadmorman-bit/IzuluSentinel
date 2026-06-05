// src/entities/all.jsx

// Mock Dataset for Incidents (Used by Threats, ThreatMap, Analytics, etc.)
export const Incident = {
  id: "INC-2026-881",
  title: "Malicious Typosquatting Target Detected",
  status: "ACTIVE",
  severity: "high",
  timestamp: new Date().toISOString(),
};

// Mock Dataset for Assets (Used by ThreatMap, EmergencyProtocols, etc.)
export const Asset = {
  id: "AST-4402",
  name: "Primary Core Database Cluster",
  type: "Cloud Infrastructure",
  criticality: "critical",
};

// Mock Dataset for Travel Routes (Used by TravelPlanning, RouteOptimization)
export const TravelRoute = {
  id: "RTE-9912",
  destination: "Thyreos Satellite Office A",
  status: "SECURE",
};

// Mock Dataset for Intelligence Reports (Used by Intelligence, AdvancedSearch)
export const IntelligenceReport = {
  id: "INT-8831",
  classification: "SECRET",
  summary: "Active OSINT scanning detected from anonymous darknet proxy pools.",
};

// Mock Dataset for Team Members (Used by Team, AdvancedSearch)
export const TeamMember = {
  id: "USR-001",
  name: "Lead Security Operator",
  role: "Incident Responder",
};

// Mock Dataset for General User Identity Context
export const User = {
  id: "SYS-ADMIN-01",
  username: "operator@izulusentinel.internal",
  role: "Global Root",
};

// Default catch-all export container to satisfy all project variants
const allEntities = {
  Incident,
  Asset,
  TravelRoute,
  IntelligenceReport,
  TeamMember,
  User
};

export default allEntities;