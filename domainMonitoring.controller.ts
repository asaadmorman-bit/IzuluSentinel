import { Request, Response, NextFunction, Router } from 'express';

// ==========================================
// 1. TYPE DEFINITIONS & SCHEMAS
// ==========================================
export interface ThreatTelemetry {
  id: string;
  type: 'typosquatting' | 'leaked_credential' | 'domain_lookup';
  source: string;
  exposure: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

// ==========================================
// 2. MOCK DATASET (Rule 3 Compliance)
// ==========================================
const MOCK_BREACH_DATASET: ThreatTelemetry[] = [
  {
    id: "vuln-9941-x8",
    type: "typosquatting",
    source: "Izulu-OSINT-Fuzzer",
    exposure: "cz-thyreos-portal.com (Registered via NameCheap)",
    severity: "high",
    timestamp: new Date().toISOString()
  },
  {
    id: "leak-4402-p1",
    type: "leaked_credential",
    source: "BreachForums-Dump-v2",
    exposure: "admin@thyreos.internal (SHA-256 Hash Exposed)",
    severity: "critical",
    timestamp: new Date(Date.now() - 3600000).toISOString()
  },
  {
    id: "look-1109-m5",
    type: "domain_lookup",
    source: "Passive-DNS-Telemetry",
    exposure: "MX records modified to untrusted bulletproof hoster",
    severity: "medium",
    timestamp: new Date(Date.now() - 7200000).toISOString()
  }
];

// ==========================================
// 3. THE CORE CONTROLLER CLASS
// ==========================================
export class DomainMonitoringController {
  /**
   * GET /api/v1/monitoring/domains
   * Fetches domain threat telemetry. Enforces tenant isolation and array-only responses.
   */
  public getDomainTelemetry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Rule 2: Explicitly require tenant_id for strict data isolation
      const tenantId = req.query.tenant_id as string;
      const useMock = req.query.mock === 'true';

      if (!tenantId) {
        // Rule 1: Even error payloads must strictly respond with a structured JSON array []
        console.error(`[Izulu Sentinel] Rejected request: Missing 'tenant_id' parameter.`);
        res.status(400).json([]);
        return;
      }

      // Route handling for Test Environment
      if (useMock) {
        console.log(`[Izulu Sentinel] Serving mock dataset for Tenant: ${tenantId}`);
        res.status(200).json(MOCK_BREACH_DATASET);
        return;
      }

      // --- Production OSINT Scraping Engine Pipeline ---
      const telemetryData: ThreatTelemetry[] = []; // Initializing empty state for production illustration

      if (!telemetryData || telemetryData.length === 0) {
        // Rule 1: Never wrap empty states in arbitrary objects; use empty arrays instead.
        res.status(200).json([]);
        return;
      }

      res.status(200).json(telemetryData);

    } catch (error) {
      // Fail-safe: Prevent THYREOS frontend crash by always returning an array
      console.error(`[Izulu Sentinel Exception]:`, error);
      res.status(500).json([]);
    }
  };
}

// ==========================================
// 4. ROUTER EXPORT & INSTANTIATION
// ==========================================
// Safe from temporal dead zone because the class is fully declared above!
const router = Router();
const controller = new DomainMonitoringController();

// Route for THYREOS telemetry ingestion
router.get('/monitoring/domains', controller.getDomainTelemetry);

export default router;