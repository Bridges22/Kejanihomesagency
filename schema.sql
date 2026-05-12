-- 1. SEED CITIES
INSERT INTO cities (id, name, country, image_url, is_active) VALUES
('diani', 'Diani', 'Kenya', '/images/locations/diani.png', true),
('mombasa', 'Mombasa', 'Kenya', '/images/locations/mombasa.png', true),
('nyali', 'Nyali', 'Kenya', '/images/locations/nyali.png', true),
('nairobi', 'Nairobi', 'Kenya', '/images/locations/nairobi.png', true),
('taita-taveta', 'Taita Taveta', 'Kenya', '/images/locations/taita-taveta.png', true),
('busia', 'Busia', 'Kenya', 'https://images.unsplash.com/photo-1580237072617-771c3ecc4a24', true),
('malindi', 'Malindi', 'Kenya', 'https://images.unsplash.com/photo-1544161513-0179fe746fd5', true),
('kisumu', 'Kisumu', 'Kenya', 'https://images.unsplash.com/photo-1731181475186-3633474eb8ca', true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, image_url = EXCLUDED.image_url;

-- 2. SEED AMENITIES (NEW CATEGORIES)
-- Note: Replace UUIDs with actual ones if already existing
INSERT INTO amenities (id, label, category) VALUES
(gen_random_uuid(), 'Beach', 'popular'),
(gen_random_uuid(), 'Swimming pool', 'popular'),
(gen_random_uuid(), 'Free WiFi', 'popular'),
(gen_random_uuid(), '5 stars', 'popular'),
(gen_random_uuid(), 'Hotels', 'property_type'),
(gen_random_uuid(), 'Apartments', 'property_type'),
(gen_random_uuid(), 'Resorts', 'property_type'),
(gen_random_uuid(), 'Villas', 'property_type'),
(gen_random_uuid(), 'Toilet with grab rails', 'accessibility'),
(gen_random_uuid(), 'Emergency cord in bathroom', 'accessibility'),
(gen_random_uuid(), 'Raised toilet', 'accessibility'),
(gen_random_uuid(), 'Lower bathroom sink', 'accessibility'),
(gen_random_uuid(), 'Upper floors accessible by elevator', 'accessibility'),
(gen_random_uuid(), 'Entire unit wheelchair accessible', 'accessibility'),
(gen_random_uuid(), 'Walk-in shower', 'accessibility'),
(gen_random_uuid(), 'Windsurfing', 'fun'),
(gen_random_uuid(), 'Snorkelling', 'fun'),
(gen_random_uuid(), 'Diving', 'fun'),
(gen_random_uuid(), 'Fishing', 'fun'),
(gen_random_uuid(), 'Diani Beach Hospital', 'landmarks'),
(gen_random_uuid(), 'Colobus Conservation', 'landmarks'),
(gen_random_uuid(), 'KFI Supermarket', 'landmarks')
ON CONFLICT (label) DO NOTHING;
