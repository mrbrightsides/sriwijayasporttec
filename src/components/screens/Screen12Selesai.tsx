import React from 'react';
import { CheckCircle2, Home, RotateCcw, ShieldCheck, Users } from 'lucide-react';

interface Screen12SelesaiProps {
  onReturnToDashboard: () => void;
  onNewAssessment: () => void;
}

export const Screen12Selesai: React.FC<Screen12SelesaiProps> = ({
  onReturnToDashboard,
  onNewAssessment,
}) => {
  return (
    <div className="max-w-2xl mx-auto bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden text-center my-8">
      
      {/* Header Dark Blue */}
      <div className="bg-[#0b1a30] p-6 text-white border-b border-slate-800">
        <div className="w-10 h-10 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs mx-auto mb-2">
          12
        </div>
        <h2 className="text-xl font-bold tracking-tight">Proses Monitoring Selesai</h2>
        <p className="text-xs text-slate-300 mt-1">Sriwijaya Sport Tec • Universitas Sriwijaya</p>
      </div>

      <div className="p-8 space-y-6">
        
        {/* Animated Green Checkmark Badge */}
        <div className="w-24 h-24 mx-auto rounded-full bg-emerald-100 border-4 border-emerald-500 flex items-center justify-center text-emerald-600 shadow-xl animate-pulse">
          <CheckCircle2 className="w-14 h-14" />
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-black text-slate-900">Terima Kasih!</h3>
          <p className="text-sm font-bold text-emerald-700">
            Proses monitoring kebugaran peserta telah berhasil diselesaikan.
          </p>
        </div>

        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
          Seluruh data hasil pengukuran telah tersimpan dalam sistem basis data dan siap digunakan untuk pemantauan berkala, evaluasi perkembangan fisik, serta penyusunan program pembinaan olahraga masyarakat berbasis data.
        </p>

        {/* Action Buttons */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onReturnToDashboard}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Dashboard Utama</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Input Tes Peserta Baru</span>
          </button>
        </div>

      </div>

      <div className="bg-slate-50 p-4 border-t border-slate-100 text-[10px] text-slate-500">
        © 2026 Sriwijaya Sport Tec • Universitas Sriwijaya
      </div>

    </div>
  );
};
