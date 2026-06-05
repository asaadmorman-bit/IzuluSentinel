import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { correlation } = await req.json();

    if (!correlation) {
      return Response.json({ error: 'Missing correlation data' }, { status: 400 });
    }

    // Build context for AI analysis
    const prompt = `You are an expert cybersecurity analyst. Analyze this threat correlation and provide actionable intelligence:

THREAT DETAILS:
- Threat: ${correlation.threat_title}
- Type: ${correlation.threat_type}
- Risk Level: ${correlation.risk_label} (Score: ${correlation.final_risk_score}/100)
- Severity: ${correlation.severity_score}/100
- Confidence: ${correlation.confidence_score}%
- Actively Exploited: ${correlation.is_actively_exploited ? 'YES' : 'NO'}

AFFECTED SERVICE:
- Service Name: ${correlation.service_name}
- Category: ${correlation.service_category}
- Business Criticality: ${correlation.business_criticality}
- Exposure Type: ${correlation.exposure_type}

AI EXPLANATION:
${correlation.explanation}

Based on this correlation, provide:

1. TRIAGE PRIORITY: Rate urgency as IMMEDIATE, HIGH, MEDIUM, or LOW with brief justification
2. INVESTIGATION STEPS: 3-5 specific technical actions the SOC should take immediately (be precise - mention logs to check, commands to run, indicators to search for)
3. REMEDIATION ACTIONS: 3-5 concrete mitigation steps ranked by priority
4. INDICATORS TO MONITOR: Specific technical indicators or behaviors to watch for
5. ESCALATION CRITERIA: When this should be escalated to senior staff or incident response

Format your response as valid JSON with these exact keys:
{
  "triage_priority": "IMMEDIATE|HIGH|MEDIUM|LOW",
  "triage_justification": "brief explanation",
  "investigation_steps": ["step 1", "step 2", "step 3"],
  "remediation_actions": ["action 1", "action 2", "action 3"],
  "indicators_to_monitor": ["indicator 1", "indicator 2"],
  "escalation_criteria": "when to escalate"
}`;

    // Call AI for threat analysis
    const analysis = await base44.integrations.Core.InvokeLLM({
      prompt: prompt,
      response_json_schema: {
        type: "object",
        properties: {
          triage_priority: { type: "string", enum: ["IMMEDIATE", "HIGH", "MEDIUM", "LOW"] },
          triage_justification: { type: "string" },
          investigation_steps: { type: "array", items: { type: "string" } },
          remediation_actions: { type: "array", items: { type: "string" } },
          indicators_to_monitor: { type: "array", items: { type: "string" } },
          escalation_criteria: { type: "string" }
        },
        required: ["triage_priority", "triage_justification", "investigation_steps", "remediation_actions"]
      }
    });

    return Response.json({
      success: true,
      analysis: analysis,
      correlation_id: correlation.id
    });

  } catch (error) {
    console.error('AI triage error:', error);
    return Response.json({ 
      error: error.message,
      success: false 
    }, { status: 500 });
  }
});