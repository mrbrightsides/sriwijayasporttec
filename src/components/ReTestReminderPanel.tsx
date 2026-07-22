import React, { useState } from 'react';
import { AssessmentRecord, Peserta } from '../types';
import {
  AlertTriangle,
  Bell,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  MessageCircle,
  PlayCircle,
  RefreshCw,
  Search,
  UserCheck
} from 'lucide-react';

interface ReTestReminderPanelProps {
  records: AssessmentRecord[];
  pesertaList: Peserta[];
  onSelectPesertaForTest: (peserta: Peserta) => void;
}

export const ReTestReminderPanel: React.FC<ReTestReminderPanelProps> = ({
  records,
  pesertaList,
  onSelectPesertaForTest,
}) => {
  const [filterStatus, setFilterStatus] = useState<'all' | 'overdue' | 'duesoon'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Helper to estimate days since last test
  const calculateDaysAgo = (dateStr?: string): number => {
    if (!dateStr) return 999;
    
    // Parse Indonesian date or standard date
    let testDate: Date;
    if (dateStr.includes('Febr') || dateStr.includes('Feb')) {
      testDate = new Date('2026-02-12');
    } else if (dateStr.includes('Mar')) {
      testDate = new Date('2026-03-15');
    } else if (dateStr.includes('Apr')) {
      testDate = new Date('2026-04-20');
    } else if (dateStr.includes('Mei') || dateStr.includes('May')) {
      testDate = new Date('2026-05-10');
    } else if (dateStr.includes('Jun')) {
      testDate = new Date('2026-06-15');
    } else if (dateStr.includes('Jan')) {
      testDate = new Date('2026-01-10');
    } else {
      testDate = new Date(dateStr);
    }

    if (isNaN(testDate.getTime())) testDate = new Date('2026-03-01');

    const today = new Date('2026-07-21'); // fixed reference date matching platform context
    const diffTime = today.getTime() - testDate.getTime();
    return Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));
  };

  // Compute reminder details for each participant
  const participantReminders = pesertaList.map((p) => {
    // Find all records for this participant, pick latest
    const pRecords = records.filter((r) => r.peserta.id === p.id);
    const latestRecord = pRecords[0]; // records ordered or picked first

    const daysAgo = calculateDaysAgo(latestRecord?.tanggal);

    let status: 'overdue' | 'duesoon' | 'active';
    let statusLabel: string;
    let badgeClass: string;

    if (daysAgo >= 90) {
      status = 'overdue';
      statusLabel = '🔴 Waktunya Tes Ulang';
      badgeClass = 'bg-red-100 text-red-800 border-red-300';
    } else if (daysAgo >= 70) {
      status = 'duesoon';
      statusLabel = '🟡 Segera Tes Ulang (14 Hari)';
      badgeClass = 'bg-amber-100 text-amber-800 border-amber-300';
    } else {
      status = 'active';
      statusLabel = '🟢 Status Aktif';
      badgeClass = 'bg-emerald-100 text-emerald-800 border-emerald-300';
    }

    return {
      peserta: p,
      latestRecord,
      daysAgo,
      status,
      statusLabel,
      badgeClass,
    };
  });

  const overdueCount = participantReminders.filter((r) => r.status === 'overdue').length;
  const dueSoonCount = participantReminders.filter((r) => r.status === 'duesoon').length;
  const activeCount = participantReminders.filter((r) => r.status === 'active').length;

  const filteredReminders = participantReminders.filter((item) => {
    const matchesSearch =
      item.peserta.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.peserta.komunitas.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'overdue') return matchesSearch && item.status === 'overdue';
    if (filterStatus === 'duesoon') return matchesSearch && (item.status === 'duesoon' || item.status === 'overdue');
    return matchesSearch;
  });

  const handleSendWaReminder = (p: Peserta, daysAgo: number) => {
    const cleanPhone = p.noHp.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.startsWith('0') ? '62' + cleanPhone.substring(1) : cleanPhone;
    const text = `Halo Sdr/i ${p.nama},\nSalam Sehat dari Sriwijaya Sport Tec Universitas Sriwijaya!\n\nKami menginformasikan bahwa tes kebugaran jasmani terakhir Anda dilakukan ${daysAgo} hari yang lalu (${p.komunitas}).\n\nUntuk memantau perkembangan kondisi fisik dan kesehatan Anda secara berkelanjutan, mari lakukan Tes Ulang Kebugaran Jasmani Berkala.\n\nHubungi petugas kami untuk jadwal pengujian berikutnya. Terimakasih!`;
    const url = `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden space-y-4">
      
      {/* Reminder Header Banner */}
      <div className="bg-gradient-to-r from-[#0b1a30] via-slate-900 to-blue-950 p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-3 bg-yellow-500/20 border border-yellow-400/40 rounded-2xl text-yellow-400 flex-shrink-0 animate-bounce">
            <Bell className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-2.5 py-0.5 rounded-full">
                Sistem Pengingat Petugas
              </span>
              <span className="text-xs text-slate-300">| Siklus Tes 90 Hari</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">
              Pengingat Tes Ulang Kebugaran Berkala
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xl">
              Memastikan seluruh anggota komunitas mendapatkan evaluasi kesehatan fisik tepat waktu secara periodik untuk hasil pemantauan longitudinal.
            </p>
          </div>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center space-x-2 self-start md:self-auto flex-shrink-0">
          <button
            onClick={() => setFilterStatus('overdue')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              filterStatus === 'overdue'
                ? 'bg-red-600 text-white border-red-500 shadow-md'
                : 'bg-red-500/10 text-red-300 border-red-500/30 hover:bg-red-500/20'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>{overdueCount} Waktunya Tes</span>
          </button>

          <button
            onClick={() => setFilterStatus('duesoon')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center space-x-1.5 ${
              filterStatus === 'duesoon'
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>{dueSoonCount} Segera Tes</span>
          </button>

          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
              filterStatus === 'all'
                ? 'bg-yellow-500 text-slate-950 border-yellow-400 shadow-md'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <span>Semua ({pesertaList.length})</span>
          </button>
        </div>
      </div>

      {/* Quick Search & Filter Toolbar */}
      <div className="px-5 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Cari nama peserta / komunitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 font-medium text-slate-800"
          />
        </div>

        <div className="text-[11px] font-semibold text-slate-500">
          Menampilkan <strong className="text-slate-800">{filteredReminders.length}</strong> dari {pesertaList.length} peserta
        </div>
      </div>

      {/* Reminder Cards Grid */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredReminders.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-400 text-xs bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            Tidak ada peserta yang memerlukan perhatian dalam kategori filter ini.
          </div>
        ) : (
          filteredReminders.map(({ peserta, latestRecord, daysAgo, status, statusLabel, badgeClass }) => (
            <div
              key={peserta.id}
              className={`p-4 rounded-2xl border transition-all shadow-sm hover:shadow-md flex flex-col justify-between space-y-3 bg-white ${
                status === 'overdue'
                  ? 'border-red-200 hover:border-red-400 bg-gradient-to-b from-red-50/40 to-white'
                  : status === 'duesoon'
                  ? 'border-amber-200 hover:border-amber-400 bg-gradient-to-b from-amber-50/30 to-white'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header Info */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                      {peserta.fotoUrl ? (
                        <img src={peserta.fotoUrl} alt={peserta.nama} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center font-bold text-slate-600">
                          {peserta.nama.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">{peserta.nama}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold">{peserta.komunitas}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${badgeClass}`}>
                    {statusLabel}
                  </span>
                </div>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Tes Terakhir:</span>
                    <strong className="text-slate-900">{latestRecord?.tanggal || 'Belum Pernah'}</strong>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Lama Sejak Tes:</span>
                    <strong className={status === 'overdue' ? 'text-red-700 font-black' : 'text-slate-800'}>
                      {daysAgo} Hari Lalu
                    </strong>
                  </div>
                  {latestRecord && (
                    <div className="flex items-center justify-between text-slate-600 border-t border-slate-200 pt-1 mt-1">
                      <span>Skor Kebugaran:</span>
                      <strong className="text-emerald-700 font-black">
                        {latestRecord.evaluation.totalSkor} ({latestRecord.evaluation.kategoriAkhir})
                      </strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleSendWaReminder(peserta, daysAgo)}
                  className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] rounded-lg transition-colors flex items-center space-x-1 shadow-sm"
                  title="Kirim Notifikasi via WhatsApp"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Kirim WA</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectPesertaForTest(peserta)}
                  className="flex-1 px-3 py-1.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-[11px] rounded-lg transition-all flex items-center justify-center space-x-1 shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />
                  <span>Mulai Tes Ulang</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
