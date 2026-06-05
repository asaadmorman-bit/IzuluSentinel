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

app.listen(port, () => {
  console.log(`⚡ [Izulu Sentinel Self-Hosted Core Engine] Online on port ${port}`);
});