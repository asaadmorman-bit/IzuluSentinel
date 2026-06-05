import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// ── Radix-44 Utility ──────────────────────────────────────────────────────────
// 44-character URL-safe alphabet (digits + uppercase + select symbols)
const R44_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ-._~@!$&*+,;';
// Trim to exactly 44 chars
const ALPHABET = R44_ALPHABET.slice(0, 44);

function encodeRadix44(buffer) {
  // Convert byte array to BigInt, then encode in base-44
  let num = 0n;
  for (const byte of buffer) {
    num = (num << 8n) | BigInt(byte);
  }
  if (num === 0n) return ALPHABET[0];
  let result = '';
  while (num > 0n) {
    result = ALPHABET[Number(num % 44n)] + result;
    num = num / 44n;
  }
  return result;
}

async function generateQRToken(payload) {
  const data = JSON.stringify(payload);
  const encoder = new TextEncoder();
  const bytes = encoder.encode(data);
  // SHA-256 hash for integrity
  const hashBuffer = await crypto.subtle.digest('SHA-256', bytes);
  const hashBytes = new Uint8Array(hashBuffer);
  // Encode first 16 bytes (128-bit) in Radix-44 for a compact URL-safe token
  const token = encodeRadix44(hashBytes.slice(0, 16));
  return token;
}

// ── System Vitality Calculators ───────────────────────────────────────────────
async function getIZuluSentinelVitality(base44) {
  const results = await Promise.allSettled([
    base44.asServiceRole.entities.Asset.list('-created_date', 1),
    base44.asServiceRole.entities.Incident.list('-created_date', 1),
    base44.asServiceRole.entities.Alert.list('-created_date', 1),
    base44.asServiceRole.entities.ActivityLog.list('-created_date', 1),
    base44.asServiceRole.entities.TeamMember.list('-created_date', 1),
  ]);

  const healthyServices = results.filter(r => r.status === 'fulfilled').length;
  const totalServices = results.length;
  const uptimePercent = Math.round((healthyServices / totalServices) * 100);

  // Check recent audit logs for failures
  let auditHealth = 100;
  try {
    const recentAudit = await base44.asServiceRole.entities.ActivityLog.filter(
      { entity_type: 'AUDIT_SUMMARY' }, '-created_date', 1
    );
    if (recentAudit?.[0]?.success === false) auditHealth = 72;
  } catch (_) {}

  const finalUptime = Math.min(uptimePercent, auditHealth);

  return {
    system: 'iZulu Sentinel',
    metric_label: 'System Uptime',
    metric_value: finalUptime,
    metric_unit: '%',
    healthy_services: healthyServices,
    total_services: totalServices,
    status: finalUptime >= 90 ? 'OPERATIONAL' : finalUptime >= 70 ? 'DEGRADED' : 'CRITICAL',
  };
}

async function getOutpostZeroVitality(base44) {
  // Research Progress: derived from enriched intel + predictive models + AI analyses
  const results = await Promise.allSettled([
    base44.asServiceRole.entities.EnrichedThreatIntel.list('-created_date', 50),
    base44.asServiceRole.entities.PredictiveThreatModel.list('-created_date', 50),
    base44.asServiceRole.entities.AIAnalysis.list('-created_date', 50),
    base44.asServiceRole.entities.ThreatCorrelation.list('-created_date', 50),
    base44.asServiceRole.entities.IntelligenceReport.list('-created_date', 50),
  ]);

  const counts = results.map(r => r.status === 'fulfilled' ? (r.value?.length ?? 0) : 0);
  const totalRecords = counts.reduce((a, b) => a + b, 0);

  // Research progress = capped percentage based on data volume milestones
  // Milestone: 500 records = 100% research corpus
  const MILESTONE = 500;
  const rawProgress = Math.min(Math.round((totalRecords / MILESTONE) * 100), 100);
  // Floor at 12% to reflect bootstrapped research environment
  const researchProgress = Math.max(rawProgress, 12);

  return {
    system: 'Outpost Zero',
    metric_label: 'Research Progress',
    metric_value: researchProgress,
    metric_unit: '%',
    total_research_records: totalRecords,
    milestone_target: MILESTONE,
    status: researchProgress >= 75 ? 'ADVANCED' : researchProgress >= 40 ? 'IN_PROGRESS' : 'EARLY_STAGE',
  };
}

// ── Handler ───────────────────────────────────────────────────────────────────
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    const body = await req.json().catch(() => ({}));
    const system = body.system ?? 'izulu'; // 'izulu' | 'outpost'

    let vitality;
    if (system === 'outpost') {
      vitality = await getOutpostZeroVitality(base44);
    } else {
      vitality = await getIZuluSentinelVitality(base44);
    }

    const timestamp = new Date().toISOString();
    const tokenPayload = {
      system: vitality.system,
      value: vitality.metric_value,
      status: vitality.status,
      ts: timestamp,
    };

    const qrToken = await generateQRToken(tokenPayload);

    return Response.json({
      ...vitality,
      timestamp,
      qr_token: qrToken,
      qr_scan_url: `https://phd-hub.sentinel/verify?token=${qrToken}&system=${encodeURIComponent(vitality.system)}`,
      encoding: 'Radix-44 · SHA-256 · 128-bit integrity hash',
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});