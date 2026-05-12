Hub Backend Specification
## Supabase Development Guide

---

## 1. System Overview

**NyumbaHub** is a real estate rental platform for African markets (Kenya, Ghana, etc.) connecting:
- **House Seekers**: Browse and book verified rentals/Airbnbs
- **Property Hosts/Landlords**: List properties and receive inquiries
- **Platform**: Monetizes through "unlock fees" (pay to view contact details)

### Core Business Model
- **Free**: Browse listings, view photos, read descriptions
- **Paid**: Pay unlock fee (KES 299-499) to view landlord contact info
- **Airbnb-style**: Direct booking with nightly rates

---

## 2. Database Schema

### 2.1 Users & Authentication (Supabase Auth)
```sql
-- Supabase Auth handles: id, email, email_confirmed_at, created_at, etc.
-- Additional profile data stored in user_profiles table:

CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  phone_number TEXT,
  user_type TEXT CHECK (user_type IN ('seeker', 'host', 'admin')) DEFAULT 'seeker',
  is_verified BOOLEAN DEFAULT FALSE,
  id_document_url TEXT, -- KYC verification
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hosts (Landlords) extended profile
CREATE TABLE host_profiles (
  id UUID PRIMARY KEY REFERENCES user_profiles(id) ON DELETE CASCADE,
  company_name TEXT,
  bio TEXT,
  response_rate INTEGER DEFAULT 0, -- percentage
  response_time TEXT, -- "within 2 hours"
  total_listings INTEGER DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  bank_account_name TEXT,
  bank_account_number TEXT,
  bank_code TEXT,
  mpesa_number TEXT
);
```

### 2.2 Listings (Core Entity)
```sql
CREATE TYPE listing_type AS ENUM ('rental', 'airbnb', 'sale');
CREATE TYPE listing_status AS ENUM ('active', 'pending', 'inactive', 'suspended');

CREATE TABLE listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- URL-friendly: "modern-3br-westlands-nairobi"
  
  -- Ownership
  host_id UUID NOT NULL REFERENCES user_profiles(id),
  
  -- Basic Info
  title TEXT NOT NULL,
  type listing_type NOT NULL,
  description TEXT,
  
  -- Location
  area TEXT NOT NULL, -- "Westlands"
  city TEXT NOT NULL, -- "Nairobi"
  country TEXT NOT NULL DEFAULT 'Kenya',
  address TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Property Details
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  max_guests INTEGER, -- for Airbnb
  floor_area INTEGER, -- sq meters
  floor INTEGER,
  total_floors INTEGER,
  
  -- Pricing
  price_per_month INTEGER, -- for rentals (KES)
  price_per_night INTEGER, -- for Airbnb (KES)
  total_price BIGINT, -- for property/land sales (KES)
  currency TEXT DEFAULT 'KES',
  deposit_months INTEGER DEFAULT 2,
  unlock_fee INTEGER DEFAULT 499, -- pay to view contact
  
  -- Status & Verification
  status listing_status DEFAULT 'pending',
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP WITH TIME ZONE,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  unlock_count INTEGER DEFAULT 0,
  
  -- Ratings
  avg_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- Rules
  rules TEXT[], -- ["No smoking", "Pets allowed"]
  
  -- Metadata
  listed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Full-text search
  search_vector TSVECTOR
);

-- Indexes for performance
CREATE INDEX idx_listings_city ON listings(city);
CREATE INDEX idx_listings_type ON listings(type);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_listings_featured ON listings(is_featured, featured_until);
CREATE INDEX idx_listings_price_month ON listings(price_per_month);
CREATE INDEX idx_listings_price_night ON listings(price_per_night);
CREATE INDEX idx_listings_search ON listings USING GIN(search_vector);
```

### 2.3 Listing Photos
```sql
CREATE TABLE listing_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.4 Amenities
```sql
CREATE TABLE amenities (
  id TEXT PRIMARY KEY, -- "amenity-wifi"
  label TEXT NOT NULL, -- "WiFi"
  icon TEXT, -- emoji or icon name
  category TEXT -- "connectivity", "security", "utilities"
);

