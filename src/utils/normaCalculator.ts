import {
  ActivityDuration,
  ActivityFrequency,
  ActivityIntensity,
  ActivityType,
  AktivitasFisik,
  CategoryOverall,
  DataFunctionalFitness,
  DataIMT,
  DataTKJI,
  EvaluationResult,
  Gender
} from '../types';

// 1. NORMA AKTIVITAS FISIK
export function calculateAktivitasFisik(
  jenisUtama: ActivityType,
  frekuensi: ActivityFrequency,
  durasi: ActivityDuration,
  intensitas: ActivityIntensity,
  aktivitasLain: string[] = []
): AktivitasFisik {
  // Jenis
  const jenisScores: Record<ActivityType, number> = {
    'Tidak berolahraga': 0,
    'Jalan kaki': 15,
    'Senam': 20,
    'Bersepeda': 22,
    'Jogging/Lari': 25,
    'Renang': 25,
    'Olahraga permainan (futsal, basket, badminton, dll.)': 25,
  };
  const skorJenis = jenisScores[jenisUtama] ?? 15;

  // Frekuensi
  const frekuensiScores: Record<ActivityFrequency, number> = {
    '<1 kali/minggu': 5,
    '1–2 kali/minggu': 10,
    '3–4 kali/minggu': 18,
    '≥5 kali/minggu': 25,
  };
  const skorFrekuensi = frekuensiScores[frekuensi] ?? 10;

  // Durasi
  const durasiScores: Record<ActivityDuration, number> = {
    '<20 menit': 5,
    '20–39 menit': 10,
    '40–59 menit': 18,
    '≥60 menit': 25,
  };
  const skorDurasi = durasiScores[durasi] ?? 10;

  // Intensitas
  const intensitasScores: Record<ActivityIntensity, number> = {
    'Ringan': 10,
    'Sedang': 18,
    'Berat': 25,
  };
  const skorIntensitas = intensitasScores[intensitas] ?? 18;

  const totalSkor = Math.min(100, Math.max(0, skorJenis + skorFrekuensi + skorDurasi + skorIntensitas));

  let kategoriAktivitas: AktivitasFisik['kategoriAktivitas'] = 'Sedang';
  if (totalSkor < 50) kategoriAktivitas = 'Sangat Rendah';
  else if (totalSkor <= 64) kategoriAktivitas = 'Rendah';
  else if (totalSkor <= 79) kategoriAktivitas = 'Sedang';
  else if (totalSkor <= 89) kategoriAktivitas = 'Tinggi';
  else kategoriAktivitas = 'Sangat Tinggi';

  return {
    jenisUtama,
    frekuensi,
    durasi,
    intensitas,
    aktivitasLain,
    skorAktivitas: totalSkor,
    kategoriAktivitas,
  };
}

// 2. NORMA IMT
export function calculateIMT(tinggiBadanCm: number, beratBadanKg: number): DataIMT {
  if (!tinggiBadanCm || tinggiBadanCm <= 0 || !beratBadanKg || beratBadanKg <= 0) {
    return {
      tinggiBadan: tinggiBadanCm || 0,
      beratBadan: beratBadanKg || 0,
      nilaiIMT: 0,
      kategoriIMT: 'Normal',
      skorIMT: 0,
      statusGizi: 'Silakan isi tinggi dan berat badan untuk menghitung IMT.',
    };
  }

  const tinggiM = tinggiBadanCm / 100;
  const nilaiIMT = Number((beratBadanKg / (tinggiM * tinggiM)).toFixed(1));

  let kategoriIMT: DataIMT['kategoriIMT'] = 'Normal';
  let skorIMT = 100;
  let statusGizi = 'Status gizi normal, risiko penyakit metabolik relatif rendah.';

  if (nilaiIMT < 18.5) {
    kategoriIMT = 'Kurus';
    skorIMT = 75;
    statusGizi = 'Berat badan kurang, berisiko mengalami kekurangan energi dan zat gizi.';
  } else if (nilaiIMT <= 24.9) {
    kategoriIMT = 'Normal';
    skorIMT = 100;
    statusGizi = 'Status gizi normal, risiko penyakit metabolik relatif rendah.';
  } else if (nilaiIMT <= 29.9) {
    kategoriIMT = 'Overweight';
    skorIMT = 85;
    statusGizi = 'Kelebihan berat badan tingkat ringan, mulai ada peningkatan risiko penyakit tidak menular.';
  } else if (nilaiIMT <= 34.9) {
    kategoriIMT = 'Obesitas Class I';
    skorIMT = 70;
    statusGizi = 'Obesitas Ringan (Class I), disarankan intervensi pola makan & aktivitas fisik.';
  } else if (nilaiIMT <= 39.9) {
    kategoriIMT = 'Obesitas Class II';
    skorIMT = 55;
    statusGizi = 'Obesitas Sedang (Class II), memerlukan pengawasan kesehatan dan latihan teratur.';
  } else {
    kategoriIMT = 'Obesitas Class III';
    skorIMT = 40;
    statusGizi = 'Obesitas Berat (Class III), memerlukan intervensi gaya hidup intensif & konsultasi spesialis.';
  }

  return {
    tinggiBadan: tinggiBadanCm,
    beratBadan: beratBadanKg,
    nilaiIMT,
    kategoriIMT,
    skorIMT,
    statusGizi,
  };
}

