import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));
const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

Deno.serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    // Verify webhook signature
    let event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return Response.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Handle different event types
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Update user subscription status
        await base44.asServiceRole.entities.User.update(
          session.metadata.userId,
          {
            stripe_customer_id: session.customer,
            subscription_status: 'active',
            subscription_tier: session.metadata.tier || 'residential',
          }
        );

        // Send welcome email
        await base44.asServiceRole.integrations.Core.SendEmail({
          to: session.metadata.userEmail,
          subject: 'Welcome to Izulu Sentinel',
          body: `Thank you for subscribing to Izulu Sentinel! Your account is now active.`
        });

        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        
        // Find user by customer ID
        const users = await base44.asServiceRole.entities.User.filter({
          stripe_customer_id: subscription.customer
        });

        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: subscription.status,
            subscription_current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          });
        }

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Find user by customer ID
        const users = await base44.asServiceRole.entities.User.filter({
          stripe_customer_id: subscription.customer
        });

        if (users.length > 0) {
          await base44.asServiceRole.entities.User.update(users[0].id, {
            subscription_status: 'canceled',
            subscription_tier: 'free',
          });

          // Send cancellation email
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: users[0].email,
            subject: 'Subscription Canceled',
            body: `Your Izulu Sentinel subscription has been canceled. You will retain access until the end of your billing period.`
          });
        }

        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        
        // Log successful payment
        await base44.asServiceRole.entities.User.filter({
          stripe_customer_id: invoice.customer
        }).then(users => {
          if (users.length > 0) {
            console.log(`Payment succeeded for user ${users[0].email}`);
          }
        });

        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        
        // Find user and send payment failed notification
        const users = await base44.asServiceRole.entities.User.filter({
          stripe_customer_id: invoice.customer
        });

        if (users.length > 0) {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: users[0].email,
            subject: 'Payment Failed - Action Required',
            body: `Your recent payment failed. Please update your payment method to continue your Izulu Sentinel subscription.`
          });
        }

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return Response.json({ received: true });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return Response.json({ 
      error: error.message 
    }, { status: 500 });
  }
});