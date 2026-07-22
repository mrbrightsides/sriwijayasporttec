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

export function getRekomendasiAktivitasFisik(kategori: string): string {
  switch (kategori) {
    case 'Sangat Tinggi':
      return 'Pertahankan pola aktivitas fisik saat ini, sertakan latihan pemulihan (recovery), peregangan, dan istirahat yang cukup untuk mencegah overtraining.';
    case 'Tinggi':
      return 'Pertahankan frekuensi latihan dan variasikan jenis aktivitas fisik agar seluruh komponen kebugaran tetap berkembang secara seimbang.';
    case 'Sedang':
      return 'Tingkatkan durasi atau frekuensi latihan hingga memenuhi rekomendasi WHO, yaitu minimal 150–300 menit aktivitas fisik intensitas sedang setiap minggu.';
    case 'Rendah':
      return 'Tingkatkan aktivitas fisik secara bertahap melalui jalan cepat, jogging ringan, bersepeda, atau senam sebanyak 3–5 kali per minggu dengan durasi 30–60 menit per sesi.';
    case 'Sangat Rendah':
    default:
      return 'Mulailah aktivitas fisik ringan seperti berjalan kaki 15–20 menit setiap hari, kemudian tingkatkan durasi dan intensitas secara bertahap sesuai kemampuan fisik.';
  }
}

export function getRekomendasiIMT(kategori: string): string {
  switch (kategori) {
    case 'Kurus':
    case 'Underweight':
    case 'Underweight (Kekurangan Berat Badan)':
      return 'Tingkatkan asupan energi dan protein berkualitas (1,2–1,6 g/kgBB/hari), lakukan latihan kekuatan (resistance training) 2–3 kali/minggu dengan intensitas 60–70% HRmax atau 60–70% 1RM, 2–3 set × 8–12 repetisi untuk setiap kelompok otot utama (misalnya squat, push-up, row, shoulder press). Tambahkan aktivitas aerobik intensitas sedang selama 150 menit/minggu (misalnya jalan cepat atau bersepeda ringan 30 menit, 5 hari/minggu) dan konsultasikan dengan ahli gizi apabila diperlukan.';
    case 'Normal':
      return 'Pertahankan pola makan seimbang dan gaya hidup aktif. Lakukan aktivitas aerobik intensitas sedang 150–300 menit/minggu atau 75–150 menit/minggu intensitas tinggi, dikombinasikan dengan latihan kekuatan minimal 2 kali/minggu pada seluruh kelompok otot utama (2–4 set × 8–12 repetisi, intensitas 60–80% 1RM). Tambahkan latihan fleksibilitas dan keseimbangan 2–3 kali/minggu untuk mempertahankan kebugaran secara menyeluruh.';
    case 'Overweight':
    case 'Overweight (Kelebihan Berat Badan Tingkat Ringan)':
      return 'Tingkatkan aktivitas aerobik menjadi 250–300 menit/minggu dengan intensitas 60–75% HRmax(misalnya jalan cepat, jogging, bersepeda atau berenang selama 45–60 menit, 5 hari/minggu). Lakukan latihan kekuatan 3 kali/minggu (2–3 set × 10–15 repetisi, intensitas 60–70% 1RM) untuk mempertahankan massa otot. Kurangi asupan kalori serta konsumsi makanan tinggi gula, garam, dan lemak jenuh.';
    case 'Obesitas Class I':
    case 'Obesity Class I':
    case 'Obesity Class I (Obesitas Ringan)':
      return 'Mulailah dengan aktivitas aerobik berdampak rendah (low impact) seperti jalan cepat, sepeda statis, atau berenang dengan intensitas 50–65% HRmax, target 300 menit/minggu secara bertahap. Tambahkan latihan kekuatan 2–3 kali/minggu menggunakan beban ringan (2–3 set × 10–12 repetisi) seperti chair squat, wall push-up, dan resistance band. Lakukan pemanasan dan pendinginan masing-masing 5–10 menit serta evaluasi perkembangan setiap 4–6 minggu.';
    case 'Obesitas Class II':
    case 'Obesity Class II':
    case 'Obesity Class II (Obesitas Sedang)':
      return 'Fokus pada peningkatan aktivitas fisik secara bertahap melalui jalan kaki, sepeda statis, senam air, atau berenang dengan intensitas 40–60% HRmax, durasi 30–45 menit, 5–6 kali/minggu. Lakukan latihan kekuatan ringan 2 kali/minggu (2 set × 8–12 repetisi) menggunakan berat badan atau resistance band untuk meningkatkan kemampuan fungsional. Tingkatkan durasi latihan sekitar 5–10 menit setiap minggusesuai toleransi tubuh. Disarankan berkonsultasi dengan tenaga kesehatan sebelum memulai program latihan.';
    case 'Obesitas Class III':
    case 'Obesity Class III':
    case 'Obesity Class III (Obesitas Berat)':
    default:
      return 'Mulailah dengan aktivitas fisik ringan seperti jalan santai, latihan menggunakan kursi (chair exercise), latihan pernapasan, dan peregangan dengan intensitas 40–50% HRmax, durasi 20–30 menit, 5–7 kali/minggu. Tambahkan latihan kekuatan ringan (2 set × 8–10 repetisi) seperti chair stand, wall push-up, dan resistance band sesuai kemampuan. Program latihan dilakukan secara progresif dengan pengawasan tenaga kesehatan, terutama apabila terdapat penyakit penyerta (komorbiditas) seperti diabetes, hipertensi, atau penyakit jantung.';
  }
}