CREATE TABLE listing_amenities (
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  amenity_id TEXT REFERENCES amenities(id) ON DELETE CASCADE,
  PRIMARY KEY (listing_id, amenity_id)
);

-- Seed data
INSERT INTO amenities (id, label, icon, category) VALUES
('amenity-wifi', 'WiFi', '📶', 'connectivity'),
('amenity-parking', 'Parking', '🚗', 'facilities'),
('amenity-pool', 'Swimming Pool', '🏊', 'recreation'),
('amenity-gym', 'Gym', '💪', 'recreation'),
('amenity-security', '24/7 Security', '🔒', 'security'),
('amenity-ac', 'Air Conditioning', '❄️', 'climate'),
('amenity-borehole', 'Borehole Water', '💧', 'utilities'),
('amenity-backup', 'Backup Generator', '⚡', 'utilities'),
('amenity-balcony', 'Balcony', '🏗️', 'features'),
('amenity-pets', 'Pet Friendly', '🐾', 'policies'),
('amenity-piped-water', 'Piped Water', '🚰', 'land_features'),
('amenity-electricity', 'Electricity Connection', '⚡', 'land_features'),
('amenity-tarmac', 'Tarmac Access', '🛣️', 'land_features'),
('amenity-red-soil', 'Red Soil', '🌱', 'land_features'),
('amenity-title-deed', 'Title Deed Ready', '📜', 'land_features');
```

### 2.5 Reviews
```sql
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  reviewer_id UUID NOT NULL REFERENCES user_profiles(id),
  
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  body TEXT NOT NULL,
  
  -- Stay details
  stay_type TEXT, -- "Long-term Rental", "Short Stay"
  stay_duration TEXT, -- "8 months"
  
  -- Host reply
  host_reply TEXT,
  host_reply_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(listing_id, reviewer_id) -- One review per user per listing
);

-- Rating categories for detailed breakdown
CREATE TABLE review_ratings (
  review_id UUID REFERENCES reviews(id) ON DELETE CASCADE,
  category TEXT CHECK (category IN ('accuracy', 'cleanliness', 'location', 'value', 'communication', 'security')),
  score DECIMAL(2,1) CHECK (score >= 1 AND score <= 5),
  PRIMARY KEY (review_id, category)
);
```

### 2.6 Unlocks (Core Business Logic)
```sql
CREATE TABLE unlocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  seeker_id UUID NOT NULL REFERENCES user_profiles(id),
  amount INTEGER NOT NULL, -- KES amount paid
  payment_method TEXT, -- 'mpesa', 'card', 'wallet'
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
  transaction_reference TEXT,
  
  -- Contact info revealed after unlock
  host_phone_revealed TEXT,
  host_email_revealed TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE, -- Optional: unlock expires after X days
  
  UNIQUE(listing_id, seeker_id) -- Can only unlock once per listing
);
```

### 2.7 Bookings (For Airbnb-type)
```sql
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  listing_id UUID NOT NULL REFERENCES listings(id),
  seeker_id UUID NOT NULL REFERENCES user_profiles(id),
  
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  nights INTEGER NOT NULL,
  guests INTEGER DEFAULT 1,
  
  -- Pricing
  nightly_rate INTEGER NOT NULL,
  total_amount INTEGER NOT NULL,
  service_fee INTEGER DEFAULT 0,
  
  -- Status
  status booking_status DEFAULT 'pending',
  
  -- Payment
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  
  -- Messaging
  special_requests TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2.8 Cities (For Featured Cities Section)
```sql
CREATE TABLE cities (
  id TEXT PRIMARY KEY, -- "nairobi"
  name TEXT NOT NULL, -- "Nairobi"
  country TEXT NOT NULL, -- "Kenya"
  image_url TEXT,
  image_alt TEXT,
  listing_count INTEGER DEFAULT 0, -- maintained by trigger
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0
);

-- Update listing_count automatically
CREATE OR REPLACE FUNCTION update_city_listing_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    UPDATE cities SET listing_count = (
      SELECT COUNT(*) FROM listings 
      WHERE city = NEW.city AND status = 'active'
    ) WHERE id = LOWER(NEW.city);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_city_count
AFTER INSERT OR UPDATE ON listings
FOR EACH ROW EXECUTE FUNCTION update_city_listing_count();
```

