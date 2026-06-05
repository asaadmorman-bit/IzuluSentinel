import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!['admin', 'command_staff', 'soc_analyst'].includes(user.role)) {
      return Response.json({ 
        error: 'Insufficient permissions' 
      }, { status: 403 });
    }

    const { 
      threatData, 
      analysisType = 'comprehensive',
      contextData = {},
      generateReport = false 
    } = await req.json();

    if (!threatData) {
      return Response.json({ 
        error: 'Threat data is required' 
      }, { status: 400 });
    }

    const startTime = Date.now();

    // Build comprehensive analysis prompt
    const analysisPrompt = `You are an expert cybersecurity and threat intelligence analyst. Analyze the following threat data:

${JSON.stringify(threatData, null, 2)}

Additional Context:
${JSON.stringify(contextData, null, 2)}

Provide a ${analysisType} threat analysis including:

1. Threat Assessment
   - Threat type and classification
   - Severity level (low, medium, high, critical)
   - Confidence score (0-100)
   - Attack vector analysis

2. Technical Analysis
   - Indicators of Compromise (IOCs)
   - Tactics, Techniques, and Procedures (TTPs)
   - MITRE ATT&CK framework mapping
   - Infrastructure analysis

3. Impact Assessment
   - Potential targets
   - Business impact
   - Data at risk
   - Operational disruption potential

4. Threat Actor Analysis
   - Potential attribution
   - Motivation
   - Capabilities
   - Historical activity

5. Recommendations
   - Immediate actions
   - Short-term mitigations
   - Long-term security improvements
   - Detection strategies

6. Intelligence Context
   - Related threats
   - Campaign identification
   - Geographic targeting
   - Sector-specific risks

Format the response as structured JSON.`;

    // Call AI for analysis
    const aiAnalysis = await base44.integrations.Core.InvokeLLM({
      prompt: analysisPrompt,
      add_context_from_internet: true,
      response_json_schema: {
        type: "object",
        properties: {
          threat_classification: {
            type: "object",
            properties: {
              threat_type: { type: "string" },
              category: { type: "string" },
              severity: { type: "string" },
              confidence_score: { type: "number" }
            }
          },
          technical_analysis: {
            type: "object",
            properties: {
              iocs: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    type: { type: "string" },
                    value: { type: "string" },
                    confidence: { type: "number" }
                  }
                }
              },
              ttps: { type: "array", items: { type: "string" } },
              mitre_techniques: { type: "array", items: { type: "string" } }
            }
          },
          impact_assessment: {
            type: "object",
            properties: {
              severity_score: { type: "number" },
              potential_targets: { type: "array", items: { type: "string" } },
              business_impact: { type: "string" },
              data_at_risk: { type: "array", items: { type: "string" } }
            }
          },
          threat_actor: {
            type: "object",
            properties: {
              attribution: { type: "string" },
              motivation: { type: "string" },
              sophistication: { type: "string" },
              known_campaigns: { type: "array", items: { type: "string" } }
            }
          },
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                priority: { type: "string" },
                action: { type: "string" },
                timeframe: { type: "string" }
              }
            }
          },
          intelligence_summary: { type: "string" },
          related_threats: { type: "array", items: { type: "string" } }
        }
      }
    });

    const processingTime = Date.now() - startTime;

    // Store analysis in database
    const analysis = await base44.entities.AIAnalysis.create({
      analysis_type: 'threat_analysis',
      status: 'completed',
      priority_score: aiAnalysis.threat_classification?.confidence_score || 70,
      confidence_level: aiAnalysis.threat_classification?.confidence_score || 70,
      summary: aiAnalysis.intelligence_summary || 'Threat analysis completed',
      detailed_analysis: JSON.stringify(aiAnalysis, null, 2),
      recommended_actions: aiAnalysis.recommendations || [],
      threat_indicators: aiAnalysis.technical_analysis?.iocs || [],
      processing_time_ms: processingTime,
      ai_model_version: 'gpt-4-turbo',
      metadata: {
        analysisType: analysisType,
        threatData: threatData,
        contextData: contextData
      }
    });

    // Generate PDF report if requested
    let reportUrl = null;
    if (generateReport) {
      const reportContent = `
THREAT ANALYSIS REPORT
Generated: ${new Date().toISOString()}
Analyst: ${user.full_name}

EXECUTIVE SUMMARY
${aiAnalysis.intelligence_summary}

THREAT CLASSIFICATION
Type: ${aiAnalysis.threat_classification?.threat_type}
Severity: ${aiAnalysis.threat_classification?.severity}
Confidence: ${aiAnalysis.threat_classification?.confidence_score}%

TECHNICAL ANALYSIS
TTPs: ${aiAnalysis.technical_analysis?.ttps?.join(', ')}
MITRE Techniques: ${aiAnalysis.technical_analysis?.mitre_techniques?.join(', ')}

RECOMMENDATIONS
${aiAnalysis.recommendations?.map((r, i) => `${i + 1}. [${r.priority}] ${r.action}`).join('\n')}
      `.trim();

      // Store report content (in production, generate actual PDF)
      reportUrl = `analysis-report-${analysis.id}.txt`;
    }

    return Response.json({
      success: true,
      analysisId: analysis.id,
      analysis: aiAnalysis,
      processingTime: processingTime,
      reportUrl: reportUrl,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Threat analysis error:', error);
    
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});