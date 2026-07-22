import React from 'react';
import { AssessmentRecord } from '../../types';
import { ArrowLeft, ArrowRight, Activity, Dumbbell, HeartPulse, Sparkles, Footprints, ShieldCheck } from 'lucide-react';

interface Screen9RekomendasiAktivitasProps {
  record: AssessmentRecord;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen9RekomendasiAktivitas: React.FC<Screen9RekomendasiAktivitasProps> = ({
  record,
  onPrev,
  onNext,
}) => {
  const { evaluation, peserta } = record;
  const { rekomendasi } = evaluation;

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            9
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Rekomendasi Program Aktivitas Jasmani</h2>
            <p className="text-xs text-slate-300">Panduan latihan terstruktur khusus untuk {peserta.nama}</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 9 dari 12
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Banner with Runner Illustration */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0b1a30] to-slate-900 text-white rounded-2xl p-5 flex flex-col md:flex-row items-center justify-between shadow-lg relative overflow-hidden">
          
          <div className="space-y-1 z-10 max-w-lg">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest bg-yellow-500/10 border border-yellow-500/20 px-2.5 py-0.5 rounded-full inline-block">
              Rekomendasi Terpersonalisasi
            </span>
            <h3 className="text-lg font-bold text-white">Program Pembinaan Kebugaran Jasmani</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Disusun berdasarkan kategori <strong className="text-yellow-400">{evaluation.kategoriAkhir}</strong> (Skor: {evaluation.totalSkor}) untuk mendukung peningkatan kebugaran fungsional dan kesehatan jangka panjang.
            </p>
          </div>

          <div className="mt-3 md:mt-0 z-10 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
              <Activity className="w-10 h-10 animate-pulse" />
            </div>
          </div>

        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Card 1: Daya Tahan */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-yellow-500 transition-colors space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">1. Daya Tahan Kardiorespirasi</h4>
                <span className="text-[10px] text-blue-600 font-semibold">Fokus: Jantung &amp; Paru</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-1">
              {rekomendasi.dayaTahan}
            </p>
          </div>

          {/* Card 2: Kekuatan */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-yellow-500 transition-colors space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-100 text-emerald-700 rounded-xl">
                <Dumbbell className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">2. Kekuatan &amp; Daya Tahan Otot</h4>
                <span className="text-[10px] text-emerald-600 font-semibold">Fokus: Otot &amp; Tulang</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-1">
              {rekomendasi.kekuatan}
            </p>
          </div>

          {/* Card 3: Fleksibilitas */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-yellow-500 transition-colors space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-purple-100 text-purple-700 rounded-xl">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">3. Kelenturan / Fleksibilitas</h4>
                <span className="text-[10px] text-purple-600 font-semibold">Fokus: Sendi &amp; Postur</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-1">
              {rekomendasi.fleksibilitas}
            </p>
          </div>

          {/* Card 4: Aktivitas Harian */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-yellow-500 transition-colors space-y-2">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-amber-100 text-amber-700 rounded-xl">
                <Footprints className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">4. Aktivitas Harian Aktif</h4>
                <span className="text-[10px] text-amber-600 font-semibold">Fokus: Gaya Hidup Sehat</span>
              </div>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed pl-1">
              {rekomendasi.aktivitasHarian}
            </p>
          </div>

        </div>

        {/* Action Buttons */}
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
            <span>Simpan &amp; Lanjut Cetak Laporan</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