---

## 3. Required API Endpoints

### 3.1 Authentication (Supabase Auth)
```typescript
// Frontend expects these from Supabase Auth:
- POST /auth/v1/signup          // Email/password registration
- POST /auth/v1/token         // Login
- POST /auth/v1/logout        // Sign out
- GET  /auth/v1/user          // Current user
- POST /auth/v1/recover       // Password reset
```

### 3.2 Listings API

#### GET /listings
**Purpose**: Search/filter listings (used on search-results page)

**Query Parameters**:
```typescript
{
  city?: string;           // "nairobi"
  type?: 'rental' | 'airbnb' | 'sale' | 'all';
  priceMin?: number;
  priceMax?: number;
  bedrooms?: number[];    // [1, 2, 3]
  verifiedOnly?: boolean;
  amenities?: string[];   // ["amenity-wifi", "amenity-pool"]
  sortBy?: 'relevance' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
  page?: number;
  limit?: number;         // default 20
}
```

**Response**:
```typescript
{
  data: ListingCardData[],
  meta: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  }
}
```

**ListingCardData Interface**:
```typescript
interface ListingCardData {
  id: string;
  slug: string;
  title: string;
  type: 'rental' | 'airbnb' | 'sale';
  property_category?: string; // e.g. "Apartment", "Land"
  area: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  maxGuests?: number;
  pricePerMonth?: number;
  pricePerNight?: number;
  totalPrice?: number;
  currency: string;
  isVerified: boolean;
  isFeatured: boolean;
  avgRating?: number;
  reviewCount?: number;
  unlockFee?: number;
  primaryPhoto: string;
  primaryPhotoAlt: string;
}
```

#### GET /listings/featured
**Purpose**: Get featured listings for homepage

**Query Parameters**:
```typescript
{
  limit?: number;  // default 4
  city?: string;   // optional: featured in specific city
}
```

#### GET /listings/:slug
**Purpose**: Get full listing details (public view)

**Response**: Full listing object WITHOUT contact info

#### GET /listings/:slug/full
**Purpose**: Get full listing with contact info (requires auth + unlock)

**Headers**: `Authorization: Bearer <token>`

**Response**: Full listing WITH host contact info (if unlocked)

#### POST /listings
**Purpose**: Create new listing (host only)

**Body**:
```typescript
{
  title: string;
  type: 'rental' | 'airbnb';
  description: string;
  area: string;
  city: string;
  country: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  maxGuests?: number;
  floorArea?: number;
  floor?: number;
  totalFloors?: number;
  pricePerMonth?: number;
  pricePerNight?: number;
  currency: string;
  depositMonths?: number;
  unlockFee?: number;
  rules?: string[];
  amenities?: string[];  // ["amenity-wifi"]
  photos: {
    url: string;
    alt?: string;
    isPrimary?: boolean;
  }[];
}
```

### 3.3 Reviews API

#### GET /listings/:id/reviews
**Purpose**: Get reviews for a listing

**Query Parameters**:
```typescript
{
  page?: number;
  limit?: number;  // default 10
}
```

**Response**:
```typescript
{
  data: {
    id: string;
    authorName: string;
    authorAvatar: string;
    authorAvatarAlt: string;
    authorLocation: string;
    rating: number;
    date: string;
    body: string;
    hostReply?: string;
    stayType: string;
    stayDuration: string;
  }[],
  meta: {
    total: number;
    avgRating: number;
    ratingBreakdown: {
      accuracy: number;
      cleanliness: number;
      location: number;
      value: number;
      communication: number;
      security: number;
    }
  }
}
```

#### POST /listings/:id/reviews
**Purpose**: Create review (verified seeker only)

### 3.4 Cities API

#### GET /cities
**Purpose**: Get all active cities with listing counts

