import { Request, Response, NextFunction, Router } from 'express';

export interface ThreatTelemetry {
  id: string;
  type: 'typosquatting' | 'leaked_credential' | 'domain_lookup';
  source: string;
  exposure: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
}

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

export class DomainMonitoringController {
  public getDomainTelemetry = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const tenantId = req.query.tenant_id as string;
      const useMock = req.query.mock === 'true';

      if (!tenantId) {
        console.error(`[Izulu Sentinel] Rejected request: Missing 'tenant_id' parameter.`);
        res.status(400).json([]);
        return;
      }

      if (useMock) {
        console.log(`[Izulu Sentinel] Serving mock dataset for Tenant: ${tenantId}`);
        res.status(200).json(MOCK_BREACH_DATASET);
        return;
      }

      const telemetryData: ThreatTelemetry[] = [];
      res.status(200).json(telemetryData);

    } catch (error) {
      console.error(`[Izulu Sentinel Exception]:`, error);
      res.status(500).json([]);
    }
  };
}

const router = Router();
const controller = new DomainMonitoringController();

router.get('/monitoring/domains', controller.getDomainTelemetry);

export default router;