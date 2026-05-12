import React from 'react';

interface RatingBadgeProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const getRatingLabel = (rating: number) => {
  if (rating >= 9.5) return 'Exceptional';
  if (rating >= 9.0) return 'Superb';
  if (rating >= 8.5) return 'Excellent';
  if (rating >= 8.0) return 'Very Good';
  if (rating >= 7.0) return 'Good';
  return 'Pleasant';
};

export default function RatingBadge({ 
  rating, 
  count, 
  size = 'md',
  showLabel = true 
}: RatingBadgeProps) {
  const label = getRatingLabel(rating);
  
  const sizeClasses = {
    sm: {
      box: 'w-7 h-7 text-xs rounded-lg',
      label: 'text-[11px]',
      count: 'text-[10px]'
    },
    md: {
      box: 'w-9 h-9 text-sm rounded-xl',
      label: 'text-sm',
      count: 'text-xs'
    },
    lg: {
      box: 'w-11 h-11 text-base rounded-2xl',
      label: 'text-base',
      count: 'text-sm'
    }
  };

  const currentSize = sizeClasses[size];

  return (
    <div className="flex items-center gap-2.5">
      {showLabel && (
        <div className="text-right hidden sm:block">
          <div className={`font-bold text-gray-900 leading-tight ${currentSize.label}`}>
            {label}
          </div>
          {count !== undefined && (
            <div className={`text-gray-500 font-medium ${currentSize.count}`}>
              {count.toLocaleString()} reviews
            </div>
          )}
        </div>
      )}
      <div className={`flex-shrink-0 flex items-center justify-center bg-teal-600 text-white font-black tabular-nums shadow-lg shadow-teal-600/20 ${currentSize.box}`}>
        {rating.toFixed(1)}
      </div>
    </div>
  );
}
