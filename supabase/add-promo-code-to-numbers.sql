-- Add promo_code column to numbers table to track team numbers
ALTER TABLE numbers ADD COLUMN IF NOT EXISTS promo_code text;

-- Create index for faster promo code lookups
CREATE INDEX IF NOT EXISTS idx_numbers_promo_code ON numbers(promo_code);
