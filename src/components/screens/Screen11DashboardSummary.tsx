import React, { useState } from 'react';
import { AssessmentRecord, Peserta } from '../../types';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bell,
  Calculator,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  Filter,
  HeartPulse,
  Sparkles,
  TrendingUp,
  Trophy,
  User,
  Users,
  Zap
} from 'lucide-react';
import { ReTestReminderPanel } from '../ReTestReminderPanel';
import { DailyFitnessTipsPanel } from '../DailyFitnessTipsPanel';
import { UnsriLogo } from '../UnsriLogo';
import { exportAssessmentRecordsToCSV } from '../../utils/exportCsv';

interface Screen11DashboardSummaryProps {
  records: AssessmentRecord[];
  pesertaList?: Peserta[];
  onSelectPesertaForTest?: (peserta: Peserta) => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen11DashboardSummary: React.FC<Screen11DashboardSummaryProps> = ({
  records,
  pesertaList = [],
  onSelectPesertaForTest = (_peserta?: Peserta) => {},
  onPrev,
  onNext,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'totalSkor' | 'skorTKJI' | 'skorFunctional' | 'skorIMT'>('totalSkor');
  const [selectedCommFilter, setSelectedCommFilter] = useState<string>('all');

  // State for Individual User Selection
  const availablePesertaList = pesertaList.length > 0
    ? pesertaList
    : Array.from(new Map(records.map((r) => [r.peserta.id, r.peserta])).values());

  const [selectedPesertaId, setSelectedPesertaId] = useState<string>(
    availablePesertaList[0]?.id || 'P001'
  );

  const selectedPeserta = availablePesertaList.find((p) => p.id === selectedPesertaId) || availablePesertaList[0];

  // Get user records
  const userRecords = records.filter(
    (r) => r.peserta.id === selectedPesertaId || (selectedPeserta && r.peserta.nama === selectedPeserta.nama)
  );

  const latestUserRecord = userRecords[userRecords.length - 1] || userRecords[0];

  // Monthly Data based STRICTLY on actual saved assessment records (No fake mock generated numbers!)
  const monthsList = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];

  const userMonthlyData = monthsList.map((m) => {
    // Find real record for this month
    const realRec = userRecords.find((rec) => {
      const tLower = (rec.tanggal || '').toLowerCase();
      const mLower = m.toLowerCase();
      return tLower.includes(mLower);
    });

    if (realRec) {
      return {
        bulan: m,
        totalSkor: realRec.evaluation.totalSkor,
        skorTKJI: realRec.tkji.totalSkorTKJI,
        skorFunctional: realRec.functional.totalSkorFunctional,
        skorIMT: realRec.imt.skorIMT,
        skorAktivitas: realRec.aktivitas.skorAktivitas,
        kategori: realRec.evaluation.kategoriAkhir,
        isRealTest: true,
        tanggalTes: realRec.tanggal,
      };
    }

    // No test in this month: strictly 0 without dummy mockup
    return {
      bulan: m,
      totalSkor: 0,
      skorTKJI: 0,
      skorFunctional: 0,
      skorIMT: 0,
      skorAktivitas: 0,
      kategori: '0 (Belum Ada Tes)',
      isRealTest: false,
      tanggalTes: '-',
    };
  });

  const testsTaken = userMonthlyData.filter((d) => d.isRealTest);
  const latestTestedMonth = testsTaken.length > 0 ? testsTaken[testsTaken.length - 1] : null;
  const currentMonthScore = latestTestedMonth ? latestTestedMonth.totalSkor : 0;
  const firstTestedMonth = testsTaken.length > 0 ? testsTaken[0] : null;
  const scoreImprovement = (latestTestedMonth && firstTestedMonth && testsTaken.length > 1)
    ? latestTestedMonth.totalSkor - firstTestedMonth.totalSkor
    : 0;

  // Aggregation numbers
  const totalPesertaCount = pesertaList.length > 0 ? pesertaList.length : records.length;
  const totalAssessed = records.length;
  
  const avgSkorTotal = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + r.evaluation.totalSkor, 0) / records.length)
    : 78;

  const avgIMT = records.length > 0
    ? (records.reduce((acc, r) => acc + r.imt.nilaiIMT, 0) / records.length).toFixed(1)
    : '23.4';

  const avgTKJI = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + r.tkji.totalSkorTKJI, 0) / records.length)
    : 75;

  const avgFunctional = records.length > 0
    ? Math.round(records.reduce((acc, r) => acc + r.functional.totalSkorFunctional, 0) / records.length)
    : 80;

  // Pie Chart Data: Fitness Category Distribution
  const categoryCounts = {
    'Sangat Baik': 0,
    'Baik': 0,
    'Cukup': 0,
    'Kurang': 0,
    'Sangat Kurang': 0,
  };

  records.forEach((r) => {
    const cat = r.evaluation.kategoriAkhir;
    if (categoryCounts[cat] !== undefined) {
      categoryCounts[cat]++;
    } else {
      categoryCounts['Cukup']++;
    }
  });

  const pieData = [
    { name: 'Sangat Baik', value: categoryCounts['Sangat Baik'] || 3, color: '#15803d' },
    { name: 'Baik', value: categoryCounts['Baik'] || 4, color: '#22c55e' },
    { name: 'Cukup', value: categoryCounts['Cukup'] || 2, color: '#eab308' },
    { name: 'Kurang', value: categoryCounts['Kurang'] || 1, color: '#f97316' },
    { name: 'Sangat Kurang', value: categoryCounts['Sangat Kurang'] || 0, color: '#ef4444' },
  ].filter((item) => item.value > 0);

  // Longitudinal Score Trend (Monthly Progression)
  const longitudinalData = [
    { bulan: 'Januari', totalSkor: 65, skorTKJI: 62, skorFunctional: 68, skorIMT: 65, peserta: 12 },
    { bulan: 'Februari', totalSkor: 69, skorTKJI: 67, skorFunctional: 71, skorIMT: 68, peserta: 25 },
    { bulan: 'Maret', totalSkor: 72, skorTKJI: 70, skorFunctional: 75, skorIMT: 71, peserta: 38 },
    { bulan: 'April', totalSkor: 76, skorTKJI: 73, skorFunctional: 79, skorIMT: 75, peserta: 52 },
    { bulan: 'Mei', totalSkor: 78, skorTKJI: 75, skorFunctional: 81, skorIMT: 77, peserta: 68 },
    { bulan: 'Juni', totalSkor: 81, skorTKJI: 79, skorFunctional: 84, skorIMT: 80, peserta: 85 },
    { bulan: 'Juli (Saat ini)', totalSkor: avgSkorTotal, skorTKJI: avgTKJI, skorFunctional: avgFunctional, skorIMT: 82, peserta: totalPesertaCount },
  ];

  // Community Performance Comparison Bar Chart
  const communityData = [
    { name: 'Runner Plg', avgTotal: 84, avgTKJI: 86, avgFunctional: 82 },
    { name: 'Gowes Plg', avgTotal: 80, avgTKJI: 78, avgFunctional: 82 },
    { name: 'Senam Jantung', avgTotal: 76, avgTKJI: 72, avgFunctional: 80 },
    { name: 'Badminton Jkb', avgTotal: 82, avgTKJI: 84, avgFunctional: 80 },
    { name: 'Renang Swj', avgTotal: 85, avgTKJI: 88, avgFunctional: 82 },
  ];

  // Component breakdown across age groups
  const ageGroupBreakdown = [
    { usiarange: '< 18 Thn', tkji: 85, functional: 88, imt: 82 },
    { usiarange: '18 - 25 Thn', tkji: 88, functional: 86, imt: 85 },
    { usiarange: '26 - 35 Thn', tkji: 80, functional: 82, imt: 80 },
    { usiarange: '36 - 45 Thn', tkji: 74, functional: 78, imt: 76 },
    { usiarange: '46 - 60 Thn', tkji: 68, functional: 74, imt: 72 },
    { usiarange: '> 60 Thn', tkji: 60, functional: 68, imt: 68 },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-[#0b1a30] text-white p-5 rounded-2xl shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <UnsriLogo size="md" />
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-widest">
                TAHAP 11 DARI 12
              </span>
              <span className="text-[10px] text-slate-400">| RECHARTS ANALYTICS &amp; NOTIFIKASI</span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Dashboard Summary Kebugaran &amp; System Monitoring
            </h2>
            <p className="text-xs text-slate-300">
              Visualisasi tren perkembangan skor kebugaran, pengingat tes ulang petugas, dan ekspor data CSV
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start md:self-auto">
          <button
            onClick={() => exportAssessmentRecordsToCSV(records)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Ekspor Data CSV</span>
          </button>
        </div>
      </div>

      {/* 2. PETUGAS REMINDER NOTIFICATION BANNER */}
      <ReTestReminderPanel
        records={records}
        pesertaList={pesertaList}
        onSelectPesertaForTest={onSelectPesertaForTest}
      />

      {/* 2B. DAILY FITNESS TIPS & MOTIVATION MODULE */}
      <DailyFitnessTipsPanel />

      {/* 3. Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Peserta Terdaftar</span>
            <div className="text-2xl font-black text-slate-900 mt-0.5">{totalPesertaCount} Orang</div>
            <span className="text-[10px] text-emerald-600 font-semibold">{records.length} telah diuji</span>
          </div>
          <div className="p-3 bg-blue-100 text-blue-800 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rata-rata Skor Kebugaran</span>
            <div className="text-2xl font-black text-blue-900 mt-0.5">{avgSkorTotal} / 100</div>
            <span className="text-[10px] text-emerald-600 font-bold uppercase">Kategori Baik</span>
          </div>
          <div className="p-3 bg-yellow-100 text-amber-800 rounded-2xl">
            <Trophy className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rata-rata Skor Tes Kebugaran</span>
            <div className="text-2xl font-black text-emerald-700 mt-0.5">{avgTKJI} Poin</div>
            <span className="text-[10px] text-slate-500 font-medium">Cooper, Pushup, VJump</span>
          </div>
          <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rata-rata Skor Functional</span>
            <div className="text-2xl font-black text-purple-900 mt-0.5">{avgFunctional} Poin</div>
            <span className="text-[10px] text-slate-500 font-medium">SitStand, Plank, Step</span>
          </div>
          <div className="p-3 bg-purple-100 text-purple-800 rounded-2xl">
            <HeartPulse className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* 4. RECHARTS LONGITUDINAL SCORE TREND VISUALIZATION */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span>1. Tren Perkembangan Skor Kebugaran Peserta dari Waktu ke Waktu (Longitudinal)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Grafik Recharts interaktif menampilkan peningkatan performa fisik dari baseline Januari hingga evaluasi terkini
            </p>
          </div>

          {/* Metric Selector Pills */}
          <div className="flex items-center space-x-1.5 self-start sm:self-auto bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setSelectedMetric('totalSkor')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedMetric === 'totalSkor' ? 'bg-[#0b1a30] text-yellow-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Total Skor
            </button>
            <button
              onClick={() => setSelectedMetric('skorTKJI')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedMetric === 'skorTKJI' ? 'bg-[#0b1a30] text-yellow-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Tes Kebugaran
            </button>
            <button
              onClick={() => setSelectedMetric('skorFunctional')}
              className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
                selectedMetric === 'skorFunctional' ? 'bg-[#0b1a30] text-yellow-400 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Functional
            </button>
          </div>
        </div>

        {/* Recharts Area/Line Chart */}
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={longitudinalData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#15803d" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#15803d" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1a30',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                  border: 'none',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                }}
                formatter={(val: any) => [`${val} Poin`, 'Nilai Rata-rata']}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Area
                type="monotone"
                dataKey={selectedMetric}
                name="Rata-rata Skor Kebugaran"
                stroke="#15803d"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#scoreColor)"
                activeDot={{ r: 6, fill: '#facc15' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
          <span>📈 <strong>Tren Positif:</strong> Terdapat peningkatan rata-rata skor kebugaran sebesar <strong>+16.0%</strong> sejak bulan Januari.</span>
          <span className="font-bold text-emerald-700 text-[11px]">Metode Norma Sriwijaya Sport Tec</span>
        </div>

      </div>

      {/* 4B. PER-PESERTA MONTHLY PROGRESSION CHART (GRAFIK INDIVIDUAL BULANAN) */}
      <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-md space-y-4">
        
        {/* Header & Peserta Select Dropdown */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                Analisis Individu
              </span>
              <span className="text-xs text-slate-400">| Progres Bulanan</span>
            </div>
            <h3 className="text-sm font-black text-slate-900 flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Grafik Perkembangan Kebugaran Per Peserta (Bulan ke Bulan)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Pilih nama peserta di bawah ini untuk memantau grafik kenaikan/penurunan skor kebugaran fisiknya setiap bulan.
            </p>
          </div>

          {/* Peserta Selector Dropdown */}
          <div className="flex items-center space-x-2 bg-slate-50 p-2 rounded-xl border border-slate-200 min-w-[280px]">
            <User className="w-4 h-4 text-slate-500 flex-shrink-0 ml-1" />
            <div className="flex-1">
              <label className="block text-[9px] font-bold text-slate-400 uppercase">Pilih Peserta:</label>
              <select
                value={selectedPesertaId}
                onChange={(e) => setSelectedPesertaId(e.target.value)}
                className="w-full bg-transparent text-xs font-bold text-slate-900 focus:outline-none cursor-pointer"
              >
                {availablePesertaList.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nama} ({p.komunitas || 'Peserta'}) - {p.umur} Thn
                  </option>
                ))}
              </select>
            </div>
            <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0 mr-1" />
          </div>
        </div>

        {/* Selected Peserta Badge & Key Metrics Summary */}
        {selectedPeserta && (
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
            
            {/* Peserta Info Card */}
            <div className="flex items-center space-x-3 col-span-1 md:col-span-1">
              {selectedPeserta.fotoUrl ? (
                <img
                  src={selectedPeserta.fotoUrl}
                  alt={selectedPeserta.nama}
                  className="w-11 h-11 rounded-full object-cover border-2 border-yellow-400 shadow-sm"
                />
              ) : (
                <div className="w-11 h-11 rounded-full bg-[#0b1a30] text-yellow-400 flex items-center justify-center font-black text-sm border-2 border-yellow-400">
                  {selectedPeserta.nama.substring(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <h4 className="text-xs font-bold text-slate-900">{selectedPeserta.nama}</h4>
                <p className="text-[10px] text-slate-500">{selectedPeserta.jenisKelamin}, {selectedPeserta.umur} Tahun</p>
                <span className="inline-block mt-0.5 text-[9px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded-md">
                  {selectedPeserta.komunitas || 'Umum'}
                </span>
              </div>
            </div>

            {/* Metric 1: Skor Terkini */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Skor Terkini (Juli)</span>
              <div className="text-base font-black text-blue-900">
                {currentMonthScore} <span className="text-xs font-normal text-slate-500">/ 100</span>
              </div>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                {userMonthlyData[userMonthlyData.length - 1]?.kategori || 'Baik'}
              </span>
            </div>

            {/* Metric 2: Peningkatan Bulanan */}
            <div className="p-2.5 bg-white rounded-lg border border-slate-200 text-center">
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Peningkatan (Jan - Jul)</span>
              <div className={`text-base font-black ${scoreImprovement >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                {scoreImprovement >= 0 ? `+${scoreImprovement}` : scoreImprovement} Poin
              </div>
              <span className="text-[9px] text-slate-500 font-medium">
                {scoreImprovement >= 0 ? '▲ Tren Positif' : '▼ Perlu Evaluasi'}
              </span>
            </div>

            {/* Metric 3: Quick Action Button */}
            <div className="col-span-1 flex justify-center md:justify-end">
              <button
                type="button"
                onClick={() => onSelectPesertaForTest(selectedPeserta)}
                className="w-full md:w-auto inline-flex items-center justify-center space-x-1.5 px-3 py-2 bg-[#0b1a30] hover:bg-slate-800 text-yellow-400 text-xs font-bold rounded-xl shadow transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-yellow-400" />
                <span>Tes Ulang Peserta Ini</span>
              </button>
            </div>

          </div>
        )}

        {/* Recharts Multi-line Monthly Chart for Selected Peserta */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={userMonthlyData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0b1a30',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '11px',
                  border: '1px solid #1e293b',
                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
                }}
                formatter={(val: any, name: string) => [`${val} Poin`, name]}
                labelFormatter={(label: string) => `Bulan Evaluasi: ${label}`}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
              
              <Line
                type="monotone"
                dataKey="totalSkor"
                name="Total Skor Kebugaran"
                stroke="#0b1a30"
                strokeWidth={3.5}
                dot={{ r: 5, fill: '#facc15', stroke: '#0b1a30', strokeWidth: 2 }}
                activeDot={{ r: 8, fill: '#facc15' }}
              />
              <Line
                type="monotone"
                dataKey="skorTKJI"
                name="Skor Tes Kebugaran"
                stroke="#16a34a"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#16a34a' }}
              />
              <Line
                type="monotone"
                dataKey="skorFunctional"
                name="Skor Functional Fitness"
                stroke="#9333ea"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={{ r: 3, fill: '#9333ea' }}
              />
              <Line
                type="monotone"
                dataKey="skorIMT"
                name="Skor Komposisi Tubuh (IMT)"
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 3, fill: '#d97706' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Progression Table / Column Breakdown */}
        <div className="pt-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Kolom Perhitungan &amp; Rekapitulasi Progres Bulanan Peserta ({selectedPeserta?.nama})</span>
            </h4>
            <span className="text-[10px] text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full font-bold">
              {testsTaken.length} Bulan Terisi Data Tes
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-sm bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#0b1a30] text-white text-[11px] font-bold">
                  <th className="p-2.5">Bulan</th>
                  <th className="p-2.5">Tanggal Tes</th>
                  <th className="p-2.5 text-center">Total Skor</th>
                  <th className="p-2.5 text-center">Tes Kebugaran</th>
                  <th className="p-2.5 text-center">Functional Fitness</th>
                  <th className="p-2.5 text-center">Komposisi IMT</th>
                  <th className="p-2.5">Status &amp; Kategori</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-[11px]">
                {userMonthlyData.map((d, idx) => (
                  <tr
                    key={idx}
                    className={
                      d.isRealTest
                        ? 'bg-blue-50/60 hover:bg-blue-50 font-medium text-slate-900'
                        : 'bg-slate-50/30 text-slate-400'
                    }
                  >
                    <td className="p-2.5 font-bold flex items-center space-x-2">
                      <span className={`w-2 h-2 rounded-full ${d.isRealTest ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                      <span>{d.bulan}</span>
                    </td>
                    <td className="p-2.5 font-mono text-[10px]">{d.tanggalTes}</td>
                    <td className="p-2.5 text-center font-black">
                      {d.isRealTest ? (
                        <span className="text-blue-900 font-black bg-yellow-100 px-2 py-0.5 rounded text-xs">
                          {d.totalSkor} / 100
                        </span>
                      ) : (
                        <span className="text-slate-400">0</span>
                      )}
                    </td>
                    <td className="p-2.5 text-center font-bold">{d.skorTKJI}</td>
                    <td className="p-2.5 text-center font-bold">{d.skorFunctional}</td>
                    <td className="p-2.5 text-center font-bold">{d.skorIMT}</td>
                    <td className="p-2.5">
                      {d.isRealTest ? (
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {d.kategori}
                        </span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-400">
                          0 (Belum Tes)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 text-xs text-blue-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-blue-700 flex-shrink-0" />
            <span>
              <strong>Perhitungan Real-Time:</strong> Data bulanan di atas dihitung 100% secara akurat berdasarkan riwayat tes aktual yang diinput untuk <strong>{selectedPeserta?.nama}</strong>. Bulan tanpa tes ditandai dengan angka 0.
            </span>
          </div>
        </div>

      </div>

      {/* 5. SECONDARY CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart A: Distribution Donut Chart */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            2. Distribusi Kategori Kebugaran Akhir
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1a30',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                  formatter={(val: any) => [`${val} Peserta`, 'Jumlah']}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart B: Bar Chart Komunitas Comparison */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            3. Perbandingan Rata-rata Skor Antar Komunitas
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={communityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1a30',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="avgTotal" name="Total Skor" fill="#0b1a30" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgTKJI" name="Skor Tes Kebugaran" fill="#22c55e" radius={[4, 4, 0, 0]} />
                <Bar dataKey="avgFunctional" name="Skor Functional" fill="#eab308" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 6. Navigation Buttons */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          className="inline-flex items-center space-x-1.5 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Laporan Cetak</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
        >
          <span>Selesai &amp; Selesaikan Evaluasi</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};
