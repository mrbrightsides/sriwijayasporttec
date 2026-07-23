import React, { useState } from 'react';
import { AssessmentRecord, Peserta } from '../../types';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Dumbbell,
  Heart,
  HeartPulse,
  MessageSquare,
  Printer,
  Scale,
  Send,
  Sparkles,
  Target,
  TrendingUp,
  Trophy,
  User,
  Users,
  Zap,
} from 'lucide-react';
import { UnsriLogo } from '../UnsriLogo';

interface Screen11PersonalProgressProps {
  record: AssessmentRecord;
  records: AssessmentRecord[];
  onPrev: () => void;
  onNext: () => void;
  onSelectPesertaForTest?: (peserta: Peserta) => void;
}

export const Screen11PersonalProgress: React.FC<Screen11PersonalProgressProps> = ({
  record,
  records,
  onPrev,
  onNext,
}) => {
  // Filter all saved records for THIS specific participant
  const personalSavedRecords = records.filter(
    (r) =>
      r.peserta.id === record.peserta.id ||
      (record.peserta.nama && r.peserta.nama.toLowerCase() === record.peserta.nama.toLowerCase())
  );

  // If current record has zeroes (e.g. user jumped straight to Step 11 without filling inputs),
  // fallback to latest saved record for this participant if available!
  const latestSaved = personalSavedRecords[0];

  const activeRecord: AssessmentRecord =
    record.evaluation.totalSkor > 20
      ? record
      : latestSaved || record;

  const { peserta, evaluation, imt, tkji, functional, aktivitas, tanggal } = activeRecord;

  // Ensure all historical records including activeRecord are combined and sorted
  const allPersonalRecordsMap = new Map<string, AssessmentRecord>();
  personalSavedRecords.forEach((r) => allPersonalRecordsMap.set(r.id, r));
  allPersonalRecordsMap.set(activeRecord.id, activeRecord);

  const sortedPersonalRecords = Array.from(allPersonalRecordsMap.values()).sort((a, b) => {
    // Basic date parsing helper
    return new Date(a.tanggal || 0).getTime() - new Date(b.tanggal || 0).getTime();
  });

  // Prepare Longitudinal Trend Chart Data
  let longitudinalData: any[] = [];

  if (sortedPersonalRecords.length > 1) {
    // Real historical sessions
    longitudinalData = sortedPersonalRecords.map((r, idx) => ({
      sessionLabel: `Tes #${idx + 1}`,
      dateLabel: r.tanggal,
      totalSkor: r.evaluation.totalSkor,
      skorTKJI: r.tkji.totalSkorTKJI,
      skorFunctional: r.functional.totalSkorFunctional,
      skorIMT: r.imt.skorIMT,
      skorAktivitas: r.aktivitas.skorAktivitas,
      kategori: r.evaluation.kategoriAkhir,
      isProjection: false,
    }));
  } else {
    // Single session: Show Baseline + 90 Days Target Projection
    const baselineScore = evaluation.totalSkor || 65;
    const targetScore = Math.min(100, Math.round(baselineScore * 1.25));

    longitudinalData = [
      {
        sessionLabel: 'Tes Awal (Baseline)',
        dateLabel: tanggal || 'Sesi Ini',
        totalSkor: baselineScore,
        skorTKJI: tkji.totalSkorTKJI || Math.round(baselineScore * 0.95),
        skorFunctional: functional.totalSkorFunctional || Math.round(baselineScore * 0.9),
        skorIMT: imt.skorIMT || 75,
        skorAktivitas: aktivitas.skorAktivitas || 60,
        kategori: evaluation.kategoriAkhir,
        isProjection: false,
      },
      {
        sessionLabel: 'Target 90 Hari',
        dateLabel: 'Proyeksi Latihan FITT',
        totalSkor: targetScore,
        skorTKJI: Math.min(100, Math.round((tkji.totalSkorTKJI || 65) * 1.2)),
        skorFunctional: Math.min(100, Math.round((functional.totalSkorFunctional || 65) * 1.25)),
        skorIMT: Math.min(100, Math.round((imt.skorIMT || 75) * 1.1)),
        skorAktivitas: Math.min(100, Math.round((aktivitas.skorAktivitas || 60) * 1.3)),
        kategori: targetScore >= 80 ? 'Baik' : 'Cukup',
        isProjection: true,
      },
    ];
  }

  // Radar Chart 5 Dimensions Data
  const radarData = [
    {
      subject: 'Aktivitas Fisik',
      skor: aktivitas.skorAktivitas || 20,
      benchmark: 70,
      fullMark: 100,
    },
    {
      subject: 'Komposisi IMT',
      skor: imt.skorIMT || 70,
      benchmark: 75,
      fullMark: 100,
    },
    {
      subject: 'Tes Kebugaran',
      skor: tkji.totalSkorTKJI || 50,
      benchmark: 72,
      fullMark: 100,
    },
    {
      subject: 'Functional Fitness',
      skor: functional.totalSkorFunctional || 50,
      benchmark: 78,
      fullMark: 100,
    },
    {
      subject: 'Pemulihan HR',
      skor: functional.skorDeltaHR || 70,
      benchmark: 70,
      fullMark: 100,
    },
  ];

  // Identify highest & lowest scoring components
  const componentScores = [
    { name: 'Aktivitas Fisik', score: aktivitas.skorAktivitas || 0 },
    { name: 'Komposisi Tubuh (IMT)', score: imt.skorIMT || 0 },
    { name: 'Tes Kebugaran', score: tkji.totalSkorTKJI || 0 },
    { name: 'Functional Fitness', score: functional.totalSkorFunctional || 0 },
    { name: 'Pemulihan Denyut Jantung', score: functional.skorDeltaHR || 70 },
  ];

  const sortedComponents = [...componentScores].sort((a, b) => b.score - a.score);
  const highestComponent = sortedComponents[0];
  const lowestComponent = sortedComponents[sortedComponents.length - 1];

  // WhatsApp Message Generator for Personal Report
  const handleSendWA = () => {
    const waPhone = peserta.noHp ? peserta.noHp.replace(/[^00987654321]/g, '') : '';
    const text = `Halo Sdr/i *${peserta.nama}*, berikut adalah Rapor Hasil Evaluasi Kebugaran Jasmani Anda dari Sriwijaya Sport Tec:
----------------------------------------
📊 *TOTAL SKOR KEBUGARAN*: *${evaluation.totalSkor} / 100* (${evaluation.kategoriAkhir.toUpperCase()})
• IMT: ${imt.nilaiIMT || '-'} kg/m² (${imt.kategoriIMT || '-'})
• Tes Kebugaran: ${tkji.totalSkorTKJI} Poin (${tkji.kategoriTKJI})
• Functional Fitness: ${functional.totalSkorFunctional} Poin (${functional.kategoriFunctional})
• Level Aktivitas: ${aktivitas.kategoriAktivitas}

💪 *Komponen Terunggul*: ${highestComponent.name} (${highestComponent.score} Poin)
🎯 *Fokus Peningkatan*: ${lowestComponent.name} (${lowestComponent.score} Poin)

📅 *Jadwal Tes Ulang Berkala*: 90 hari mendatang.
Tetap semangat menjaga kesehatan & kebugaran jasmani bersama Sriwijaya Sport Tec! 🚀`;

    const url = waPhone
      ? `https://wa.me/${waPhone}?text=${encodeURIComponent(text)}`
      : `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. HEADER BANNER - PERSONAL PROGRESS */}
      <div className="bg-gradient-to-r from-[#0b1a30] via-[#0f284a] to-[#12315b] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <UnsriLogo size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest bg-yellow-500/20 px-2 py-0.5 rounded border border-yellow-400/30">
                TAHAP 11 DARI 12
              </span>
              <span className="text-[10px] text-slate-300 font-medium">
                RAPOR PROGRESS PERSONAL PESERTA
              </span>
            </div>
            <h2 className="text-xl font-black text-white tracking-tight mt-1 flex items-center space-x-2">
              <span>Progress &amp; Rapor Personal: {peserta.nama || 'Peserta'}</span>
            </h2>
            <p className="text-xs text-slate-300">
              Pelacakan perkembangan kebugaran jasmani, performa fungsional, &amp; tren penilaian berkala.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={handleSendWA}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Kirim WA Rapor</span>
          </button>
        </div>
      </div>

      {/* 2. PROFILE CARD & SUMMARY BADGE */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-md flex flex-col md:flex-row items-stretch gap-6">
        {/* Peserta Info */}
        <div className="flex items-center space-x-4 flex-1">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-md flex-shrink-0">
            {peserta.nama ? peserta.nama.charAt(0).toUpperCase() : 'P'}
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 flex-wrap">
              <h3 className="text-lg font-bold text-slate-900">{peserta.nama || 'Nama Peserta'}</h3>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold border border-slate-300">
                {peserta.jenisKelamin} • {peserta.umur} Tahun
              </span>
            </div>
            <div className="text-xs text-slate-600 flex items-center space-x-3 flex-wrap gap-y-1">
              <span><strong>Komunitas:</strong> {peserta.komunitas || 'Umum'}</span>
              <span>•</span>
              <span><strong>No. HP:</strong> {peserta.noHp || '-'}</span>
              <span>•</span>
              <span><strong>Tanggal Tes:</strong> {tanggal}</span>
            </div>
          </div>
        </div>

        {/* Overall Fitness Category Badge */}
        <div className="bg-gradient-to-br from-slate-900 to-[#0b1a30] text-white p-4 rounded-xl border border-slate-800 flex items-center justify-between md:w-80 shadow-inner">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider block">
              PREDIKAT KEBUGARAN TOTAL
            </span>
            <div className="text-2xl font-black text-white tracking-tight">
              {evaluation.kategoriAkhir}
            </div>
            <p className="text-[11px] text-slate-300">
              Berdasarkan norma gabungan WHO, TKJI &amp; FFT
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black text-yellow-400">{evaluation.totalSkor}</div>
            <div className="text-[10px] text-slate-400 font-bold uppercase">/ 100 POIN</div>
          </div>
        </div>
      </div>

      {/* 3. 5-COMPONENT SCORE BREAKDOWN CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5">
        
        {/* Aktivitas Fisik */}
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 p-3.5 rounded-xl border border-blue-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-blue-900">Aktivitas Fisik</span>
            <Activity className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{aktivitas.skorAktivitas}</div>
          <div className="text-[11px] font-semibold text-blue-800">{aktivitas.kategoriAktivitas}</div>
        </div>

        {/* IMT */}
        <div className="bg-gradient-to-br from-indigo-50 to-slate-50 p-3.5 rounded-xl border border-indigo-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-indigo-900">Komposisi IMT</span>
            <Scale className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{imt.skorIMT || 75}</div>
          <div className="text-[11px] font-semibold text-indigo-800">
            {imt.nilaiIMT > 0 ? `${imt.nilaiIMT} kg/m²` : '22.1 kg/m²'} ({imt.kategoriIMT || 'Normal'})
          </div>
        </div>

        {/* Tes Kebugaran */}
        <div className="bg-gradient-to-br from-purple-50 to-slate-50 p-3.5 rounded-xl border border-purple-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-purple-900">Skor Tes Kebugaran</span>
            <Dumbbell className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{tkji.totalSkorTKJI}</div>
          <div className="text-[11px] font-semibold text-purple-800">{tkji.kategoriTKJI}</div>
        </div>

        {/* Functional Fitness */}
        <div className="bg-gradient-to-br from-emerald-50 to-slate-50 p-3.5 rounded-xl border border-emerald-200 shadow-sm space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-900">Functional Fitness</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{functional.totalSkorFunctional}</div>
          <div className="text-[11px] font-semibold text-emerald-800">{functional.kategoriFunctional}</div>
        </div>

        {/* Pemulihan HR */}
        <div className="bg-gradient-to-br from-amber-50 to-slate-50 p-3.5 rounded-xl border border-amber-200 shadow-sm space-y-1 col-span-2 md:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-900">Pemulihan HR</span>
            <Zap className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-slate-900">{functional.skorDeltaHR || 70}</div>
          <div className="text-[11px] font-semibold text-amber-800">Delta HR: {functional.deltaHR || 30} bpm</div>
        </div>

      </div>

      {/* 4. CHARTS SECTION (RADAR & LONGITUDINAL TREND) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART A: RADAR SPIDER CHART 5 DIMENSI */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Radar Profil Kebugaran 5 Dimensi</span>
              </h4>
              <p className="text-xs text-slate-500">
                Perbandingan skor {peserta.nama || 'Peserta'} terhadap standar benchmark norma
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 text-blue-800 rounded-md border border-blue-200">
              Personal vs Norma
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y}
                      textAnchor="middle"
                      fill="#0f172a"
                      fontSize={11}
                      fontWeight={700}
                    >
                      {payload.value}
                    </text>
                  )}
                />
                <PolarRadiusAxis angle={90} domain={[0, 100]} stroke="#94a3b8" tick={{ fontSize: 9 }} />
                <Radar
                  name="Benchmark Standar (75)"
                  dataKey="benchmark"
                  stroke="#f59e0b"
                  fill="#fde047"
                  fillOpacity={0.15}
                  strokeWidth={2}
                  strokeDasharray="4 4"
                />
                <Radar
                  name={`Hasil ${peserta.nama || 'Peserta'}`}
                  dataKey="skor"
                  stroke="#2563eb"
                  fill="#3b82f6"
                  fillOpacity={0.45}
                  strokeWidth={3}
                  dot={{ r: 4, fill: '#1d4ed8', stroke: '#fff', strokeWidth: 2 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0b1a30] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1">
                          <div className="font-bold text-yellow-400 border-b border-slate-700 pb-1 mb-1">
                            {data.subject}
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-slate-300">Skor Peserta:</span>
                            <span className="font-bold text-blue-400">{data.skor} Poin</span>
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-slate-300">Benchmark Norma:</span>
                            <span className="font-bold text-yellow-400">{data.benchmark} Poin</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART B: GRAFIK TREN LONGITUDINAL PERSONAL */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Grafik Tren Kebugaran Berkala (Longitudinal)</span>
              </h4>
              <p className="text-xs text-slate-500">
                {sortedPersonalRecords.length > 1
                  ? `Rekam jejak ${sortedPersonalRecords.length} sesi pengujian kebugaran berkala`
                  : `Lintasan tren dari Tes Awal ke Proyeksi Target 90 Hari`}
              </p>
            </div>
            <span className="text-[10px] font-bold px-2 py-1 bg-emerald-50 text-emerald-800 rounded-md border border-emerald-200">
              {sortedPersonalRecords.length > 1
                ? `${sortedPersonalRecords.length} Sesi Terdata`
                : 'Target & Proyeksi 90 Hari'}
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={longitudinalData} margin={{ top: 15, right: 20, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="sessionLabel"
                  tick={({ x, y, payload }) => {
                    const item = longitudinalData[payload.index];
                    return (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={12} textAnchor="middle" fill="#0f172a" fontSize={11} fontWeight={700}>
                          {payload.value}
                        </text>
                        {item?.dateLabel && (
                          <text x={0} y={24} textAnchor="middle" fill="#64748b" fontSize={9}>
                            {item.dateLabel}
                          </text>
                        )}
                      </g>
                    );
                  }}
                  height={35}
                />
                <YAxis domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0b1a30] text-white p-3 rounded-xl shadow-xl border border-slate-700 text-xs space-y-1.5">
                          <div className="font-bold text-yellow-400 border-b border-slate-700 pb-1 flex justify-between items-center space-x-3">
                            <span>{label}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {data.dateLabel}
                            </span>
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-emerald-400 font-medium">Total Skor:</span>
                            <span className="font-extrabold text-emerald-400">{data.totalSkor} Poin</span>
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-purple-300">Skor Tes Kebugaran:</span>
                            <span className="font-bold text-purple-300">{data.skorTKJI} Poin</span>
                          </div>
                          <div className="flex justify-between space-x-4">
                            <span className="text-blue-300">Skor Functional:</span>
                            <span className="font-bold text-blue-300">{data.skorFunctional} Poin</span>
                          </div>
                          {data.isProjection && (
                            <div className="text-[10px] text-amber-300 pt-1 border-t border-slate-700">
                              🚀 Target pencapaian pasca intervensi program FITT 90 Hari
                            </div>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="totalSkor"
                  name="Total Skor Kebugaran"
                  stroke="#16a34a"
                  strokeWidth={3.5}
                  dot={{ r: 6, fill: '#16a34a', strokeWidth: 2, stroke: '#fff' }}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="skorTKJI"
                  name="Skor Tes Kebugaran"
                  stroke="#9333ea"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 4, fill: '#9333ea' }}
                />
                <Line
                  type="monotone"
                  dataKey="skorFunctional"
                  name="Skor Functional Fitness"
                  stroke="#2563eb"
                  strokeWidth={2}
                  strokeDasharray="2 2"
                  dot={{ r: 4, fill: '#2563eb' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. ANALYSIS & PERSONALIZED RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* HIGHEST COMPONENT */}
        <div className="bg-gradient-to-br from-emerald-50/80 to-slate-50 p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-emerald-900 font-bold text-xs">
            <Trophy className="w-4 h-4 text-emerald-600" />
            <span>KOMPONEN TERUNGGUL PESERTA</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-emerald-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{highestComponent.name}</span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                {highestComponent.score} / 100 Poin
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Performa {peserta.nama || 'peserta'} berada dalam kondisi sangat memuaskan pada aspek ini. Disarankan mempertahankan frekuensi latihan rutin minimal 2–3 kali seminggu.
            </p>
          </div>
        </div>

        {/* LOWEST COMPONENT */}
        <div className="bg-gradient-to-br from-amber-50/80 to-slate-50 p-4 rounded-2xl border border-amber-200 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs">
            <Target className="w-4 h-4 text-amber-600" />
            <span>FOKUS OPTIMALISASI &amp; PERBAIKAN</span>
          </div>
          <div className="bg-white p-3 rounded-xl border border-amber-100 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">{lowestComponent.name}</span>
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {lowestComponent.score} / 100 Poin
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Aspek ini membutuhkan perhatian tambahan dalam program preskripsi latihan harian. Terapkan rekomendasi latihan FITT pada Langkah 9 untuk meningkatkan kapasitas fisik secara bertahap.
            </p>
          </div>
        </div>

      </div>

      {/* 6. PERSONAL RETEST COUNTDOWN BANNER */}
      <div className="bg-[#0b1a30] text-white p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400 font-bold flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
              SIKLUS EVALUASI 90 HARI
            </div>
            <h4 className="text-sm font-bold text-white">
              Jadwal Tes Ulang Berkala {peserta.nama || 'Peserta'}
            </h4>
            <p className="text-xs text-slate-300">
              Disarankan melakukan tes ulang pada 90 hari mendatang untuk mengukur peningkatan kebugaran jasmani pasca intervensi program latihan.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-stretch md:self-auto">
          <button
            onClick={onPrev}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl border border-slate-700 transition-all"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Lihat Cetak PDF</span>
          </button>
          <button
            onClick={onNext}
            className="flex-1 md:flex-none inline-flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 text-xs font-extrabold rounded-xl shadow-lg transition-all"
          >
            <span>Selesai Sesi</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
        </div>
      </div>

    </div>
  );
};
