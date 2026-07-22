import React, { useState } from 'react';
import { AssessmentRecord, Peserta } from '../types';
import { Download, FileText, Plus, Search, Trash2, UserCheck, Users } from 'lucide-react';
import { exportAssessmentRecordsToCSV, exportPesertaListToCSV } from '../utils/exportCsv';

interface DataPesertaListProps {
  pesertaList: Peserta[];
  records: AssessmentRecord[];
  onSelectPesertaForTest: (peserta: Peserta) => void;
  onViewReport: (record: AssessmentRecord) => void;
  onAddNewPeserta: () => void;
  onDeletePeserta: (id: string) => void;
}

export const DataPesertaList: React.FC<DataPesertaListProps> = ({
  pesertaList,
  records,
  onSelectPesertaForTest,
  onViewReport,
  onAddNewPeserta,
  onDeletePeserta,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCommunity, setFilterCommunity] = useState<string>('all');

  const filtered = pesertaList.filter((p) => {
    const matchesSearch =
      p.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.noHp.includes(searchTerm) ||
      p.komunitas.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesComm = filterCommunity === 'all' || p.komunitas === filterCommunity;
    return matchesSearch && matchesComm;
  });

  const communities = Array.from(new Set(pesertaList.map((p) => p.komunitas)));

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Top Action Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Users className="w-5 h-5 text-yellow-600" />
            <span>Daftar Peserta &amp; Riwayat Kebugaran</span>
          </h2>
          <p className="text-xs text-slate-500">
            Kelola data identitas peserta, mulai pengujian baru, dan lihat laporan longitudinal
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => exportAssessmentRecordsToCSV(records)}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            title="Ekspor seluruh hasil assessment ke format CSV/Excel"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Hasil Assessment (CSV)</span>
          </button>

          <button
            onClick={onAddNewPeserta}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Peserta Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Cari nama peserta, no hp, atau komunitas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 font-medium text-slate-800"
          />
        </div>

        <select
          value={filterCommunity}
          onChange={(e) => setFilterCommunity(e.target.value)}
          className="w-full sm:w-56 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-700"
        >
          <option value="all">Semua Komunitas</option>
          {communities.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Participants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0b1a30] text-white">
              <tr>
                <th className="p-3.5 font-bold">Peserta</th>
                <th className="p-3.5 font-bold">Jenis Kelamin</th>
                <th className="p-3.5 font-bold">Umur</th>
                <th className="p-3.5 font-bold">Komunitas</th>
                <th className="p-3.5 font-bold">Status Tes Terakhir</th>
                <th className="p-3.5 font-bold text-right">Aksi &amp; Evaluasi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs">
                    Tidak ada data peserta yang ditemukan.
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const record = records.find((r) => r.peserta.id === p.id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3.5 flex items-center space-x-3">
                        <div className="w-9 h-9 rounded-full bg-slate-200 overflow-hidden flex-shrink-0 border border-slate-300">
                          {p.fotoUrl ? (
                            <img src={p.fotoUrl} alt={p.nama} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center font-bold text-slate-500">
                              {p.nama.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <strong className="text-slate-900 block">{p.nama}</strong>
                          <span className="text-[10px] text-slate-500">{p.noHp}</span>
                        </div>
                      </td>

                      <td className="p-3.5">{p.jenisKelamin}</td>
                      <td className="p-3.5">{p.umur} Thn</td>
                      <td className="p-3.5 font-semibold text-slate-700">{p.komunitas}</td>

                      <td className="p-3.5">
                        {record ? (
                          <div className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            <span>Skor {record.evaluation.totalSkor} ({record.evaluation.kategoriAkhir})</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[10px] italic">Belum Ada Tes</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right space-x-2">
                        {record && (
                          <button
                            onClick={() => onViewReport(record)}
                            className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] rounded-lg transition-colors inline-flex items-center space-x-1"
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Laporan</span>
                          </button>
                        )}

                        <button
                          onClick={() => onSelectPesertaForTest(p)}
                          className="px-2.5 py-1.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-[11px] rounded-lg transition-colors"
                        >
                          Lakukan Tes
                        </button>

                        <button
                          onClick={() => onDeletePeserta(p.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Peserta"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
