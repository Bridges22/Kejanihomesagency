'use client';

import React, { memo, useMemo } from 'react';
import AppIcon from './AppIcon';
import AppImage from './AppImage';

interface AppLogoProps {
  src?: string; // Image source (optional)
  iconName?: string; // Icon name when no image
  size?: number; // Size for icon/image
  className?: string; // Additional classes
  onClick?: () => void; // Click handler
}

const AppLogo = memo(function AppLogo({
  src = '/kejani-logo.png',
  iconName = 'SparklesIcon',
  size = 64,
  className = '',
  onClick,
}: AppLogoProps) {
  // Memoize className calculation
  const containerClassName = useMemo(() => {
    const classes = ['flex items-center'];
    if (onClick) classes.push('cursor-pointer hover:opacity-80 transition-opacity');
    if (className) classes.push(className);
    return classes.join(' ');
  }, [onClick, className]);

  return (
    <div className={containerClassName} onClick={onClick}>
      {/* Show image if src provided, otherwise show icon */}
      <div className="relative flex-shrink-0">
        {src ? (
          <div className="rounded-full p-0.5 bg-white shadow-sm ring-1 ring-gray-100/50 overflow-hidden">
            <AppImage
              src={src}
              alt="Logo" 
              width={size}
              height={size}
              className="rounded-full object-cover"
              priority={true}
              unoptimized={src.endsWith('.svg')}
            />
          </div>
        ) : (
          <div className="p-2 bg-teal-50 rounded-xl text-teal-600 shadow-sm border border-teal-100/50">
            <AppIcon name={iconName} size={size * 0.6} className="flex-shrink-0" />
          </div>
        )}
      </div>
    </div>
  );
});

export default AppLogo;
