import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    // Get webhook secret from query params for validation
    const url = new URL(req.url);
    const providedSecret = url.searchParams.get('secret');
    const webhookSecret = Deno.env.get('WEBHOOK_SECRET');

    // Validate webhook secret
    if (webhookSecret && providedSecret !== webhookSecret) {
      return Response.json({ error: 'Invalid webhook secret' }, { status: 401 });
    }

    const base44 = createClientFromRequest(req);
    const payload = await req.json();

    const {
      source,
      eventType,
      data,
      timestamp = new Date().toISOString(),
    } = payload;

    if (!source || !eventType || !data) {
      return Response.json({ 
        error: 'Missing required fields: source, eventType, data' 
      }, { status: 400 });
    }

    // Process different webhook types
    switch (source.toLowerCase()) {
      case 'evolv':
      case 'weapons_detection': {
        // Process weapons detection webhook
        const detection = await base44.asServiceRole.entities.WeaponsDetection.create({
          detector_id: data.detectorId || 'webhook-detector',
          location: data.location || 'Unknown Location',
          detected_at: data.detectedAt || timestamp,
          threat_level: data.threatLevel || 'medium',
          weapon_type: data.weaponType || 'unknown',
          confidence_score: data.confidenceScore || 0.5,
          person_id: data.personId || null,
          image_url: data.imageUrl || null,
          cleared: false,
          investigation_status: 'pending',
          metadata: data.metadata || {},
        });

        // Create alert if threat level is high
        if (['high', 'confirmed', 'critical'].includes(data.threatLevel?.toLowerCase())) {
          await base44.asServiceRole.entities.Alert.create({
            title: `Weapons Detection Alert: ${data.weaponType || 'Unknown'}`,
            description: `High-priority weapons detection at ${data.location}`,
            severity: 'critical',
            status: 'active',
            alert_type: 'weapons_detection',
            metadata: {
              detectionId: detection.id,
              source: 'webhook',
            }
          });
        }

        return Response.json({
          success: true,
          detectionId: detection.id,
          processed: true,
        });
      }

      case 'threat_feed':
      case 'intelligence': {
        // Process threat intelligence webhook
        const feed = await base44.asServiceRole.entities.ThreatFeed.create({
          feed_name: data.feedName || source,
          source_type: data.sourceType || 'api',
          threat_type: data.threatType || 'unknown',
          severity: data.severity || 'medium',
          confidence: data.confidence || 0.5,
          indicators: data.indicators || [],
          description: data.description || '',
          raw_data: data,
          last_updated: timestamp,
        });

        return Response.json({
          success: true,
          feedId: feed.id,
          processed: true,
        });
      }

      case 'social_media':
      case 'socmint': {
        // Process social media intelligence webhook
        const intel = await base44.asServiceRole.entities.SocialMediaIntel.create({
          source_type: data.platform || 'unknown',
          content: data.content || '',
          author: data.author || 'unknown',
          posted_at: data.postedAt || timestamp,
          threat_score: data.threatScore || 0,
          sentiment: data.sentiment || 'neutral',
          threat_indicators: data.threatIndicators || [],
          keywords_matched: data.keywords || [],
          flagged: data.threatScore > 60,
          reviewed: false,
        });

        return Response.json({
          success: true,
          intelId: intel.id,
          processed: true,
        });
      }

      case 'incident':
      case 'security_event': {
        // Process security incident webhook
        const incident = await base44.asServiceRole.entities.Incident.create({
          title: data.title || 'External Security Event',
          description: data.description || '',
          threat_type: data.threatType || 'other',
          severity: data.severity || 'medium',
          status: 'active',
          latitude: data.location?.latitude || 0,
          longitude: data.location?.longitude || 0,
          location_name: data.location?.name || 'External Source',
          verified: false,
          source: source,
          reported_date: timestamp,
        });

        return Response.json({
          success: true,
          incidentId: incident.id,
          processed: true,
        });
      }

      case 'geofence':
      case 'location': {
        // Process geofence/location webhook
        const alert = await base44.asServiceRole.entities.Alert.create({
          title: `Geofence Alert: ${data.zoneName || 'Unknown Zone'}`,
          description: data.description || 'Location-based alert triggered',
          severity: data.severity || 'medium',
          status: 'active',
          alert_type: 'geofence',
          metadata: {
            location: data.location,
            zoneName: data.zoneName,
            triggerType: data.triggerType,
            source: 'webhook',
          }
        });

        return Response.json({
          success: true,
          alertId: alert.id,
          processed: true,
        });
      }

      default: {
        // Generic webhook processing
        console.log(`Processing generic webhook from ${source}:`, eventType);

        return Response.json({
          success: true,
          message: 'Webhook received and logged',
          source: source,
          eventType: eventType,
          processed: true,
        });
      }
    }

  } catch (error) {
    console.error('Webhook processing error:', error);
    
    return Response.json({ 
      error: error.message,
      details: error.stack 
    }, { status: 500 });
  }
});