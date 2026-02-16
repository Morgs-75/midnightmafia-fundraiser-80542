import { createClient } from '@supabase/supabase-js';

export async function handler(event) {
  const { numbers, displayName, email, phone, message, boardId } = JSON.parse(event.body);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Ensure all numbers are available
  const { data: existing } = await supabase
    .from('numbers')
    .select('number,status')
    .in('number', numbers)
    .eq('board_id', boardId);

  if (existing.some(n => n.status !== 'available')) {
    return { statusCode: 409, body: 'One or more numbers unavailable' };
  }

  // Create hold
  const { data: hold } = await supabase
    .from('holds')
    .insert({
      board_id: boardId,
      email,
      phone: phone || null,
      display_name: displayName,
      message,
      expires_at: expiresAt
    })
    .select()
    .single();

  // Mark numbers as held and link them to this specific hold
  const { data: updatedNumbers, error: updateError } = await supabase
    .from('numbers')
    .update({
      status: 'held',
      hold_expires_at: expiresAt,
      hold_id: hold.id  // Link numbers to this specific hold
    })
    .in('number', numbers)
    .eq('board_id', boardId)
    .eq('status', 'available')  // Only update if still available
    .select();

  if (updateError) {
    console.error('Error updating numbers to held:', updateError);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to mark numbers as held', details: updateError.message })
    };
  }

  console.log(`✅ Marked ${updatedNumbers?.length || 0} numbers as held`);
  console.log('Numbers:', numbers);
  console.log('Board ID:', boardId);

  if (!updatedNumbers || updatedNumbers.length === 0) {
    console.error('⚠️ No numbers were updated to held status!');
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'No numbers were marked as held' })
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ holdId: hold.id, numbersHeld: updatedNumbers.length })
  };
}
