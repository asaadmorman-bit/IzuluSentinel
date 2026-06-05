import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json().catch(() => ({}));

    // Support direct calls AND entity automation payloads
    const eventData = body.data ?? body;
    const threatId = eventData.id ?? eventData.threat_id;
    const severity = eventData.severity ?? eventData.threat_level;

    // Guard: only dispatch for Critical severity
    if (!severity || severity.toLowerCase() !== 'critical') {
      return Response.json({ skipped: true, reason: 'Non-critical severity — dispatch suppressed.' });
    }

    const endpointUrl = Deno.env.get('ACHE_ENDPOINT_URL');
    if (!endpointUrl) {
      return Response.json({ error: 'ACHE_ENDPOINT_URL secret is not configured.' }, { status: 500 });
    }

    const payload = {
      threat_id: threatId,
      source_app: 'iZulu Sentinel',
      timestamp: new Date().toISOString(),
      // enriched context
      title: eventData.title ?? null,
      threat_type: eventData.threat_type ?? null,
      severity: severity,
      location: eventData.location_name ?? null,
      status: eventData.status ?? null,
    };

    const response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Source-App': 'iZulu-Sentinel',
        'X-Dispatch-Version': '1.0',
      },
      body: JSON.stringify(payload),
    });

    const responseText = await response.text().catch(() => '');

    // Log dispatch to ActivityLog
    await base44.asServiceRole.entities.ActivityLog.create({
      user_email: 'system@izulu-sentinel',
      action: 'ACHE_DISPATCH',
      entity_type: 'Threats',
      entity_id: threatId ?? 'unknown',
      details: {
        endpoint: endpointUrl,
        http_status: response.status,
        payload,
        response_preview: responseText.slice(0, 300),
      },
      severity: 'high',
      success: response.ok,
      error_message: response.ok ? null : `HTTP ${response.status}: ${responseText.slice(0, 200)}`,
    });

    return Response.json({
      dispatched: true,
      threat_id: threatId,
      ache_status: response.status,
      ache_ok: response.ok,
      timestamp: payload.timestamp,
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});