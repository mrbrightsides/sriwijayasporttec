import React, { useState } from 'react';
import {
  ActivityDuration,
  ActivityFrequency,
  ActivityIntensity,
  ActivityType,
  AktivitasFisik,
} from '../../types';
import { calculateAktivitasFisik } from '../../utils/normaCalculator';
import { Activity, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';

interface Screen3AktivitasFisikProps {
  currentAktivitas: AktivitasFisik;
  onSaveAktivitas: (aktivitas: AktivitasFisik) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen3AktivitasFisik: React.FC<Screen3AktivitasFisikProps> = ({
  currentAktivitas,
  onSaveAktivitas,
  onPrev,
  onNext,
}) => {
  const [jenis, setJenis] = useState<ActivityType>(currentAktivitas.jenisUtama || 'Jogging/Lari');
  const [frekuensi, setFrekuensi] = useState<ActivityFrequency>(currentAktivitas.frekuensi || '3–4 kali/minggu');
  const [durasi, setDurasi] = useState<ActivityDuration>(currentAktivitas.durasi || '40–59 menit');
  const [intensitas, setIntensitas] = useState<ActivityIntensity>(currentAktivitas.intensitas || 'Sedang');
  const [aktivitasLain, setAktivitasLain] = useState<string[]>(
    currentAktivitas.aktivitasLain || ['Jalan Kaki', 'Senam']
  );

  const calculated = calculateAktivitasFisik(jenis, frekuensi, durasi, intensitas, aktivitasLain);

  const toggleAktivitasLain = (item: string) => {
    if (aktivitasLain.includes(item)) {
      setAktivitasLain(aktivitasLain.filter((a) => a !== item));
    } else {
      setAktivitasLain([...aktivitasLain, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAktivitas(calculated);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            3
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Input Aktivitas Fisik &amp; Jasmani</h2>
            <p className="text-xs text-slate-300">Pencatatan frekuensi, durasi, dan intensitas olahraga</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 3 dari 12
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* Realtime Calculated Score Preview */}
        <div className="bg-gradient-to-r from-blue-900 via-[#0b1a30] to-slate-900 text-white p-4 rounded-xl flex items-center justify-between border border-blue-800/60 shadow-inner">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-yellow-500/20 text-yellow-400 rounded-xl">
              <Activity className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-slate-300 font-semibold">Estimasi Skor Aktivitas Fisik</div>
              <div className="text-xs text-slate-400">Norma Maksimum = 100 poin</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-yellow-400">{calculated.skorAktivitas} <span className="text-xs font-normal text-slate-300">/100</span></div>
            <div className="inline-block text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              Kategori: {calculated.kategoriAktivitas}
            </div>
          </div>
        </div>

        {/* Form Grid */}
        <div className="space-y-5">
          
          {/* 1. Jenis Aktivitas Utama */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              1. Jenis Aktivitas Utama
            </label>
            <select
              value={jenis}
              onChange={(e) => setJenis(e.target.value as ActivityType)}
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
            >
              <option value="Tidak berolahraga">Tidak berolahraga (Skor 0)</option>
              <option value="Jalan kaki">Jalan kaki (Skor 15)</option>
              <option value="Senam">Senam (Skor 20)</option>
              <option value="Bersepeda">Bersepeda (Skor 22)</option>
              <option value="Jogging/Lari">Jogging / Lari (Skor 25)</option>
              <option value="Renang">Renang (Skor 25)</option>
              <option value="Olahraga permainan (futsal, basket, badminton, dll.)">
                Olahraga Permainan (Futsal, Basket, Badminton, dll) (Skor 25)
              </option>
            </select>
          </div>

          {/* 2. Frekuensi Latihan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              2. Frekuensi Latihan
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['<1 kali/minggu', '1–2 kali/minggu', '3–4 kali/minggu', '≥5 kali/minggu'] as ActivityFrequency[]).map(
                (f) => (
                  <button
                    type="button"
                    key={f}
                    onClick={() => setFrekuensi(f)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      frekuensi === f
                        ? 'bg-[#0b1a30] text-yellow-400 border-[#0b1a30] font-bold shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {f}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 3. Durasi Latihan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              3. Durasi Latihan Per Sesi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {(['<20 menit', '20–39 menit', '40–59 menit', '≥60 menit'] as ActivityDuration[]).map(
                (d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDurasi(d)}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold text-center transition-all ${
                      durasi === d
                        ? 'bg-[#0b1a30] text-yellow-400 border-[#0b1a30] font-bold shadow-md'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {d}
                  </button>
                )
              )}
            </div>
          </div>

          {/* 4. Intensitas Latihan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              4. Tingkat Intensitas Aktivitas
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(['Ringan', 'Sedang', 'Berat'] as ActivityIntensity[]).map((i) => (
                <button
                  type="button"
                  key={i}
                  onClick={() => setIntensitas(i)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-bold text-center transition-all ${
                    intensitas === i
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                      : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Aktivitas Tambahan Lain */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              5. Aktivitas Tambahan Lainnya (Opsional)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Jalan Kaki', 'Bersepeda', 'Senam', 'Yoga', 'Berenang', 'Futsal/Badminton'].map((item) => {
                const isSelected = aktivitasLain.includes(item);
                return (
                  <label
                    key={item}
                    onClick={() => toggleAktivitasLain(item)}
                    className={`flex items-center space-x-2 p-2 rounded-xl border text-xs font-medium cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                        : 'bg-slate-50 border-slate-200 text-slate-600'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}}
                      className="rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span>{item}</span>
                  </label>
                );
              })}
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
            <span>Simpan &amp; Lanjut Hitung IMT</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
