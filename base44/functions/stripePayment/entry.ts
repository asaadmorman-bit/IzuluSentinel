import { createClientFromRequest } from 'npm:@base44/sdk@0.8.4';
import Stripe from 'npm:stripe@14.11.0';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action, priceId, customerId, subscriptionId } = await req.json();

    // Create checkout session
    if (action === 'create_checkout') {
      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.get('origin')}/Subscription?success=true`,
        cancel_url: `${req.headers.get('origin')}/Subscription?canceled=true`,
        customer_email: user.email,
        metadata: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      return Response.json({ 
        sessionId: session.id,
        url: session.url 
      });
    }

    // Create customer portal session
    if (action === 'create_portal') {
      if (!customerId) {
        return Response.json({ error: 'Customer ID required' }, { status: 400 });
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${req.headers.get('origin')}/Subscription`,
      });

      return Response.json({ url: session.url });
    }

    // Cancel subscription
    if (action === 'cancel_subscription') {
      if (!subscriptionId) {
        return Response.json({ error: 'Subscription ID required' }, { status: 400 });
      }

      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

      return Response.json({ subscription });
    }

    // Get customer subscriptions
    if (action === 'get_subscriptions') {
      const customers = await stripe.customers.list({
        email: user.email,
        limit: 1,
      });

      if (customers.data.length === 0) {
        return Response.json({ subscriptions: [] });
      }

      const subscriptions = await stripe.subscriptions.list({
        customer: customers.data[0].id,
        limit: 10,
      });

      return Response.json({ 
        subscriptions: subscriptions.data,
        customer: customers.data[0]
      });
    }

    // Create payment intent for one-time payment
    if (action === 'create_payment_intent') {
      const { amount, currency = 'usd', description } = await req.json();

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        description: description,
        metadata: {
          userId: user.id,
          userEmail: user.email,
        },
      });

      return Response.json({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Stripe payment error:', error);
    return Response.json({ 
      error: error.message,
      type: error.type 
    }, { status: 500 });
  }
});