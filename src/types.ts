export type Role = 'admin' | 'instruktur' | 'petugas' | 'pelatih' | 'pengelola';

export interface UserProfile {
  username: string;
  name: string;
  role: Role;
  institution: string;
  isLoggedIn: boolean;
}

export type Gender = 'Laki-laki' | 'Perempuan';

export interface Peserta {
  id: string;
  nama: string;
  jenisKelamin: Gender;
  tanggalLahir: string;
  umur: number;
  komunitas: string;
  noHp: string;
  alamat: string;
  fotoUrl?: string;
  createdAt: string;
}

export type ActivityType = 
  | 'Tidak berolahraga'
  | 'Jalan kaki'
  | 'Senam'
  | 'Bersepeda'
  | 'Jogging/Lari'
  | 'Renang'
  | 'Olahraga permainan (futsal, basket, badminton, dll.)';

export type ActivityFrequency = '<1 kali/minggu' | '1–2 kali/minggu' | '3–4 kali/minggu' | '≥5 kali/minggu';
export type ActivityDuration = '<20 menit' | '20–39 menit' | '40–59 menit' | '≥60 menit';
export type ActivityIntensity = 'Ringan' | 'Sedang' | 'Berat';

export interface AktivitasFisik {
  jenisUtama: ActivityType;
  frekuensi: ActivityFrequency;
  durasi: ActivityDuration;
  intensitas: ActivityIntensity;
  aktivitasLain: string[];
  skorAktivitas: number; // 0 - 100
  kategoriAktivitas: 'Sangat Rendah' | 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';
}

export interface DataIMT {
  tinggiBadan: number; // cm
  beratBadan: number; // kg
  nilaiIMT: number;
  kategoriIMT: 'Kurus' | 'Normal' | 'Overweight' | 'Obesitas Class I' | 'Obesitas Class II' | 'Obesitas Class III';
  skorIMT: number; // 0 - 100
  statusGizi: string;
}

export interface DataTKJI {
  lari60m?: number; // detik
  pushUpRepetisi: number; // repetisi
  sitUpRepetisi?: number; // repetisi
  verticalJumpCm: number; // cm
  cooperDistanceMeter: number; // meter (Lari 12m)
  
  // Scoring
  skorCooper: number;
  skorPushUp: number;
  skorVerticalJump: number;
  totalSkorTKJI: number; // Weighted: 40% Cooper + 30% PushUp + 30% VJump
  kategoriTKJI: 'Sangat Kurang' | 'Kurang' | 'Sedang' | 'Baik' | 'Sangat Baik';
}

export interface DataFunctionalFitness {
  sitToStandRepetisi: number; // 30s count
  plankDetik: number; // seconds
  balanceDetik: number; // 1 leg stand seconds
  sitAndReachCm: number; // cm
  stepTestRecoveryPulse: number; // bpm
  denyutNadiAwal: number; // bpm
  denyutNadiAkhir: number; // bpm
  deltaHR: number; // Initial - Recovery

  // Calculated Scores
  skorSitToStand: number;
  skorPlank: number;
  skorBalance: number;
  skorSitAndReach: number;
  skorStepTest: number;
  skorDeltaHR: number;
  totalSkorFunctional: number; // average
  kategoriFunctional: 'Sangat Kurang' | 'Kurang' | 'Sedang' | 'Baik' | 'Sangat Baik';
}

export type CategoryOverall = 'Sangat Kurang' | 'Kurang' | 'Cukup' | 'Baik' | 'Sangat Baik';

export interface EvaluationResult {
  skorAktivitas: number; // 15%
  skorIMT: number; // 15%
  skorTKJI: number; // 35%
  skorFunctional: number; // 35%
  totalSkor: number; // 0 - 100
  kategoriAkhir: CategoryOverall;
  rekomendasi: {
    dayaTahan: string;
    kekuatan: string;
    fleksibilitas: string;
    aktivitasHarian: string;
  };
  tanggalTes: string;
}

export interface AssessmentRecord {
  id: string;
  peserta: Peserta;
  aktivitas: AktivitasFisik;
  imt: DataIMT;
  tkji: DataTKJI;
  functional: DataFunctionalFitness;
  evaluation: EvaluationResult;
  tanggal: string;
}
