import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Heart,
  Activity,
  Zap,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Share2,
  Bookmark,
  Lightbulb,
  Droplets,
  Dumbbell,
  ShieldCheck,
  Award
} from 'lucide-react';

interface FitnessTip {
  id: number;
  hari: string;
  kategori: 'Daya Tahan' | 'Kekuatan' | 'Fleksibilitas' | 'Hidrasi & Nutrisi' | 'Pemulihan';
  judul: string;
  ringkasan: string;
  detail: string;
  targetAktivitas: string;
  manfaat: string;
  icon: 'zap' | 'dumbbell' | 'heart' | 'droplets' | 'shield';
}

const TIPS_DATABASE: FitnessTip[] = [
  {
    id: 1,
    hari: 'Senin - Daya Tahan Aerobik',
    kategori: 'Daya Tahan',
    judul: 'Latihan Jalan Cepat 30 Menit Konsisten',
    ringkasan: 'Tingkatkan kapasitas VO2 Max dan efisiensi pompa jantung secara bertahap.',
    detail: 'Lakukan jalan cepat atau jogging santai selama 30 menit dengan denyut nadi target 60-70% dari HR Max. Jaga ritme napas teratur (2 langkah tarik, 2 langkah hembus).',
    targetAktivitas: '30 menit | Pagi atau Sore Hari',
    manfaat: 'Menurunkan tekanan darah sistolik dan melatih efisiensi sistem kardiovaskular.',
    icon: 'zap',
  },
  {
    id: 2,
    hari: 'Selasa - Kekuatan Otot Inti',
    kategori: 'Kekuatan',
    judul: 'Aktivasi Otot Inti dengan Isometric Plank',
    ringkasan: 'Perkuat otot perut, punggung bawah, dan panggul untuk stabilitas postur tubuh.',
    detail: 'Lakukan 3 set isometric plank masing-masing 30-45 detik. Pastikan posisi punggung lurus mendatar dan hindari pinggul merosot ke bawah.',
    targetAktivitas: '3 Set x 45 Detik | Istirahat 30d/set',
    manfaat: 'Mencegah nyeri punggung bawah (LBP) dan meningkatkan daya tahan otot inti.',
    icon: 'dumbbell',
  },
  {
    id: 3,
    hari: 'Rabu - Pemulihan Aktif',
    kategori: 'Fleksibilitas',
    judul: 'Peregangan Dinamis & Keseimbangan Sendi',
    ringkasan: 'Jaga kelenturan otot sendi lutut, panggul, dan pergelangan kaki.',
    detail: 'Lakukan peregangan hamstring, quad, dan calf stretch masing-masing 20 detik. Tambahkan latihan berdiri satu kaki (single leg stance) untuk melatih proprioception.',
    targetAktivitas: '15 Menit | Sebelum / Sesudah Beraktivitas',
    manfaat: 'Mengurangi kekakuan sendi dan meminimalkan risiko cedera olahraga.',
    icon: 'heart',
  },
  {
    id: 4,
    hari: 'Kamis - Hidrasi & Nutrisi',
    kategori: 'Hidrasi & Nutrisi',
    judul: 'Manajemen CairanTubuh & Elektrolit Kebugaran',
    ringkasan: 'Cukupi asupan air putih minimum 2.5 - 3 Liter per hari untuk performa optimal.',
    detail: 'Minum 250ml air hangat setelah bangun tidur dan hindari minuman tinggi gula sebelum berolahraga. Konsumsi buah tinggi kalium seperti pisang pasca latihan.',
    targetAktivitas: '8 - 10 Gelas Air / Hari',
    manfaat: 'Mencegah kram otot, menjaga volume plasma darah, dan mempercepat pemulihan.',
    icon: 'droplets',
  },
  {
    id: 5,
    hari: 'Jumat - Kekuatan Tubuh Bagian Bawah',
    kategori: 'Kekuatan',
    judul: 'Sit-to-Stand & Wall Sit untuk Otot Tungkai',
    ringkasan: 'Perkuat otot kuadrisep, gluteus, dan betis tanpa alat berat.',
    detail: 'Lakukan 15 kali repetisi Sit-to-Stand dari kursi standar sebanyak 3 set. Kombinasikan dengan Wall Sit selama 30 detik untuk meningkatkan ketahanan otot kaki.',
    targetAktivitas: '3 Set x 15 Repetisi Sit-to-Stand',
    manfaat: 'Meningkatkan kekuatan ekstensor lutut dan stabilitas saat menaiki tangga.',
    icon: 'dumbbell',
  },
  {
    id: 6,
    hari: 'Sabtu - Kardio Fleksibel Komunitas',
    kategori: 'Daya Tahan',
    judul: 'Aktivitas Aerobik Bersama Komunitas (Gowes / Senam)',
    ringkasan: 'Olahraga kelompok menyenangkan untuk kesehatan mental dan kebugaran fisik.',
    detail: 'Ikuti sesi gowes santai, senam jantung sehat, atau renang selama 45-60 menit bersama rekan komunitas Sriwijaya Sport Tec dengan intesitas sedang.',
    targetAktivitas: '45-60 Menit | Intensitas Sedang',
    manfaat: 'Menurunkan hormon stres (kortisol) dan meningkatkan ikatan sosial kebugaran.',
    icon: 'zap',
  },
  {
    id: 7,
    hari: 'Minggu - Pemulihan Total & Evaluasi',
    kategori: 'Pemulihan',
    judul: 'Tidur Berkualitas & Evaluasi Mingguan',
    ringkasan: 'Restorasi energi seluler dan regenerasi jaringan otot secara penuh.',
    detail: 'Pastikan tidur malam 7-8 jam berkualitas. Lakukan evaluasi mandiri mengenai tingkat kelelahan, kualitas denyut nadi istirahat pagi hari, dan tingkat hidrasi.',
    targetAktivitas: '7-8 Jam Tidur Malam Tanpa Gangguan',
    manfaat: 'Sintesis protein otot maksimal dan kesiapan fisik menghadapi minggu baru.',
    icon: 'shield',
  },
];