**Response**:
```typescript
{
  id: string;        // "nairobi"
  name: string;      // "Nairobi"
  country: string;   // "Kenya"
  image: string;     // URL
  alt: string;       // Alt text
  slug: string;      // "nairobi"
  listingCount: number;
}[]
```

### 3.5 Unlock API (Payment)

#### POST /payments/unlock
**Purpose**: Pay to unlock contact details

**Body**:
```typescript
{
  listingId: string;
  paymentMethod: 'mpesa' | 'card';
  // For M-Pesa:
  mpesaPhoneNumber?: string;
  // For card (Stripe):
  paymentIntentId?: string;
}
```

**Response**:
```typescript
{
  success: boolean;
  unlockId: string;
  status: 'pending' | 'completed';
  hostPhone?: string;
  hostEmail?: string;
}
```

#### GET /unlocks
**Purpose**: Get user's unlock history

### 3.6 Bookings API

#### POST /bookings
**Purpose**: Create Airbnb-style booking

**Body**:
```typescript
{
  listingId: string;
  checkIn: string;  // ISO date
  checkOut: string;
  guests: number;
  specialRequests?: string;
  paymentMethod: 'mpesa' | 'card';
}
```

---

## 4. Supabase Client Setup

### 4.1 Create Client File
Create `src/lib/supabase/client.ts`:

```typescript
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

### 4.2 Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

---

## 5. Row Level Security (RLS) Policies

```sql
-- Enable RLS on all tables
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE listing_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE unlocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE host_profiles ENABLE ROW LEVEL SECURITY;

-- Listings: Anyone can view active listings
CREATE POLICY "Anyone can view active listings" ON listings
  FOR SELECT USING (status = 'active');

-- Listings: Hosts can manage their own listings
CREATE POLICY "Hosts can manage own listings" ON listings
  FOR ALL USING (host_id = auth.uid());

-- Reviews: Anyone can view
CREATE POLICY "Anyone can view reviews" ON reviews
  FOR SELECT USING (true);

-- Reviews: Authenticated users can create
CREATE POLICY "Authenticated can create reviews" ON reviews
  FOR INSERT WITH CHECK (auth.uid() = reviewer_id);

-- Unlocks: Users can only view their own unlocks
CREATE POLICY "Users view own unlocks" ON unlocks
  FOR SELECT USING (seeker_id = auth.uid());

-- Host Profiles: Public view, host can edit own
CREATE POLICY "Public can view host profiles" ON host_profiles
  FOR SELECT USING (true);

CREATE POLICY "Hosts can edit own profile" ON host_profiles
  FOR ALL USING (id = auth.uid());
```

---

## 6. Storage Buckets

Create these Supabase Storage buckets:

```
listing-photos/       # Public read, host write
  - {listingId}/{photoId}.jpg

user-avatars/         # Public read, owner write
  - {userId}/avatar.jpg

verification-docs/    # Private, admin read
  - {userId}/id-document.pdf

host-documents/       # Private, admin read
  - {hostId}/business-registration.pdf
```

---

## 7. Edge Functions (Serverless)

Create these Supabase Edge Functions:

### 7.1 Search Listings
`functions/search-listings/index.ts`
- Full-text search with filters
- Geolocation sorting
- Pagination

### 7.2 Process Payment (M-Pesa STK Push)
`functions/mpesa-stk-push/index.ts`

**Logic Flow:**
1. **Auth**: Verify user is logged in.
2. **Access Token**: Call Safaricom `oauth/v1/generate?grant_type=client_credentials` to get `access_token`.
3. **STK Push**: Call `stkpush/v1/processrequest` with:
   - `BusinessShortCode`: Your Lipa na M-Pesa shortcode.
   - `Password`: Base64(ShortCode + PassKey + Timestamp).
   - `Amount`: From request body.
   - `PhoneNumber`: From request body.
   - `CallBackURL`: `https://<project-id>.supabase.co/functions/v1/mpesa-callback`.
4. **Response**: Return the `CheckoutRequestID` to the frontend.

### 7.3 M-Pesa Callback (Webhook)
`functions/mpesa-callback/index.ts`

