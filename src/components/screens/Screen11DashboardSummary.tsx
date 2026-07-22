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
  Bell,
  Calculator,
  Download,
  Filter,
  HeartPulse,
  TrendingUp,
  Trophy,
  Users
} from 'lucide-react';
import { ReTestReminderPanel } from '../ReTestReminderPanel';
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
  onSelectPesertaForTest = () => {},
  onPrev,
  onNext,
}) => {
  const [selectedMetric, setSelectedMetric] = useState<'totalSkor' | 'skorTKJI' | 'skorFunctional' | 'skorIMT'>('totalSkor');
  const [selectedCommFilter, setSelectedCommFilter] = useState<string>('all');

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
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Rata-rata Skor TKJI</span>
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
              TKJI
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
                <Bar dataKey="avgTKJI" name="Skor TKJI" fill="#22c55e" radius={[4, 4, 0, 0]} />
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
