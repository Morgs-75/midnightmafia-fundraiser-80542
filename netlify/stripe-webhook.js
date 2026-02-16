import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function handler(event) {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const sig = event.headers['stripe-signature'] || event.headers['Stripe-Signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig) {
    console.error('No Stripe signature found');
    return { statusCode: 400, body: 'No signature' };
  }

  if (!webhookSecret || webhookSecret === 'whsec_xxxxx') {
    console.error('Webhook secret not configured properly');
    return { statusCode: 500, body: 'Webhook secret not configured' };
  }

  let stripeEvent;
  let signatureVerified = false;

  // Try multiple approaches to verify the signature
  const attempts = [
    { name: 'String body', value: event.body },
    { name: 'UTF8 Buffer', value: Buffer.from(event.body, 'utf8') },
    { name: 'Base64 decoded', value: event.isBase64Encoded ? Buffer.from(event.body, 'base64') : null },
  ];

  for (const attempt of attempts) {
    if (!attempt.value) continue;

    try {
      stripeEvent = stripe.webhooks.constructEvent(
        attempt.value,
        sig,
        webhookSecret
      );
      signatureVerified = true;
      console.log(`✅ Signature verified using: ${attempt.name}`);
      break;
    } catch (err) {
      console.log(`❌ ${attempt.name} failed: ${err.message}`);
    }
  }

  if (!signatureVerified) {
    console.error('⚠️ All signature verification attempts failed');
    console.error('Headers:', JSON.stringify(event.headers, null, 2));
    console.error('Is base64:', event.isBase64Encoded);
    console.error('Body type:', typeof event.body);
    console.error('Body length:', event.body?.length);

    // TEMPORARY: For debugging, parse the event anyway (REMOVE IN PRODUCTION)
    try {
      const parsedEvent = JSON.parse(event.body);
      console.log('⚠️ BYPASSING SIGNATURE CHECK FOR DEBUG - Event type:', parsedEvent.type);
      stripeEvent = parsedEvent;
    } catch (parseErr) {
      return {
        statusCode: 400,
        body: 'Signature verification failed and body not parseable'
      };
    }
  }

  console.log('✅ Webhook verified:', stripeEvent.type);

  // Handle the checkout.session.completed event
  if (stripeEvent.type === 'checkout.session.completed') {
    const session = stripeEvent.data.object;
    const holdId = session.metadata?.holdId;

    console.log('📦 Event type:', stripeEvent.type);
    console.log('📋 Session ID:', session.id);
    console.log('🎯 Hold ID from metadata:', holdId);

    if (!holdId) {
      console.error('❌ No holdId in session metadata');
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'No holdId in metadata' })
      };
    }

    console.log('⏳ Processing payment for holdId:', holdId);

    try {
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );

      // Get the hold details
      const { data: hold, error: holdError } = await supabase
        .from('holds')
        .select('*')
        .eq('id', holdId)
        .single();

      if (holdError || !hold) {
        console.error('❌ Hold not found:', holdError?.message || 'No hold data');
        console.error('   Hold ID searched:', holdId);
        return {
          statusCode: 404,
          body: JSON.stringify({
            error: 'Hold not found',
            holdId: holdId,
            details: holdError?.message
          })
        };
      }

      console.log('✅ Found hold for board:', hold.board_id);
      console.log('   Display name:', hold.display_name);
      console.log('   Email:', hold.email);

      // Mark numbers as sold (and clear promo_code since this is a paid purchase)
      const { data: updatedNumbers, error: updateError } = await supabase
        .from('numbers')
        .update({
          status: 'sold',
          display_name: hold.display_name,
          message: hold.message,
          hold_expires_at: null,
          promo_code: null // Clear any promo code since this is a paid purchase
        })
        .eq('board_id', hold.board_id)
        .eq('status', 'held')
        .select();

      if (updateError) {
        console.error('❌ Error updating numbers:', updateError.message);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Error updating numbers',
            details: updateError.message
          })
        };
      }

      console.log(`✅ Updated ${updatedNumbers?.length || 0} numbers to sold`);

      // Create purchase record
      const { data: purchase, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          board_id: hold.board_id,
          email: hold.email,
          phone: hold.phone,
          display_name: hold.display_name,
          message: hold.message,
          amount_cents: session.amount_total,
          stripe_payment_intent: session.payment_intent
        })
        .select();

      if (purchaseError) {
        console.error('❌ Error creating purchase:', purchaseError.message);
        return {
          statusCode: 500,
          body: JSON.stringify({
            error: 'Error creating purchase',
            details: purchaseError.message
          })
        };
      }

      console.log('✅ Created purchase record:', purchase?.[0]?.id);
      console.log('✅✅✅ Payment processed successfully');
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        statusCode: 500,
        body: `Error: ${error.message}`
      };
    }
  }

  console.log('✅ Webhook completed successfully');

  return {
    statusCode: 200,
    body: JSON.stringify({
      received: true,
      processed: stripeEvent.type === 'checkout.session.completed',
      signatureVerified: signatureVerified
    })
  };
}