// 3. NORMA TES KEBUGARAN JASMANI (TKJI)
export function calculateTKJI(
  jenisKelamin: Gender,
  cooperDistanceMeter: number,
  pushUpRepetisi: number,
  verticalJumpCm: number,
  lari60m: number = 8.2,
  sitUpRepetisi: number = 32
): DataTKJI {
  const isPutra = jenisKelamin === 'Laki-laki';

  // Cooper Test (40% weight)
  let skorCooper = 70;
  if (isPutra) {
    if (cooperDistanceMeter > 2800) skorCooper = 100;
    else if (cooperDistanceMeter >= 2400) skorCooper = 85;
    else if (cooperDistanceMeter >= 2200) skorCooper = 70;
    else if (cooperDistanceMeter >= 1600) skorCooper = 55;
    else skorCooper = 40;
  } else {
    if (cooperDistanceMeter > 2700) skorCooper = 100;
    else if (cooperDistanceMeter >= 2200) skorCooper = 85;
    else if (cooperDistanceMeter >= 1800) skorCooper = 70;
    else if (cooperDistanceMeter >= 1500) skorCooper = 55;
    else skorCooper = 40;
  }

  // Push-Up (30% weight)
  let skorPushUp = 70;
  if (isPutra) {
    if (pushUpRepetisi >= 62) skorPushUp = 100;
    else if (pushUpRepetisi >= 44) skorPushUp = 85;
    else if (pushUpRepetisi >= 33) skorPushUp = 70;
    else if (pushUpRepetisi >= 24) skorPushUp = 55;
    else if (pushUpRepetisi >= 14) skorPushUp = 48;
    else skorPushUp = 40;
  } else {
    if (pushUpRepetisi >= 54) skorPushUp = 100;
    else if (pushUpRepetisi >= 35) skorPushUp = 85;
    else if (pushUpRepetisi >= 23) skorPushUp = 70;
    else if (pushUpRepetisi >= 15) skorPushUp = 55;
    else if (pushUpRepetisi >= 11) skorPushUp = 48;
    else skorPushUp = 40;
  }

  // Vertical Jump (30% weight)
  let skorVerticalJump = 70;
  if (isPutra) {
    if (verticalJumpCm > 65) skorVerticalJump = 100;
    else if (verticalJumpCm >= 56) skorVerticalJump = 85;
    else if (verticalJumpCm >= 46) skorVerticalJump = 70;
    else if (verticalJumpCm >= 36) skorVerticalJump = 55;
    else skorVerticalJump = 40;
  } else {
    if (verticalJumpCm > 50) skorVerticalJump = 100;
    else if (verticalJumpCm >= 41) skorVerticalJump = 85;
    else if (verticalJumpCm >= 31) skorVerticalJump = 70;
    else if (verticalJumpCm >= 21) skorVerticalJump = 55;
    else skorVerticalJump = 40;
  }

  // Formula: Nilai Akhir TKJI = (Cooper x 40%) + (Push-Up x 30%) + (Vertical Jump x 30%)
  const totalSkorTKJI = Number(
    (skorCooper * 0.4 + skorPushUp * 0.3 + skorVerticalJump * 0.3).toFixed(1)
  );

  let kategoriTKJI: DataTKJI['kategoriTKJI'] = 'Sedang';
  if (totalSkorTKJI >= 85) kategoriTKJI = 'Sangat Baik';
  else if (totalSkorTKJI >= 70) kategoriTKJI = 'Baik';
  else if (totalSkorTKJI >= 55) kategoriTKJI = 'Sedang';
  else if (totalSkorTKJI >= 40) kategoriTKJI = 'Kurang';
  else kategoriTKJI = 'Sangat Kurang';

  return {
    lari60m,
    pushUpRepetisi,
    sitUpRepetisi,
    verticalJumpCm,
    cooperDistanceMeter,
    skorCooper,
    skorPushUp,
    skorVerticalJump,
    totalSkorTKJI,
    kategoriTKJI,
  };
}

