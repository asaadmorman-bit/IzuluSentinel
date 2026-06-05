import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { 
      emergencyType, 
      location, 
      description, 
      severity = 'critical',
      notifyContacts = true 
    } = await req.json();

    if (!emergencyType || !location) {
      return Response.json({ 
        error: 'Emergency type and location are required' 
      }, { status: 400 });
    }

    // Create emergency incident
    const incident = await base44.entities.Incident.create({
      title: `EMERGENCY: ${emergencyType}`,
      description: description || `Emergency alert triggered by ${user.full_name}`,
      threat_type: emergencyType,
      severity: severity,
      status: 'active',
      latitude: location.latitude,
      longitude: location.longitude,
      location_name: location.address || 'Emergency Location',
      verified: true,
      source: 'panic_button',
      reported_date: new Date().toISOString(),
      recommendation: 'Immediate response required - Emergency alert activated',
    });

    // Get emergency contacts
    const emergencyContacts = user.emergency_contacts || [];
    const notificationPromises = [];

    if (notifyContacts && emergencyContacts.length > 0) {
      // Send email to all emergency contacts
      for (const contact of emergencyContacts) {
        notificationPromises.push(
          base44.integrations.Core.SendEmail({
            to: contact.email,
            subject: `🚨 EMERGENCY ALERT - ${user.full_name}`,
            body: `
EMERGENCY ALERT

User: ${user.full_name}
Email: ${user.email}
Emergency Type: ${emergencyType}
Location: ${location.address || 'See coordinates'}
Coordinates: ${location.latitude}, ${location.longitude}
Time: ${new Date().toISOString()}

Description: ${description || 'Emergency button activated'}

This is an automated emergency alert from Izulu Sentinel.
            `.trim()
          })
        );
      }
    }

    // Notify command staff
    const commandStaff = await base44.entities.User.filter({ 
      role: { $in: ['admin', 'command_staff'] } 
    });

    for (const staff of commandStaff) {
      notificationPromises.push(
        base44.integrations.Core.SendEmail({
          to: staff.email,
          subject: `🚨 Emergency Alert - ${user.full_name}`,
          body: `
Emergency alert has been triggered.

User: ${user.full_name} (${user.email})
Type: ${emergencyType}
Location: ${location.latitude}, ${location.longitude}
Address: ${location.address || 'Unknown'}

Incident ID: ${incident.id}

Immediate action required.
          `.trim()
        })
      );
    }

    // Create alert record
    const alert = await base44.entities.Alert.create({
      title: `EMERGENCY: ${emergencyType}`,
      description: `Emergency alert from ${user.full_name}`,
      severity: 'critical',
      status: 'active',
      alert_type: 'emergency',
      recipients: [...emergencyContacts.map(c => c.email), ...commandStaff.map(s => s.email)],
      sent_at: new Date().toISOString(),
      sent_by: user.email,
      incident_id: incident.id,
      metadata: {
        location: location,
        emergencyType: emergencyType,
        triggerMethod: 'panic_button'
      }
    });

    // Wait for all notifications to send
    await Promise.allSettled(notificationPromises);

    return Response.json({
      success: true,
      incidentId: incident.id,
      alertId: alert.id,
      notificationsSent: emergencyContacts.length + commandStaff.length,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Emergency alert error:', error);
    
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});