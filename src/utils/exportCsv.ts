import { AssessmentRecord, Peserta } from '../types';

/**
 * Utility to trigger browser download of a CSV string with UTF-8 BOM
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const bom = '\uFEFF'; // UTF-8 Byte Order Mark for Excel compatibility
  const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Escapes CSV field values
 */
function escapeCsv(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

/**
 * Exports all Assessment Records and Participants to CSV
 */
export function exportAssessmentRecordsToCSV(records: AssessmentRecord[], filename = 'Data_Hasil_Kebugaran_SriwijayaSportTec.csv'): void {
  const headers = [
    'ID Peserta',
    'Nama Lengkap',
    'Jenis Kelamin',
    'Umur (Tahun)',
    'Komunitas',
    'No. HP',
    'Alamat',
    'Tanggal Tes',
    'Jenis Aktivitas Utama',
    'Frekuensi Aktivitas',
    'Durasi Aktivitas',
    'Skor Aktivitas (15%)',
    'Kategori Aktivitas',
    'Tinggi Badan (cm)',
    'Berat Badan (kg)',
    'Nilai IMT',
    'Skor IMT (15%)',
    'Kategori IMT',
    'Tes Lari 12M / Cooper (m)',
    'Skor Cooper',
    'Push Up (Repetisi)',
    'Skor Push Up',
    'Vertical Jump (cm)',
    'Skor Vertical Jump',
    'Total Skor TKJI (35%)',
    'Kategori TKJI',
    'Sit to Stand (Repetisi)',
    'Plank (Detik)',
    'Balance / Berdiri 1 Kaki (Detik)',
    'Sit and Reach (cm)',
    'Step Test Recovery Pulse (bpm)',
    'Total Skor Functional (35%)',
    'Kategori Functional',
    'TOTAL SKOR KEBUGARAN (100%)',
    'KATEGORI AKHIR KEBUGARAN',
    'Rekomendasi Daya Tahan',
    'Rekomendasi Kekuatan',
    'Rekomendasi Fleksibilitas',
    'Rekomendasi Aktivitas Harian',
  ];

  const rows = records.map((r) => [
    escapeCsv(r.peserta.id),
    escapeCsv(r.peserta.nama),
    escapeCsv(r.peserta.jenisKelamin),
    escapeCsv(r.peserta.umur),
    escapeCsv(r.peserta.komunitas),
    escapeCsv(r.peserta.noHp),
    escapeCsv(r.peserta.alamat),
    escapeCsv(r.tanggal),
    escapeCsv(r.aktivitas.jenisUtama),
    escapeCsv(r.aktivitas.frekuensi),
    escapeCsv(r.aktivitas.durasi),
    escapeCsv(r.aktivitas.skorAktivitas),
    escapeCsv(r.aktivitas.kategoriAktivitas),
    escapeCsv(r.imt.tinggiBadan),
    escapeCsv(r.imt.beratBadan),
    escapeCsv(r.imt.nilaiIMT),
    escapeCsv(r.imt.skorIMT),
    escapeCsv(r.imt.kategoriIMT),
    escapeCsv(r.tkji.cooperDistanceMeter),
    escapeCsv(r.tkji.skorCooper),
    escapeCsv(r.tkji.pushUpRepetisi),
    escapeCsv(r.tkji.skorPushUp),
    escapeCsv(r.tkji.verticalJumpCm),
    escapeCsv(r.tkji.skorVerticalJump),
    escapeCsv(r.tkji.totalSkorTKJI),
    escapeCsv(r.tkji.kategoriTKJI),
    escapeCsv(r.functional.sitToStandRepetisi),
    escapeCsv(r.functional.plankDetik),
    escapeCsv(r.functional.balanceDetik),
    escapeCsv(r.functional.sitAndReachCm),
    escapeCsv(r.functional.stepTestRecoveryPulse),
    escapeCsv(r.functional.totalSkorFunctional),
    escapeCsv(r.functional.kategoriFunctional),
    escapeCsv(r.evaluation.totalSkor),
    escapeCsv(r.evaluation.kategoriAkhir),
    escapeCsv(r.evaluation.rekomendasi.dayaTahan),
    escapeCsv(r.evaluation.rekomendasi.kekuatan),
    escapeCsv(r.evaluation.rekomendasi.fleksibilitas),
    escapeCsv(r.evaluation.rekomendasi.aktivitasHarian),
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadCSV(filename, csvContent);
}

/**
 * Exports participants directory list to CSV
 */
export function exportPesertaListToCSV(pesertaList: Peserta[], records: AssessmentRecord[], filename = 'Daftar_Peserta_Kebugaran.csv'): void {
  const headers = [
    'ID Peserta',
    'Nama Lengkap',
    'Jenis Kelamin',
    'Tanggal Lahir',
    'Umur',
    'Komunitas',
    'No HP',
    'Alamat',
    'Status Tes Terakhir',
    'Skor Kebugaran Terakhir',
    'Kategori Kebugaran Terakhir',
    'Tanggal Registrasi',
  ];

  const rows = pesertaList.map((p) => {
    const record = records.find((r) => r.peserta.id === p.id);
    return [
      escapeCsv(p.id),
      escapeCsv(p.nama),
      escapeCsv(p.jenisKelamin),
      escapeCsv(p.tanggalLahir),
      escapeCsv(p.umur),
      escapeCsv(p.komunitas),
      escapeCsv(p.noHp),
      escapeCsv(p.alamat),
      escapeCsv(record ? 'Sudah Diuji' : 'Belum Diuji'),
      escapeCsv(record ? record.evaluation.totalSkor : '-'),
      escapeCsv(record ? record.evaluation.kategoriAkhir : '-'),
      escapeCsv(p.createdAt),
    ];
  });

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  downloadCSV(filename, csvContent);
}
