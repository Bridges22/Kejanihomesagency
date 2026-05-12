'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  ArrowRight,
  Upload, 
  X, 
  Home, 
  MapPin, 
  Tag, 
  Bed, 
  Bath, 
  FileText,
  Loader2,
  CheckCircle2,
  Smartphone,
  Globe,
  Layers,
  Sparkles,
  Info,
  DollarSign,
  Calendar,
  Key,
  ShieldCheck,
  Video,
  ExternalLink,
  Map as MapIcon,
  Phone,
  Mail,
  User,
  Building
} from 'lucide-react';
import Link from 'next/link';
import { hostService } from '@/services/hostService';
import { toast } from 'sonner';

const STEPS = [
  { id: 'basic', title: 'Basic Info', icon: FileText },
  { id: 'location', title: 'Location', icon: MapPin },
  { id: 'details', title: 'Structure', icon: Layers },
  { id: 'amenities', title: 'Amenities', icon: Sparkles },
  { id: 'media', title: 'Media', icon: Upload },
  { id: 'contact', title: 'Contact & Finish', icon: ShieldCheck }
];

export default function EditListingPage() {
  const router = useRouter();
  const { id } = useParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Media State
  const [existingPhotos, setExistingPhotos] = useState<any[]>([]);
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  // Form Data State
  const [formData, setFormData] = useState({
    title: '',
    type: 'Apartment',
    listing_type: 'rental',
    price: '',
    currency: 'KES',
    price_frequency: 'Per Month',
    is_negotiable: false,
    short_description: '',
    description: '',
    country: 'Kenya',
    county: 'Mombasa',
    sub_county: '',
    area: '',
    city_id: '',
    street_name: '',
    landmark: '',
    postal_code: '',
    latitude: '',
    longitude: '',
    display_location_publicly: true,
    bedrooms: '1',
    bathrooms: '1',
    toilets: '1',
    kitchens: '1',
    balconies: '0',
    floor_number: '',
    total_floors: '',
    size_sqft: '',
    year_built: '',
    furnishing_status: 'unfurnished',
    parking_spaces: '0',
    has_sq: false,
    amenities: {
      ac: false, ceiling_fan: false, wardrobes: false, walk_in_closet: false, modern_kitchen: false, pantry: false, laundry: false,
      pool: false, garden: false, cctv: false, electric_fence: false, perimeter_wall: false, gated_community: false, borehole: false, generator: false, lift: false, security_24h: false,
      water_included: false, electricity_included: false, internet_ready: false, solar: false,
      
      // Land Features
      'Piped Water': false, 'Electricity connection': false, 'Tarmac access': false, 'Red Soil': false, 'Title Deed Ready': false, 'Perimeter Fence': false, 'Borehole': false, 'Sewer Line': false
    },
    video_url: '',
    virtual_tour_url: '',
    floor_plan_url: '',
    agent_name: '',
    agency_name: '',
    agent_phone: '',
    agent_whatsapp: '',
    agent_email: '',
    show_contact_publicly: true,
    deposit_months: '1',
    lease_period: '',
    service_charge_included: false,
    available_from: '',
    has_title_deed: false,
    tenure_type: 'freehold',
    remaining_lease_years: '',
    property_condition: 'new'
  });

  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    async function init() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        // Fetch Cities
        const { data: citiesData } = await supabase.from('cities').select('id, name');
        if (citiesData) setCities(citiesData);

        // Fetch Listing
        const listing = await hostService.getListingById(id as string);
        
        setFormData({
          title: listing.title || '',
          type: listing.property_category || 'Apartment',
          listing_type: listing.type || 'rental',
          price: (listing.price_per_month || listing.price_per_night || listing.total_price || '').toString(),
          currency: listing.currency || 'KES',
          price_frequency: listing.price_frequency || 'Per Month',
          is_negotiable: listing.is_negotiable || false,
          short_description: listing.short_description || '',
          description: listing.description || '',
          country: listing.country || 'Kenya',
          county: listing.county || 'Mombasa',
          sub_county: listing.sub_county || '',
          area: listing.area || '',
          city_id: listing.city_id || '',
          street_name: listing.street_name || '',
          landmark: listing.landmark || '',
          postal_code: listing.postal_code || '',
          latitude: (listing.latitude || '').toString(),
          longitude: (listing.longitude || '').toString(),
          display_location_publicly: listing.display_location_publicly !== false,
          bedrooms: (listing.bedrooms || '1').toString(),
          bathrooms: (listing.bathrooms || '1').toString(),
          toilets: (listing.toilets || '1').toString(),
          kitchens: (listing.kitchens || '1').toString(),
          balconies: (listing.balconies || '0').toString(),
          floor_number: (listing.floor_number || '').toString(),
          total_floors: (listing.total_floors || '').toString(),
          size_sqft: (listing.size_sqft || '').toString(),
          year_built: (listing.year_built || '').toString(),
          furnishing_status: listing.furnishing_status || 'unfurnished',
          parking_spaces: (listing.parking_spaces || '0').toString(),
          has_sq: listing.has_sq || false,
          amenities: { ...formData.amenities, ...(listing.amenities_config || {}) },
          video_url: listing.video_url || '',
          virtual_tour_url: listing.virtual_tour_url || '',
          floor_plan_url: listing.floor_plan_url || '',
          agent_name: listing.agent_name || '',
          agency_name: listing.agency_name || '',
          agent_phone: listing.agent_phone || '',
          agent_whatsapp: listing.agent_whatsapp || '',
          agent_email: listing.agent_email || '',
          show_contact_publicly: listing.show_contact_publicly !== false,
          deposit_months: (listing.deposit_months || '1').toString(),
          lease_period: listing.lease_period || '',
          service_charge_included: listing.service_charge_included || false,
          available_from: listing.available_from || '',
          has_title_deed: listing.has_title_deed || false,
          tenure_type: listing.tenure_type || 'freehold',
          remaining_lease_years: (listing.remaining_lease_years || '').toString(),
          property_condition: listing.property_condition || 'new'
        });

        if (listing.photos) {
          setExistingPhotos(listing.photos);
        }

      } catch (err) {
        console.error('Failed to load listing', err);
        setError('Listing not found or access denied.');
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [id]);

  const handleRemoveExistingPhoto = async (photoId: string) => {
    if (!window.confirm('Delete this photo?')) return;
    try {
      await hostService.deleteListingPhoto(photoId);
      setExistingPhotos(prev => prev.filter(p => p.id !== photoId));
      toast.success('Photo removed');
    } catch (err) {
      toast.error('Failed to remove photo');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    const val = type === 'checkbox' ? (e.target as any).checked : value;
    
    if (name.startsWith('amenity_')) {
      const amenityName = name.replace('amenity_', '');
      setFormData(prev => ({
        ...prev,
        amenities: { ...prev.amenities, [amenityName]: val }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const finalData = {
        ...formData,
        amenities_config: formData.amenities
      };

      await hostService.updateListing(id as string, finalData);
      setSuccess(true);
      toast.success('Property updated successfully!');
      
      const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';
      setTimeout(() => router.push(isAdmin ? '/admin/listings' : '/host/listings'), 1500);
    } catch (err: any) {
      console.error('Update error:', err);
      setError(err.message || 'Failed to update listing.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 size={48} className="text-teal-600 animate-spin" />
        <p className="text-slate-500 font-medium tracking-tight">Loading property details...</p>
      </div>
    );
  }

  const ActiveIcon = STEPS[step].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link 
            href={typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === 'true' ? "/admin/listings" : "/host/listings"} 
            className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest mb-2 transition-colors"
          >
            <ArrowLeft size={14} /> Back to listings
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Edit Property</h1>
          <p className="text-slate-500">Updating: {formData.title}</p>
        </div>
        
        <div className="hidden md:flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s.id} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                i <= step ? 'bg-teal-800 text-white shadow-lg shadow-teal-900/20' : 'bg-slate-100 text-slate-400'
              }`}>
                {i < step ? <CheckCircle2 size={16} /> : i + 1}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-0.5 mx-1 ${i < step ? 'bg-teal-800' : 'bg-slate-100'}`} />
              )}
            </div>
          ))}
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3">
          <X size={18} className="text-rose-600 mt-1" />
          <p className="text-sm text-rose-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-[40px] border border-teal-50 shadow-xl shadow-teal-900/5 space-y-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600">
            <ActiveIcon size={28} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">{STEPS[step].title}</h2>
            <p className="text-sm text-slate-500">Edit the information as needed.</p>
          </div>
        </div>

        {/* STEP 1: BASIC INFO */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6 md:col-span-2">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Property Title</span>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Property Type</span>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900">
                  {['Apartment', 'Bedsitter', 'Studio', 'Maisonette', 'Villa', 'Townhouse', 'AirBNB', 'Commercial Office', 'Shop', 'Warehouse', 'Land'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Listing Type</span>
                <select name="listing_type" value={formData.listing_type} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900">
                  <option value="rental">For Rent</option>
                  <option value="sale">For Sale</option>
                  <option value="airbnb">Airbnb / Short Stay</option>
                </select>
              </label>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Price</span>
                  <div className="relative">
                    <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Currency</span>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900">
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                  </select>
                </label>
              </div>
              <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50">
                <span className="text-xs font-bold text-slate-600">Is Price Negotiable?</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" name="is_negotiable" checked={formData.is_negotiable} onChange={handleInputChange} className="sr-only peer" />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-600"></div>
                </label>
              </div>
            </div>

            <div className="space-y-6 md:col-span-2">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Short Description</span>
                <input maxLength={200} name="short_description" value={formData.short_description} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Description</span>
                <textarea rows={6} name="description" value={formData.description} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900 resize-none" />
              </label>
            </div>
          </div>
        )}

        {/* STEP 2: LOCATION */}
        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">County</span>
                <input name="county" value={formData.county} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">City / Town</span>
                <select name="city_id" value={formData.city_id} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900">
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Area / Estate</span>
                <input name="area" value={formData.area} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
              </label>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Latitude</span>
                  <input name="latitude" value={formData.latitude} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Longitude</span>
                  <input name="longitude" value={formData.longitude} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
                </label>
              </div>
              <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 cursor-pointer">
                <input type="checkbox" name="display_location_publicly" checked={formData.display_location_publicly} onChange={handleInputChange} className="rounded text-teal-600" />
                <span className="text-xs font-bold text-slate-700">Show exact location publicly</span>
              </label>
            </div>
          </div>
        )}

        {/* STEP 3: STRUCTURE */}
        {step === 2 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {formData.type !== 'Land' && [
              { label: 'Bedrooms', name: 'bedrooms', icon: Bed },
              { label: 'Bathrooms', name: 'bathrooms', icon: Bath },
              { label: 'Toilets', name: 'toilets', icon: Info },
              { label: 'Kitchens', name: 'kitchens', icon: Home },
              { label: 'Balconies', name: 'balconies', icon: ExternalLink },
              { label: 'Floor No', name: 'floor_number', icon: Layers },
              { label: 'Total Floors', name: 'total_floors', icon: Building },
              { label: 'Parking', name: 'parking_spaces', icon: MapPin },
            ].map((f) => (
              <label key={f.name} className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{f.label}</span>
                <div className="relative">
                  <input type="number" name={f.name} value={(formData as any)[f.name]} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" />
                  <f.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </label>
            ))}
            
            <div className={`col-span-2 grid ${formData.type === 'Land' ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{formData.type === 'Land' ? 'Size (Acres / Hectares / SqFt)' : 'Size (Sq Ft)'}</span>
                <input name="size_sqft" value={formData.size_sqft} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder={formData.type === 'Land' ? 'e.g. 5 Acres' : 'e.g. 1500'} />
              </label>
              {formData.type !== 'Land' && (
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Year Built</span>
                  <input name="year_built" value={formData.year_built} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="e.g. 2022" />
                </label>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: AMENITIES */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            {(formData.type === 'Land' ? (
              [
                { 
                  title: 'Land Features', 
                  items: [
                    { id: 'Piped Water', label: 'Piped Water' }, { id: 'Electricity connection', label: 'Electricity' }, 
                    { id: 'Tarmac access', label: 'Tarmac Road' }, { id: 'Red Soil', label: 'Red Soil' },
                    { id: 'Title Deed Ready', label: 'Title Deed Ready' }, { id: 'Perimeter Fence', label: 'Perimeter Fence' },
                    { id: 'Borehole', label: 'Borehole' }, { id: 'Sewer Line', label: 'Sewer Line' }
                  ] 
                }
              ]
            ) : (
              [
                { 
                  title: 'Interior', 
                  items: [
                    { id: 'ac', label: 'Air Conditioning' }, { id: 'wardrobes', label: 'Wardrobes' },
                    { id: 'modern_kitchen', label: 'Modern Kitchen' }, { id: 'laundry', label: 'Laundry Area' }
                  ] 
                },
                { 
                  title: 'Exterior', 
                  items: [
                    { id: 'pool', label: 'Swimming Pool' }, { id: 'garden', label: 'Garden' }, 
                    { id: 'cctv', label: 'CCTV' }, { id: 'lift', label: 'Lift' },
                    { id: 'security_24h', label: '24/7 Security' }, { id: 'borehole', label: 'Borehole' }
                  ] 
                },
                { 
                  title: 'Utilities', 
                  items: [
                    { id: 'water_included', label: 'Water Included' }, { id: 'internet_ready', label: 'Internet Ready' },
                    { id: 'solar', label: 'Solar Power' }
                  ] 
                }
              ]
            )).map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{group.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {group.items.map((item) => (
                    <label key={item.id} className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                      (formData.amenities as any)[item.id] ? 'bg-teal-50 border-teal-100 text-teal-900' : 'bg-white border-slate-50 text-slate-500 hover:border-slate-100'
                    }`}>
                      <input type="checkbox" name={`amenity_${item.id}`} checked={(formData.amenities as any)[item.id]} onChange={handleInputChange} className="sr-only" />
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        (formData.amenities as any)[item.id] ? 'bg-teal-600 border-teal-600' : 'bg-white border-slate-200'
                      }`}>
                        {(formData.amenities as any)[item.id] && <CheckCircle2 size={12} className="text-white" />}
                      </div>
                      <span className="text-xs font-bold">{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* STEP 5: MEDIA */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Existing Photos</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {existingPhotos.map((photo, index) => (
                <div key={photo.id} className="relative aspect-square rounded-2xl overflow-hidden group border border-slate-100 shadow-sm">
                  <img src={photo.url} alt="Listing" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    {typeof window !== 'undefined' && new URLSearchParams(window.location.search).get('admin') === 'true' && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveExistingPhoto(photo.id)}
                        className="p-2 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-all shadow-lg"
                        title="Delete photo"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-teal-50/50 hover:border-teal-500 hover:text-teal-600 transition-all cursor-pointer">
                <Upload size={24} />
                <span className="text-[10px] font-bold uppercase tracking-widest">Add More</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
              {[
                { label: 'Video URL', name: 'video_url', icon: Video },
                { label: 'Virtual Tour', name: 'virtual_tour_url', icon: Globe },
                { label: 'Floor Plan', name: 'floor_plan_url', icon: FileText },
              ].map((m) => (
                <label key={m.name} className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{m.label}</span>
                  <div className="relative">
                    <input name={m.name} value={(formData as any)[m.name]} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-xs text-slate-900" />
                    <m.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* STEP 6: CONTACT */}
        {step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6">
              <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact Person</h3>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Name</span>
                  <input name="agent_name" value={formData.agent_name} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none font-medium text-slate-900 text-sm" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone</span>
                  <input name="agent_phone" value={formData.agent_phone} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none font-medium text-slate-900 text-sm" />
                </label>
              </div>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email</span>
                <input type="email" name="agent_email" value={formData.agent_email} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none outline-none font-medium text-slate-900 text-sm" />
              </label>
            </div>

            <div className="p-8 rounded-[32px] bg-teal-800 text-white space-y-4 shadow-xl shadow-teal-900/20">
              <h3 className="font-bold flex items-center gap-2 text-lg">
                <CheckCircle2 size={20} className="text-teal-300" />
                Ready to update?
              </h3>
              <p className="text-sm text-teal-100 leading-relaxed">
                Review all changes before submitting. The listing will remain {formData.listing_type} and continue to be visible to seekers.
              </p>
              <div className="pt-4 space-y-2">
                <div className="flex justify-between text-xs font-bold text-teal-300 uppercase tracking-widest">
                  <span>Price</span>
                  <span>{formData.currency} {parseFloat(formData.price || '0').toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-teal-300 uppercase tracking-widest">
                  <span>Status</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded">Active</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION */}
        <div className="flex items-center justify-between pt-10 border-t border-slate-50">
          <button type="button" onClick={prevStep} disabled={step === 0 || submitting} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
            step === 0 ? 'opacity-0 pointer-events-none' : 'bg-slate-50 text-slate-600 hover:bg-slate-100 shadow-sm'
          }`}>
            <ArrowLeft size={18} /> Back
          </button>
          
          <button type="submit" disabled={submitting} className="flex items-center gap-3 bg-teal-800 hover:bg-teal-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-teal-900/20 active:scale-95 group disabled:bg-slate-300">
            {submitting ? (
              <Loader2 size={20} className="animate-spin" />
            ) : step === STEPS.length - 1 ? (
              <>Save Changes <CheckCircle2 size={20} /></>
            ) : (
              <>Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