// 4. NORMA FUNCTIONAL FITNESS
export function calculateFunctionalFitness(
  age: number,
  sitToStandRepetisi: number,
  plankDetik: number,
  balanceDetik: number,
  sitAndReachCm: number,
  stepTestRecoveryPulse: number,
  denyutNadiAwal: number,
  denyutNadiAkhir: number,
  jenisKelamin: 'Laki-laki' | 'Perempuan' = 'Laki-laki'
): DataFunctionalFitness {
  const isMale = jenisKelamin === 'Laki-laki';
  const isTeenGroup = age <= 25; // 17-25 vs 26-35

  const deltaHR = Math.abs(denyutNadiAwal - denyutNadiAkhir);

  // 1. Sit to Stand (repetisi)
  let skorSitToStand = 0;
  if (sitToStandRepetisi > 0) {
    if (isMale && isTeenGroup) {
      if (sitToStandRepetisi >= 38) skorSitToStand = 100;
      else if (sitToStandRepetisi >= 34) skorSitToStand = 80;
      else if (sitToStandRepetisi >= 30) skorSitToStand = 60;
      else if (sitToStandRepetisi >= 26) skorSitToStand = 40;
      else skorSitToStand = 20;
    } else if (!isMale && isTeenGroup) {
      if (sitToStandRepetisi >= 36) skorSitToStand = 100;
      else if (sitToStandRepetisi >= 32) skorSitToStand = 80;
      else if (sitToStandRepetisi >= 28) skorSitToStand = 60;
      else if (sitToStandRepetisi >= 24) skorSitToStand = 40;
      else skorSitToStand = 20;
    } else if (isMale && !isTeenGroup) {
      if (sitToStandRepetisi >= 36) skorSitToStand = 100;
      else if (sitToStandRepetisi >= 32) skorSitToStand = 80;
      else if (sitToStandRepetisi >= 28) skorSitToStand = 60;
      else if (sitToStandRepetisi >= 24) skorSitToStand = 40;
      else skorSitToStand = 20;
    } else {
      if (sitToStandRepetisi >= 34) skorSitToStand = 100;
      else if (sitToStandRepetisi >= 30) skorSitToStand = 80;
      else if (sitToStandRepetisi >= 26) skorSitToStand = 60;
      else if (sitToStandRepetisi >= 22) skorSitToStand = 40;
      else skorSitToStand = 20;
    }
  }

  // 2. Plank (detik)
  let skorPlank = 0;
  if (plankDetik > 0) {
    if (isMale && isTeenGroup) {
      if (plankDetik >= 180) skorPlank = 100;
      else if (plankDetik >= 120) skorPlank = 80;
      else if (plankDetik >= 60) skorPlank = 60;
      else if (plankDetik >= 30) skorPlank = 40;
      else skorPlank = 20;
    } else if (!isMale && isTeenGroup) {
      if (plankDetik >= 150) skorPlank = 100;
      else if (plankDetik >= 100) skorPlank = 80;
      else if (plankDetik >= 60) skorPlank = 60;
      else if (plankDetik >= 30) skorPlank = 40;
      else skorPlank = 20;
    } else if (isMale && !isTeenGroup) {
      if (plankDetik >= 160) skorPlank = 100;
      else if (plankDetik >= 110) skorPlank = 80;
      else if (plankDetik >= 60) skorPlank = 60;
      else if (plankDetik >= 30) skorPlank = 40;
      else skorPlank = 20;
    } else {
      if (plankDetik >= 140) skorPlank = 100;
      else if (plankDetik >= 90) skorPlank = 80;
      else if (plankDetik >= 50) skorPlank = 60;
      else if (plankDetik >= 20) skorPlank = 40;
      else skorPlank = 20;
    }
  }

  // 3. Balance 1 Kaki (detik)
  let skorBalance = 0;
  if (balanceDetik > 0) {
    if (isMale && isTeenGroup) {
      if (balanceDetik >= 60) skorBalance = 100;
      else if (balanceDetik >= 45) skorBalance = 80;
      else if (balanceDetik >= 30) skorBalance = 60;
      else if (balanceDetik >= 15) skorBalance = 40;
      else skorBalance = 20;
    } else if (!isMale && isTeenGroup) {
      if (balanceDetik >= 60) skorBalance = 100;
      else if (balanceDetik >= 45) skorBalance = 80;
      else if (balanceDetik >= 30) skorBalance = 60;
      else if (balanceDetik >= 15) skorBalance = 40;
      else skorBalance = 20;
    } else if (isMale && !isTeenGroup) {
      if (balanceDetik >= 55) skorBalance = 100;
      else if (balanceDetik >= 40) skorBalance = 80;
      else if (balanceDetik >= 25) skorBalance = 60;
      else if (balanceDetik >= 10) skorBalance = 40;
      else skorBalance = 20;
    } else {
      if (balanceDetik >= 55) skorBalance = 100;
      else if (balanceDetik >= 40) skorBalance = 80;
      else if (balanceDetik >= 25) skorBalance = 60;
      else if (balanceDetik >= 10) skorBalance = 40;
      else skorBalance = 20;
    }
  }

  // 4. Sit and Reach (cm)
  let skorSitAndReach = 0;
  if (sitAndReachCm !== 0) {
    if (isMale && isTeenGroup) {
      if (sitAndReachCm >= 35) skorSitAndReach = 100;
      else if (sitAndReachCm >= 28) skorSitAndReach = 80;
      else if (sitAndReachCm >= 20) skorSitAndReach = 60;
      else if (sitAndReachCm >= 12) skorSitAndReach = 40;
      else skorSitAndReach = 20;
    } else if (!isMale && isTeenGroup) {
      if (sitAndReachCm >= 40) skorSitAndReach = 100;
      else if (sitAndReachCm >= 33) skorSitAndReach = 80;
      else if (sitAndReachCm >= 25) skorSitAndReach = 60;
      else if (sitAndReachCm >= 15) skorSitAndReach = 40;
      else skorSitAndReach = 20;
    } else if (isMale && !isTeenGroup) {
      if (sitAndReachCm >= 32) skorSitAndReach = 100;
      else if (sitAndReachCm >= 25) skorSitAndReach = 80;
      else if (sitAndReachCm >= 17) skorSitAndReach = 60;
      else if (sitAndReachCm >= 10) skorSitAndReach = 40;
      else skorSitAndReach = 20;
    } else {
      if (sitAndReachCm >= 38) skorSitAndReach = 100;
      else if (sitAndReachCm >= 30) skorSitAndReach = 80;
      else if (sitAndReachCm >= 22) skorSitAndReach = 60;
      else if (sitAndReachCm >= 12) skorSitAndReach = 40;
      else skorSitAndReach = 20;
    }
  }

  // 5. Step Test Recovery (bpm) - lower is better
  let skorStepTest = 0;
  if (stepTestRecoveryPulse > 0) {
    if (isMale && isTeenGroup) {
      if (stepTestRecoveryPulse <= 80) skorStepTest = 100;
      else if (stepTestRecoveryPulse <= 90) skorStepTest = 80;
      else if (stepTestRecoveryPulse <= 100) skorStepTest = 60;
      else if (stepTestRecoveryPulse <= 110) skorStepTest = 40;
      else skorStepTest = 20;
    } else if (!isMale && isTeenGroup) {
      if (stepTestRecoveryPulse <= 82) skorStepTest = 100;
      else if (stepTestRecoveryPulse <= 92) skorStepTest = 80;
      else if (stepTestRecoveryPulse <= 102) skorStepTest = 60;
      else if (stepTestRecoveryPulse <= 112) skorStepTest = 40;
      else skorStepTest = 20;
    } else if (isMale && !isTeenGroup) {
      if (stepTestRecoveryPulse <= 82) skorStepTest = 100;
      else if (stepTestRecoveryPulse <= 92) skorStepTest = 80;
      else if (stepTestRecoveryPulse <= 102) skorStepTest = 60;
      else if (stepTestRecoveryPulse <= 112) skorStepTest = 40;
      else skorStepTest = 20;
    } else {
      if (stepTestRecoveryPulse <= 84) skorStepTest = 100;
      else if (stepTestRecoveryPulse <= 94) skorStepTest = 80;
      else if (stepTestRecoveryPulse <= 104) skorStepTest = 60;
      else if (stepTestRecoveryPulse <= 114) skorStepTest = 40;
      else skorStepTest = 20;
    }
  }

  // 6. Recovery HR (penurunan 1 menit) (bpm) - higher drop is better
  let skorDeltaHR = 0;
  if (denyutNadiAwal > 0 && denyutNadiAkhir > 0) {
    if (isMale && isTeenGroup) {
      if (deltaHR >= 40) skorDeltaHR = 100;
      else if (deltaHR >= 30) skorDeltaHR = 80;
      else if (deltaHR >= 20) skorDeltaHR = 60;
      else if (deltaHR >= 10) skorDeltaHR = 40;
      else skorDeltaHR = 20;
    } else if (!isMale && isTeenGroup) {
      if (deltaHR >= 38) skorDeltaHR = 100;
      else if (deltaHR >= 28) skorDeltaHR = 80;
      else if (deltaHR >= 18) skorDeltaHR = 60;
      else if (deltaHR >= 8) skorDeltaHR = 40;
      else skorDeltaHR = 20;
    } else if (isMale && !isTeenGroup) {
      if (deltaHR >= 38) skorDeltaHR = 100;
      else if (deltaHR >= 28) skorDeltaHR = 80;
      else if (deltaHR >= 18) skorDeltaHR = 60;
      else if (deltaHR >= 8) skorDeltaHR = 40;
      else skorDeltaHR = 20;
    } else {
      if (deltaHR >= 35) skorDeltaHR = 100;
      else if (deltaHR >= 25) skorDeltaHR = 80;
      else if (deltaHR >= 15) skorDeltaHR = 60;
      else if (deltaHR >= 5) skorDeltaHR = 40;
      else skorDeltaHR = 20;
    }
  }

  const sum = skorSitToStand + skorPlank + skorBalance + skorSitAndReach + skorStepTest + skorDeltaHR;
  const totalSkorFunctional = Number((sum / 6).toFixed(1));

  let kategoriFunctional: DataFunctionalFitness['kategoriFunctional'] = 'Sedang';
  if (totalSkorFunctional >= 85) kategoriFunctional = 'Sangat Baik';
  else if (totalSkorFunctional >= 70) kategoriFunctional = 'Baik';
  else if (totalSkorFunctional >= 55) kategoriFunctional = 'Sedang';
  else if (totalSkorFunctional >= 40) kategoriFunctional = 'Kurang';
  else kategoriFunctional = 'Sangat Kurang';

  return {
    sitToStandRepetisi,
    plankDetik,
    balanceDetik,
    sitAndReachCm,
    stepTestRecoveryPulse,
    denyutNadiAwal,
    denyutNadiAkhir,
    deltaHR,
    skorSitToStand,
    skorPlank,
    skorBalance,
    skorSitAndReach,
    skorStepTest,
    skorDeltaHR,
    totalSkorFunctional,
    kategoriFunctional,
  };
}

