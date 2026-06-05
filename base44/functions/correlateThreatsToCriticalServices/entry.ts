/**
 * Threat Correlation Engine
 * 
 * Correlates threat intelligence with critical services using:
 * - Category semantic matching
 * - Risk scoring based on severity, confidence, exploitation status
 * - AI-generated explanations
 * 
 * Formula: Final Risk Score = 
 *   (Severity × 0.4) + (Confidence × 0.3) + (Active Exploit × 0.2) + (Service Criticality × 0.1)
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    // Authenticate
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins and analysts can run correlation
    if (!['admin', 'command_staff', 'soc_analyst'].includes(user.role)) {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Fetch critical services
    const services = await base44.asServiceRole.entities.CriticalService.list();
    
    // Fetch threat intelligence (using EnrichedThreatIntel)
    const threats = await base44.asServiceRole.entities.EnrichedThreatIntel.list('-created_date', 100);

    const correlations = [];
    const errors = [];

    for (const threat of threats) {
      for (const service of services) {
        try {
          // Category matching - check if threat affects this service category
          const categoryMatch = checkCategoryMatch(threat, service);
          
          if (!categoryMatch) {
            continue; // Skip if categories don't match
          }

          // Calculate scores
          const scores = calculateRiskScores(threat, service);
          
          // Generate AI explanation
          const explanation = await generateExplanation(base44, threat, service, scores);

          // Determine risk label
          const riskLabel = getRiskLabel(scores.finalRiskScore);

          // Create correlation object
          const correlation = {
            threat_id: threat.id,
            critical_service_id: service.id,
            threat_title: threat.indicator || threat.threat_description || 'Unknown Threat',
            threat_type: mapThreatType(threat.threat_category),
            service_name: service.service_name,
            service_category: service.category,
            relevance_score: scores.relevanceScore,
            final_risk_score: Math.round(scores.finalRiskScore),
            risk_label: riskLabel,
            explanation: explanation,
            severity_score: threat.severity_score || 70,
            confidence_score: threat.confidence_level || 70,
            is_actively_exploited: threat.is_active || false,
            business_criticality: service.business_criticality,
            exposure_type: service.exposure_type,
            alert_sent: false
          };

          correlations.push(correlation);
        } catch (err) {
          errors.push({
            threat_id: threat.id,
            service_id: service.id,
            error: err.message
          });
        }
      }
    }

    // Store correlations (upsert to avoid duplicates)
    const savedCorrelations = [];
    for (const corr of correlations) {
      try {
        // Check if correlation already exists
        const existing = await base44.asServiceRole.entities.ThreatCorrelation.filter({
          threat_id: corr.threat_id,
          critical_service_id: corr.critical_service_id
        });

        if (existing.length > 0) {
          // Update existing
          const updated = await base44.asServiceRole.entities.ThreatCorrelation.update(
            existing[0].id,
            corr
          );
          savedCorrelations.push(updated);
        } else {
          // Create new
          const created = await base44.asServiceRole.entities.ThreatCorrelation.create(corr);
          savedCorrelations.push(created);
        }
      } catch (err) {
        errors.push({
          threat_id: corr.threat_id,
          service_id: corr.critical_service_id,
          error: `Failed to save: ${err.message}`
        });
      }
    }

    return Response.json({
      success: true,
      stats: {
        threats_analyzed: threats.length,
        services_checked: services.length,
        correlations_found: correlations.length,
        correlations_saved: savedCorrelations.length,
        errors: errors.length
      },
      correlations: savedCorrelations.slice(0, 10), // Return top 10
      errors: errors.length > 0 ? errors.slice(0, 5) : undefined
    });

  } catch (error) {
    console.error('Correlation error:', error);
    return Response.json({ 
      error: 'Correlation failed', 
      details: error.message 
    }, { status: 500 });
  }
});

/**
 * Check if threat category matches service category
 */
