import express, { Request, Response } from 'express';
import sentinelRouter from './domainMonitoring.controller.ts';

const app = express();
const port = 3000;

app.use(express.json());

// Wide open CORS handling to unblock simultaneous cross-port Codespace processes
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  next();
});

// Bind core local multi-tenant monitoring routes
app.use('/api/v1', sentinelRouter);

/**
 * POST /api/v1/sentinel/upstream
 * Explicit route for self-hosted engines to forward processed threat telemetry 
 * directly to the central THYREOS SaaS management console database layers.
 */
app.post('/api/v1/sentinel/upstream', async (req: Request, res: Response): Promise<void> => {
  try {
    const telemetryPayload = req.body;
    const thyreosIngestEndpoint = process.env.VITE_THYREOS_INGEST_URL || 'http://localhost:8080/api/v1/telemetry';

    // Verify payload is an array to preserve absolute system rendering reliability (Rule 1)
    if (!Array.isArray(telemetryPayload)) {
      console.error("🚷 [Upstream Forwarder REJECTED]: Telemetry payload must be a structured JSON array.");
      res.status(400).json([]);
      return;
    }

    console.log(`📡 [Forwarding Telemetry]: Shipping ${telemetryPayload.length} items to THYREOS console...`);

    // Execute upstream dispatch
    const upstreamResponse = await fetch(thyreosIngestEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telemetryPayload)
    });

    if (!upstreamResponse.ok) {
      throw new Error(`THYREOS console rejected payload with status: ${upstreamResponse.status}`);
    }

    res.status(200).json({ success: true, message: "Telemetry pushed to THYREOS successfully." });
  } catch (error) {
    console.error("❌ [Upstream Pipeline Failure]:", error);
    // Enforce Rule 1: Never crash on edge network failure, safely return structural container
    res.status(500).json([]);
  }
});

/**
 * THYREOS OPENING DAY DEMO SINK:
 * Intercepts incoming telemetry payloads and generates an instant,
 * high-fidelity visual ingestion receipt directly in the system logs.
 */
app.post('/api/v1/thyreos-mock-sink', (req: Request, res: Response) => {
  const incomingData = req.body;
  const timestamp = new Date().toISOString();
  const recordCount = incomingData.records?.length || 0;

  console.log(`\n\x1b[36m┌────────────────────────────────────────────────────────┐\x1b[0m`);
  console.log(`\x1b[36m│          🏛️  THYREOS CENTRAL INGESTION ROUTER          │\x1b[0m`);
  console.log(`\x1b[36m├────────────────────────────────────────────────────────┤\x1b[0m`);
  console.log(`\x1b[32m│ STATUS:    [ SUCCESS - 201 CREATED ]                   │\x1b[0m`);
  console.log(`│ TIME:      ${timestamp}                │`);
  console.log(`│ NODE:      ${incomingData.source_engine || "UNKNOWN_NODE"}               │`);
  console.log(`│ CAPACITY:  [ ${recordCount} Threat Records Synced ]                 │`);
  console.log(`\x1b[36m├────────────────────────────────────────────────────────┤\x1b[0m`);
  console.log(`\x1b[33m│ PACKET METADATA DEPLOYMENT LOG:                        │\x1b[0m`);
  
  if (recordCount > 0) {
    incomingData.records.forEach((record: any, index: number) => {
      console.log(`│  [${index + 1}] ID: ${record.id.padEnd(12)} | SEVERITY: ${record.severity.toUpperCase().padEnd(8)} │`);
      console.log(`│      EXPOSURE: ${record.exposure.substring(0, 43).padEnd(43)} │`);
    });
  } else {
    console.log(`│  ⚠️ No records parsed in current payload array.         │`);
  }
  
  console.log(`\x1b[36m└────────────────────────────────────────────────────────┘\x1b[0m\n`);

  // Send a successful confirmation payload back to the UI
  res.status(201).json({
    success: true,
    status: "PROCESSED",
    ingressToken: `THY-SIM-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    message: "Data securely integrated into THYREOS simulation cluster."
  });
});

app.listen(port, () => {
  console.log(`⚡ [Izulu Sentinel Self-Hosted Core Engine] Online on port ${port}`);
});