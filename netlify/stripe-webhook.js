import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  // Get the signature from headers (case-insensitive)
  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  // Get raw body - Netlify may base64 encode binary data
  let body = event.body;
  if (event.isBase64Encoded) {
    body = Buffer.from(event.body, 'base64').toString('utf8');
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(
      body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: err.message })
    };
  }

  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const holdId = session.metadata.holdId;

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: hold } = await supabase
      .from('holds')
      .select('*')
      .eq('id', holdId)
      .single();

    // Mark numbers sold
    await supabase
      .from('numbers')
      .update({
        status: 'sold',
        display_name: hold.display_name,
        message: hold.message,
        hold_expires_at: null
      })
      .eq('board_id', hold.board_id)
      .eq('status', 'held');

    await supabase.from('purchases').insert({
      board_id: hold.board_id,
      email: hold.email,
      phone: hold.phone,
      display_name: hold.display_name,
      message: hold.message,
      amount_cents: session.amount_total,
      stripe_payment_intent: session.payment_intent
    });
  }

  return { statusCode: 200 };
}
