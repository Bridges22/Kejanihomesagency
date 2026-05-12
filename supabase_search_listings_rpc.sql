-- --------------------------------------------------------------------------------------
-- ROBUST UPDATE: search_listings function
-- --------------------------------------------------------------------------------------
-- 1. CLEANUP: First we drop ANY existing versions to avoid parameter conflicts (overloading)
-- --------------------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.search_listings(text, text, text, text[], text, numeric, boolean, numeric, numeric, integer[], text, boolean);
DROP FUNCTION IF EXISTS public.search_listings(text, text, text, text[], text, numeric, boolean, numeric, numeric, integer[], text, boolean, text);

-- --------------------------------------------------------------------------------------
-- 2. CREATE: The new function with 13 parameters (including p_property_category)
-- --------------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.search_listings(
  p_city_slug text DEFAULT NULL,
  p_type text DEFAULT NULL,
  p_search text DEFAULT NULL,
  p_amenity_labels text[] DEFAULT '{}',
  p_amenity_mode text DEFAULT 'AND',
  p_min_rating numeric DEFAULT NULL,
  p_verified_only boolean DEFAULT NULL,
  p_price_min numeric DEFAULT NULL,
  p_price_max numeric DEFAULT NULL,
  p_bedrooms integer[] DEFAULT NULL,
  p_sort_col text DEFAULT 'created_at',
  p_sort_desc boolean DEFAULT true,
  p_property_category text DEFAULT NULL
)
RETURNS SETOF public.listings
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT l.*
  FROM public.listings l
  WHERE 
    l.status = 'active'
    
    -- City filter (matches against city_id UUID)
    AND (p_city_slug IS NULL OR EXISTS (
      SELECT 1 FROM public.cities c 
      WHERE c.id = l.city_id AND (
        LOWER(c.slug) = LOWER(p_city_slug)
        OR (LOWER(p_city_slug) = 'diani' AND LOWER(c.slug) = 'kwale')
      )
    ))
    
    -- Type filter (rental, sale, airbnb)
    AND (p_type IS NULL OR l.type::text = p_type)
    
    -- Category filter (Land, Apartment, etc.)
    AND (
      CASE 
        WHEN p_property_category IS NOT NULL THEN l.property_category = p_property_category
        ELSE (l.property_category IS NULL OR l.property_category != 'Land') -- Default: hide Land unless requested
      END
    )

    -- Price filtering (handles different column types automatically)
    AND (p_price_min IS NULL OR 
         (l.type::text = 'sale' AND l.total_price >= p_price_min) OR 
         (l.type::text = 'rental' AND l.price_per_month >= p_price_min) OR 
         (l.type::text = 'airbnb' AND l.price_per_night >= p_price_min))
    AND (p_price_max IS NULL OR 
         (l.type::text = 'sale' AND l.total_price <= p_price_max) OR 
         (l.type::text = 'rental' AND l.price_per_month <= p_price_max) OR 
         (l.type::text = 'airbnb' AND l.price_per_night <= p_price_max))

    -- Bedrooms
    AND (p_bedrooms IS NULL OR array_length(p_bedrooms, 1) IS NULL OR l.bedrooms = ANY(p_bedrooms))
    
    -- Verified only
    AND (p_verified_only IS NULL OR p_verified_only = false OR l.is_verified = true)
    
    -- Min rating
    AND (p_min_rating IS NULL OR l.avg_rating >= p_min_rating)
    
    -- Search filter (text matching)
    AND (p_search IS NULL OR l.title ILIKE '%' || p_search || '%' OR l.description ILIKE '%' || p_search || '%' OR l.area ILIKE '%' || p_search || '%')
    
    -- Amenities filter (matches against labels)
    AND (
      array_length(p_amenity_labels, 1) IS NULL 
      OR 
      (p_amenity_mode = 'AND' AND NOT EXISTS (
        SELECT 1 
        FROM unnest(p_amenity_labels) AS req_amenity
        WHERE NOT EXISTS (
          SELECT 1 
          FROM public.listing_amenities la
          JOIN public.amenities a ON a.id = la.amenity_id
          WHERE la.listing_id = l.id AND a.label = req_amenity
        )
      ))
      OR 
      (p_amenity_mode = 'OR' AND EXISTS (
        SELECT 1 
        FROM public.listing_amenities la
        JOIN public.amenities a ON a.id = la.amenity_id
        WHERE la.listing_id = l.id AND a.label = ANY(p_amenity_labels)
      ))
    )
  ORDER BY 
    CASE WHEN p_sort_col = 'price' AND p_sort_desc = true THEN COALESCE(l.price_per_month, l.price_per_night, l.total_price) END DESC,
    CASE WHEN p_sort_col = 'price' AND p_sort_desc = false THEN COALESCE(l.price_per_month, l.price_per_night, l.total_price) END ASC,
    CASE WHEN p_sort_col = 'avg_rating' AND p_sort_desc = true THEN l.avg_rating END DESC,
    CASE WHEN p_sort_col = 'avg_rating' AND p_sort_desc = false THEN l.avg_rating END ASC,
    CASE WHEN (p_sort_col = 'created_at' OR p_sort_col = 'newest') AND p_sort_desc = true THEN l.created_at END DESC,
    CASE WHEN (p_sort_col = 'created_at' OR p_sort_col = 'newest') AND p_sort_desc = false THEN l.created_at END ASC,
    CASE WHEN p_sort_col = 'relevance' THEN l.is_featured END DESC,
    l.created_at DESC;
END;
$$;

-- --------------------------------------------------------------------------------------
-- 3. PERMISSIONS: Ensure the website can actually call this
-- --------------------------------------------------------------------------------------
GRANT EXECUTE ON FUNCTION public.search_listings TO anon, authenticated, service_role;

-- --------------------------------------------------------------------------------------
-- 4. CACHE RELOAD: Tell PostgREST to refresh its schema cache immediately
-- --------------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';
