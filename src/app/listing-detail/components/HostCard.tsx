import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { ShieldCheck, MessageCircle, Phone, Mail, Building2 } from 'lucide-react';

interface HostCardProps {
  host: {
    id: string;
    name: string;
    avatar: string;
    avatarAlt: string;
    memberSince: string;
    isVerified: boolean;
    bio: string;
    agency?: string;
    phone?: string;
    email?: string;
  };
}

export default function HostCard({ host }: HostCardProps) {
  return (
    <div className="border-t border-gray-100 pt-8">
      <h2 className="font-display text-xl font-bold text-gray-900 mb-5">Listed By</h2>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-card p-6">
        <div className="flex items-start gap-4 mb-5">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-teal-100">
              <AppImage
                src={host.avatar}
                alt={host.avatarAlt}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            {host.isVerified && (
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center border-2 border-white">
                <ShieldCheck size={12} className="text-white" />
              </div>
            )}
          </div>

          {/* Name + meta */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-display text-lg font-bold text-gray-900">{host.name}</h3>
              {host.isVerified && (
                <span className="badge-verified text-[11px]">
                  <ShieldCheck size={10} />
                  Verified
                </span>
              )}
            </div>
            
            {host.agency ? (
              <div className="flex items-center gap-1.5 text-sm font-medium text-gray-600 mb-1">
                <Building2 size={14} className="text-gray-400" />
                {host.agency}
              </div>
            ) : null}
            
            <p className="text-xs text-gray-400">Member since {host.memberSince}</p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-sm text-gray-600 leading-relaxed mb-6">{host.bio}</p>

        {/* Contact Actions */}
        <div className="flex gap-2">
          {host.phone ? (
            <a 
              href={`tel:${host.phone}`}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-sm font-bold text-white transition-colors"
            >
              <Phone size={15} />
              Call Agent
            </a>
          ) : (
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-teal-600 hover:bg-teal-700 rounded-xl text-sm font-bold text-white transition-colors">
              <MessageCircle size={15} />
              Send Message
            </button>
          )}
          
          {host.email && (
            <a 
              href={`mailto:${host.email}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:border-teal-200 rounded-xl text-sm font-bold text-gray-600 hover:text-teal-600 transition-colors"
            >
              <Mail size={15} />
              Email
            </a>
          )}
        </div>
      </div>
    </div>
  );
}