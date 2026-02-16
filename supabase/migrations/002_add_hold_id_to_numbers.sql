-- Add hold_id column to numbers table to track which hold owns which numbers
-- This prevents race conditions where multiple holds exist simultaneously

ALTER TABLE numbers
ADD COLUMN hold_id uuid REFERENCES holds(id) ON DELETE SET NULL;

-- Add index for faster lookups
CREATE INDEX idx_numbers_hold_id ON numbers(hold_id);

-- Add promo_code column if it doesn't exist (for tracking team numbers)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'numbers' AND column_name = 'promo_code'
  ) THEN
    ALTER TABLE numbers ADD COLUMN promo_code text;
  END IF;
END $$;

-- Add index for promo_code lookups
CREATE INDEX IF NOT EXISTS idx_numbers_promo_code ON numbers(promo_code);

COMMENT ON COLUMN numbers.hold_id IS 'Links this number to a specific hold record. NULL when available or sold.';
COMMENT ON COLUMN numbers.promo_code IS 'Promo code used (e.g., OUTLAWS for team numbers). NULL for paid purchases.';
