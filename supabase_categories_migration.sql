-- ========================================================
-- KEJANI HOMES: CATEGORIES & PRICING MIGRATION SCRIPT
-- ========================================================

-- 1. ADD NEW COLUMNS
ALTER TABLE listings 
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS listing_type_detailed TEXT,
  ADD COLUMN IF NOT EXISTS price_per_night NUMERIC,
  ADD COLUMN IF NOT EXISTS price_per_month NUMERIC,
  ADD COLUMN IF NOT EXISTS sale_price NUMERIC,
  ADD COLUMN IF NOT EXISTS land_price NUMERIC,
  ADD COLUMN IF NOT EXISTS commercial_rent_price NUMERIC,
  ADD COLUMN IF NOT EXISTS commercial_sale_price NUMERIC,
  ADD COLUMN IF NOT EXISTS check_in_time TEXT,
  ADD COLUMN IF NOT EXISTS check_out_time TEXT,
  ADD COLUMN IF NOT EXISTS land_size TEXT,
  ADD COLUMN IF NOT EXISTS property_size TEXT,
  ADD COLUMN IF NOT EXISTS title_deed_status TEXT,
  ADD COLUMN IF NOT EXISTS utilities_details TEXT,
  ADD COLUMN IF NOT EXISTS parking_details TEXT,
  ADD COLUMN IF NOT EXISTS lease_duration TEXT,
  ADD COLUMN IF NOT EXISTS deposit TEXT;

-- 2. MIGRATE EXISTING DATA
-- We map the existing 'type' (which is the enum 'rental', 'airbnb', 'sale') and 'property_category' / 'type' (Apartment, Land)
-- to the new columns safely without dropping the old 'price' column immediately so nothing breaks.

UPDATE listings
SET 
  category = CASE 
    WHEN type = 'airbnb' THEN 'Airbnb'
    WHEN type = 'rental' THEN 'Rental'
    WHEN type = 'sale' AND property_category ILIKE '%Land%' THEN 'Land'
    WHEN type = 'sale' THEN 'Sale'
    ELSE 'Rental'
  END,
  
  listing_type_detailed = CASE 
    WHEN type = 'airbnb' THEN 'short_stay'
    WHEN type = 'rental' THEN 'rent'
    WHEN type = 'sale' AND property_category ILIKE '%Land%' THEN 'land'
    WHEN type = 'sale' THEN 'sale'
    ELSE 'rent'
  END,

  price_per_night = CASE WHEN type = 'airbnb' THEN price ELSE NULL END,
  price_per_month = CASE WHEN type = 'rental' THEN price ELSE NULL END,
  sale_price = CASE WHEN type = 'sale' AND property_category NOT ILIKE '%Land%' THEN price ELSE NULL END,
  land_price = CASE WHEN type = 'sale' AND property_category ILIKE '%Land%' THEN price ELSE NULL END
WHERE category IS NULL;

-- 3. RECREATE RPC SEARCH FUNCTION (If necessary to support new price columns)
-- The search_listings RPC might need updating to check all these price columns, 
-- but for now, the old `price` column is kept intact to ensure backward compatibility.
-- Future searches will check the specific columns or we keep `price` as a generalized "default" price column.
-- Let's ensure `price` is kept updated automatically via a trigger if needed, or we just rely on the frontend changes.
