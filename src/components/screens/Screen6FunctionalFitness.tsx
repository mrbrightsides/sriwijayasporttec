import React, { useState } from 'react';
import { DataFunctionalFitness, Peserta } from '../../types';
import { calculateFunctionalFitness } from '../../utils/normaCalculator';
import { ArrowLeft, ArrowRight, HeartPulse, Info, Activity } from 'lucide-react';

interface Screen6FunctionalFitnessProps {
  peserta: Peserta;
  currentFunctional: DataFunctionalFitness;
  onSaveFunctional: (data: DataFunctionalFitness) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen6FunctionalFitness: React.FC<Screen6FunctionalFitnessProps> = ({
  peserta,
  currentFunctional,
  onSaveFunctional,
  onPrev,
  onNext,
}) => {
  const [sitToStand, setSitToStand] = useState<number>(currentFunctional.sitToStandRepetisi || 27);
  const [plank, setPlank] = useState<number>(currentFunctional.plankDetik || 130);
  const [balance, setBalance] = useState<number>(currentFunctional.balanceDetik || 50);
  const [sitAndReach, setSitAndReach] = useState<number>(currentFunctional.sitAndReachCm || 28);
  const [stepTestPulse, setStepTestPulse] = useState<number>(currentFunctional.stepTestRecoveryPulse || 92);
  const [denyutAwal, setDenyutAwal] = useState<number>(currentFunctional.denyutNadiAwal || 88);
  const [denyutAkhir, setDenyutAkhir] = useState<number>(currentFunctional.denyutNadiAkhir || 110);

  const calculated = calculateFunctionalFitness(
    peserta.umur,
    sitToStand,
    plank,
    balance,
    sitAndReach,
    stepTestPulse,
    denyutAwal,
    denyutAkhir
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveFunctional(calculated);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            6
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Pengukuran Functional Fitness</h2>
            <p className="text-xs text-slate-300">Kemampuan fungsional tubuh &amp; ketahanan aktivitas harian</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 6 dari 12
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Realtime Calculated Score Preview */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0b1a30] to-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-blue-800/60 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-300 font-semibold">Skor Functional Fitness (Usia {peserta.umur} Thn)</div>
              <div className="text-[11px] text-slate-400">
                Aktivasi Norma Kelompok Usia {peserta.umur <= 25 ? '17–25 Tahun (Remaja Akhir)' : '26–35 Tahun (Dewasa Awal)'}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-yellow-400">{calculated.totalSkorFunctional} <span className="text-xs font-normal text-slate-300">/100</span></div>
            <div className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Kategori: {calculated.kategoriFunctional}
            </div>
          </div>
        </div>

        {/* Inputs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. Sit to Stand 30 Detik */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">1</span>
                <span>Sit to Stand 30 Detik</span>
              </label>
              <span className="text-[10px] text-slate-500">repetisi</span>
            </div>
            <input
              type="number"
              min="0"
              max="80"
              value={sitToStand}
              onChange={(e) => setSitToStand(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
            />
            <div className="text-[10px] text-slate-500 mt-1">Skor Component: {calculated.skorSitToStand}/100</div>
          </div>

          {/* 2. Plank */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">2</span>
                <span>Plank (Daya Tahan Core)</span>
              </label>
              <span className="text-[10px] text-slate-500">detik</span>
            </div>
            <input
              type="number"
              min="0"
              max="600"
              value={plank}
              onChange={(e) => setPlank(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
            />
            <div className="text-[10px] text-slate-500 mt-1">Skor Component: {calculated.skorPlank}/100</div>
          </div>

          {/* 3. Balance 1 Kaki */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">3</span>
                <span>Balance (Berdiri 1 Kaki Mata Terbuka)</span>
              </label>
              <span className="text-[10px] text-slate-500">detik</span>
            </div>
            <input
              type="number"
              min="0"
              max="300"
              value={balance}
              onChange={(e) => setBalance(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
            />
            <div className="text-[10px] text-slate-500 mt-1">Skor Component: {calculated.skorBalance}/100</div>
          </div>

          {/* 4. Sit and Reach */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">4</span>
                <span>Sit and Reach (Kelenturan)</span>
              </label>
              <span className="text-[10px] text-slate-500">cm</span>
            </div>
            <input
              type="number"
              min="-20"
              max="60"
              value={sitAndReach}
              onChange={(e) => setSitAndReach(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
            />
            <div className="text-[10px] text-slate-500 mt-1">Skor Component: {calculated.skorSitAndReach}/100</div>
          </div>

          {/* 5. Step Test Recovery Pulse */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">5</span>
                <span>YMCA Step Test (Recovery Pulse)</span>
              </label>
              <span className="text-[10px] text-slate-500">bpm</span>
            </div>
            <input
              type="number"
              min="50"
              max="200"
              value={stepTestPulse}
              onChange={(e) => setStepTestPulse(Number(e.target.value))}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
            />
            <div className="text-[10px] text-slate-500 mt-1">Skor Component: {calculated.skorStepTest}/100</div>
          </div>

          {/* 6. Heart Rates */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">6</span>
              <span>Pengukuran Denyut Nadi</span>
            </label>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block">Denyut Nadi Awal</span>
                <input
                  type="number"
                  min="40"
                  max="180"
                  value={denyutAwal}
                  onChange={(e) => setDenyutAwal(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>

              <div>
                <span className="text-[10px] text-slate-500 block">Denyut Nadi Akhir (1 m)</span>
                <input
                  type="number"
                  min="40"
                  max="200"
                  value={denyutAkhir}
                  onChange={(e) => setDenyutAkhir(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-bold text-slate-800"
                />
              </div>
            </div>
            <div className="text-[10px] text-slate-500">Skor Delta HR: {calculated.skorDeltaHR}/100</div>
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
            <span>Simpan &amp; Lanjut Analisis Sistem</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
