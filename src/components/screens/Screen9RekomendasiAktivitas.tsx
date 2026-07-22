import React, { useState } from 'react';
import { AssessmentRecord } from '../../types';
import { ArrowLeft, ArrowRight, Activity, Dumbbell, Sparkles, Footprints, Info, Scale, HeartPulse, ChevronDown, ChevronUp, Zap, Flame } from 'lucide-react';
import {
  getRekomendasiAktivitasFisik,
  getRekomendasiIMT,
  getRekomendasiPushUp,
  getRekomendasiVerticalJump,
  getRekomendasiCooperRun,
} from '../../utils/normaCalculator';

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
  const { evaluation, peserta, aktivitas, imt, tkji } = record;
  const { rekomendasi } = evaluation;
  const [showTableNorma, setShowTableNorma] = useState(false);

  const rekomendasiAktivitasFisikText = rekomendasi.aktivitasFisik || getRekomendasiAktivitasFisik(aktivitas.kategoriAktivitas);
  const rekomendasiIMTText = rekomendasi.imt || getRekomendasiIMT(imt.kategoriIMT);
  const rekomendasiPushUpText = rekomendasi.pushUp || getRekomendasiPushUp(tkji.skorPushUp);
  const rekomendasiVerticalJumpText = rekomendasi.verticalJump || getRekomendasiVerticalJump(tkji.skorVerticalJump);
  const rekomendasiCooperRunText = rekomendasi.cooperRun || getRekomendasiCooperRun(tkji.skorCooper);

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
              Disusun berdasarkan kategori <strong className="text-yellow-400">{evaluation.kategoriAkhir}</strong> (Skor Total: {evaluation.totalSkor}) untuk mendukung peningkatan kebugaran fungsional dan kesehatan jangka panjang.
            </p>
          </div>

          <div className="mt-3 md:mt-0 z-10 flex-shrink-0">
            <div className="w-20 h-20 rounded-2xl bg-yellow-500/20 border border-yellow-400/40 flex items-center justify-center text-yellow-400">
              <Activity className="w-10 h-10 animate-pulse" />
            </div>
          </div>

        </div>

        {/* SECTION: REKOMENDASI AKTIVITAS BERDASARKAN HASIL TES */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <HeartPulse className="w-5 h-5 text-blue-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Rekomendasi Aktivitas Berdasarkan Hasil Tes Spesifik
            </h3>
          </div>

          {/* 1. Aktivitas Fisik */}
          <div className="p-4 bg-gradient-to-br from-blue-50/70 to-slate-50 rounded-2xl border border-blue-200 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-blue-700 text-white rounded-xl">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">1. Aktivitas Fisik Harian</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Evaluasi Kebiasaan Olahraga &amp; Gaya Hidup</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-300">
                Kategori: {aktivitas.kategoriAktivitas} (Skor: {aktivitas.skorAktivitas})
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-blue-100 font-medium">
              {rekomendasiAktivitasFisikText}
            </p>
          </div>

          {/* 2. Indeks Massa Tubuh (IMT) */}
          <div className="p-4 bg-gradient-to-br from-emerald-50/70 to-slate-50 rounded-2xl border border-emerald-200 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-emerald-700 text-white rounded-xl">
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">2. Indeks Massa Tubuh (IMT)</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Evaluasi Komposisi Tubuh &amp; Status Gizi</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                IMT: {imt.nilaiIMT} kg/m² ({imt.kategoriIMT})
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-emerald-100 font-medium">
              {rekomendasiIMTText}
            </p>
          </div>

          {/* 3. Push-Up 60 Detik (TKJI - Daya Tahan Otot Tubuh Bagian Atas) */}
          <div className="p-4 bg-gradient-to-br from-indigo-50/70 to-slate-50 rounded-2xl border border-indigo-200 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-indigo-700 text-white rounded-xl">
                  <Dumbbell className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">3. Push-Up 60 Detik (Daya Tahan Otot Tubuh Bagian Atas)</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Evaluasi Otot Dada, Bahu, Lengan &amp; Inti</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-100 text-indigo-900 border border-indigo-300">
                Hasil: {tkji.pushUpRepetisi} reps (Skor: {tkji.skorPushUp})
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-indigo-100 font-medium">
              {rekomendasiPushUpText}
            </p>
          </div>

          {/* 4. Vertical Jump (TKJI - Power Otot Tungkai) */}
          <div className="p-4 bg-gradient-to-br from-amber-50/70 to-slate-50 rounded-2xl border border-amber-200 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-amber-600 text-white rounded-xl">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">4. Vertical Jump (Power Otot Tungkai)</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Evaluasi Daya Ledak &amp; Eksplosivitas Otot Tungkai</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Lompatan: {tkji.verticalJumpCm} cm (Skor: {tkji.skorVerticalJump})
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-amber-100 font-medium">
              {rekomendasiVerticalJumpText}
            </p>
          </div>

          {/* 5. Lari 12 Menit / Cooper Test (TKJI - Kapasitas Kardiorespirasi VO2max) */}
          <div className="p-4 bg-gradient-to-br from-rose-50/70 to-slate-50 rounded-2xl border border-rose-200 space-y-2.5 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center space-x-2.5">
                <div className="p-2 bg-rose-700 text-white rounded-xl">
                  <Flame className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">5. Lari 12 Menit / Cooper Test (Kapasitas Kardiorespirasi)</h4>
                  <span className="text-[11px] text-slate-500 font-medium">Evaluasi VO₂max &amp; Ketahanan Jantung-Paru</span>
                </div>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-900 border border-rose-300">
                Jarak Tempuh: {tkji.cooperDistanceMeter} m (Skor: {tkji.skorCooper})
              </span>
            </div>
            <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-xl border border-rose-100 font-medium">
              {rekomendasiCooperRunText}
            </p>
          </div>

        </div>

        {/* SECTION: PROGRAM LATIHAN KOMPONEN KEBUGARAN */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center space-x-2 border-b border-slate-200 pb-2">
            <Dumbbell className="w-5 h-5 text-blue-800" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
              Panduan Program Latihan Spesifik Kebugaran
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Card 1: Daya Tahan */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-yellow-500 transition-colors space-y-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-xl">
                  <Activity className="w-4 h-4" />
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
                <div className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Dumbbell className="w-4 h-4" />
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
                <div className="p-2 bg-purple-100 text-purple-700 rounded-xl">
                  <Sparkles className="w-4 h-4" />
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
                <div className="p-2 bg-amber-100 text-amber-700 rounded-xl">
                  <Footprints className="w-4 h-4" />
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
        </div>

        {/* Collapsible Reference Table for Norma Rekomendasi */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
          <button
            type="button"
            onClick={() => setShowTableNorma(!showTableNorma)}
            className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-800"
          >
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-600" />
              <span>TABEL NORMA ACUAN REKOMENDASI LENGKAP (AKTIVITAS, IMT &amp; TES TKJI)</span>
            </div>
            <div className="flex items-center space-x-1 text-blue-700">
              <span className="text-[11px] font-semibold">{showTableNorma ? 'Sembunyikan' : 'Lihat Selengkapnya'}</span>
              {showTableNorma ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>

          {showTableNorma && (
            <div className="space-y-6 pt-2 border-t border-slate-200 text-xs text-slate-700">
              {/* Table 1: Aktivitas Fisik */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs text-blue-900 uppercase">1. Rekomendasi Berdasarkan Aktivitas Fisik</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-[#0b1a30] text-white font-bold">
                        <th className="p-2 border border-slate-700 w-1/4">Kategori</th>
                        <th className="p-2 border border-slate-700">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-blue-900">Sangat Tinggi</td>
                        <td className="p-2 border border-slate-200">Pertahankan pola aktivitas fisik saat ini, sertakan latihan pemulihan (recovery), peregangan, dan istirahat yang cukup untuk mencegah overtraining.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-blue-800">Tinggi</td>
                        <td className="p-2 border border-slate-200">Pertahankan frekuensi latihan dan variasikan jenis aktivitas fisik agar seluruh komponen kebugaran tetap berkembang secara seimbang.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-amber-800">Sedang</td>
                        <td className="p-2 border border-slate-200">Tingkatkan durasi atau frekuensi latihan hingga memenuhi rekomendasi WHO, yaitu minimal 150–300 menit aktivitas fisik intensitas sedang setiap minggu.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-orange-800">Rendah</td>
                        <td className="p-2 border border-slate-200">Tingkatkan aktivitas fisik secara bertahap melalui jalan cepat, jogging ringan, bersepeda, atau senam sebanyak 3–5 kali per minggu dengan durasi 30–60 menit per sesi.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-rose-800">Sangat Rendah</td>
                        <td className="p-2 border border-slate-200">Mulailah aktivitas fisik ringan seperti berjalan kaki 15–20 menit setiap hari, kemudian tingkatkan durasi dan intensitas secara bertahap sesuai kemampuan fisik.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 2: IMT */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs text-emerald-900 uppercase">2. Rekomendasi Berdasarkan Indeks Massa Tubuh (IMT)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-[#0b1a30] text-white font-bold">
                        <th className="p-2 border border-slate-700 w-1/4">Kategori</th>
                        <th className="p-2 border border-slate-700">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-amber-800">Underweight (Kekurangan Berat Badan)</td>
                        <td className="p-2 border border-slate-200">Tingkatkan asupan energi dan protein berkualitas (1,2–1,6 g/kgBB/hari), lakukan latihan kekuatan (resistance training) 2–3 kali/minggu dengan intensitas 60–70% HRmax atau 60–70% 1RM, 2–3 set × 8–12 repetisi untuk setiap kelompok otot utama (misalnya squat, push-up, row, shoulder press). Tambahkan aktivitas aerobik intensitas sedang selama 150 menit/minggu (misalnya jalan cepat atau bersepeda ringan 30 menit, 5 hari/minggu) dan konsultasikan dengan ahli gizi apabila diperlukan.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-emerald-800">Normal</td>
                        <td className="p-2 border border-slate-200">Pertahankan pola makan seimbang dan gaya hidup aktif. Lakukan aktivitas aerobik intensitas sedang 150–300 menit/minggu atau 75–150 menit/minggu intensitas tinggi, dikombinasikan dengan latihan kekuatan minimal 2 kali/minggu pada seluruh kelompok otot utama (2–4 set × 8–12 repetisi, intensitas 60–80% 1RM). Tambahkan latihan fleksibilitas dan keseimbangan 2–3 kali/minggu untuk mempertahankan kebugaran secara menyeluruh.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-amber-800">Overweight (Kelebihan Berat Badan Tingkat Ringan)</td>
                        <td className="p-2 border border-slate-200">Tingkatkan aktivitas aerobik menjadi 250–300 menit/minggu dengan intensitas 60–75% HRmax(misalnya jalan cepat, jogging, bersepeda atau berenang selama 45–60 menit, 5 hari/minggu). Lakukan latihan kekuatan 3 kali/minggu (2–3 set × 10–15 repetisi, intensitas 60–70% 1RM) untuk mempertahankan massa otot. Kurangi asupan kalori serta konsumsi makanan tinggi gula, garam, dan lemak jenuh.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-orange-800">Obesity Class I (Obesitas Ringan)</td>
                        <td className="p-2 border border-slate-200">Mulailah dengan aktivitas aerobik berdampak rendah (low impact) seperti jalan cepat, sepeda statis, atau berenang dengan intensitas 50–65% HRmax, target 300 menit/minggu secara bertahap. Tambahkan latihan kekuatan 2–3 kali/minggu menggunakan beban ringan (2–3 set × 10–12 repetisi) seperti chair squat, wall push-up, dan resistance band. Lakukan pemanasan dan pendinginan masing-masing 5–10 menit serta evaluasi perkembangan setiap 4–6 minggu.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-rose-800">Obesity Class II (Obesitas Sedang)</td>
                        <td className="p-2 border border-slate-200">Fokus pada peningkatan aktivitas fisik secara bertahap melalui jalan kaki, sepeda statis, senam air, atau berenang dengan intensitas 40–60% HRmax, durasi 30–45 menit, 5–6 kali/minggu. Lakukan latihan kekuatan ringan 2 kali/minggu (2 set × 8–12 repetisi) menggunakan berat badan atau resistance band untuk meningkatkan kemampuan fungsional. Tingkatkan durasi latihan sekitar 5–10 menit setiap minggusesuai toleransi tubuh. Disarankan berkonsultasi dengan tenaga kesehatan sebelum memulai program latihan.</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-red-900">Obesity Class III (Obesitas Berat)</td>
                        <td className="p-2 border border-slate-200">Mulailah dengan aktivitas fisik ringan seperti jalan santai, latihan menggunakan kursi (chair exercise), latihan pernapasan, dan peregangan dengan intensitas 40–50% HRmax, durasi 20–30 menit, 5–7 kali/minggu. Tambahkan latihan kekuatan ringan (2 set × 8–10 repetisi) seperti chair stand, wall push-up, dan resistance band sesuai kemampuan. Program latihan dilakukan secara progresif dengan pengawasan tenaga kesehatan, terutama apabila terdapat penyakit penyerta (komorbiditas) seperti diabetes, hipertensi, atau penyakit jantung.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 3: Push-Up 60 Detik */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs text-indigo-900 uppercase">3. Rekomendasi Push-Up 60 Detik (Daya Tahan Otot)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-[#0b1a30] text-white font-bold">
                        <th className="p-2 border border-slate-700 w-1/4">Kategori</th>
                        <th className="p-2 border border-slate-700">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-blue-900">Sangat Baik</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiPushUp('Sangat Baik')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-emerald-800">Baik</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiPushUp('Baik')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-amber-800">Cukup</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiPushUp('Cukup')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-orange-800">Kurang</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiPushUp('Kurang')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-rose-800">Sangat Kurang</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiPushUp('Sangat Kurang')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 4: Vertical Jump */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs text-amber-900 uppercase">4. Rekomendasi Vertical Jump (Power Tungkai)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-[#0b1a30] text-white font-bold">
                        <th className="p-2 border border-slate-700 w-1/4">Kategori</th>
                        <th className="p-2 border border-slate-700">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-blue-900">Sangat Baik</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiVerticalJump('Sangat Baik')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-emerald-800">Baik</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiVerticalJump('Baik')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-amber-800">Cukup</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiVerticalJump('Cukup')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-orange-800">Kurang</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiVerticalJump('Kurang')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-rose-800">Sangat Kurang</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiVerticalJump('Sangat Kurang')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Table 5: Lari 12 Menit */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 text-xs text-rose-900 uppercase">5. Rekomendasi Lari 12 Menit (Cooper Test - Kapasitas Kardiorespirasi)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-[11px] border-collapse border border-slate-300">
                    <thead>
                      <tr className="bg-[#0b1a30] text-white font-bold">
                        <th className="p-2 border border-slate-700 w-1/4">Kategori</th>
                        <th className="p-2 border border-slate-700">Rekomendasi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-blue-900">Sangat Baik</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiCooperRun('Sangat Baik')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-emerald-800">Baik</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiCooperRun('Baik')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-amber-800">Cukup</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiCooperRun('Cukup')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-orange-800">Kurang</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiCooperRun('Kurang')}</td>
                      </tr>
                      <tr>
                        <td className="p-2 font-bold border border-slate-200 text-rose-800">Sangat Kurang</td>
                        <td className="p-2 border border-slate-200">{getRekomendasiCooperRun('Sangat Kurang')}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
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
