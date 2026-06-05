/**
 * Send threat alert emails for high-risk correlations
 * 
 * Triggers: 
 * - final_risk_score >= 80 (Critical)
 * - exposure_type = INTERNET or HYBRID
 * - alert not already sent
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and analysts can send alerts
    if (!['admin', 'command_staff', 'soc_analyst'].includes(user.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { correlationId, recipients } = await req.json();

    // Fetch correlation details
    const correlation = await base44.asServiceRole.entities.ThreatCorrelation.get(correlationId);
    
    if (!correlation) {
      return Response.json({ error: 'Correlation not found' }, { status: 404 });
    }

    // Check if already sent
    if (correlation.alert_sent) {
      return Response.json({ 
        success: false, 
        message: 'Alert already sent for this correlation' 
      });
    }

    // Build email content
    const subject = `[${correlation.risk_label.toUpperCase()}] Threat impacting ${correlation.service_category}`;
    
    const body = buildAlertEmail(correlation);

    // Send email to recipients
    const emailRecipients = recipients || [user.email];
    
    for (const recipient of emailRecipients) {
      try {
        await base44.asServiceRole.integrations.Core.SendEmail({
          from_name: 'iZulu Sentinel',
          to: recipient,
          subject: subject,
          body: body
        });
      } catch (err) {
        console.error(`Failed to send alert to ${recipient}:`, err);
      }
    }

    // Mark as sent
    await base44.asServiceRole.entities.ThreatCorrelation.update(correlationId, {
      alert_sent: true
    });

    // Create alert record
    await base44.asServiceRole.entities.Alert.create({
      title: correlation.threat_title,
      message: `Critical threat detected: ${correlation.threat_title}`,
      priority: correlation.risk_label === 'Critical' ? 'critical' : 'high',
      category: 'threat',
      status: 'active'
    });

    return Response.json({
      success: true,
      message: `Alert sent to ${emailRecipients.length} recipient(s)`,
      recipients: emailRecipients
    });

  } catch (error) {
    console.error('Alert sending error:', error);
    return Response.json({ 
      error: 'Failed to send alert', 
      details: error.message 
    }, { status: 500 });
  }
});

/**
 * Build alert email HTML
 */
function buildAlertEmail(correlation) {
  const riskColor = correlation.risk_label === 'Critical' ? '#b00020' : 
                    correlation.risk_label === 'High' ? '#ff6f00' : '#ffa000';

  return `
<!DOCTYPE html>
<html>
  <body style="font-family: Arial, sans-serif; background:#f5f6f8; padding:20px;">
    <table width="100%" bgcolor="#ffffff" cellpadding="20" style="max-width:600px; margin:0 auto;">
      <tr>
        <td>
          <h2 style="color:${riskColor};">${correlation.risk_label} Threat Detected</h2>

          <p><strong>Threat:</strong> ${correlation.threat_title}</p>
          <p><strong>Service Category:</strong> ${correlation.service_category}</p>
          <p><strong>Service Name:</strong> ${correlation.service_name}</p>
          <p><strong>Risk Score:</strong> ${correlation.final_risk_score}/100</p>
          <p><strong>Type:</strong> ${correlation.threat_type}</p>

          <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;" />

          <h3 style="color:#333;">Why This Matters</h3>
          <p style="line-height:1.6;">${correlation.explanation}</p>

          <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;" />

          <h3 style="color:#333;">Threat Details</h3>
          <ul style="line-height:1.8;">
            <li><strong>Severity:</strong> ${correlation.severity_score}/100</li>
            <li><strong>Confidence:</strong> ${correlation.confidence_score}%</li>
            <li><strong>Active Exploitation:</strong> ${correlation.is_actively_exploited ? 'Yes ⚠️' : 'No'}</li>
            <li><strong>Business Criticality:</strong> ${correlation.business_criticality}</li>
            <li><strong>Exposure:</strong> ${correlation.exposure_type}</li>
          </ul>

          <hr style="border:none; border-top:1px solid #ddd; margin:20px 0;" />

          <p>
            <strong>Recommended Action:</strong><br />
            Review ${correlation.service_category} service controls and monitor for suspicious activity.
          </p>

          <p style="font-size:12px;color:#666; margin-top:30px;">
            Detected: ${new Date().toUTCString()}<br/>
            iZulu Sentinel - Enterprise Threat Intelligence Platform
          </p>
        </td>
      </tr>
    </table>
  </body>
</html>
  `.trim();
}