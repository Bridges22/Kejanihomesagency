import React from 'react';
import TopNav from '@/components/TopNav';
import Footer from '@/components/Footer';
import ListingDetailContent from '@/app/listing-detail/components/ListingDetailContent';
import { listingsService } from '@/services/listings';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const listing = await listingsService.getListingBySlug(slug);

  if (!listing) return { title: 'Listing Not Found | Kejani Homes' };

  const price = listing.type === 'sale' 
    ? `KES ${listing.total_price?.toLocaleString()}`
    : listing.type === 'rental' 
      ? `KES ${listing.price_per_month?.toLocaleString()}/mo`
      : `KES ${listing.price_per_night?.toLocaleString()}/night`;

  const description = `${listing.property_category} in ${listing.area}, ${listing.county || listing.cities?.name}. ${listing.bedrooms} Bedroom | ${listing.bathrooms} Bath. ${listing.short_description || ''}`;
  const imageUrl = listing.photos?.[0]?.url || 'https://kejanihomes.co.ke/og-default.png';

  return {
    title: `${listing.title} | ${price} | Kejani Homes`,
    description: description,
    openGraph: {
      title: listing.title,
      description: description,
      url: `https://kejanihomes.co.ke/listing-detail/${slug}`,
      siteName: 'Kejani Homes Agency',
      images: [{ url: imageUrl, width: 1200, height: 630, alt: listing.title }],
      locale: 'en_KE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: listing.title,
      description: description,
      images: [imageUrl],
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  let listing = null;
  try {
    listing = await listingsService.getListingBySlug(slug);
  } catch (error) {
    console.error('Error fetching listing:', error);
  }

  if (!listing) {
    notFound();
  }

  // Schema.org Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'RealEstateListing',
    'name': listing.title,
    'description': listing.description,
    'datePosted': listing.created_at,
    'url': `https://kejanihomes.co.ke/listing-detail/${listing.slug}`,
    'image': listing.photos?.map((p: any) => p.url),
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': listing.area,
      'addressRegion': listing.cities?.name,
      'addressCountry': 'KE'
    },
    'offers': {
      '@type': 'Offer',
      'price': listing.total_price || listing.price_per_month || listing.price_per_night,
      'priceCurrency': listing.currency || 'KES',
      'availability': 'https://schema.org/InStock'
    }
  };

    // Map Supabase data to frontend structure
    const mappedListing = {
      id: listing.id,
      slug: listing.slug,
      title: listing.title,
      type: listing.type, // listing_type (rental/sale/airbnb)
      property_category: listing.property_category,
      listing_type: listing.type, 
      area: listing.area,
      city: listing.cities?.name || '',
      country: listing.country || 'Kenya',
      county: listing.county,
      sub_county: listing.sub_county,
      landmark: listing.landmark,
      postal_code: listing.postal_code,
      latitude: listing.latitude,
      longitude: listing.longitude,
      display_location_publicly: listing.display_location_publicly,
      
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      toilets: listing.toilets,
      kitchens: listing.kitchens,
      balconies: listing.balconies,
      floor: listing.floor_number,
      totalFloors: listing.total_floors,
      size_sqft: listing.size_sqft,
      year_built: listing.year_built,
      furnishing_status: listing.furnishing_status,
      parking_spaces: listing.parking_spaces,
      has_sq: listing.has_sq,
      max_guests: listing.max_guests,
      
      amenities: listing.amenities_config || {},
      short_description: listing.short_description,
      
      video_url: listing.video_url,
      virtual_tour_url: listing.virtual_tour_url,
      floor_plan_url: listing.floor_plan_url,
      
      agent: {
        name: listing.agent_name || listing.host?.full_name,
        agency: listing.agency_name,
        phone: listing.agent_phone,
        whatsapp: listing.agent_whatsapp,
        email: listing.agent_email,
        show_contact: listing.show_contact_publicly
      },
      
      price_per_month: listing.price_per_month,
      price_per_night: listing.price_per_night,
      sale_price: listing.sale_price,
      land_price: listing.land_price,
      commercial_rent_price: listing.commercial_rent_price,
      commercial_sale_price: listing.commercial_sale_price,
      total_price: listing.total_price,
      currency: listing.currency || 'KES',
      price_frequency: listing.price_frequency,
      is_negotiable: listing.is_negotiable,
      
      category: listing.category,
      listing_type_detailed: listing.listing_type_detailed,
      
      check_in_time: listing.check_in_time,
      check_out_time: listing.check_out_time,
      land_size: listing.land_size,
      property_size: listing.property_size,
      utilities_details: listing.utilities_details,
      parking_details: listing.parking_details,
      deposit: listing.deposit,
      lease_duration: listing.lease_duration,
      
      lease_period: listing.lease_period,
      service_charge_included: listing.service_charge_included,
      available_from: listing.available_from,
      has_title_deed: listing.has_title_deed,
      title_deed_status: listing.title_deed_status,
      tenure_type: listing.tenure_type,
      remaining_lease_years: listing.remaining_lease_years,
      property_condition: listing.property_condition,
      
      isVerified: listing.is_verified,
      isFeatured: listing.is_featured,
      avgRating: Number(listing.avg_rating) || 0,
      reviewCount: listing.review_count || 0,
      viewCount: listing.view_count || 0,
      unlockCount: listing.unlock_count || 0,
      unlockFee: listing.unlock_fee || 499,
      listedAt: new Date(listing.created_at).toLocaleDateString('en-KE', { month: 'long', year: 'numeric' }),
      description: listing.description || 'No description provided.',
      rules: listing.rules || ['No specific rules provided.'],
      depositMonths: listing.deposit_months || 1,
      photos: listing.photos?.map((photo: any) => ({
        id: photo.id,
        url: photo.url,
        alt: photo.alt || listing.title,
        is_primary: photo.is_primary
      })) || [],
      host: {
        id: listing.host?.id || 'host-default',
        name: listing.host?.full_name || 'Property Manager',
        avatar: listing.host?.avatar_url || "https://img.rocket.new/generatedImages/rocket_gen_img_1fc7258af-1772393417158.png",
        avatarAlt: listing.host?.full_name || 'Host',
        memberSince: '2024',
        responseRate: 100,
        responseTime: 'within hours',
        totalListings: 1,
        isVerified: true
      }
    };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopNav />
      <main className="min-h-screen bg-gray-50">
        <ListingDetailContent listing={mappedListing} />
      </main>
      <Footer />
      <Toaster position="bottom-right" richColors />
    </>
  );
}