export function getRekomendasiPushUp(val: number | string): string {
  const kat = typeof val === 'number'
    ? (val >= 85 ? 'Sangat Baik' : val >= 70 ? 'Baik' : val >= 55 ? 'Cukup' : val >= 45 ? 'Kurang' : 'Sangat Kurang')
    : val;
  const str = String(kat).toLowerCase();

  if (str.includes('sangat baik')) {
    return 'Hasil menunjukkan bahwa daya tahan otot tubuh bagian atas, khususnya otot dada (pectoralis major), bahu (deltoid), lengan (triceps brachii), serta otot inti (core muscles), berada pada kategori sangat baik. Kondisi ini menunjukkan kemampuan otot untuk melakukan kontraksi berulang dalam waktu yang lama tanpa mengalami kelelahan yang berarti. Kemampuan tersebut sangat mendukung aktivitas sehari-hari, pekerjaan yang membutuhkan kekuatan tubuh bagian atas, maupun performa olahraga. Untuk mempertahankan kondisi ini, lakukan latihan kekuatan dan daya tahan otot 2–3 kali per minggu melalui push-up, incline push-up, decline push-up, bench press, dumbbell press, dips, dan plank dengan intensitas 70–85% 1RM, 3–4 set × 12–20 repetisi. Tambahkan circuit training atau upper body interval training sebanyak 1–2 kali per minggu untuk meningkatkan kapasitas otot. Pastikan melakukan pemanasan dan pendinginan selama 5–10 menit, serta evaluasi kemampuan setiap 8–12 minggu.';
  }
  if (str.includes('baik')) {
    return 'Hasil menunjukkan bahwa daya tahan otot tubuh bagian atas berada pada kategori baik. Otot telah mampu bekerja secara efektif dalam aktivitas berulang, namun masih memiliki peluang untuk ditingkatkan agar mencapai performa yang lebih optimal. Disarankan melakukan latihan kekuatan otot 2–3 kali per minggu menggunakan push-up, incline push-up, dumbbell chest press, shoulder press, triceps dip, dan plank dengan intensitas 60–75% 1RM, 3 set × 10–15 repetisi. Tambahkan latihan fungsional seperti medicine ball throw atau battle rope untuk meningkatkan daya tahan otot. Tingkatkan jumlah repetisi atau beban sekitar 5–10% setiap 2–3 minggu apabila latihan dapat dilakukan dengan teknik yang baik tanpa kelelahan berlebihan.';
  }
  if (str.includes('cukup') || str.includes('sedang')) {
    return 'Hasil menunjukkan bahwa daya tahan otot tubuh bagian atas berada pada kategori cukup sehingga kemampuan mempertahankan kontraksi otot secara berulang masih perlu ditingkatkan. Kondisi ini dapat menyebabkan kelelahan lebih cepat saat melakukan aktivitas yang melibatkan dorongan, angkatan, atau penopangan berat badan. Untuk meningkatkan kemampuan tersebut, lakukan modified push-up, incline push-up, wall push-up, dumbbell press ringan, resistance band chest press, dan plank sebanyak 3 kali per minggu dengan intensitas 50–60% 1RM, 2–3 set × 10–12 repetisi. Kombinasikan dengan latihan otot inti (core stability) dan latihan aerobik intensitas sedang selama 30–45 menit, 3–5 kali per minggu. Fokus pada teknik gerakan yang benar dan tingkatkan repetisi secara bertahap sesuai kemampuan.';
  }
  if (str.includes('kurang') && !str.includes('sangat')) {
    return 'Hasil menunjukkan bahwa daya tahan otot tubuh bagian atas masih berada di bawah rata-rata sehingga otot lebih cepat mengalami kelelahan saat melakukan aktivitas berulang. Kondisi ini dapat memengaruhi kemampuan melakukan aktivitas sehari-hari maupun aktivitas olahraga yang membutuhkan kekuatan lengan dan bahu. Disarankan memulai latihan secara bertahap menggunakan wall push-up, incline push-up, resistance band exercise, dumbbell ringan (1–3 kg), seated chest press, dan modified plank sebanyak 3 kali per minggu dengan intensitas 40–60% 1RM, 2 set × 8–10 repetisi. Tambahkan latihan mobilitas bahu dan peregangan otot dada setelah latihan. Tingkatkan jumlah repetisi sekitar 1–2 repetisi setiap minggu apabila latihan dapat dilakukan tanpa nyeri dan dengan teknik yang benar.';
  }
  return 'Hasil menunjukkan bahwa daya tahan otot tubuh bagian atas berada pada kategori sangat rendah sehingga kemampuan otot dalam mempertahankan kontraksi berulang masih sangat terbatas. Kondisi ini dapat menyebabkan cepat lelah saat mengangkat, mendorong, atau menopang berat badan, serta meningkatkan risiko cedera akibat kelemahan otot. Disarankan memulai latihan menggunakan wall push-up, standing push-up, resistance band chest press, shoulder flexion menggunakan resistance band, seated arm press, dan latihan penguatan otot inti ringan sebanyak 3 kali per minggu, dengan intensitas 40–50% 1RM, 2 set × 8 repetisi. Seluruh latihan dilakukan secara perlahan dengan memperhatikan teknik gerakan dan pola pernapasan yang benar. Lakukan pemanasan selama 5–10 menit sebelum latihan dan pendinginan setelah latihan. Apabila terdapat riwayat cedera bahu, siku, pergelangan tangan, atau penyakit muskuloskeletal lainnya, disarankan berkonsultasi dengan fisioterapis atau tenaga kesehatan sebelum meningkatkan intensitas latihan.';
}

