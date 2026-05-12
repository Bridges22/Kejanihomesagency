import React from 'react';
import PhotoGallery from './PhotoGallery';
import ListingBreadcrumb from './ListingBreadcrumb';
import ListingMainInfo from './ListingMainInfo';
import AmenitiesGrid from './AmenitiesGrid';
import HostCard from './HostCard';
import ListingDescription from './ListingDescription';
import StickyBookingSidebar from './StickyBookingSidebar';
import MapSection from './MapSection';
import ReviewsSection from './ReviewsSection';
import SimilarListings from './SimilarListings';

interface ListingDetailContentProps {
  listing: any;
}

export default function ListingDetailContent({ listing }: ListingDetailContentProps) {
  return (
    <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-10 py-6">
      {/* Breadcrumb */}
      <ListingBreadcrumb listing={listing} />

      {/* Photo Gallery & Top Map Section */}
      <div className="mt-4 mb-8 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <PhotoGallery photos={listing.photos} />
        </div>
        <div className="h-[400px] lg:h-auto">
          <MapSection listing={listing} />
        </div>
      </div>

      {/* Main Content + Sidebar */}
      <div className="flex flex-col xl:flex-row gap-10">
        {/* Left: Main Content */}
        <div className="flex-1 min-w-0 space-y-8">
          <ListingMainInfo listing={listing} />
          <AmenitiesGrid amenities={listing.amenities} />
          <ListingDescription listing={listing} />
          <HostCard host={{
            ...listing.host,
            name: listing.agent?.name || listing.host?.name || 'Property Manager',
            isVerified: true,
            memberSince: new Date().getFullYear().toString(),
            agency: listing.agent?.agency,
            phone: listing.agent?.phone,
            email: listing.agent?.email,
            bio: `Contact ${listing.agent?.name || 'the agent'} for more details about this ${listing.property_category?.toLowerCase() || 'property'}.`
          }} />
          {listing.reviewCount > 0 && <ReviewsSection listing={listing} />}
        </div>

        {/* Right: Sticky Sidebar */}
        <div className="xl:w-[380px] 2xl:w-[420px] flex-shrink-0">
          <div className="sticky top-20">
            <StickyBookingSidebar listing={listing} />
          </div>
        </div>
      </div>

      {/* Similar Listings */}
      <div className="mt-14">
        <SimilarListings currentId={listing.id} />
      </div>
    </div>);

}