import React, { useState } from 'react';
import { Gender, Peserta } from '../../types';
import { KOMUNITAS_LIST } from '../../data/mockData';
import { ArrowRight, Camera, User, UserPlus } from 'lucide-react';

interface Screen2DataPesertaProps {
  currentPeserta: Peserta;
  onSavePeserta: (peserta: Peserta) => void;
  onNext: () => void;
}

export const Screen2DataPeserta: React.FC<Screen2DataPesertaProps> = ({
  currentPeserta,
  onSavePeserta,
  onNext,
}) => {
  const [formData, setFormData] = useState<Peserta>(currentPeserta);

  const calculateAgeFromDob = (dobString: string) => {
    if (!dobString) return 25;
    const birthDate = new Date(dobString);
    if (isNaN(birthDate.getTime())) return 25;
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age > 0 ? age : 25;
  };

  const MONTHS_INDONESIA = [
    { value: '01', label: 'Januari' },
    { value: '02', label: 'Februari' },
    { value: '03', label: 'Maret' },
    { value: '04', label: 'April' },
    { value: '05', label: 'Mei' },
    { value: '06', label: 'Juni' },
    { value: '07', label: 'Juli' },
    { value: '08', label: 'Agustus' },
    { value: '09', label: 'September' },
    { value: '10', label: 'Oktober' },
    { value: '11', label: 'November' },
    { value: '12', label: 'Desember' },
  ];
  const YEARS_LIST = Array.from({ length: 87 }, (_, i) => String(2026 - i));
  const DAYS_LIST = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'));

  const parts = (formData.tanggalLahir || '1998-05-10').split('-');
  const selectedYear = parts[0] && parts[0].length === 4 ? parts[0] : '1998';
  const selectedMonth = parts[1] || '05';
  const selectedDay = parts[2] || '10';

  const handleDobPartChange = (type: 'day' | 'month' | 'year', val: string) => {
    let d = selectedDay;
    let m = selectedMonth;
    let y = selectedYear;
    if (type === 'day') d = val;
    if (type === 'month') m = val;
    if (type === 'year') y = val;

    const formatted = `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
    const age = calculateAgeFromDob(formatted);
    setFormData((prev) => ({
      ...prev,
      tanggalLahir: formatted,
      umur: age,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSavePeserta(formData);
    onNext();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            2
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Tambah / Input Data Peserta</h2>
            <p className="text-xs text-slate-300">Identitas awal peserta pengukuran kebugaran</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 2 dari 12
        </div>
      </div>

      {/* Form Content */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left Column: Form Fields */}
          <div className="md:col-span-2 space-y-4">
            
            {/* Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                placeholder="mis. Andi Pratama"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-800"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <div className="flex space-x-6 pt-1">
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="Laki-laki"
                    checked={formData.jenisKelamin === 'Laki-laki'}
                    onChange={() => setFormData({ ...formData, jenisKelamin: 'Laki-laki' })}
                    className="text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Laki-laki</span>
                </label>
                <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer">
                  <input
                    type="radio"
                    name="jenisKelamin"
                    value="Perempuan"
                    checked={formData.jenisKelamin === 'Perempuan'}
                    onChange={() => setFormData({ ...formData, jenisKelamin: 'Perempuan' })}
                    className="text-yellow-500 focus:ring-yellow-500"
                  />
                  <span>Perempuan</span>
                </label>
              </div>
            </div>

            {/* Tanggal Lahir & Umur */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tanggal Lahir (Tgl / Bln / Thn)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {/* Tanggal */}
                  <select
                    value={selectedDay}
                    onChange={(e) => handleDobPartChange('day', e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-800"
                  >
                    {DAYS_LIST.map((d) => (
                      <option key={d} value={d}>
                        Tgl {parseInt(d)}
                      </option>
                    ))}
                  </select>

                  {/* Bulan */}
                  <select
                    value={selectedMonth}
                    onChange={(e) => handleDobPartChange('month', e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-800"
                  >
                    {MONTHS_INDONESIA.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>

                  {/* Tahun */}
                  <select
                    value={selectedYear}
                    onChange={(e) => handleDobPartChange('year', e.target.value)}
                    className="w-full px-2 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-yellow-800 bg-yellow-50/50"
                  >
                    {YEARS_LIST.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Umur (Tahun)
                </label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={formData.umur}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^0+(?=\d)/, '');
                    e.target.value = val;
                    setFormData({ ...formData, umur: val === '' ? 0 : parseInt(val) || 0 });
                  }}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Komunitas / Klub */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Komunitas / Klub Olahraga
              </label>
              <select
                value={formData.komunitas}
                onChange={(e) => setFormData({ ...formData, komunitas: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-800"
              >
                {KOMUNITAS_LIST.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* No. HP */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                No. HP / WhatsApp
              </label>
              <input
                type="text"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                placeholder="0812-3456-7890"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-800"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Alamat Domisili
              </label>
              <input
                type="text"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                placeholder="Kec. Ilir Timur, Kota Palembang"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-800"
              />
            </div>

          </div>

          {/* Right Column: Photo Upload Box */}
          <div className="flex flex-col items-center justify-start bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 mb-3">Dokumentasi Foto Peserta</span>
            
            <div className="w-36 h-36 rounded-2xl bg-slate-200 border-2 border-dashed border-slate-300 flex flex-col items-center justify-center overflow-hidden relative group">
              {formData.fotoUrl ? (
                <img
                  src={formData.fotoUrl}
                  alt="Foto Peserta"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-12 h-12 text-slate-400" />
              )}
            </div>

            <label className="mt-3 cursor-pointer inline-flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
              <Camera className="w-3.5 h-3.5" />
              <span>Ganti / Upload Foto</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setFormData({ ...formData, fotoUrl: url });
                  }
                }}
              />
            </label>
            <p className="text-[10px] text-slate-500 mt-2 text-center">
              Format: JPG, PNG. Maks 2MB.
            </p>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setFormData(currentPeserta)}
            className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            Reset Form
          </button>

          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Simpan &amp; Lanjut Aktivitas Fisik</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
};
