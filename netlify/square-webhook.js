import { WebhooksHelper } from 'square';
import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const signature = event.headers['x-square-hmacsha256-signature'];
  const signatureKey = process.env.SQUARE_WEBHOOK_SIGNATURE_KEY;
  const notificationUrl = process.env.SQUARE_WEBHOOK_URL;

  if (!signature) {
    console.error('No Square signature header found');
    return { statusCode: 400, body: 'No signature' };
  }

  const body = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  const isValid = await WebhooksHelper.verifySignature({
    requestBody: body,
    signatureHeader: signature,
    signatureKey,
    notificationUrl,
  });

  if (!isValid) {
    console.error('⚠️ SECURITY: Square webhook signature verification failed');
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Signature verification failed' }),
    };
  }

  const squareEvent = JSON.parse(body);
  console.log('✅ Square webhook received:', squareEvent.type);

  // Only process payment.updated events
  if (squareEvent.type !== 'payment.updated') {
    return { statusCode: 200, body: JSON.stringify({ received: true, processed: false }) };
  }

  const payment = squareEvent.data?.object?.payment;
  const holdId = payment?.note;

  // If payment failed or was cancelled, release the hold immediately
  if (payment?.status === 'FAILED' || payment?.status === 'CANCELED') {
    console.log(`⚠️ Payment ${payment.status} — releasing hold:`, holdId);
    if (holdId) {
      const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
      await supabase.from('numbers').update({ status: 'available', hold_expires_at: null, hold_id: null }).eq('hold_id', holdId).eq('status', 'held');
      await supabase.from('holds').delete().eq('id', holdId);
    }
    return { statusCode: 200, body: JSON.stringify({ received: true, processed: false, status: payment?.status }) };
  }

  if (payment?.status !== 'COMPLETED') {
    return { statusCode: 200, body: JSON.stringify({ received: true, processed: false, status: payment?.status }) };
  }

  if (!holdId) {
    console.error('❌ No holdId found in payment.note');
    return { statusCode: 400, body: JSON.stringify({ error: 'No holdId in payment note' }) };
  }

  console.log('⏳ Processing Square payment for holdId:', holdId);

  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
    );

    // Get hold details
    const { data: hold, error: holdError } = await supabase
      .from('holds')
      .select('*')
      .eq('id', holdId)
      .single();

    if (holdError || !hold) {
      console.error('❌ Hold not found:', holdError?.message);
      return { statusCode: 404, body: JSON.stringify({ error: 'Hold not found', holdId }) };
    }

    console.log('✅ Found hold for board:', hold.board_id);

    // Idempotency check (stripe_payment_intent column repurposed for Square payment ID)
    const { data: existingPurchase } = await supabase
      .from('purchases')
      .select('id')
      .eq('stripe_payment_intent', payment.id)
      .maybeSingle();

    if (existingPurchase) {
      console.log('⚠️ Payment already processed (idempotent)');
      return { statusCode: 200, body: JSON.stringify({ received: true, processed: false }) };
    }

    // Mark numbers as sold
    const { data: updatedNumbers, error: updateError } = await supabase
      .from('numbers')
      .update({
        status: 'sold',
        display_name: hold.display_name,
        message: hold.message,
        hold_expires_at: null,
        hold_id: null,
        promo_code: null,
      })
      .eq('hold_id', holdId)
      .eq('status', 'held')
      .select();

    if (updateError) {
      console.error('❌ Error updating numbers:', updateError.message);
      return { statusCode: 500, body: JSON.stringify({ error: 'Error updating numbers', details: updateError.message }) };
    }

    console.log(`✅ Updated ${updatedNumbers?.length || 0} numbers to sold`);

    // Create purchase record
    const { error: purchaseError } = await supabase
      .from('purchases')
      .insert({
        board_id: hold.board_id,
        email: hold.email,
        phone: hold.phone,
        display_name: hold.display_name,
        message: hold.message,
        amount_cents: payment.total_money?.amount ?? 0,
        stripe_payment_intent: payment.id, // column repurposed for Square payment ID
      });

    if (purchaseError) {
      console.error('❌ Error creating purchase:', purchaseError.message);
      // Rollback numbers to held
      await supabase
        .from('numbers')
        .update({ status: 'held', hold_id: holdId })
        .in('id', updatedNumbers.map(n => n.id));
      return { statusCode: 500, body: JSON.stringify({ error: 'Error creating purchase' }) };
    }

    // Clean up hold
    await supabase.from('holds').delete().eq('id', holdId);

    console.log('✅✅✅ Square payment processed successfully');
    return { statusCode: 200, body: JSON.stringify({ received: true, processed: true }) };

  } catch (error) {
    console.error('Error processing Square payment:', error);
    return { statusCode: 500, body: `Error: ${error.message}` };
  }
}
