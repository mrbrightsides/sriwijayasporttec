import React from 'react';
import {
  Activity,
  Calculator,
  CheckCircle2,
  Dumbbell,
  FileSpreadsheet,
  HeartPulse,
  Home,
  LogOut,
  Settings,
  ShieldAlert,
  UserCheck,
  Users
} from 'lucide-react';

export type MainNavTab = 
  | 'dashboard'
  | 'peserta'
  | 'aktivitas'
  | 'imt'
  | 'tkji'
  | 'functional'
  | 'laporan'
  | 'pengaturan';

interface SidebarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onSelectTab, onLogout }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, stepTarget: 11 },
    { id: 'peserta', label: 'Data Peserta', icon: Users, stepTarget: 2 },
    { id: 'aktivitas', label: 'Aktivitas Fisik', icon: Activity, stepTarget: 3 },
    { id: 'imt', label: 'IMT', icon: Calculator, stepTarget: 4 },
    { id: 'tkji', label: 'Tes Kebugaran', icon: Dumbbell, stepTarget: 5 },
    { id: 'functional', label: 'Functional Fitness', icon: HeartPulse, stepTarget: 6 },
    { id: 'laporan', label: 'Hasil & Laporan', icon: FileSpreadsheet, stepTarget: 10 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings, stepTarget: 1 },
  ];

  return (
    <aside className="w-64 bg-[#081325] text-slate-300 border-r border-slate-800/80 flex flex-col flex-shrink-0 min-h-[calc(100vh-5rem)]">
      
      {/* Sidebar Header Badge */}
      <div className="p-4 border-b border-slate-800/80 flex items-center space-x-3 bg-[#0a182d]">
        <div className="w-9 h-9 rounded-lg bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400 font-bold">
          <Activity className="w-5 h-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-white tracking-wide uppercase">SRIWIJAYA</div>
          <div className="text-[10px] text-yellow-400 font-medium">SPORT TEC v1.0</div>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
          Navigasi Utama
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id as MainNavTab)}
              className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all text-left ${
                isActive
                  ? 'bg-yellow-500 text-slate-950 font-bold shadow-lg shadow-yellow-500/10'
                  : 'text-slate-300 hover:bg-slate-800/70 hover:text-white'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span className="flex-1">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Info / Logout */}
      <div className="p-3 border-t border-slate-800/80 bg-[#060f1d]">
        <div className="bg-slate-900/80 rounded-xl p-3 border border-slate-800 mb-2">
          <div className="flex items-center space-x-2 text-yellow-400 text-xs font-semibold mb-1">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Sistem Kebugaran</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            Terintegrasi Norma WHO, Tes Kebugaran & Functional Fitness.
          </p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout Sistem</span>
        </button>
      </div>

    </aside>
  );
};
