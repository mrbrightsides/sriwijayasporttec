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

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dob = e.target.value;
    const age = calculateAgeFromDob(dob);
    setFormData((prev) => ({
      ...prev,
      tanggalLahir: dob,
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

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-slate-700 font-bold mb-1">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.tanggalLahir}
                onChange={handleDobChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-yellow-500 font-semibold text-slate-900"
              />
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
                onChange={(e) => setFormData({ ...formData, umur: parseInt(e.target.value) || 0 })}
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
