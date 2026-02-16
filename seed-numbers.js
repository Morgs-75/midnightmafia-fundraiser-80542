import { createClient } from '@supabase/supabase-js';

// Your Supabase credentials
const SUPABASE_URL = 'https://xwdkvsexakvyvsasuayz.supabase.co';
const SUPABASE_SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh3ZGt2c2V4YWt2eXZzYXN1YXl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA2NjMwOCwiZXhwIjoyMDg2NjQyMzA4fQ.SQtgm4SwJ7O7HZ-Yi4VWoVAa6jpX5tk4SzdcmpdJZGU';
const BOARD_ID = '09cfb491-4efc-4bf2-9da9-8b07a740ddaf';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function seedNumbers() {
  console.log('🌱 Seeding numbers table...');

  // Create numbers 1-100
  const numbers = [];
  for (let i = 1; i <= 100; i++) {
    numbers.push({
      board_id: BOARD_ID,
      number: i,
      status: 'available',
      display_name: null,
      message: null,
      hold_expires_at: null
    });
  }

  // Insert in batches of 50
  const batch1 = numbers.slice(0, 50);
  const batch2 = numbers.slice(50, 100);

  console.log('📦 Inserting numbers 1-50...');
  const { error: error1 } = await supabase
    .from('numbers')
    .insert(batch1);

  if (error1) {
    console.error('❌ Error inserting batch 1:', error1.message);
    return;
  }

  console.log('📦 Inserting numbers 51-100...');
  const { error: error2 } = await supabase
    .from('numbers')
    .insert(batch2);

  if (error2) {
    console.error('❌ Error inserting batch 2:', error2.message);
    return;
  }

  console.log('✅ Successfully seeded 100 numbers!');
  console.log(`   Board ID: ${BOARD_ID}`);
  console.log('   Numbers: 1-100');
  console.log('   Status: All available');
}

seedNumbers();
