# Supabase Backend Integration Instructions - Kejani Homes

This document outlines the necessary database schema updates and API logic required to support the recent front-end overhaul, including expanded locations, deep filtering, and special property sections.

---

## 1. Cities Expansion
The homepage now supports 8 key locations. The `cities` table must contain these records with matching IDs (lowercase, hyphenated) to ensure the search redirects work correctly.

**Action**: Upsert these records into the `cities` table:
- `diani`, `mombasa`, `nyali`, `nairobi`, `taita-taveta`, `busia`, `malindi`, `kisumu`

---

## 2. Deep Filtering System (Amenities & Features)
The search results page now features a high-density filtering sidebar. To support this, the `amenities` table needs to be expanded beyond basic utilities to include "Features," "Accessibility," and "Landmarks."

### 2.1 Table: `amenities`
Ensure the `id` is `UUID` and `label` is `TEXT`.
**New Categories and Labels to Seed**:
- **Popular**: `Beach`, `Swimming pool`, `Free WiFi`, `5 stars`, `Superb: 9+`
- **Property Type**: `Hotels`, `Apartments`, `Resorts`, `Villas`, `Holiday homes`, `Hostels`, `Lodges`, `Guest houses`, `Chalets`, `Bed and breakfasts`
- **Facilities**: `Hot tub/Jacuzzi`, `Spa and wellness centre`, `Free parking`, `Fitness centre`
- **Room Facilities**: `Dressing room`, `Landmark view`, `Private entrance`, `Linen`, `Plunge pool`
- **Accessibility**: `Toilet with grab rails`, `Emergency cord in bathroom`, `Raised toilet`, `Lower bathroom sink`, `Upper floors accessible by elevator`, `Entire unit wheelchair accessible`, `Walk-in shower`
- **Fun Things to Do**: `Windsurfing`, `Snorkelling`, `Diving`, `Fishing`
- **Landmarks**: `Diani Beach Hospital`, `Colobus Conservation`, `KFI Supermarket`

### 2.2 Join Table: `listing_amenities`
Frontend uses these labels to filter. The backend `getListings` logic (or Edge Function) should resolve selected **Labels** to their respective **UUIDs** in the `amenities` table before filtering the `listings`.

---

## 3. Filtering Logic Requirements
The `GET /listings` endpoint (or equivalent Supabase query) must support the following:

- **Amenity Filtering**: Must handle an array of labels/IDs. The query should return listings that have *at least one* (OR) or *all* (AND) of the selected features based on `listing_amenities`.
- **Property Type**: Filter by the labels listed above.
- **Rating**: Filter by `avg_rating` (e.g., `avg_rating >= 4.0` for "Very good: 8+").
- **Verified Status**: Filter where `is_verified = true`.
- **Price Range**: Filter between `price_min` and `price_max` for both `rental` (monthly) and `airbnb` (nightly) types.

---

## 4. Special Sections
### 4.1 Weekend Deals
The homepage features a "Deals for the weekend" section.
- **Logic**: Fetch listings where `type = 'airbnb'`, ordered by `avg_rating` descending, limit 4.
- **Data Requirement**: These listings MUST have at least one high-quality photo in `listing_photos`.

---

## 5. Summary of Schema Dependencies
Ensure the `listings` table has these columns populated for the frontend to display correctly:
- `avg_rating` (Decimal 2,1)
- `review_count` (Integer)
- `is_verified` (Boolean)
- `area` (Text - e.g., "Westlands", "Diani Beach")
- `type` (Enum: 'rental', 'airbnb', 'sale') - **Update: `sale` added for selling properties including Land.**
- `property_category` (Text - e.g., "Apartment", "Land", "Villa")
- `total_price` (Integer/Decimal - required for `sale` listings)

---

## 6. Land for Sale/Lease Support
The frontend now supports listing lands. The backend database and API need to accommodate the following:
- **`listing_type` Enum**: Must be updated to include `'sale'` (e.g., `ALTER TYPE listing_type ADD VALUE 'sale';`).
- **New Columns**: Ensure `total_price` exists for one-off sales. Land listings might use `size_sqft` for acres/hectares if we don't have a dedicated `land_size` column, so ensure it can accept appropriate values or add `land_size` if preferred.
- **Land Amenities**: Seed new amenities specific to land into the `amenities` table:
  - `Piped Water`, `Electricity connection`, `Tarmac access`, `Red Soil`, `Title Deed Ready`, `Perimeter Fence`, `Borehole`, `Sewer Line`.

---

## 7. Frontend Configuration
The frontend is currently configured to use `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Please ensure these are provided for the production environment.
