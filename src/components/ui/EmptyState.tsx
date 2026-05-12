import React from 'react';
import { Search, Home, BookOpen, Heart } from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


const iconMap = {
  search: Search,
  home: Home,
  bookings: BookOpen,
  saved: Heart,
};

interface EmptyStateProps {
  icon?: keyof typeof iconMap;
  title: string;
  subtitle: string;
  ctaLabel?: string;
  onCta?: () => void;
}

export default function EmptyState({ icon = 'search', title, subtitle, ctaLabel, onCta }: EmptyStateProps) {
  const Icon = iconMap[icon];
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-teal-50 flex items-center justify-center mb-5">
        <Icon size={28} className="text-teal-500" />
      </div>
      <h3 className="font-display text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 max-w-sm leading-relaxed mb-6">{subtitle}</p>
      {ctaLabel && onCta && (
        <button onClick={onCta} className="btn-primary">
          {ctaLabel}
        </button>
      )}
    </div>
  );
}