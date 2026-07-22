import React from 'react';
import unsriLogoImg from '../assets/images/unsri_logo_1784691173021.jpg';

interface UnsriLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtext?: boolean;
  className?: string;
}

export const UnsriLogo: React.FC<UnsriLogoProps> = ({
  size = 'md',
  showSubtext = false,
  className = '',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-11 h-11',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-600 p-0.5 shadow-md flex-shrink-0 flex items-center justify-center overflow-hidden border border-yellow-300/60`}
      >
        <img
          src={unsriLogoImg}
          alt="Universitas Sriwijaya Logo"
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Fallback if image fails to load
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
      </div>

      {showSubtext && (
        <div>
          <span className="text-[10px] font-bold tracking-widest text-yellow-400 uppercase block">
            UNIVERSITAS SRIWIJAYA
          </span>
          <h2 className="text-sm font-black text-white tracking-tight leading-tight">
            SRIWIJAYA SPORT TEC
          </h2>
          <span className="text-[9px] text-slate-300 font-medium block">
            ILMU ALAT PENGABDIAN
          </span>
        </div>
      )}
    </div>
  );
};
