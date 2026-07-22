import React from 'react';
import { BookOpen, CheckCircle2, FileCheck, Info, Shield } from 'lucide-react';

export const PengaturanView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <BookOpen className="w-5 h-5 text-yellow-600" />
          <span>Pengaturan &amp; Standar Norma Sriwijaya Sport Tec</span>
        </h2>
        <p className="text-xs text-slate-500 leading-relaxed">
          Sistem penilaian kebugaran olahraga masyarakat berbasis standar Kementerian Kesehatan Republik Indonesia, WHO (2000), ACSM (2022), dan Tes Kebugaran Jasmani Indonesia (TKJI).
        </p>
      </div>

      {/* Standards Summary Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
            1. Bobot Komponen Penilaian Utama
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            <li className="flex items-center justify-between">
              <span>• Aktivitas Fisik (Habit &amp; Frequency):</span>
              <strong className="text-blue-900">15%</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Indeks Massa Tubuh (IMT / BMI WHO):</span>
              <strong className="text-blue-900">15%</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Tes Kebugaran Jasmani Indonesia (TKJI):</span>
              <strong className="text-emerald-700">35%</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Pengukuran Functional Fitness:</span>
              <strong className="text-emerald-700">35%</strong>
            </li>
          </ul>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b pb-2">
            2. Klasifikasi Norma Akhir
          </h3>
          <ul className="text-xs text-slate-700 space-y-2">
            <li className="flex items-center justify-between">
              <span>• Total Skor &ge; 90 - 100:</span>
              <strong className="text-emerald-700">Sangat Baik</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Total Skor 80 - 89:</span>
              <strong className="text-emerald-600">Baik</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Total Skor 65 - 79:</span>
              <strong className="text-yellow-600">Cukup</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Total Skor 50 - 64:</span>
              <strong className="text-orange-600">Kurang</strong>
            </li>
            <li className="flex items-center justify-between">
              <span>• Total Skor &lt; 50:</span>
              <strong className="text-red-600">Sangat Kurang</strong>
            </li>
          </ul>
        </div>

      </div>

      {/* References */}
      <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2">
        <h4 className="font-bold text-slate-900">Referensi &amp; Dasar Acuan Ilmiah:</h4>
        <ol className="list-decimal list-inside space-y-1 text-slate-600 leading-relaxed">
          <li>Kementerian Kesehatan Republik Indonesia. (2019). Peraturan Menteri Kesehatan RI No 28 Tahun 2019.</li>
          <li>World Health Organization (WHO). (2000). Obesity: Preventing and Managing the Global Epidemic.</li>
          <li>American College of Sports Medicine (ACSM). (2022). ACSM's Guidelines for Exercise Testing and Prescription.</li>
          <li>Cooper, K. H. (2018). The Aerobics Program for Total Well-Being.</li>
          <li>Rikli, R. E., &amp; Jones, C. J. (2013). Senior Fitness Test Manual (2nd ed.).</li>
        </ol>
      </div>

    </div>
  );
};