function checkCategoryMatch(threat, service) {
  const threatCategories = [
    threat.threat_category,
    threat.attack_vector,
    ...(threat.associated_tags || [])
  ].filter(Boolean).map(c => c.toLowerCase());

  const serviceCategory = service.category.toLowerCase();
  
  // Direct match
  if (threatCategories.some(tc => tc.includes(serviceCategory) || serviceCategory.includes(tc))) {
    return true;
  }

  // Semantic expansion
  const categoryMap = {
    'authentication': ['auth', 'login', 'sso', 'identity', 'credential'],
    'payments': ['payment', 'transaction', 'billing', 'checkout', 'financial'],
    'data storage': ['database', 'storage', 'data', 'backup', 's3', 'blob'],
    'api gateway': ['api', 'gateway', 'endpoint', 'rest', 'graphql'],
    'admin portal': ['admin', 'management', 'control panel', 'dashboard'],
    'email services': ['email', 'smtp', 'mail', 'messaging'],
    'infrastructure': ['server', 'cloud', 'network', 'infrastructure', 'compute']
  };

  const expandedCategories = categoryMap[serviceCategory] || [];
  
  return threatCategories.some(tc => 
    expandedCategories.some(ec => tc.includes(ec) || ec.includes(tc))
  );
}

/**
 * Calculate risk scores
 */
function calculateRiskScores(threat, service) {
  const severity = threat.severity_score || 70;
  const confidence = threat.confidence_level || 70;
  const isExploited = threat.is_active || false;
  const criticality = service.business_criticality;

  // Service criticality weight
  const criticalityWeight = {
    'HIGH': 30,
    'MEDIUM': 15,
    'LOW': 5
  }[criticality] || 15;

  // Relevance score (0-100)
  const relevanceScore = Math.min(100, Math.round(
    (isExploited ? 30 : 0) +
    (severity * 0.4) +
    (confidence * 0.3)
  ));

  // Final risk score (0-100)
  const finalRiskScore = Math.min(100, Math.round(
    (severity * 0.4) +
    (confidence * 0.3) +
    (isExploited ? 20 : 0) +
    criticalityWeight
  ));

  return { relevanceScore, finalRiskScore };
}

/**
 * Generate AI explanation
 */
async function generateExplanation(base44, threat, service, scores) {
  try {
    const prompt = `Generate a 2-3 sentence explanation of why this threat is relevant to this service. Use enterprise security language, be direct, avoid hyperbole.

Threat: ${threat.indicator || threat.threat_description}
Category: ${threat.threat_category}
Severity: ${threat.severity_score || 70}/100
Actively Exploited: ${threat.is_active ? 'Yes' : 'No'}

Service: ${service.service_name}
Category: ${service.category}
Business Criticality: ${service.business_criticality}
Exposure: ${service.exposure_type}

Risk Score: ${scores.finalRiskScore}/100

Rules:
- Be specific about the threat vector
- Explain why it impacts this specific service category
- Mention business criticality and exposure if relevant
- No marketing language, no emojis
- Keep it under 60 words`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: prompt,
      add_context_from_internet: false
    });

    return result || 'This threat matches your service category and security profile.';
  } catch (err) {
    console.error('AI explanation failed:', err);
    // Fallback explanation
    return `This ${threat.threat_category || 'threat'} targets ${service.category} services. Your ${service.service_name} is marked as ${service.business_criticality} criticality and ${service.exposure_type} exposure, increasing its risk profile.`;
  }
}

/**
 * Map threat category to standard type
 */
function mapThreatType(category) {
  const mapping = {
    'vulnerability': 'VULNERABILITY',
    'cve': 'VULNERABILITY',
    'exploit': 'VULNERABILITY',
    'campaign': 'CAMPAIGN',
    'apt': 'CAMPAIGN',
    'malware': 'MALWARE',
    'ransomware': 'MALWARE',
    'trojan': 'MALWARE',
    'infrastructure': 'INFRASTRUCTURE',
    'c2': 'INFRASTRUCTURE',
    'botnet': 'INFRASTRUCTURE'
  };

  const cat = (category || '').toLowerCase();
  for (const [key, value] of Object.entries(mapping)) {
    if (cat.includes(key)) return value;
  }
  return 'OTHER';
}

/**
 * Get risk label from score
 */
function getRiskLabel(score) {
  if (score >= 80) return 'Critical';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Medium';
  return 'Low';
}