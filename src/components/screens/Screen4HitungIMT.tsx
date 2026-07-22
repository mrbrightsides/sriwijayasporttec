import React, { useState } from 'react';
import { DataIMT, Peserta } from '../../types';
import { calculateIMT } from '../../utils/normaCalculator';
import { ArrowLeft, ArrowRight, Calculator, CheckCircle2, Info } from 'lucide-react';

interface Screen4HitungIMTProps {
  peserta: Peserta;
  currentIMT: DataIMT;
  onSaveIMT: (data: DataIMT) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen4HitungIMT: React.FC<Screen4HitungIMTProps> = ({
  peserta,
  currentIMT,
  onSaveIMT,
  onPrev,
  onNext,
}) => {
  const [tinggiBadan, setTinggiBadan] = useState<number>(currentIMT.tinggiBadan || 170);
  const [beratBadan, setBeratBadan] = useState<number>(currentIMT.beratBadan || 68);

  const calculated = calculateIMT(tinggiBadan, beratBadan);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveIMT(calculated);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            4
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Perhitungan Indeks Massa Tubuh (IMT)</h2>
            <p className="text-xs text-slate-300">Pengukuran rasio berat dan tinggi badan sesuai Standar WHO</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 4 dari 12
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Left Side: Inputs */}
          <div className="space-y-4">
            
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <span className="text-xs font-bold text-slate-800 block border-b pb-2 border-slate-200">
                Input Data Pengukuran Fisik
              </span>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tinggi Badan (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="100"
                    max="220"
                    required
                    value={tinggiBadan}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^0+(?=\d)/, '');
                      e.target.value = val;
                      setTinggiBadan(val === '' ? 0 : Number(val));
                    }}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">cm</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Berat Badan (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="30"
                    max="200"
                    required
                    value={beratBadan}
                    onChange={(e) => {
                      const val = e.target.value.replace(/^0+(?=\d)/, '');
                      e.target.value = val;
                      setBeratBadan(val === '' ? 0 : Number(val));
                    }}
                    className="w-full px-3 py-2.5 text-xs bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
                  />
                  <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-400">kg</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Usia Peserta:</span>
                  <span className="font-bold text-slate-800">{peserta.umur} Tahun</span>
                </div>
                <div className="bg-white p-2 rounded-lg border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Jenis Kelamin:</span>
                  <span className="font-bold text-slate-800">{peserta.jenisKelamin}</span>
                </div>
              </div>

            </div>

            {/* Calculated Card Highlight */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0b1a30] text-white p-5 rounded-2xl border border-slate-800 text-center shadow-lg">
              <span className="text-xs font-bold text-slate-300 block mb-1">Hasil Perhitungan IMT</span>
              <div className="text-4xl font-black text-yellow-400 my-1">
                {calculated.nilaiIMT.toString().replace('.', ',')}
              </div>
              
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold my-2 bg-emerald-500 text-slate-950 shadow">
                {calculated.kategoriIMT} (Skor Norma: {calculated.skorIMT})
              </div>

              <p className="text-[11px] text-slate-300 leading-relaxed mt-2 px-2">
                {calculated.statusGizi}
              </p>
            </div>

          </div>

          {/* Right Side: WHO Norm Table */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 border-b pb-2 border-slate-200 mb-3">
                <Info className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-slate-800">
                  Norma Klasifikasi WHO / Kemenkes RI (Bobot 15%)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-200 text-slate-700 text-[11px]">
                      <th className="p-2 font-bold rounded-l-lg">Kategori</th>
                      <th className="p-2 font-bold">Rentang IMT (kg/m²)</th>
                      <th className="p-2 font-bold rounded-r-lg text-center">Skor Norma</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    <tr className={calculated.kategoriIMT === 'Kurus' ? 'bg-amber-100 font-bold' : ''}>
                      <td className="p-2">Kurus (Underweight)</td>
                      <td className="p-2">&lt; 18,5</td>
                      <td className="p-2 text-center font-bold">75</td>
                    </tr>
                    <tr className={calculated.kategoriIMT === 'Normal' ? 'bg-emerald-100 font-bold text-emerald-900' : ''}>
                      <td className="p-2">Normal</td>
                      <td className="p-2">18,5 – 24,9</td>
                      <td className="p-2 text-center font-bold text-emerald-700">100</td>
                    </tr>
                    <tr className={calculated.kategoriIMT === 'Overweight' ? 'bg-amber-100 font-bold text-amber-900' : ''}>
                      <td className="p-2">Overweight (Kelebihan BB)</td>
                      <td className="p-2">25,0 – 29,9</td>
                      <td className="p-2 text-center font-bold">85</td>
                    </tr>
                    <tr className={calculated.kategoriIMT === 'Obesitas Class I' ? 'bg-rose-100 font-bold text-rose-900' : ''}>
                      <td className="p-2">Obesitas Class I</td>
                      <td className="p-2">30,0 – 34,9</td>
                      <td className="p-2 text-center font-bold">70</td>
                    </tr>
                    <tr className={calculated.kategoriIMT === 'Obesitas Class II' ? 'bg-rose-100 font-bold text-rose-900' : ''}>
                      <td className="p-2">Obesitas Class II</td>
                      <td className="p-2">35,0 – 39,9</td>
                      <td className="p-2 text-center font-bold">55</td>
                    </tr>
                    <tr className={calculated.kategoriIMT === 'Obesitas Class III' ? 'bg-rose-100 font-bold text-rose-900' : ''}>
                      <td className="p-2">Obesitas Class III</td>
                      <td className="p-2">≥ 40,0</td>
                      <td className="p-2 text-center font-bold">40</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mt-4 text-[10px] text-amber-900">
              <strong>Catatan Tim Evaluator:</strong> Nilai IMT memberikan bobot 15% pada formula total kebugaran akhir Sriwijaya Sport Tec.
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
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Simpan &amp; Lanjut Tes TKJI</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
