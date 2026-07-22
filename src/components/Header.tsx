import React from 'react';
import { UserProfile } from '../types';
import { Activity, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { UnsriLogo } from './UnsriLogo';

interface HeaderProps {
  user: UserProfile;
  onLogout: () => void;
  activeStep: number;
  setActiveStep: (step: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ user, onLogout, activeStep, setActiveStep }) => {
  return (
    <header className="bg-[#0b1a30] text-white border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & University Title */}
          <div className="flex items-center space-x-3">
            <UnsriLogo size="md" />

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-yellow-400 uppercase">
                  UNIVERSITAS SRIWIJAYA
                </span>
                <span className="hidden md:inline-block text-[10px] text-slate-400">| ILMU ALAT PENGABDIAN</span>
              </div>
              <h1 className="text-base sm:text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                <span>SRIWIJAYA SPORT TEC</span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
                  PROTOTIPE
                </span>
              </h1>
              <p className="text-[11px] sm:text-xs text-slate-300 hidden sm:block">
                Sistem Monitoring Kebugaran Olahraga Masyarakat Berbasis Web
              </p>
            </div>
          </div>

          {/* User Profile & Actions */}
          <div className="flex items-center space-x-3">
            {user.isLoggedIn ? (
              <div className="flex items-center space-x-3 bg-slate-800/80 backdrop-blur-sm border border-slate-700/60 rounded-xl px-3 py-1.5">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs">
                  {user.name.charAt(0)}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-xs font-semibold text-slate-100">{user.name}</div>
                  <div className="text-[10px] text-amber-400 capitalize">{user.role} • {user.institution}</div>
                </div>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveStep(1)}
                className="inline-flex items-center space-x-1.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow-md"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>Login</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
