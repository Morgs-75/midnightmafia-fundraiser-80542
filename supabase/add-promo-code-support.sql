-- Add promo code support for team purchases
-- Run this migration in Supabase SQL Editor before deploying

-- Add promo_code column to purchases table for team entries
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS promo_code text;

-- Add promo_code column to numbers table to track team numbers
ALTER TABLE numbers ADD COLUMN IF NOT EXISTS promo_code text;

-- Create indexes for faster promo code lookups
CREATE INDEX IF NOT EXISTS idx_purchases_promo_code ON purchases(promo_code);
CREATE INDEX IF NOT EXISTS idx_numbers_promo_code ON numbers(promo_code);

-- Verify the changes
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'purchases' AND column_name = 'promo_code';

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'numbers' AND column_name = 'promo_code';
