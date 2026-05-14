'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

export default function NewListingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  // Media State
  const [selectedPhotos, setSelectedPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [featuredPhotoIndex, setFeaturedPhotoIndex] = useState(0);

  // Form Data State
  const [formData, setFormData] = useState({
    // Basic Info
    title: '',
    type: 'Apartment', // Property Type (Sub-category)
    category: 'Rental', // Airbnb, Rental, Sale, Land, Commercial
    listing_type_detailed: 'rent', // short_stay, rent, sale, land, commercial_rent, commercial_sale
    listing_type: 'rental', // Keeping for backward compatibility (rental, airbnb, sale)
    
    // Pricing
    price_per_night: '',
    price_per_month: '',
    sale_price: '',
    land_price: '',
    commercial_rent_price: '',
    commercial_sale_price: '',
    price: '', // Keeping as fallback or general reference
    
    currency: 'KES',
    price_frequency: 'Per Month',
    is_negotiable: false,
    short_description: '',
    description: '',

    // Location
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

    // Details
    bedrooms: '1',
    bathrooms: '1',
    toilets: '1',
    kitchens: '1',
    balconies: '0',
    floor_number: '',
    total_floors: '',
    size_sqft: '',
    property_size: '',
    year_built: '',
    furnishing_status: 'unfurnished',
    parking_spaces: '0',
    parking_details: '',
    utilities_details: '',
    has_sq: false,

    // Amenities (Flat list for the form, will be grouped into amenities_config)
    amenities: {
      // Basic Interior
      ac: false, ceiling_fan: false, wardrobes: false, walk_in_closet: false, modern_kitchen: false, pantry: false, laundry: false,
      // Basic Exterior
      pool: false, garden: false, cctv: false, electric_fence: false, perimeter_wall: false, gated_community: false, borehole: false, generator: false, lift: false, security_24h: false,
      // Basic Utilities
      water_included: false, electricity_included: false, internet_ready: false, solar: false,
      
      // NEW SEARCHABLE FILTERS (Match database labels)
      'Beach': false, 'Swimming pool': false, 'Free WiFi': false, '5 stars': false, 'Beachfront': false,
      'Toilet with grab rails': false, 'Emergency cord in bathroom': false, 'Raised toilet': false, 
      'Lower bathroom sink': false, 'Upper floors accessible by elevator': false, 
      'Entire unit wheelchair accessible': false, 'Walk-in shower': false,
      'Windsurfing': false, 'Snorkelling': false, 'Diving': false, 'Fishing': false,
      'Diani Beach Hospital': false, 'Colobus Conservation': false, 'KFI Supermarket': false,
      
      // Land Features
      'Piped Water': false, 'Electricity connection': false, 'Tarmac access': false, 'Red Soil': false, 'Title Deed Ready': false, 'Perimeter Fence': false, 'Borehole': false, 'Sewer Line': false
    },

    // Media Links
    video_url: '',
    virtual_tour_url: '',
    floor_plan_url: '',

    // Contact
    agent_name: '',
    agency_name: '',
    agent_phone: '',
    agent_whatsapp: '',
    agent_email: '',
    show_contact_publicly: true,

    // Specific Fields
    deposit_months: '1',
    deposit: '',
    lease_period: '',
    lease_duration: '',
    service_charge_included: false,
    available_from: '',
    has_title_deed: false,
    title_deed_status: 'Freehold',
    tenure_type: 'freehold',
    remaining_lease_years: '',
    property_condition: 'new',
    max_guests: '2',
    check_in_time: '14:00',
    check_out_time: '10:00',
    land_size: ''
  });

  const [cities, setCities] = useState<any[]>([]);

  useEffect(() => {
    const fetchCities = async () => {
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      const { data } = await supabase.from('cities').select('id, name');
      if (data && data.length > 0) {
        setCities(data);
        // Removed the auto-default to data[0].id to force user selection
      }
    };
    fetchCities();
  }, []);

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

  const nextStep = () => {
    // Validation before moving to next step
    if (step === 1 && !formData.city_id) {
      setError('Please select a City / Town before proceeding.');
      return;
    }
    setError('');
    setStep(prev => Math.min(prev + 1, STEPS.length - 1));
  };
  const prevStep = () => setStep(prev => Math.max(prev - 1, 0));

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedPhotos(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removePhoto = (index: number) => {
    setSelectedPhotos(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
    if (featuredPhotoIndex === index) setFeaturedPhotoIndex(0);
    else if (featuredPhotoIndex > index) setFeaturedPhotoIndex(featuredPhotoIndex - 1);
  };

   const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Final Validation
    if (!formData.city_id) {
      setError('Please select a City / Town in the Location step.');
      setStep(1); // Go back to location step
      return;
    }

    if (step < STEPS.length - 1) {
      nextStep();
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (selectedPhotos.length === 0) throw new Error('Please upload at least one photo.');

      // Prepare final data
      const finalData = {
        ...formData,
        amenities_config: formData.amenities,
        price: formData.price
      };

      // Reorder photos to put featured one first
      const orderedPhotos = [...selectedPhotos];
      if (featuredPhotoIndex > 0) {
        const [featured] = orderedPhotos.splice(featuredPhotoIndex, 1);
        orderedPhotos.unshift(featured);
      }

      await hostService.createListing(finalData, orderedPhotos);
      setSuccess(true);
      toast.success('Property listed successfully!');
      setTimeout(() => router.push('/host/listings'), 2000);
    } catch (err: any) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to create listing.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 animate-in zoom-in-95 duration-500">
        <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center text-teal-600">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">Listing Created!</h2>
        <p className="text-slate-500 text-center max-w-xs">Redirecting you to your listings...</p>
      </div>
    );
  }

  const ActiveIcon = STEPS[step].icon;

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/host/listings" className="flex items-center gap-2 text-xs font-bold text-teal-600 hover:text-teal-700 uppercase tracking-widest mb-2 transition-colors">
            <ArrowLeft size={14} /> Back to listings
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Add New Property</h1>
          <p className="text-slate-500">Step {step + 1} of {STEPS.length}: {STEPS[step].title}</p>
        </div>
        
        {/* Progress Bar */}
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
            <p className="text-sm text-slate-500">Please provide the required information below.</p>
          </div>
        </div>

        {/* STEP 1: BASIC INFO */}
        {step === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-6 md:col-span-2">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Property Title</span>
                <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900" placeholder="e.g. 3 Bedroom Apartment in Nyali with Ocean View" />
              </label>
            </div>

            <div className="space-y-6">
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Primary Category</span>
                <select name="category" value={formData.category} onChange={(e) => {
                  handleInputChange(e);
                  // Auto-set listing type based on category
                  const cat = e.target.value;
                  let lt = formData.listing_type_detailed;
                  let oldLt = formData.listing_type;
                  if (cat === 'Airbnb') { lt = 'short_stay'; oldLt = 'airbnb'; }
                  else if (cat === 'Rental') { lt = 'rent'; oldLt = 'rental'; }
                  else if (cat === 'Sale') { lt = 'sale'; oldLt = 'sale'; }
                  else if (cat === 'Land') { lt = 'land'; oldLt = 'sale'; }
                  else if (cat === 'Commercial') { lt = 'commercial_rent'; oldLt = 'rental'; }
                  
                  setFormData(prev => ({ ...prev, listing_type_detailed: lt, listing_type: oldLt }));
                }} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium">
                  <option value="Rental">Rental Property</option>
                  <option value="Airbnb">Airbnb / Short Stay</option>
                  <option value="Sale">Property for Sale</option>
                  <option value="Land">Land</option>
                  <option value="Commercial">Commercial Property</option>
                </select>
              </label>

              {formData.category === 'Commercial' && (
                <label className="block animate-in fade-in slide-in-from-top-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Commercial Type</span>
                  <select name="listing_type_detailed" value={formData.listing_type_detailed} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium">
                    <option value="commercial_rent">For Rent</option>
                    <option value="commercial_sale">For Sale</option>
                  </select>
                </label>
              )}

              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Property Sub-Type</span>
                <select name="type" value={formData.type} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium">
                  {['Apartment', 'Bedsitter', 'Studio', 'Maisonette', 'Villa', 'Townhouse', 'Holiday Home', 'Commercial Office', 'Shop', 'Warehouse', 'Farm', 'Plot'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                    {formData.category === 'Airbnb' ? 'Price Per Night' : 
                     formData.category === 'Rental' ? 'Price Per Month' : 
                     formData.category === 'Sale' ? 'Sale Price' : 
                     formData.category === 'Land' ? 'Land Price' : 
                     formData.listing_type_detailed === 'commercial_rent' ? 'Rent Per Month' : 'Sale Price'}
                  </span>
                  <div className="relative">
                    {formData.category === 'Airbnb' && <input required type="number" name="price_per_night" value={formData.price_per_night} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />}
                    {formData.category === 'Rental' && <input required type="number" name="price_per_month" value={formData.price_per_month} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />}
                    {formData.category === 'Sale' && <input required type="number" name="sale_price" value={formData.sale_price} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />}
                    {formData.category === 'Land' && <input required type="number" name="land_price" value={formData.land_price} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />}
                    {formData.category === 'Commercial' && formData.listing_type_detailed === 'commercial_rent' && <input required type="number" name="commercial_rent_price" value={formData.commercial_rent_price} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />}
                    {formData.category === 'Commercial' && formData.listing_type_detailed === 'commercial_sale' && <input required type="number" name="commercial_sale_price" value={formData.commercial_sale_price} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />}
                    <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Currency</span>
                  <select name="currency" value={formData.currency} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium">
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
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Short Description (150-200 chars)</span>
                <input maxLength={200} name="short_description" value={formData.short_description} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="Quick catchphrase for search results..." />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Full Description</span>
                <textarea rows={6} name="description" value={formData.description} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium resize-none" placeholder="Detailed property features, neighborhood perks, etc..." />
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
                <input name="county" value={formData.county} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="e.g. Mombasa" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">City / Town</span>
                <select required name="city_id" value={formData.city_id} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-slate-900">
                  <option value="" disabled>Select a City / Town...</option>
                  {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Area / Estate</span>
                <input name="area" value={formData.area} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="e.g. Nyali, Galu Beach" />
              </label>
              <label className="block">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Landmark</span>
                <input name="landmark" value={formData.landmark} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="e.g. Near City Mall" />
              </label>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Latitude</span>
                  <input name="latitude" value={formData.latitude} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="-4.0435" />
                </label>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Longitude</span>
                  <input name="longitude" value={formData.longitude} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" placeholder="39.6682" />
                </label>
              </div>
              <div className="p-6 rounded-3xl bg-teal-50/50 border border-teal-100 flex items-start gap-4">
                <MapIcon className="text-teal-600 shrink-0 mt-1" size={20} />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-teal-900">Map Settings</h4>
                  <p className="text-xs text-teal-700 leading-relaxed">Enter coordinates to enable the interactive map on your listing detail page.</p>
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input type="checkbox" name="display_location_publicly" checked={formData.display_location_publicly} onChange={handleInputChange} className="rounded text-teal-600 focus:ring-teal-500" />
                    <span className="text-xs font-bold text-teal-900">Show exact location publicly</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DETAILS */}
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
                  <input type="number" name={f.name} value={(formData as any)[f.name]} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />
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

            {formData.type !== 'Land' && (
              <div className="col-span-2 grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Furnishing</span>
                  <select name="furnishing_status" value={formData.furnishing_status} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium">
                    <option value="furnished">Furnished</option>
                    <option value="semi-furnished">Semi-Furnished</option>
                    <option value="unfurnished">Unfurnished</option>
                  </select>
                </label>
                <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 mt-5">
                  <span className="text-xs font-bold text-slate-600">Servant Quarter?</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" name="has_sq" checked={formData.has_sq} onChange={handleInputChange} className="sr-only peer" />
                    <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:bg-teal-600 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5"></div>
                  </label>
                </div>
              </div>
            )}
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
                },
                { 
                  title: 'Nearby Landmarks', 
                  items: [
                    { id: 'Diani Beach Hospital', label: 'Diani Beach Hospital' },
                    { id: 'Colobus Conservation', label: 'Colobus Conservation' },
                    { id: 'KFI Supermarket', label: 'KFI Supermarket' }
                  ] 
                }
              ]
            ) : (
              [
                { 
                  title: 'Interior Features', 
                  items: [
                    { id: 'ac', label: 'Air Conditioning' }, { id: 'ceiling_fan', label: 'Ceiling Fan' }, 
                    { id: 'wardrobes', label: 'Built-in Wardrobes' }, { id: 'walk_in_closet', label: 'Walk-in Closet' },
                    { id: 'modern_kitchen', label: 'Modern Kitchen' }, { id: 'pantry', label: 'Pantry' }, { id: 'laundry', label: 'Laundry Area' }
                  ] 
                },
                { 
                  title: 'Exterior Features', 
                  items: [
                    { id: 'pool', label: 'Swimming Pool' }, { id: 'garden', label: 'Garden' }, 
                    { id: 'cctv', label: 'CCTV' }, { id: 'electric_fence', label: 'Electric Fence' },
                    { id: 'perimeter_wall', label: 'Perimeter Wall' }, { id: 'gated_community', label: 'Gated Community' },
                    { id: 'borehole', label: 'Borehole' }, { id: 'generator', label: 'Backup Generator' },
                    { id: 'lift', label: 'Lift / Elevator' }, { id: 'security_24h', label: '24/7 Security' }
                  ] 
                },
                { 
                  title: 'Utilities', 
                  items: [
                    { id: 'water_included', label: 'Water Included' }, { id: 'electricity_included', label: 'Electricity Included' },
                    { id: 'internet_ready', label: 'Internet Ready' }, { id: 'solar', label: 'Solar System' }
                  ] 
                },
                { 
                  title: 'Popular & Location', 
                  items: [
                    { id: 'Beach', label: 'Beach Access' }, { id: 'Swimming pool', label: 'Swimming Pool' }, 
                    { id: 'Free WiFi', label: 'Free WiFi' }, { id: '5 stars', label: '5 Star Rating' },
                    { id: 'Beachfront', label: 'Beachfront' }
                  ] 
                },
                { 
                  title: 'Accessibility', 
                  items: [
                    { id: 'Toilet with grab rails', label: 'Toilet with grab rails' }, 
                    { id: 'Emergency cord in bathroom', label: 'Emergency cord in bathroom' },
                    { id: 'Raised toilet', label: 'Raised toilet' },
                    { id: 'Lower bathroom sink', label: 'Lower bathroom sink' },
                    { id: 'Upper floors accessible by elevator', label: 'Elevator Accessible' },
                    { id: 'Entire unit wheelchair accessible', label: 'Wheelchair Accessible' },
                    { id: 'Walk-in shower', label: 'Walk-in shower' }
                  ] 
                },
                { 
                  title: 'Fun Things To Do', 
                  items: [
                    { id: 'Windsurfing', label: 'Windsurfing' }, { id: 'Snorkelling', label: 'Snorkelling' },
                    { id: 'Diving', label: 'Diving' }, { id: 'Fishing', label: 'Fishing' }
                  ] 
                },
                { 
                  title: 'Nearby Landmarks', 
                  items: [
                    { id: 'Diani Beach Hospital', label: 'Diani Beach Hospital' },
                    { id: 'Colobus Conservation', label: 'Colobus Conservation' },
                    { id: 'KFI Supermarket', label: 'KFI Supermarket' }
                  ] 
                }
              ]
            )).map((group) => (
              <div key={group.title} className="space-y-4">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">{group.title}</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="md:col-span-2 space-y-6">
              <label className="group relative w-full h-[300px] rounded-[32px] border-2 border-dashed border-slate-200 hover:border-teal-500 hover:bg-teal-50/30 transition-all flex flex-col items-center justify-center cursor-pointer overflow-hidden">
                <input type="file" multiple accept="image/*" onChange={handlePhotoChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                <div className="w-16 h-16 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 group-hover:scale-110 transition-transform mb-4">
                  <Upload size={32} />
                </div>
                <h4 className="text-lg font-bold text-slate-900">Drag & Drop Gallery</h4>
                <p className="text-sm text-slate-500">Upload multiple photos. First one is featured.</p>
              </label>

              {previews.length > 0 && (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                  {previews.map((src, index) => (
                    <div key={src} onClick={() => setFeaturedPhotoIndex(index)} className={`relative group aspect-square rounded-2xl overflow-hidden cursor-pointer border-4 transition-all ${
                      featuredPhotoIndex === index ? 'border-teal-500 ring-4 ring-teal-500/10' : 'border-white hover:border-slate-100'
                    }`}>
                      <img src={src} alt="Preview" className="w-full h-full object-cover" />
                      <button type="button" onClick={(e) => { e.stopPropagation(); removePhoto(index); }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <X size={14} />
                      </button>
                      {featuredPhotoIndex === index && (
                        <div className="absolute inset-0 bg-teal-900/40 flex items-center justify-center">
                          <span className="bg-teal-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded-full">Featured</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              {[
                { label: 'Video URL (YouTube/Vimeo)', name: 'video_url', icon: Video },
                { label: 'Virtual Tour Link', name: 'virtual_tour_url', icon: Globe },
                { label: 'Floor Plan Image URL', name: 'floor_plan_url', icon: FileText },
              ].map((m) => (
                <label key={m.name} className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">{m.label}</span>
                  <div className="relative">
                    <input name={m.name} value={(formData as any)[m.name]} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium text-xs" placeholder="https://..." />
                    <m.icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
              ))}
              <div className="p-6 rounded-3xl bg-blue-50 border border-blue-100">
                <h4 className="text-xs font-bold text-blue-900 mb-2">Pro Tip</h4>
                <p className="text-[10px] text-blue-700 leading-relaxed">Listings with virtual tours and video walkthroughs get 80% more engagement on Kejani Homes.</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 6: CONTACT & SPECIFIC FIELDS */}
        {step === 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-8">
              <div className="space-y-6">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Agent Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Agent Name</span>
                    <div className="relative">
                      <input name="agent_name" value={formData.agent_name} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />
                      <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Agency</span>
                    <div className="relative">
                      <input name="agency_name" value={formData.agency_name} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />
                      <Building size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Phone</span>
                    <div className="relative">
                      <input name="agent_phone" value={formData.agent_phone} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />
                      <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">WhatsApp</span>
                    <div className="relative">
                      <input name="agent_whatsapp" value={formData.agent_whatsapp} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />
                      <Smartphone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>
                </div>
                <label className="block">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Email Address</span>
                  <div className="relative">
                    <input type="email" name="agent_email" value={formData.agent_email} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 transition-all outline-none font-medium" />
                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50/50 border border-teal-100 cursor-pointer">
                  <input type="checkbox" name="show_contact_publicly" checked={formData.show_contact_publicly} onChange={handleInputChange} className="rounded text-teal-600" />
                  <span className="text-xs font-bold text-teal-900">Show my contact details publicly on the listing</span>
                </label>
              </div>
            </div>

            <div className="space-y-8">
              {formData.category === 'Rental' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Rental Specifics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Deposit (Amount/Months)</span>
                      <input type="text" name="deposit" value={formData.deposit} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lease Duration</span>
                      <input name="lease_duration" value={formData.lease_duration} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" placeholder="e.g. 1 Year" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Available From</span>
                    <div className="relative">
                      <input type="date" name="available_from" value={formData.available_from} onChange={handleInputChange} className="w-full pl-10 pr-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" />
                      <Calendar size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 cursor-pointer">
                    <input type="checkbox" name="service_charge_included" checked={formData.service_charge_included} onChange={handleInputChange} className="rounded text-slate-600" />
                    <span className="text-xs font-bold text-slate-700">Service charge included in rent?</span>
                  </label>
                </div>
              ) : formData.category === 'Airbnb' || formData.category === 'Short Stay' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Airbnb Specifics</h3>
                  <div className="bg-rose-50 border border-rose-100 p-6 rounded-[32px] space-y-4">
                    <div className="flex items-center gap-3 text-rose-600 mb-2">
                      <Sparkles size={20} />
                      <span className="text-sm font-black uppercase tracking-widest">Short Stay Optimization</span>
                    </div>
                    <p className="text-xs text-rose-700 leading-relaxed font-medium">
                      Airbnb listings are automatically optimized for short stays. Ensure your photos and amenities (WiFi, Pool, etc.) are up to date to attract more guests.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Max Guests</span>
                      <input type="number" name="max_guests" value={formData.max_guests} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" placeholder="e.g. 4" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Check-in Time</span>
                      <input type="time" name="check_in_time" value={formData.check_in_time} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" />
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Check-out Time</span>
                      <input type="time" name="check_out_time" value={formData.check_out_time} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" />
                    </label>
                  </div>
                </div>
              ) : formData.category === 'Sale' || formData.category === 'Commercial' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Sale Specifics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tenure</span>
                      <select name="tenure_type" value={formData.tenure_type} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium">
                        <option value="freehold">Freehold</option>
                        <option value="leasehold">Leasehold</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Lease Years</span>
                      <input type="number" name="remaining_lease_years" value={formData.remaining_lease_years} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" disabled={formData.tenure_type === 'freehold'} />
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Property Condition</span>
                    <select name="property_condition" value={formData.property_condition} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium">
                      <option value="new">Brand New</option>
                      <option value="renovated">Renovated</option>
                      <option value="resale">Resale</option>
                    </select>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-2xl bg-teal-50/50 border border-teal-100 cursor-pointer">
                    <input type="checkbox" name="has_title_deed" checked={formData.has_title_deed} onChange={handleInputChange} className="rounded text-teal-600" />
                    <span className="text-xs font-bold text-teal-900">Title Deed Available?</span>
                  </label>
                </div>
              ) : formData.category === 'Land' ? (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Land Specifics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Tenure</span>
                      <select name="tenure_type" value={formData.tenure_type} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium">
                        <option value="freehold">Freehold</option>
                        <option value="leasehold">Leasehold</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Title Deed Status</span>
                      <select name="title_deed_status" value={formData.title_deed_status} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium">
                        <option value="Ready">Ready</option>
                        <option value="In Progress">In Progress</option>
                        <option value="No Title">No Title</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">Land Size</span>
                    <input name="land_size" value={formData.land_size} onChange={handleInputChange} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-teal-500/20 outline-none font-medium" placeholder="e.g. 50x100, 1 Acre" />
                  </label>
                </div>
              ) : null}
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="flex items-center justify-between pt-10 border-t border-slate-50">
          <button type="button" onClick={prevStep} disabled={step === 0 || loading} className={`flex items-center gap-2 px-8 py-4 rounded-2xl font-bold transition-all ${
            step === 0 ? 'opacity-0 pointer-events-none' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}>
            <ArrowLeft size={18} /> Back
          </button>
          
          <button type="submit" disabled={loading} className="flex items-center gap-3 bg-teal-800 hover:bg-teal-700 text-white px-10 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-teal-900/20 active:scale-95 group disabled:bg-slate-300">
            {loading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : step === STEPS.length - 1 ? (
              <>List Property <CheckCircle2 size={20} /></>
            ) : (
              <>Continue <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
