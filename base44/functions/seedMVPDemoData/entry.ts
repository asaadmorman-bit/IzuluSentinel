/**
 * Seed MVP Demo Data
 * 
 * Creates:
 * - Critical services (Auth, Payments, Admin)
 * - Threat intelligence (Campaigns, Vulnerabilities, Malware)
 * - Runs correlation
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only admins can seed data
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin only' }, { status: 403 });
    }

    const results = {
      services: [],
      threats: [],
      correlations: null
    };

    // 1. Create Critical Services
    const services = [
      {
        service_name: 'Customer Authentication API',
        category: 'Authentication',
        business_criticality: 'HIGH',
        exposure_type: 'INTERNET',
        description: 'Primary authentication service for customer logins',
        owner_email: user.email
      },
      {
        service_name: 'Payment Processing Gateway',
        category: 'Payments',
        business_criticality: 'HIGH',
        exposure_type: 'INTERNET',
        description: 'Handles all payment transactions and PCI data',
        owner_email: user.email
      },
      {
        service_name: 'Admin Control Panel',
        category: 'Admin Portal',
        business_criticality: 'MEDIUM',
        exposure_type: 'INTERNAL',
        description: 'Internal admin portal for system management',
        owner_email: user.email
      },
      {
        service_name: 'API Gateway',
        category: 'API Gateway',
        business_criticality: 'HIGH',
        exposure_type: 'INTERNET',
        description: 'Main API gateway routing all external requests',
        owner_email: user.email
      },
      {
        service_name: 'Customer Data Warehouse',
        category: 'Data Storage',
        business_criticality: 'HIGH',
        exposure_type: 'INTERNAL',
        description: 'Primary customer data storage and analytics',
        owner_email: user.email
      }
    ];

    for (const svc of services) {
      try {
        const created = await base44.asServiceRole.entities.CriticalService.create(svc);
        results.services.push(created);
      } catch (err) {
        console.error('Failed to create service:', err);
      }
    }

    // 2. Create Enriched Threat Intelligence
    const threats = [
      {
        indicator: 'CVE-2024-8899',
        threat_description: 'Active Credential Harvesting Campaign',
        threat_category: 'Campaign',
        attack_vector: 'Phishing targeting enterprise login portals',
        severity_score: 85,
        confidence_level: 90,
        is_active: true,
        ioc_type: 'Campaign',
        associated_tags: ['Authentication', 'Phishing', 'Credential Theft'],
        geographical_context: 'Global',
        mitigation_steps: 'Enable MFA, monitor for suspicious login patterns'
      },
      {
        indicator: 'CVE-2024-9001',
        threat_description: 'Payment API Remote Code Execution Vulnerability',
        threat_category: 'Vulnerability',
        attack_vector: 'Unauthenticated RCE in payment processing frameworks',
        severity_score: 92,
        confidence_level: 85,
        is_active: false,
        ioc_type: 'CVE',
        associated_tags: ['Payments', 'RCE', 'API'],
        geographical_context: 'Global',
        mitigation_steps: 'Apply security patches, restrict API access'
      },
      {
        indicator: 'MALWARE-2024-112',
        threat_description: 'Admin Panel Brute Force Automation Tool',
        threat_category: 'Malware',
        attack_vector: 'Automated credential stuffing against admin interfaces',
        severity_score: 65,
        confidence_level: 75,
        is_active: true,
        ioc_type: 'Malware',
        associated_tags: ['Admin Portal', 'Brute Force', 'Credential Stuffing'],
        geographical_context: 'North America',
        mitigation_steps: 'Implement rate limiting, use CAPTCHA'
      },
      {
        indicator: 'CAMPAIGN-2024-AUTH',
        threat_description: 'API Gateway DDoS Campaign',
        threat_category: 'Infrastructure',
        attack_vector: 'Distributed denial of service targeting API gateways',
        severity_score: 78,
        confidence_level: 80,
        is_active: true,
        ioc_type: 'Campaign',
        associated_tags: ['API Gateway', 'DDoS', 'Infrastructure'],
        geographical_context: 'Global',
        mitigation_steps: 'Enable DDoS protection, use CDN'
      },
      {
        indicator: 'CVE-2024-7755',
        threat_description: 'Database Injection Vulnerability in Analytics Platforms',
        threat_category: 'Vulnerability',
        attack_vector: 'SQL injection in data warehouse connectors',
        severity_score: 88,
        confidence_level: 70,
        is_active: false,
        ioc_type: 'CVE',
        associated_tags: ['Data Storage', 'SQL Injection', 'Database'],
        geographical_context: 'Global',
        mitigation_steps: 'Update database drivers, validate inputs'
      }
    ];

    for (const threat of threats) {
      try {
        const created = await base44.asServiceRole.entities.EnrichedThreatIntel.create(threat);
        results.threats.push(created);
      } catch (err) {
        console.error('Failed to create threat:', err);
      }
    }

    // 3. Run Correlation
    try {
      const correlationResult = await base44.asServiceRole.functions.invoke(
        'correlateThreatsToCriticalServices',
        {}
      );
      results.correlations = correlationResult;
    } catch (err) {
      console.error('Correlation failed:', err);
      results.correlations = { error: err.message };
    }

    return Response.json({
      success: true,
      message: 'MVP demo data seeded successfully',
      stats: {
        services_created: results.services.length,
        threats_created: results.threats.length,
        correlation_result: results.correlations
      },
      data: results
    });

  } catch (error) {
    console.error('Seeding error:', error);
    return Response.json({ 
      error: 'Failed to seed data', 
      details: error.message 
    }, { status: 500 });
  }
});