export const DailyFitnessTipsPanel: React.FC = () => {
  const [currentTipIndex, setCurrentTipIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [isCopied, setIsCopied] = useState(false);
  const [savedTips, setSavedTips] = useState<number[]>([1, 4]);

  const filteredTips = selectedCategory === 'Semua'
    ? TIPS_DATABASE
    : TIPS_DATABASE.filter((t) => t.kategori === selectedCategory);

  const activeTip = filteredTips[currentTipIndex % filteredTips.length] || TIPS_DATABASE[0];

  const handleNextTip = () => {
    setCurrentTipIndex((prev) => (prev + 1) % filteredTips.length);
  };

  const handlePrevTip = () => {
    setCurrentTipIndex((prev) => (prev - 1 + filteredTips.length) % filteredTips.length);
  };

  const handleCopyTip = () => {
    const text = `*Tips Kebugaran Harian - Sriwijaya Sport Tec UNSRI*\n\n📌 *${activeTip.judul}*\n(${activeTip.hari})\n\n💡 *Rekomendasi:* ${activeTip.detail}\n\n🎯 *Target:* ${activeTip.targetAktivitas}\n✨ *Manfaat:* ${activeTip.manfaat}\n\nMari jaga kebugaran jasmani secara berkala bersama Universitas Sriwijaya!`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const toggleBookmark = (id: number) => {
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter((item) => item !== id));
    } else {
      setSavedTips([...savedTips, id]);
    }
  };

  const categories = ['Semua', 'Daya Tahan', 'Kekuatan', 'Fleksibilitas', 'Hidrasi & Nutrisi', 'Pemulihan'];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4">
      
      {/* Panel Top Header */}
      <div className="bg-gradient-to-r from-[#0b1a30] via-slate-900 to-blue-900 p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-yellow-500/20 border border-yellow-400/40 rounded-2xl text-yellow-400 flex-shrink-0 animate-pulse">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2.5 py-0.5 rounded-full flex items-center space-x-1">
                <Lightbulb className="w-3 h-3" />
                <span>Edukasi &amp; Motivasi Harian</span>
              </span>
              <span className="text-xs text-slate-300">| Rekomendasi Resmi UNSRI</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Tips Kebugaran Harian &amp; Motivasi Diri
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Panduan praktis aktivitas fisik harian untuk menjaga tingkat kebugaran jasmani masyarakat secara berkelanjutan.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <span className="text-[11px] font-bold text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-xl border border-slate-700 flex items-center space-x-1.5">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Hari Ini: {activeTip.hari.split('-')[0]}</span>
          </span>
        </div>
      </div>

      {/* Category Selection Filter Bar */}
      <div className="px-5 pt-1 flex items-center space-x-2 overflow-x-auto scrollbar-none pb-1">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0 mr-1">
          Kategori:
        </span>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setCurrentTipIndex(0);
            }}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex-shrink-0 border ${
              selectedCategory === cat
                ? 'bg-[#0b1a30] text-yellow-400 border-[#0b1a30] shadow-sm'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Main Tip Showcase Card */}
      <div className="px-5 pb-5">
        <div className="bg-gradient-to-br from-amber-50/50 via-white to-blue-50/40 p-5 rounded-2xl border border-amber-200/80 shadow-sm relative space-y-4">
          
          {/* Top Info Bar inside Card */}
          <div className="flex items-center justify-between border-b border-amber-100 pb-3">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-500/20 text-amber-900 border border-yellow-400/50">
                {activeTip.kategori}
              </span>
              <span className="text-xs font-bold text-slate-500">
                {activeTip.hari}
              </span>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => toggleBookmark(activeTip.id)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  savedTips.includes(activeTip.id)
                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-white text-slate-400 border-slate-200 hover:text-slate-700'
                }`}
                title="Simpan Tip"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>

              <button
                type="button"
                onClick={handleCopyTip}
                className="px-2.5 py-1.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-bold text-[11px] rounded-lg transition-colors flex items-center space-x-1 shadow-2xs"
                title="Salin Teks Tip"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>{isCopied ? 'Tersalin!' : 'Bagikan'}</span>
              </button>
            </div>
          </div>

          {/* Title and Summary */}
          <div>
            <h4 className="text-base font-black text-slate-900 tracking-tight leading-snug">
              {activeTip.judul}
            </h4>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
              {activeTip.detail}
            </p>
          </div>

          {/* Target & Benefits Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start space-x-2.5">
              <div className="p-2 bg-blue-50 text-blue-800 rounded-lg flex-shrink-0">
                <Activity className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Target Dosis Latihan</span>
                <span className="text-xs font-bold text-slate-800">{activeTip.targetAktivitas}</span>
              </div>
            </div>

            <div className="bg-white p-3 rounded-xl border border-slate-200/80 shadow-2xs flex items-start space-x-2.5">
              <div className="p-2 bg-emerald-50 text-emerald-800 rounded-lg flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Manfaat Utama Fisiologis</span>
                <span className="text-xs font-semibold text-slate-700">{activeTip.manfaat}</span>
              </div>
            </div>
          </div>

          {/* Bottom Card Carousel Controls */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-slate-500">
              Rekomendasi <strong className="text-slate-800">{currentTipIndex + 1}</strong> dari {filteredTips.length} ({selectedCategory})
            </span>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={handlePrevTip}
                className="p-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition-all"
                title="Tip Sebelumnya"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleNextTip}
                className="px-3 py-1.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-lg shadow-sm transition-all flex items-center space-x-1"
              >
                <span>Tip Berikutnya</span>
                <ChevronRight className="w-3.5 h-3.5 text-yellow-400" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
