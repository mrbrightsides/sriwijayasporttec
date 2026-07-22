import React, { useState } from 'react';
import { DataTKJI, Peserta } from '../../types';
import { calculateTKJI } from '../../utils/normaCalculator';
import { Activity, ArrowLeft, ArrowRight, Dumbbell, Info, Timer } from 'lucide-react';

interface Screen5TesTKJIProps {
  peserta: Peserta;
  currentTKJI: DataTKJI;
  onSaveTKJI: (data: DataTKJI) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen5TesTKJI: React.FC<Screen5TesTKJIProps> = ({
  peserta,
  currentTKJI,
  onSaveTKJI,
  onPrev,
  onNext,
}) => {
  const [cooper, setCooper] = useState<number>(currentTKJI.cooperDistanceMeter || 0);
  const [pushUp, setPushUp] = useState<number>(currentTKJI.pushUpRepetisi || 0);
  const [verticalJump, setVerticalJump] = useState<number>(currentTKJI.verticalJumpCm || 0);

  const calculated = calculateTKJI(peserta.jenisKelamin, cooper, pushUp, verticalJump);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveTKJI(calculated);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            5
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Tes Kebugaran Jasmani Indonesia (TKJI)</h2>
            <p className="text-xs text-slate-300">Pengukuran daya tahan kardiorespirasi, daya tahan otot, dan power tungkai</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 5 dari 12
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Realtime Calculated Score Preview */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0b1a30] to-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-blue-800/60 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl">
              <Dumbbell className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-300 font-semibold">Skor Akhir TKJI ({peserta.jenisKelamin})</div>
              <div className="text-[11px] text-slate-400">
                Cooper (40%) + Push-Up (30%) + Vertical Jump (30%)
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-yellow-400">{calculated.totalSkorTKJI} <span className="text-xs font-normal text-slate-300">/100</span></div>
            <div className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Kategori: {calculated.kategoriTKJI}
            </div>
          </div>
        </div>

        {/* Inputs List */}
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* 1. Push-Up 60 Detik */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">1</span>
                  <span>Push-Up 60 Detik (Daya Tahan Otot)</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-600">Bobot 30%</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={pushUp}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    e.target.value = val;
                    setPushUp(val === '' ? 0 : Number(val));
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">repetisi</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Skor Norma Component: {calculated.skorPushUp}/100</div>
            </div>

            {/* 2. Vertical Jump */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">2</span>
                  <span>Vertical Jump (Power Tungkai)</span>
                </label>
                <span className="text-[10px] font-bold text-emerald-600">Bobot 30%</span>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={verticalJump}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    e.target.value = val;
                    setVerticalJump(val === '' ? 0 : Number(val));
                  }}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
                />
                <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">cm</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-1">Skor Norma Component: {calculated.skorVerticalJump}/100</div>
            </div>

          </div>

          {/* 3. Cooper 12-Minute Run Test (40% Weight) */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-amber-900 flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center">3</span>
                <span>Lari 12 Menit (Cooper 12-Minute Run Test)</span>
              </label>
              <span className="text-xs font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Bobot Utama 40%
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
              <div>
                <span className="text-[11px] text-amber-800 font-medium block mb-1">
                  Jarak Tempuh dalam 12 Menit (Meter)
                </span>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    step="50"
                    value={cooper}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^0+(?=\d)/, '');
                      e.target.value = val;
                      setCooper(val === '' ? 0 : Number(val));
                    }}
                    className="w-full px-3 py-2 text-xs bg-white border border-amber-300 rounded-xl focus:ring-2 focus:ring-amber-500 font-black text-amber-950"
                  />
                  <span className="absolute right-3 top-2 text-xs font-bold text-slate-500">meter</span>
                </div>
              </div>

              <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs">
                <div className="text-[10px] text-slate-500">Skor Norma Cooper ({peserta.jenisKelamin}):</div>
                <div className="text-base font-black text-amber-700">{calculated.skorCooper} / 100</div>
                <div className="text-[10px] text-slate-500">Target Ideal: &gt; {peserta.jenisKelamin === 'Laki-laki' ? '2.800m' : '2.700m'}</div>
              </div>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center space-x-3 text-xs text-blue-900">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="leading-snug">
              <strong>Petunjuk Lapangan:</strong> Pastikan peserta melakukan pemanasan (stretching &amp; light jogging) sebelum tes untuk mencegah cedera dan mencapai hasil optimal.
            </p>
          </div>

        </div>

        {/* Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Simpan &amp; Lanjut Functional Fitness</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