// 5. EVALUASI TOTAL & NORMA AKHIR SRIWIJAYA SPORT TEC
export function evaluateSriwijayaSportTec(
  aktivitas: AktivitasFisik,
  imt: DataIMT,
  tkji: DataTKJI,
  functional: DataFunctionalFitness
): EvaluationResult {
  const skorAktivitas = aktivitas.skorAktivitas;
  const skorIMT = imt.skorIMT;
  const skorTKJI = tkji.totalSkorTKJI;
  const skorFunctional = functional.totalSkorFunctional;

  // Rumus Norma Akhir Document Page 10:
  // Total Skor = (Hasil aktivitas fisik x 15%) + (Hasil IMT x 15%) + (Hasil TKJI x 35%) + (Hasil Functional Fitness x 35%)
  const rawTotal = (skorAktivitas * 0.15) + (skorIMT * 0.15) + (skorTKJI * 0.35) + (skorFunctional * 0.35);
  const totalSkor = Number(rawTotal.toFixed(1));

  let kategoriAkhir: CategoryOverall = 'Cukup';
  if (totalSkor < 50) kategoriAkhir = 'Sangat Kurang';
  else if (totalSkor <= 64) kategoriAkhir = 'Kurang';
  else if (totalSkor <= 79) kategoriAkhir = 'Cukup';
  else if (totalSkor <= 89) kategoriAkhir = 'Baik';
  else kategoriAkhir = 'Sangat Baik';

  // Recommendations
  let dayaTahan = 'Tingkatkan latihan aerobik (jogging, berenang, bersepeda) 3–4x/minggu selama 30–60 menit.';
  let kekuatan = 'Lakukan latihan kekuatan otot 2–3x/minggu (push-up, squat, plank, lunge).';
  let fleksibilitas = 'Lakukan stretching atau yoga minimal 2x/minggu untuk meningkatkan kelenturan sendi.';
  let aktivitasHarian = 'Jaga aktivitas harian aktif minimal 150 menit per minggu.';

  if (kategoriAkhir === 'Sangat Baik') {
    dayaTahan = 'Pertahankan intensitas latihan aerobik 4–5x/minggu 45–60 menit untuk menjaga kapasitas paru dan jantung.';
    kekuatan = 'Pertahankan latihan kekuatan beban tubuh/gym 3x/minggu untuk pertahanan massa otot optimal.';
    fleksibilitas = 'Rutin fleksibilitas & mobilitas sendi pasca latihan 10–15 menit.';
    aktivitasHarian = 'Pertahankan gaya hidup aktif tinggi dan kecukupan hidrasi harian.';
  } else if (kategoriAkhir === 'Baik') {
    dayaTahan = 'Tingkatkan lari aerobik atau olahraga permainan 3–4x/minggu 30–60 menit.';
    kekuatan = 'Latihan kekuatan otot 2–3x/minggu (push-up, sit-up, plank).';
    fleksibilitas = 'Lakukan stretching atau yoga minimal 2x/minggu.';
    aktivitasHarian = 'Jaga aktivitas harian minimal 150 menit per minggu.';
  } else if (kategoriAkhir === 'Cukup') {
    dayaTahan = 'Mulailah jalan cepat atau jogging secara bertahap 3x/minggu 30 menit.';
    kekuatan = 'Lakukan variasi push-up ringan dan sit-up 2x/minggu.';
    fleksibilitas = 'Stretching rutin sebelum dan sesudah aktivitas fisik.';
    aktivitasHarian = 'Upayakan minimal 8.000 langkah kaki setiap hari.';
  } else {
    dayaTahan = 'Awali dengan jalan kaki santai 20–30 menit 3x/minggu secara teratur.';
    kekuatan = 'Lakukan peregangan dasar dan angkat beban tubuh ringan (wall push-up, chair sit-to-stand).';
    fleksibilitas = 'Peregangan lembut 10 menit setiap pagi.';
    aktivitasHarian = 'Hindari perilaku sedenter, perbanyak bergerak setiap 1 jam sekali.';
  }

  return {
    skorAktivitas,
    skorIMT,
    skorTKJI,
    skorFunctional,
    totalSkor,
    kategoriAkhir,
    rekomendasi: {
      dayaTahan,
      kekuatan,
      fleksibilitas,
      aktivitasHarian,
    },
    tanggalTes: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}
