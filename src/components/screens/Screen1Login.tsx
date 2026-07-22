import React, { useState } from 'react';
import { Role, UserProfile } from '../../types';
import { Lock, LogIn, Shield, User } from 'lucide-react';
import { UnsriLogo } from '../UnsriLogo';

interface Screen1LoginProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export const Screen1Login: React.FC<Screen1LoginProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin_sriwijaya');
  const [password, setPassword] = useState('123456');
  const [role, setRole] = useState<Role>('admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess({
      username,
      name: username === 'admin_sriwijaya' ? 'Dr. Heru Pratama, M.Or.' : username,
      role,
      institution: 'Universitas Sriwijaya',
      isLoggedIn: true,
    });
  };

  const handleDemoFill = (selectedRole: Role, demoUsername: string) => {
    setRole(selectedRole);
    setUsername(demoUsername);
    setPassword('sriwijaya2026');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-[#0b1a30] p-6 text-center text-white relative flex flex-col items-center">
          <div className="absolute top-3 left-3 bg-yellow-500 text-slate-950 font-black text-[11px] px-2.5 py-0.5 rounded-full flex items-center space-x-1">
            <span>1</span>
            <span>MULAI - LOGIN</span>
          </div>

          <div className="mt-4 mb-2">
            <UnsriLogo size="xl" />
          </div>

          <h2 className="text-xl font-bold tracking-tight text-white">SRIWIJAYA SPORT TEC</h2>
          <p className="text-xs text-slate-300 mt-1">Sistem Monitoring Kebugaran Olahraga Masyarakat</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Username</label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none font-medium text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Hak Akses / Peran</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="w-full px-3 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:outline-none font-semibold text-slate-800"
            >
              <option value="admin">Administrator Sistem</option>
              <option value="instruktur">Instruktur Olahraga</option>
              <option value="petugas">Petugas Pengukuran</option>
              <option value="pelatih">Pelatih Komunitas</option>
              <option value="pengelola">Pengelola Komunitas</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold py-3 rounded-xl text-xs transition-all flex items-center justify-center space-x-2 shadow-lg shadow-blue-950/20 active:scale-[0.99]"
          >
            <LogIn className="w-4 h-4" />
            <span>Login Ke Sistem</span>
          </button>

          {/* Preset Roles Demo Helper */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-[10px] text-slate-500 font-semibold block mb-1.5 text-center">
              Pilih Akun Demo Cepat:
            </span>
            <div className="flex flex-wrap gap-1.5 justify-center">
              <button
                type="button"
                onClick={() => handleDemoFill('admin', 'admin_sriwijaya')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-medium"
              >
                Admin
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('instruktur', 'instruktur_fai')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-medium"
              >
                Instruktur
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('petugas', 'petugas_lapangan')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-medium"
              >
                Petugas Tes
              </button>
              <button
                type="button"
                onClick={() => handleDemoFill('pengelola', 'pengelola_runner')}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-1 rounded-md font-medium"
              >
                Pengelola
              </button>
            </div>
          </div>

        </form>

        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 text-center text-[10px] text-slate-500">
          © 2026 Universitas Sriwijaya • Fakultas Ilmu Keolahragaan
        </div>

      </div>
    </div>
  );
};
