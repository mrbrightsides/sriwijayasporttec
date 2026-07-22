import React, { useState } from 'react';
import { Peserta } from '../types';
import { KOMUNITAS_LIST } from '../data/mockData';
import { Camera, CheckCircle2, User, UserPlus, X } from 'lucide-react';

interface AddPesertaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (peserta: Peserta) => void;
  existingCount: number;
}

export const AddPesertaModal: React.FC<AddPesertaModalProps> = ({
  isOpen,
  onClose,
  onSave,
  existingCount,
}) => {
  if (!isOpen) return null;

  const defaultId = `P${String(existingCount + 1).padStart(3, '0')}`;

  const [formData, setFormData] = useState<Peserta>({
    id: defaultId,
    nama: '',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2000-01-15',
    umur: 26,
    komunitas: KOMUNITAS_LIST[0] || 'Bersepeda',
    noHp: '',
    alamat: 'Palembang, Sumatera Selatan',
    fotoUrl: '',
    createdAt: new Date().toISOString().split('T')[0],
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const parts = (formData.tanggalLahir || '2000-01-15').split('-');
  const selectedYear = parts[0] && parts[0].length === 4 ? parts[0] : '2000';
  const selectedMonth = parts[1] || '01';
  const selectedDay = parts[2] || '15';

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
    if (!formData.nama.trim()) {
      alert('Silakan masukkan nama lengkap peserta!');
      return;
    }

    onSave(formData);
    setToastMessage(`Peserta "${formData.nama}" berhasil disimpan ke LocalStorage!`);
    
    setTimeout(() => {
      setToastMessage(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header Modal */}
        <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-xl">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Tambah Peserta Baru</h3>
              <p className="text-xs text-slate-300">Input data peserta baru dan simpan di LocalStorage</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="bg-emerald-600 text-white px-6 py-3 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-medium text-slate-800">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* ID Peserta (Auto) */}
            <div>
              <label className="block text-slate-600 font-bold mb-1">
                ID Peserta (Sistem)
              </label>
              <input
                type="text"
                readOnly
                value={formData.id}
                className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl font-bold text-slate-600 cursor-not-allowed"
              />
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="mis. Budi Santoso"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.jenisKelamin}
                onChange={(e) => setFormData({ ...formData, jenisKelamin: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Komunitas / Klub */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Komunitas / Klub
              </label>
              <select
                value={formData.komunitas}
                onChange={(e) => setFormData({ ...formData, komunitas: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
              >
                {KOMUNITAS_LIST.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            {/* Tanggal Lahir (3 Dropdowns: Tanggal, Bulan, Tahun) */}
            <div className="sm:col-span-2">
              <label className="block text-slate-700 font-bold mb-1">
                Tanggal Lahir (Tgl / Bln / Thn)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {/* Tanggal */}
                <select
                  value={selectedDay}
                  onChange={(e) => handleDobPartChange('day', e.target.value)}
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
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
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
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
                  className="w-full px-2.5 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-900 text-yellow-800 bg-yellow-50/50"
                >
                  {YEARS_LIST.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Umur */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
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
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-bold text-slate-900"
              />
            </div>

            {/* No. HP */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                No. HP / WhatsApp
              </label>
              <input
                type="text"
                placeholder="0812-3456-7890"
                value={formData.noHp}
                onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
              />
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Alamat Domisili
              </label>
              <input
                type="text"
                placeholder="Kec. Ilir Timur, Palembang"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
              />
            </div>

          </div>

          {/* Upload Foto optional */}
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 border border-slate-300 overflow-hidden flex items-center justify-center flex-shrink-0">
                {formData.fotoUrl ? (
                  <img src={formData.fotoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-5 h-5 text-slate-400" />
                )}
              </div>
              <div>
                <span className="font-bold text-slate-800 block text-[11px]">Foto Profil Peserta (Opsional)</span>
                <span className="text-[10px] text-slate-500">Pilih berkas foto dari komputer</span>
              </div>
            </div>

            <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center space-x-1">
              <Camera className="w-3.5 h-3.5" />
              <span>Unggah</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, fotoUrl: reader.result as string });
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
            >
              Batal
            </button>

            <button
              type="submit"
              className="px-5 py-2 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold rounded-xl shadow-md transition-all flex items-center space-x-1.5"
            >
              <UserPlus className="w-4 h-4 text-yellow-400" />
              <span>Simpan Peserta (LocalStorage)</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
