import React, { useEffect } from 'react';
import { AssessmentRecord } from '../../types';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Award, CheckCircle, Flame, Medal, Trophy } from 'lucide-react';

interface Screen8KategoriHasilProps {
  record: AssessmentRecord;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen8KategoriHasil: React.FC<Screen8KategoriHasilProps> = ({
  record,
  onPrev,
  onNext,
}) => {
  const { evaluation, peserta } = record;
  const score = evaluation.totalSkor;

  useEffect(() => {
    if (score >= 80) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }
  }, [score]);

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            8
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Penentuan Kategori Hasil Kebugaran</h2>
            <p className="text-xs text-slate-300">Klasifikasi tingkat kebugaran jasmani peserta secara visual</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 8 dari 12
        </div>
      </div>

      <div className="p-6 space-y-8">
        
        {/* Visual Gauge Bar */}
        <div>
          <span className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wider text-center">
            Rentang Norma Klasifikasi Kebugaran Sriwijaya Sport Tec
          </span>

          <div className="grid grid-cols-5 gap-1 text-center font-bold text-xs text-white rounded-xl overflow-hidden p-1 bg-slate-100 border border-slate-200 shadow-inner">
            <div className="bg-red-500 py-3 rounded-l-lg relative">
              <div className="text-[10px] opacity-90">&lt; 50</div>
              <div className="text-xs font-black">Sangat Kurang</div>
            </div>

            <div className="bg-amber-500 py-3 relative">
              <div className="text-[10px] opacity-90">50 – 64</div>
              <div className="text-xs font-black">Kurang</div>
            </div>

            <div className="bg-yellow-500 py-3 relative">
              <div className="text-[10px] opacity-90">65 – 79</div>
              <div className="text-xs font-black">Cukup</div>
            </div>

            <div className="bg-emerald-500 py-3 relative">
              <div className="text-[10px] opacity-90">80 – 89</div>
              <div className="text-xs font-black">Baik</div>
            </div>

            <div className="bg-emerald-700 py-3 rounded-r-lg relative">
              <div className="text-[10px] opacity-90">90 – 100</div>
              <div className="text-xs font-black">Sangat Baik</div>
            </div>
          </div>

          {/* Marker indicator for current score */}
          <div className="mt-3 flex justify-center">
            <div className="bg-[#0b1a30] text-yellow-400 font-bold px-4 py-1.5 rounded-full text-xs shadow-md border border-yellow-400/40 flex items-center space-x-2">
              <Flame className="w-4 h-4 text-yellow-400" />
              <span>Skor Total Peserta: <strong>{score}</strong>/100</span>
            </div>
          </div>
        </div>

        {/* Big Results Banner Card */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100 border-2 border-emerald-300 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between shadow-lg">
          
          <div className="space-y-3 text-center md:text-left">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest">
              Hasil Evaluasi Kebugaran Peserta ({peserta.nama})
            </div>

            <div className="text-2xl md:text-3xl font-black text-emerald-950 flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span>Anda Termasuk Dalam Kategori</span>
              <span className="px-4 py-1 bg-emerald-600 text-white rounded-xl shadow-md uppercase tracking-wider text-xl md:text-2xl">
                {evaluation.kategoriAkhir}
              </span>
            </div>

            <p className="text-xs md:text-sm font-semibold text-emerald-900 max-w-xl leading-relaxed">
              Pertahankan kebiasaan baik Anda dan tingkatkan latihan secara teratur untuk hasil kondisi fisik yang lebih optimal!
            </p>
          </div>

          {/* Gold Trophy Graphic */}
          <div className="mt-4 md:mt-0 flex-shrink-0 w-28 h-28 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 p-1 shadow-2xl flex items-center justify-center">
            <div className="w-full h-full rounded-2xl bg-slate-950 flex flex-col items-center justify-center text-yellow-400 border border-yellow-300/40">
              <Trophy className="w-12 h-12 text-yellow-400 animate-bounce" />
              <span className="text-[10px] font-black uppercase text-yellow-300 mt-1">SPORT TEC</span>
            </div>
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
            type="button"
            onClick={onNext}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Simpan &amp; Lanjut Rekomendasi</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
