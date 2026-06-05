// server.ts
import express from 'express';
import sentinelRouter from './domainMonitoring.controller.ts';

const app = express();
const port = 3000;

// Enable CORS so your Vite frontend can easily pull this telemetry
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Use the consolidated router module under your API namespace prefix
app.use('/api/v1', sentinelRouter);

app.listen(port, () => {
  console.log(`⚡ [Izulu Sentinel Engine] Live inside Codespace on http://localhost:${port}`);
});