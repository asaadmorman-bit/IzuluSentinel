import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import twilio from 'npm:twilio@5.0.4';

const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

const client = twilio(accountSid, authToken);

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { phoneNumber, message, alertType = 'general', incidentId } = await req.json();

    if (!phoneNumber || !message) {
      return Response.json({ 
        error: 'Phone number and message are required' 
      }, { status: 400 });
    }

    // Validate user has permission to send alerts
    if (!['admin', 'command_staff', 'soc_analyst', 'security_personnel'].includes(user.role)) {
      return Response.json({ 
        error: 'Insufficient permissions to send SMS alerts' 
      }, { status: 403 });
    }

    // Format message with alert type prefix
    const formattedMessage = `[${alertType.toUpperCase()}] ${message} - Izulu Sentinel`;

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: formattedMessage,
      from: twilioPhoneNumber,
      to: phoneNumber,
    });

    // Log the alert in database
    await base44.entities.Alert.create({
      title: `SMS Alert: ${alertType}`,
      description: message,
      severity: alertType === 'emergency' ? 'critical' : alertType === 'warning' ? 'high' : 'medium',
      status: 'sent',
      alert_type: 'sms',
      recipients: [phoneNumber],
      sent_at: new Date().toISOString(),
      sent_by: user.email,
      incident_id: incidentId || null,
      external_id: twilioMessage.sid,
      metadata: {
        twilioSid: twilioMessage.sid,
        twilioStatus: twilioMessage.status,
      }
    });

    return Response.json({
      success: true,
      messageSid: twilioMessage.sid,
      status: twilioMessage.status,
      phoneNumber: phoneNumber,
    });

  } catch (error) {
    console.error('SMS alert error:', error);
    
    return Response.json({ 
      error: error.message,
      code: error.code 
    }, { status: 500 });
  }
});