**Logic Flow:**
1. Receive JSON from Safaricom.
2. Check `ResultCode` (0 = Success).
3. If success, create a record in `public.unlocks` table:
   - `listing_id`: (Extracted from metadata or tracked by CheckoutRequestID).
   - `seeker_id`: (Extracted from metadata).
   - `amount`: `CallbackMetadata.Item[Amount]`.
   - `payment_status`: 'completed'.
   - `transaction_reference`: `MpesaReceiptNumber`.


### 7.3 Send Notification
`functions/send-notification/index.ts`
- SMS via Twilio/Africa's Talking
- Email via SendGrid
- Push notifications

---

## 8. Integration Checklist

### Phase 1: Core (MVP)
- [x] Set up Supabase project
- [x] Run schema migrations
- [x] Seed cities
- [x] Create storage buckets
- [x] Set up RLS policies (Initial)
- [x] Implement GET /listings
- [x] Implement GET /listings/:slug
- [x] Implement GET /cities

### Phase 2: Auth & Users
- [x] Configure Supabase Auth
- [x] Create user_profiles table
- [x] Set up email templates
- [x] Implement login/logout

### Phase 3: Host Features
- [x] Create listing endpoint
- [x] Upload photos to storage
- [x] Host dashboard API
- [x] Listing management (edit/delete)

### Phase 4: Payments
- [ ] M-Pesa STK Push integration
- [ ] M-Pesa Callback handling
- [ ] Unlock payment flow
- [ ] Booking payment flow

### Phase 5: Advanced
- [x] Truthful Reviews system
- [ ] Notifications (SMS/Email)
- [ ] Advanced Analytics
- [ ] Admin panel

### Security & Environment
- [x] Create `.env.local` with Supabase keys
- [x] Add `.env.local` to `.gitignore`
- [ ] Rotate `NEXTAUTH_SECRET` for production


---

## 9. Frontend Integration Points

The frontend has these "Backend integration point" comments:

| File | Line | Integration Needed |
|------|------|-------------------|
| `FeaturedListings.tsx` | 7 | `GET /listings?featured=true&limit=4` |
| `ListingDetailContent.tsx` | 13 | `GET /listings/:slug/full` |
| `StickyBookingSidebar.tsx` | 43 | `POST /payments/unlock` |
| `StickyBookingSidebar.tsx` | 57 | `POST /bookings` |
| `ReviewsSection.tsx` | 7 | `GET /listings/:id/reviews` |
| `SearchResultsContent.tsx` | - | `GET /listings?filters...` |

---

## 10. Testing Data

Seed data for development:

```sql
-- Cities
INSERT INTO cities (id, name, country, image_url, image_alt) VALUES
('nairobi', 'Nairobi', 'Kenya', 'https://images.unsplash.com/photo-1699530259689-d0c8bafe20a4', 'Nairobi skyline'),
('mombasa', 'Mombasa', 'Kenya', 'https://images.unsplash.com/photo-1706653969853-dfbdc3f7cc19', 'Mombasa beach'),
('nakuru', 'Nakuru', 'Kenya', 'https://images.unsplash.com/photo-1707818031584-6995a4eb9264', 'Nakuru city'),
('kisumu', 'Kisumu', 'Kenya', 'https://images.unsplash.com/photo-1731181475186-3633474eb8ca', 'Kisumu lakeside'),
('machakos', 'Machakos', 'Kenya', 'https://images.unsplash.com/photo-1706696441041-d997af0a994c', 'Machakos town'),
('accra', 'Accra', 'Ghana', 'https://images.unsplash.com/photo-1641935886235-d5deab1625f5', 'Accra coastal city');
```

---

## 11. Contact Information

**Questions? Contact:**
- Frontend Dev: [Your Name]
- Project Manager: [PM Name]

**Useful Links:**
- Supabase Docs: https://supabase.com/docs
- M-Pesa API: https://developer.safaricom.co.ke
- Stripe Docs: https://stripe.com/docs

---

**Document Version**: 1.0  
**Last Updated**: 2026-04-19  
**Status**: Ready for Development
