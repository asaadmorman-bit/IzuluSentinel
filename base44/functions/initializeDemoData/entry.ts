import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';

Deno.serve(async (req) => {
    try {
        const base44 = createClientFromRequest(req);
        
        // Check for existing data
        const existingIncidents = await base44.asServiceRole.entities.Incident.list('-created_date', 1);
        
        if (existingIncidents.length > 0) {
            return Response.json({ 
                message: "Demo data already exists",
                initialized: true 
            });
        }

        // Create sample incidents
        await base44.asServiceRole.entities.Incident.bulkCreate([
            {
                title: "Critical: Unauthorized Network Access",
                description: "Multiple failed authentication attempts detected from IP range 192.168.1.x. Pattern suggests coordinated attack.",
                threat_type: "cybersecurity",
                severity: "critical",
                status: "active",
                latitude: 40.7128,
                longitude: -74.0060,
                location_name: "New York, NY",
                verified: true,
                source: "Intrusion Detection System",
                recommendation: "Block IP range, reset credentials, investigate access logs"
            },
            {
                title: "High: Data Exfiltration Detected",
                description: "Unusual outbound traffic pattern identified. Large data transfer to unknown external server.",
                threat_type: "cybersecurity",
                severity: "high",
                status: "monitoring",
                latitude: 34.0522,
                longitude: -118.2437,
                location_name: "Los Angeles, CA",
                verified: true,
                source: "Network Monitor",
                recommendation: "Isolate affected systems, analyze traffic patterns"
            },
            {
                title: "Medium: Physical Perimeter Breach",
                description: "Motion sensors triggered at facility Zone 3. Security team dispatched.",
                threat_type: "crime",
                severity: "medium",
                status: "contained",
                latitude: 41.8781,
                longitude: -87.6298,
                location_name: "Chicago, IL",
                verified: false,
                source: "Physical Security Systems"
            },
            {
                title: "Low: Suspicious Email Campaign",
                description: "Phishing attempt detected targeting employees. Email filters activated.",
                threat_type: "cybersecurity",
                severity: "low",
                status: "resolved",
                latitude: 47.6062,
                longitude: -122.3321,
                location_name: "Seattle, WA",
                verified: true,
                source: "Email Security Gateway"
            }
        ]);

        // Create sample alerts
        await base44.asServiceRole.entities.Alert.bulkCreate([
            {
                title: "Critical Security Event",
                message: "High-priority threat detected requiring immediate SOC response",
                priority: "critical",
                category: "threat",
                status: "active",
                affected_regions: ["Northeast", "Mid-Atlantic"]
            },
            {
                title: "Asset Movement Alert",
                message: "Protected asset movement detected outside designated safe zone",
                priority: "high",
                category: "alert",
                status: "active",
                affected_regions: ["West Coast"]
            },
            {
                title: "System Update Available",
                message: "Security patch available for deployment",
                priority: "medium",
                category: "system",
                status: "active",
                affected_regions: ["All Regions"]
            }
        ]);

        // Create sample assets
        await base44.asServiceRole.entities.Asset.bulkCreate([
            {
                name: "Corporate Headquarters",
                asset_type: "facility",
                current_location: "New York, NY",
                latitude: 40.7580,
                longitude: -73.9855,
                status: "safe",
                security_level: "high",
                last_check_in: new Date().toISOString()
            },
            {
                name: "Data Center - Primary",
                asset_type: "facility",
                current_location: "Ashburn, VA",
                latitude: 39.0438,
                longitude: -77.4874,
                status: "safe",
                security_level: "maximum",
                last_check_in: new Date().toISOString()
            },
            {
                name: "Executive Protection - CEO",
                asset_type: "executive",
                current_location: "San Francisco, CA",
                latitude: 37.7749,
                longitude: -122.4194,
                status: "in_transit",
                security_level: "elevated",
                last_check_in: new Date(Date.now() - 10 * 60 * 1000).toISOString()
            },
            {
                name: "Mobile Command Unit Alpha",
                asset_type: "vehicle",
                current_location: "Miami, FL",
                latitude: 25.7617,
                longitude: -80.1918,
                status: "safe",
                security_level: "standard",
                last_check_in: new Date().toISOString()
            }
        ]);

        return Response.json({ 
            message: "Demo data initialized successfully",
            initialized: true,
            counts: {
                incidents: 4,
                alerts: 3,
                assets: 4
            }
        });
    } catch (error) {
        return Response.json({ 
            error: error.message,
            initialized: false 
        }, { status: 500 });
    }
});