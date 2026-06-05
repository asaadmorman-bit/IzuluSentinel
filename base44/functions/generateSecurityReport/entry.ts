import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import { jsPDF } from 'npm:jspdf@2.5.1';

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
      reportType = 'comprehensive',
      timeframe = '7days',
      includeCharts = true,
      format = 'json' // json or pdf
    } = await req.json();

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    switch (timeframe) {
      case '24hours':
        startDate.setHours(startDate.getHours() - 24);
        break;
      case '7days':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30days':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90days':
        startDate.setDate(startDate.getDate() - 90);
        break;
    }

    // Fetch all relevant data
    const [incidents, alerts, analyses, detections] = await Promise.all([
      base44.entities.Incident.filter({
        reported_date: { $gte: startDate.toISOString() }
      }, '-reported_date', 1000),
      base44.entities.Alert.filter({
        sent_at: { $gte: startDate.toISOString() }
      }, '-sent_at', 1000),
      base44.entities.AIAnalysis.filter({
        created_date: { $gte: startDate.toISOString() }
      }, '-created_date', 1000),
      base44.entities.WeaponsDetection.filter({
        detected_at: { $gte: startDate.toISOString() }
      }, '-detected_at', 1000),
    ]);

    // Generate comprehensive analysis using AI
    const reportPrompt = `Generate a comprehensive security report for the period from ${startDate.toISOString()} to ${endDate.toISOString()}.

Data Summary:
- Total Incidents: ${incidents.length}
- Total Alerts: ${alerts.length}
- AI Analyses: ${analyses.length}
- Weapons Detections: ${detections.length}

Incident Breakdown:
${JSON.stringify(incidents.slice(0, 10), null, 2)}

Provide:
1. Executive Summary
2. Key Security Metrics
3. Threat Landscape Overview
4. Critical Findings
5. Trend Analysis
6. Risk Assessment
7. Recommendations
8. Conclusion

Format as structured report content.`;

    const aiReport = await base44.integrations.Core.InvokeLLM({
      prompt: reportPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          executive_summary: { type: "string" },
          key_metrics: {
            type: "object",
            properties: {
              total_incidents: { type: "number" },
              critical_incidents: { type: "number" },
              resolved_incidents: { type: "number" },
              average_response_time: { type: "string" },
              threat_level: { type: "string" }
            }
          },
          threat_landscape: {
            type: "object",
            properties: {
              primary_threats: { type: "array", items: { type: "string" } },
              emerging_threats: { type: "array", items: { type: "string" } },
              geographic_hotspots: { type: "array", items: { type: "string" } }
            }
          },
          critical_findings: {
            type: "array",
            items: {
              type: "object",
              properties: {
                finding: { type: "string" },
                severity: { type: "string" },
                impact: { type: "string" }
              }
            }
          },
          trend_analysis: { type: "string" },
          risk_assessment: {
            type: "object",
            properties: {
              overall_risk_level: { type: "string" },
              key_risks: { type: "array", items: { type: "string" } },
              mitigation_status: { type: "string" }
            }
          },
          recommendations: {
            type: "array",
            items: {
              type: "object",
              properties: {
                priority: { type: "string" },
                recommendation: { type: "string" },
                expected_impact: { type: "string" }
              }
            }
          },
          conclusion: { type: "string" }
        }
      }
    });

    // Calculate additional statistics
    const stats = {
      incidents: {
        total: incidents.length,
        critical: incidents.filter(i => i.severity === 'critical').length,
        high: incidents.filter(i => i.severity === 'high').length,
        resolved: incidents.filter(i => i.status === 'resolved').length,
        active: incidents.filter(i => i.status === 'active').length,
        byType: incidents.reduce((acc, i) => {
          acc[i.threat_type] = (acc[i.threat_type] || 0) + 1;
          return acc;
        }, {}),
      },
      alerts: {
        total: alerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        bySeverity: alerts.reduce((acc, a) => {
          acc[a.severity] = (acc[a.severity] || 0) + 1;
          return acc;
        }, {}),
      },
      detections: {
        total: detections.length,
        confirmed: detections.filter(d => d.threat_level === 'confirmed').length,
        weapons: detections.reduce((acc, d) => {
          acc[d.weapon_type] = (acc[d.weapon_type] || 0) + 1;
          return acc;
        }, {}),
      },
    };

    const reportData = {
      reportId: crypto.randomUUID(),
      generatedAt: new Date().toISOString(),
      generatedBy: user.full_name,
      timeframe: {
        start: startDate.toISOString(),
        end: endDate.toISOString(),
      },
      reportType: reportType,
      aiAnalysis: aiReport,
      statistics: stats,
      rawData: {
        incidentCount: incidents.length,
        alertCount: alerts.length,
        analysisCount: analyses.length,
        detectionCount: detections.length,
      }
    };

    // Generate PDF if requested
    if (format === 'pdf') {
      const doc = new jsPDF();
      let y = 20;

      // Title
      doc.setFontSize(20);
      doc.text('Security Intelligence Report', 20, y);
      y += 15;

      // Metadata
      doc.setFontSize(10);
      doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, y);
      y += 7;
      doc.text(`Period: ${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`, 20, y);
      y += 7;
      doc.text(`Analyst: ${user.full_name}`, 20, y);
      y += 15;

      // Executive Summary
      doc.setFontSize(14);
      doc.text('Executive Summary', 20, y);
      y += 10;
      doc.setFontSize(10);
      const summaryLines = doc.splitTextToSize(aiReport.executive_summary || 'N/A', 170);
      doc.text(summaryLines, 20, y);
      y += summaryLines.length * 7 + 10;

      // Key Metrics
      if (y > 250) {
        doc.addPage();
        y = 20;
      }
      doc.setFontSize(14);
      doc.text('Key Metrics', 20, y);
      y += 10;
      doc.setFontSize(10);
      doc.text(`Total Incidents: ${stats.incidents.total}`, 20, y);
      y += 7;
      doc.text(`Critical Incidents: ${stats.incidents.critical}`, 20, y);
      y += 7;
      doc.text(`Total Alerts: ${stats.alerts.total}`, 20, y);
      y += 7;
      doc.text(`Weapons Detections: ${stats.detections.total}`, 20, y);

      const pdfBytes = doc.output('arraybuffer');

      return new Response(pdfBytes, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename=security-report-${reportData.reportId}.pdf`
        }
      });
    }

    // Return JSON format
    return Response.json({
      success: true,
      report: reportData,
    });

  } catch (error) {
    console.error('Report generation error:', error);
    
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});