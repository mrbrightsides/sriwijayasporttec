import React from 'react';
import { AssessmentRecord } from '../../types';
import { ArrowLeft, ArrowRight, CheckCircle2, Cpu, Info } from 'lucide-react';

interface Screen7AnalisisSistemProps {
  record: AssessmentRecord;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen7AnalisisSistem: React.FC<Screen7AnalisisSistemProps> = ({
  record,
  onPrev,
  onNext,
}) => {
  const { evaluation, imt, tkji, functional, aktivitas } = record;

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            7
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Analisis Sistem Sriwijaya Sport Tec</h2>
            <p className="text-xs text-slate-300">Pengolahan otomatis skor total kebugaran masyarakat</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 7 dari 12
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Left Table: 4 Components */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-yellow-600" />
              <span>Rincian Bobot Komponen Penilaian</span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1a30] text-white">
                  <tr>
                    <th className="p-3 font-bold">Komponen Penilaian</th>
                    <th className="p-3 font-bold text-center">Skor Component</th>
                    <th className="p-3 font-bold text-center">Bobot %</th>
                    <th className="p-3 font-bold text-right">Kontribusi Skor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-semibold text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Aktivitas Fisik</td>
                    <td className="p-3 text-center">{aktivitas.skorAktivitas} ({aktivitas.kategoriAktivitas})</td>
                    <td className="p-3 text-center font-bold text-slate-500">15%</td>
                    <td className="p-3 text-right font-black text-blue-900">
                      {(aktivitas.skorAktivitas * 0.15).toFixed(1)}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Indeks Massa Tubuh (IMT)</td>
                    <td className="p-3 text-center">{imt.skorIMT} ({imt.kategoriIMT})</td>
                    <td className="p-3 text-center font-bold text-slate-500">15%</td>
                    <td className="p-3 text-right font-black text-blue-900">
                      {(imt.skorIMT * 0.15).toFixed(1)}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Tes Kebugaran</td>
                    <td className="p-3 text-center">{tkji.totalSkorTKJI} ({tkji.kategoriTKJI})</td>
                    <td className="p-3 text-center font-bold text-emerald-600">35%</td>
                    <td className="p-3 text-right font-black text-blue-900">
                      {(tkji.totalSkorTKJI * 0.35).toFixed(1)}
                    </td>
                  </tr>

                  <tr className="hover:bg-slate-50">
                    <td className="p-3 font-bold text-slate-900">Functional Fitness</td>
                    <td className="p-3 text-center">{functional.totalSkorFunctional} ({functional.kategoriFunctional})</td>
                    <td className="p-3 text-center font-bold text-emerald-600">35%</td>
                    <td className="p-3 text-right font-black text-blue-900">
                      {(functional.totalSkorFunctional * 0.35).toFixed(1)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Formula display */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono">
              <strong>Rumus Sriwijaya Sport Tec:</strong><br />
              Total = (Aktivitas × 15%) + (IMT × 15%) + (Tes Kebugaran × 35%) + (Functional × 35%)
            </div>
          </div>

          {/* Right Gauge / Total Display */}
          <div className="bg-gradient-to-br from-[#0b1a30] via-slate-900 to-[#081325] text-white p-6 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center shadow-xl">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-widest mb-3">
              Total Skor Kebugaran
            </span>

            {/* Big Radial Ring */}
            <div className="w-32 h-32 rounded-full border-8 border-yellow-400 bg-slate-950 flex flex-col items-center justify-center shadow-2xl relative my-2">
              <span className="text-3xl font-black text-yellow-400 tracking-tight">
                {evaluation.totalSkor.toString().replace('.', ',')}
              </span>
              <span className="text-[10px] font-bold text-emerald-400 uppercase mt-0.5">
                ({evaluation.kategoriAkhir})
              </span>
            </div>

            <div className="mt-3 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold text-xs">
              Kategori: {evaluation.kategoriAkhir.toUpperCase()}
            </div>
          </div>

        </div>

        {/* Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center space-x-3 text-xs text-blue-900">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />
          <p className="leading-snug">
            <strong>Sistem Otomatis:</strong> Analisis dilakukan berdasarkan standar norma kebugaran olahraga masyarakat terpadu.
          </p>
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
            <span>Simpan &amp; Lanjut Kategori Hasil</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
