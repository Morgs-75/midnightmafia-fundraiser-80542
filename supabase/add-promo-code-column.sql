-- Add promo_code column to purchases table for team entries
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS promo_code text;

-- Create index for faster promo code lookups
CREATE INDEX IF NOT EXISTS idx_purchases_promo_code ON purchases(promo_code);