export function getRekomendasiVerticalJump(val: number | string): string {
  const kat = typeof val === 'number'
    ? (val >= 85 ? 'Sangat Baik' : val >= 70 ? 'Baik' : val >= 55 ? 'Cukup' : val >= 45 ? 'Kurang' : 'Sangat Kurang')
    : val;
  const str = String(kat).toLowerCase();

  if (str.includes('sangat baik')) {
    return 'Hasil menunjukkan bahwa power otot tungkai berada pada kategori sangat baik. Kondisi ini menunjukkan kemampuan otot tungkai menghasilkan gaya secara maksimal dalam waktu yang sangat singkat sehingga mendukung performa pada aktivitas yang membutuhkan kecepatan, kelincahan, akselerasi, dan lompatan eksplosif. Kemampuan ini juga mencerminkan koordinasi neuromuskular yang baik antara otot, tendon, dan sistem saraf. Untuk mempertahankan kemampuan tersebut, lakukan latihan power 2–3 kali per minggu melalui box jump, squat jump, countermovement jump, tuck jump, bounding, lateral jump, dan depth jump dengan intensitas 70–90% kemampuan maksimal, 3–5 set × 5–8 repetisi disertai waktu istirahat 2–3 menit antar set agar kualitas gerakan tetap optimal. Kombinasikan dengan latihan kekuatan seperti back squat, front squat, Romanian deadlift, lunges, dan hip thrust pada intensitas 70–85% 1RM, sebanyak 3–4 set × 6–10 repetisi. Evaluasi kemampuan setiap 8–12 minggu untuk memastikan peningkatan performa tetap terjaga.';
  }
  if (str.includes('baik')) {
    return 'Hasil menunjukkan bahwa power otot tungkai berada pada kategori baik, namun masih dapat ditingkatkan untuk menghasilkan daya ledak yang lebih optimal. Disarankan melakukan latihan power 2–3 kali per minggu menggunakan jump squat, box jump, split jump, lateral hop, skipping, dan medicine ball squat throw dengan intensitas 60–80% kemampuan maksimal, 3–4 set × 6–10 repetisi. Tambahkan latihan kekuatan berupa squat, leg press, step-up, dan lunges pada intensitas 60–75% 1RM, 3 set × 8–12 repetisi. Tingkatkan tinggi lompatan atau beban latihan sekitar 5–10% setiap 2–3 minggu apabila teknik gerakan tetap baik dan tidak menimbulkan nyeri.';
  }
  if (str.includes('cukup') || str.includes('sedang')) {
    return 'Hasil menunjukkan bahwa power otot tungkai berada pada kategori cukup sehingga kemampuan menghasilkan gaya eksplosif masih perlu ditingkatkan. Kondisi ini dapat memengaruhi kemampuan berlari cepat, melompat, mengubah arah gerakan, maupun aktivitas olahraga lainnya. Untuk meningkatkan kemampuan tersebut, lakukan jump squat ringan, squat, step-up, calf raise, skipping, dan standing broad jump sebanyak 2–3 kali per minggu dengan intensitas 50–70% 1RM, 2–3 set × 8–12 repetisi. Kombinasikan dengan latihan keseimbangan, core stability, dan aktivitas aerobik intensitas sedang selama 30–45 menit, 3–5 kali per minggu. Fokus pada teknik pendaratan yang benar untuk mengurangi risiko cedera dan tingkatkan volume latihan secara bertahap sesuai kemampuan.';
  }
  if (str.includes('kurang') && !str.includes('sangat')) {
    return 'Hasil menunjukkan bahwa power otot tungkai berada di bawah rata-rata sehingga kemampuan menghasilkan tenaga secara cepat masih terbatas. Kondisi ini dapat menyebabkan penurunan performa dalam aktivitas yang membutuhkan lompatan, sprint, maupun perubahan arah gerakan secara cepat. Disarankan memulai latihan secara bertahap melalui bodyweight squat, chair squat, step-up, calf raise, glute bridge, dan mini jump sebanyak 2–3 kali per minggu dengan intensitas 40–60% 1RM, 2 set × 8–10 repetisi. Setelah kekuatan dasar meningkat, latihan dapat dilanjutkan dengan jump squat ringan atau low box jump. Tingkatkan repetisi atau tinggi lompatan secara bertahap sekitar 5–10% setiap minggu sesuai kemampuan dan tetap memperhatikan teknik pendaratan yang aman.';
  }
  return 'Hasil menunjukkan bahwa power otot tungkai berada pada kategori sangat rendah sehingga kemampuan menghasilkan tenaga eksplosif masih sangat terbatas. Kondisi ini dapat memengaruhi kemampuan melakukan aktivitas fungsional seperti naik tangga, berdiri dari posisi duduk, maupun aktivitas olahraga yang membutuhkan daya ledak. Disarankan memulai latihan menggunakan chair squat, sit-to-stand, calf raise, wall squat, glute bridge, dan marching exercise sebanyak 2–3 kali per minggu dengan intensitas 40–50% 1RM, 2 set × 8 repetisi. Setelah kekuatan dasar meningkat, latihan dapat dilanjutkan dengan step-up dan mini jump secara bertahap. Lakukan pemanasan selama 5–10 menit sebelum latihan serta pendinginan setelah latihan. Apabila terdapat riwayat cedera lutut, pergelangan kaki, panggul, atau gangguan muskuloskeletal lainnya, latihan sebaiknya dilakukan di bawah supervisi fisioterapis atau tenaga kesehatan sebelum meningkatkan intensitas maupun volume latihan.';
}

