import { AssessmentRecord, Peserta } from '../types';
import {
  calculateAktivitasFisik,
  calculateFunctionalFitness,
  calculateIMT,
  calculateTKJI,
  evaluateSriwijayaSportTec,
} from '../utils/normaCalculator';

export const INITIAL_PESERTA: Peserta[] = [
  {
    id: 'P001',
    nama: 'Andi Pratama',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1996-05-28',
    umur: 28,
    komunitas: 'Lari / Jogging',
    noHp: '0812-3456-7890',
    alamat: 'Kec. Ilir Timur, Kota Palembang',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-02-10',
  },
  {
    id: 'P002',
    nama: 'Siti Rahmawati',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '1998-11-14',
    umur: 26,
    komunitas: 'Bersepeda',
    noHp: '0813-9876-5432',
    alamat: 'Kec. Seberang Ulu, Kota Palembang',
    fotoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-03-01',
  },
  {
    id: 'P003',
    nama: 'Budi Santoso',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '2002-03-10',
    umur: 24,
    komunitas: 'Senam',
    noHp: '0821-1122-3344',
    alamat: 'Kec. Sako, Kota Palembang',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-04-12',
  },
  {
    id: 'P004',
    nama: 'Dina Malika',
    jenisKelamin: 'Perempuan',
    tanggalLahir: '2001-08-22',
    umur: 23,
    komunitas: 'Lari / Jogging',
    noHp: '0852-6677-8899',
    alamat: 'Kec. Alang-Alang Lebar, Palembang',
    fotoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-06-01',
  },
  {
    id: 'P005',
    nama: 'Fajar Nugraha',
    jenisKelamin: 'Laki-laki',
    tanggalLahir: '1995-02-18',
    umur: 31,
    komunitas: 'Bersepeda',
    noHp: '0878-4455-6677',
    alamat: 'Kec. Bukit Kecil, Palembang',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
    createdAt: '2026-06-15',
  }
];

export function createSampleAssessmentRecord(peserta: Peserta, testDate = '10 Mei 2026', overrideScore?: number): AssessmentRecord {
  const isAndi = peserta.nama === 'Andi Pratama';
  const isSiti = peserta.nama === 'Siti Rahmawati';

  const aktivitas = calculateAktivitasFisik(
    isAndi ? 'Jogging/Lari' : 'Bersepeda',
    '3–4 kali/minggu',
    '≥60 menit',
    'Sedang',
    ['Jalan Kaki', 'Senam']
  );

  const imt = calculateIMT(
    isAndi ? 170 : 165,
    isAndi ? 68 : 58
  );

  const tkji = calculateTKJI(
    peserta.jenisKelamin,
    isAndi ? 2500 : 2300, // Cooper
    isAndi ? 48 : 38,     // Pushup
    isAndi ? 58 : 45,     // Vertical Jump
    8.2,
    32
  );

  const functional = calculateFunctionalFitness(
    peserta.umur,
    isAndi ? 27 : 25,  // Sit to Stand
    isAndi ? 130 : 110, // Plank
    isAndi ? 50 : 45,  // Balance
    isAndi ? 28 : 26,  // Sit and Reach
    isAndi ? 92 : 90,  // Step Test Recovery Pulse
    88,                // Initial pulse
    110                // Final pulse
  );

  const evaluation = evaluateSriwijayaSportTec(aktivitas, imt, tkji, functional);
  if (overrideScore) {
    evaluation.totalSkor = overrideScore;
  }

  return {
    id: `REC-${peserta.id}-${testDate.replace(/\s+/g, '-')}`,
    peserta,
    aktivitas,
    imt,
    tkji,
    functional,
    evaluation,
    tanggal: testDate,
  };
}

// Initial records with varying dates to trigger periodic re-test reminders (e.g. >90 days)
export const INITIAL_ASSESSMENTS: AssessmentRecord[] = [
  createSampleAssessmentRecord(INITIAL_PESERTA[0], '12 Februari 2026', 74), // Andi Pratama (Overdue >90 days)
  createSampleAssessmentRecord(INITIAL_PESERTA[1], '15 Maret 2026', 68),    // Siti Rahmawati (Overdue >90 days)
  createSampleAssessmentRecord(INITIAL_PESERTA[2], '20 April 2026', 81),    // Budi Santoso (Due soon)
  createSampleAssessmentRecord(INITIAL_PESERTA[3], '01 Juni 2026', 86),     // Dina Malika (Recent)
  createSampleAssessmentRecord(INITIAL_PESERTA[4], '15 Juni 2026', 82),     // Fajar Nugraha (Recent)
  // Historical previous tests for Andi and Siti to demonstrate Longitudinal Recharts trends!
  createSampleAssessmentRecord(INITIAL_PESERTA[0], '10 Januari 2026', 68),
  createSampleAssessmentRecord(INITIAL_PESERTA[1], '05 Januari 2026', 62),
];

export const KOMUNITAS_LIST = [
  'Bersepeda',
  'Lari / Jogging',
  'Badminton',
  'Senam',
  'Renang',
  'Futsal / Sepakbola',
  'Fitnes / Gym',
  'Lainnya',
];
