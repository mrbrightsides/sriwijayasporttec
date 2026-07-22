import React from 'react';
import { Check } from 'lucide-react';

interface StepFlowNavProps {
  currentStep: number;
  onSelectStep: (stepNumber: number) => void;
}

export const STEPS_CONFIG = [
  { step: 1, title: 'Login Pengguna', short: '1. Login' },
  { step: 2, title: 'Input Data Peserta', short: '2. Data Peserta' },
  { step: 3, title: 'Input Aktivitas Fisik', short: '3. Aktivitas Fisik' },
  { step: 4, title: 'Hitung IMT', short: '4. Hitung IMT' },
  { step: 5, title: 'Tes TKJI', short: '5. Tes TKJI' },
  { step: 6, title: 'Functional Fitness', short: '6. Functional' },
  { step: 7, title: 'Analisis Sistem', short: '7. Analisis' },
  { step: 8, title: 'Kategori Hasil', short: '8. Kategori' },
  { step: 9, title: 'Rekomendasi Aktivitas', short: '9. Rekomendasi' },
  { step: 10, title: 'Cetak Laporan', short: '10. Cetak' },
  { step: 11, title: 'Dashboard Summary', short: '11. Dashboard' },
  { step: 12, title: 'Selesai', short: '12. Selesai' },
];

export const StepFlowNav: React.FC<StepFlowNavProps> = ({ currentStep, onSelectStep }) => {
  return (
    <div className="bg-[#0f2137] border-b border-slate-800 py-2.5 px-3 sm:px-6 shadow-inner overflow-x-auto no-scrollbar">
      <div className="flex items-center space-x-1.5 min-w-max mx-auto max-w-7xl">
        {STEPS_CONFIG.map((item, index) => {
          const isActive = currentStep === item.step;
          const isPassed = currentStep > item.step;

          return (
            <React.Fragment key={item.step}>
              <button
                onClick={() => onSelectStep(item.step)}
                className={`group flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-yellow-500 text-slate-950 font-bold shadow-md shadow-yellow-500/20 scale-105'
                    : isPassed
                    ? 'bg-slate-800/90 text-yellow-400 hover:bg-slate-700/80 border border-yellow-500/20'
                    : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200 border border-slate-800'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-black ${
                    isActive
                      ? 'bg-slate-950 text-yellow-400'
                      : isPassed
                      ? 'bg-yellow-500/20 text-yellow-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isPassed ? <Check className="w-3 h-3 stroke-[3]" /> : item.step}
                </div>
                <span className="whitespace-nowrap">{item.short}</span>
              </button>

              {index < STEPS_CONFIG.length - 1 && (
                <span className="text-slate-600 text-[10px] font-bold px-0.5">➔</span>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