export function getRekomendasiCooperRun(val: number | string): string {
  const kat = typeof val === 'number'
    ? (val >= 85 ? 'Sangat Baik' : val >= 70 ? 'Baik' : val >= 55 ? 'Cukup' : val >= 45 ? 'Kurang' : 'Sangat Kurang')
    : val;
  const str = String(kat).toLowerCase();

  if (str.includes('sangat baik')) {
    return 'Hasil menunjukkan bahwa kapasitas kardiorespirasi (VO₂max) berada pada kategori sangat baik. Kondisi ini menunjukkan kemampuan jantung, paru-paru, dan sistem sirkulasi dalam memasok oksigen ke otot bekerja secara sangat efisien sehingga mampu mempertahankan aktivitas aerobik dengan intensitas tinggi dalam waktu yang relatif lama. Kapasitas aerobik yang tinggi juga berhubungan dengan penurunan risiko penyakit kardiovaskular, peningkatan produktivitas fisik, dan performa olahraga yang lebih baik. Untuk mempertahankan kondisi ini, lakukan latihan aerobik 3–5 kali per minggu dengan intensitas 70–85% HRmax selama 30–60 menit melalui lari, jogging, bersepeda, berenang, rowing, atau elliptical training. Tambahkan High Intensity Interval Training (HIIT) sebanyak 1–2 kali per minggu menggunakan pola 4–6 interval × 2–4 menit pada 80–90% HRmax dengan pemulihan aktif selama 2–3 menit. Kombinasikan dengan latihan kekuatan 2–3 kali per minggu, lakukan pemanasan dan pendinginan selama 5–10 menit, serta evaluasi hasil Cooper Test setiap 8–12 minggu untuk mempertahankan kapasitas aerobik yang optimal.';
  }
  if (str.includes('baik')) {
    return 'Hasil menunjukkan bahwa kapasitas kardiorespirasi berada pada kategori baik. Kemampuan tubuh dalam menggunakan oksigen selama aktivitas fisik telah berkembang dengan baik, namun masih memiliki peluang untuk ditingkatkan agar efisiensi kerja jantung dan paru menjadi lebih optimal. Disarankan melakukan latihan aerobik 4–5 kali per minggu dengan intensitas 60–75% HRmax selama 30–60 menit melalui jogging, jalan cepat, bersepeda, berenang, atau senam aerobik. Tambahkan latihan interval sedang sebanyak 1 kali per minggu menggunakan pola 5 interval × 2 menit pada intensitas 75–80% HRmax dengan pemulihan aktif. Tingkatkan jarak tempuh atau durasi latihan sekitar 5–10% setiap 2–3 minggu apabila tubuh telah beradaptasi dengan baik terhadap beban latihan.';
  }
  if (str.includes('cukup') || str.includes('sedang')) {
    return 'Hasil menunjukkan bahwa kapasitas kardiorespirasi berada pada kategori cukup sehingga kemampuan tubuh dalam memanfaatkan oksigen selama aktivitas fisik masih belum optimal. Kondisi ini dapat menyebabkan kelelahan lebih cepat saat melakukan aktivitas yang berlangsung dalam waktu lama. Untuk meningkatkan kapasitas aerobik, lakukan aktivitas aerobik 4–5 kali per minggu selama 30–45 menit pada intensitas 55–70% HRmax melalui jalan cepat, jogging ringan, bersepeda, berenang, atau senam aerobik. Tambahkan latihan interval sedang berupa 4–6 interval × 1–2 menit pada intensitas 70–75% HRmax yang diselingi jalan kaki selama 2 menit. Kombinasikan dengan latihan kekuatan tubuh bagian bawah dan latihan inti (core stability) sebanyak 2 kali per minggu untuk meningkatkan efisiensi gerakan saat berlari.';
  }
  if (str.includes('kurang') && !str.includes('sangat')) {
    return 'Hasil menunjukkan bahwa kapasitas kardiorespirasi berada di bawah rata-rata sehingga kemampuan jantung dan paru dalam menyuplai oksigen saat aktivitas fisik masih terbatas. Kondisi ini menyebabkan tubuh lebih cepat lelah dan memerlukan waktu pemulihan yang lebih lama setelah beraktivitas. Disarankan memulai latihan secara bertahap melalui jalan cepat, jogging ringan, bersepeda statis, atau berenang ringan sebanyak 5 kali per minggu dengan durasi 20–30 menit pada intensitas 50–65% HRmax. Setelah tubuh mulai beradaptasi, tambahkan interval jogging selama 1 menit yang diselingi jalan kaki selama 2 menit sebanyak 3–5 pengulangan. Tingkatkan durasi latihan sekitar 5 menit setiap minggu hingga mencapai target 150–300 menit aktivitas aerobik per minggu. Pastikan melakukan pemanasan dan pendinginan selama 5–10 menit pada setiap sesi latihan.';
  }
  return 'Hasil menunjukkan bahwa kapasitas kardiorespirasi berada pada kategori sangat rendah sehingga kemampuan tubuh dalam melakukan aktivitas aerobik masih sangat terbatas. Kondisi ini dapat meningkatkan risiko cepat lelah saat melakukan aktivitas sehari-hari serta berkaitan dengan rendahnya tingkat kebugaran jasmani. Disarankan memulai latihan menggunakan aktivitas aerobik berdampak rendah (low impact) seperti jalan santai, sepeda statis tanpa beban, latihan air (aquatic exercise), atau chair exercise sebanyak 5–7 kali per minggu, durasi 15–20 menit per sesi pada intensitas 40–55% HRmax. Setelah tubuh mulai beradaptasi, tingkatkan durasi latihan sekitar 5 menit setiap minggu hingga mencapai 30–45 menit per sesi. Tambahkan latihan kekuatan ringan 2 kali per minggu untuk meningkatkan kapasitas fungsional tubuh secara menyeluruh. Seluruh latihan harus diawali dengan pemanasan dan diakhiri pendinginan selama 5–10 menit. Apabila pengguna memiliki riwayat penyakit jantung, hipertensi tidak terkontrol, penyakit paru kronis, diabetes, atau mengalami keluhan seperti nyeri dada, sesak napas berat, pusing, atau denyut jantung tidak teratur selama latihan, segera hentikan aktivitas dan konsultasikan dengan dokter atau tenaga kesehatan sebelum melanjutkan program latihan.';
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

  const rekomendasiAktivitasFisik = getRekomendasiAktivitasFisik(aktivitas.kategoriAktivitas);
  const rekomendasiIMT = getRekomendasiIMT(imt.kategoriIMT);
  const rekomendasiPushUp = getRekomendasiPushUp(tkji.skorPushUp);
  const rekomendasiVerticalJump = getRekomendasiVerticalJump(tkji.skorVerticalJump);
  const rekomendasiCooperRun = getRekomendasiCooperRun(tkji.skorCooper);

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
      aktivitasFisik: rekomendasiAktivitasFisik,
      imt: rekomendasiIMT,
      pushUp: rekomendasiPushUp,
      verticalJump: rekomendasiVerticalJump,
      cooperRun: rekomendasiCooperRun,
    },
    tanggalTes: new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
  };
}
