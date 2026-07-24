import React, { useState } from 'react';
import { AssessmentRecord } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import { getCategoryStyle } from '../../utils/categoryStyles';
import {
  ArrowLeft,
  ArrowRight,
  FileSpreadsheet,
  Printer,
  Share2,
  BarChart3,
  TrendingUp,
  Activity,
  Award,
  Sparkles,
} from 'lucide-react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import { UnsriLogo } from '../UnsriLogo';
import {
  getRekomendasiAktivitasFisik,
  getRekomendasiIMT,
  getRekomendasiPushUp,
  getRekomendasiVerticalJump,
  getRekomendasiCooperRun,
  getRekomendasiSitToStand,
  getRekomendasiPlank,
  getRekomendasiBalance,
  getRekomendasiSitAndReachFF,
  getRekomendasiStepTest,
  getRekomendasiRecoveryHR,
} from '../../utils/normaCalculator';

interface Screen10CetakLaporanProps {
  record: AssessmentRecord;
  records?: AssessmentRecord[];
  onPrev: () => void;
  onNext: () => void;
}

export const Screen10CetakLaporan: React.FC<Screen10CetakLaporanProps> = ({
  record,
  records,
  onPrev,
  onNext,
}) => {
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const { peserta, evaluation, imt, tkji, functional, aktivitas, tanggal } = record;

  const recAktivitasFisik = evaluation.rekomendasi.aktivitasFisik || getRekomendasiAktivitasFisik(aktivitas.kategoriAktivitas);
  const recIMT = evaluation.rekomendasi.imt || getRekomendasiIMT(imt.kategoriIMT);
  const recPushUp = evaluation.rekomendasi.pushUp || getRekomendasiPushUp(tkji.skorPushUp);
  const recVerticalJump = evaluation.rekomendasi.verticalJump || getRekomendasiVerticalJump(tkji.skorVerticalJump);
  const recCooperRun = evaluation.rekomendasi.cooperRun || getRekomendasiCooperRun(tkji.skorCooper);

  const recSitToStand = evaluation.rekomendasi.sitToStand || getRekomendasiSitToStand(functional.skorSitToStand);
  const recPlank = evaluation.rekomendasi.plank || getRekomendasiPlank(functional.skorPlank);
  const recBalance = evaluation.rekomendasi.balance || getRekomendasiBalance(functional.skorBalance);
  const recSitAndReachFF = evaluation.rekomendasi.sitAndReachFF || getRekomendasiSitAndReachFF(functional.skorSitAndReach);
  const recStepTest = evaluation.rekomendasi.stepTest || getRekomendasiStepTest(functional.skorStepTest);
  const recRecoveryHR = evaluation.rekomendasi.recoveryHR || getRekomendasiRecoveryHR(functional.skorDeltaHR);

  // Statistical calculations
  const componentScores = [
    { name: 'Aktivitas Fisik', score: aktivitas.skorAktivitas || 0 },
    { name: 'Komposisi IMT', score: imt.skorIMT || 0 },
    { name: 'Tes Kebugaran', score: tkji.totalSkorTKJI || 0 },
    { name: 'Functional Fitness', score: functional.totalSkorFunctional || 0 },
    { name: 'Pemulihan Denyut Jantung', score: functional.skorDeltaHR || 70 },
  ];

  const meanScore = Math.round(
    componentScores.reduce((acc, curr) => acc + curr.score, 0) / componentScores.length
  );

  const highestComp = [...componentScores].sort((a, b) => b.score - a.score)[0];
  const lowestComp = [...componentScores].sort((a, b) => a.score - b.score)[0];
  const deviationFromBenchmark = evaluation.totalSkor - 75;

  // Radar Data for Chart
  const radarData = [
    { subject: 'Aktivitas Fisik', skor: aktivitas.skorAktivitas || 0, benchmark: 75, fullMark: 100 },
    { subject: 'Komposisi IMT', skor: imt.skorIMT || 0, benchmark: 75, fullMark: 100 },
    { subject: 'Tes Kebugaran', skor: tkji.totalSkorTKJI || 0, benchmark: 75, fullMark: 100 },
    { subject: 'Functional Fitness', skor: functional.totalSkorFunctional || 0, benchmark: 75, fullMark: 100 },
    { subject: 'Pemulihan HR', skor: functional.skorDeltaHR || 70, benchmark: 75, fullMark: 100 },
  ];

  // Bar Data for Sub-tests comparison
  const subTestsBarData = [
    { test: 'Push-Up', skor: tkji.skorPushUp || 0, benchmark: 75 },
    { test: 'V.Jump', skor: tkji.skorVerticalJump || 0, benchmark: 75 },
    { test: 'Cooper', skor: tkji.skorCooper || 0, benchmark: 75 },
    { test: 'Sit-Stand', skor: functional.skorSitToStand || 0, benchmark: 75 },
    { test: 'Plank', skor: functional.skorPlank || 0, benchmark: 75 },
    { test: 'Balance', skor: functional.skorBalance || 0, benchmark: 75 },
    { test: 'Sit&Reach', skor: functional.skorSitAndReach || 0, benchmark: 75 },
  ];

  const handlePrintDocument = () => {
    window.print();
  };

  const handleExportPDF = async () => {
    setIsExportingPDF(true);
    try {
      const doc = new jsPDF();

      // Header Title
      doc.setFillColor(11, 26, 48); // #0b1a30
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(250, 204, 21); // Yellow
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('SRIWIJAYA SPORT TEC', 14, 15);

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('UNIVERSITAS SRIWIJAYA - LAPORAN HASIL MONITORING KEBUGARAN', 14, 22);
      doc.text(`Tanggal Tes: ${tanggal}`, 14, 28);

      // Peserta Info
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('1. IDENTITAS PESERTA', 14, 45);

      autoTable(doc, {
        startY: 48,
        theme: 'grid',
        headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        body: [
          ['Nama Lengkap', peserta.nama, 'Jenis Kelamin', peserta.jenisKelamin],
          ['Umur', `${peserta.umur} Tahun`, 'Komunitas', peserta.komunitas],
          ['No. HP', peserta.noHp, 'Alamat', peserta.alamat],
        ],
      });

      // Ringkasan Hasil
      const lastY1 = (doc as any).lastAutoTable.finalY || 80;
      doc.text('2. RINGKASAN HASIL EVALUASI KEBUGARAN 5 DIMENSI', 14, lastY1 + 12);

      autoTable(doc, {
        startY: lastY1 + 16,
        theme: 'grid',
        headStyles: { fillColor: [11, 26, 48], textColor: [255, 255, 255], fontStyle: 'bold' },
        head: [['Komponen Evaluasi', 'Bobot', 'Skor Nilai', 'Kategori']],
        body: [
          ['Aktivitas Fisik Harian', '15%', `${aktivitas.skorAktivitas}/100`, aktivitas.kategoriAktivitas],
          ['Indeks Massa Tubuh (IMT)', '15%', `${imt.skorIMT}/100`, imt.kategoriIMT],
          ['Tes Kebugaran', '35%', `${tkji.totalSkorTKJI}/100`, tkji.kategoriTKJI],
          ['Functional Fitness', '35%', `${functional.totalSkorFunctional}/100`, functional.kategoriFunctional],
          ['TOTAL SKOR AKHIR', '100%', `${evaluation.totalSkor}/100`, evaluation.kategoriAkhir.toUpperCase()],
        ],
        didParseCell: (data) => {
          if (data.section === 'body') {
            if (data.column.index === 3) {
              const rawVal = String(data.cell.raw || '');
              const style = getCategoryStyle(rawVal);
              data.cell.styles.textColor = style.pdfTextColor;
              data.cell.styles.fillColor = style.pdfBgColor;
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.halign = 'center';
            }
            if (data.row.index === 4 && data.column.index !== 3) {
              data.cell.styles.fontStyle = 'bold';
              data.cell.styles.fillColor = [254, 243, 199]; // Amber-100 highlight for total row
            }
          }
        },
      });

      // Statistik & Benchmark Summary
      const lastY2 = (doc as any).lastAutoTable.finalY || 140;
      doc.text('3. ANALISIS STATISTIK & PROFIL BENCHMARK', 14, lastY2 + 12);

      autoTable(doc, {
        startY: lastY2 + 16,
        theme: 'grid',
        headStyles: { fillColor: [245, 158, 11], textColor: [0, 0, 0], fontStyle: 'bold' },
        head: [['Metrik Analisis', 'Nilai / Hasil', 'Catatan Evaluasi']],
        body: [
          ['Rata-Rata Skor 5 Komponen', `${meanScore} / 100`, 'Nilai rata-rata dari seluruh dimensi'],
          ['Komponen Terunggul (Max)', `${highestComp.name} (${highestComp.score} Poin)`, 'Perlu dipertahankan'],
          ['Area Fokus Utama (Min)', `${lowestComp.name} (${lowestComp.score} Poin)`, 'Rekomendasi prioritas perbaikan'],
          ['Indeks Pemulihan Denyut Jantung', `${functional.recoveryHrDelta} bpm`, `Status Pemulihan: ${recRecoveryHR.split('.')[0]}`],
          ['Deviasi dari Benchmark (75 Poin)', `${deviationFromBenchmark >= 0 ? '+' : ''}${deviationFromBenchmark} Poin`, evaluation.totalSkor >= 75 ? 'Memenuhi Standar Kebugaran Baik' : 'Di Bawah Target Benchmark'],
        ],
      });

      // Sub-Tes Detail on Page 2
      doc.addPage();
      doc.text('4. DETAIL HASIL SUB-TES LAPANGAN', 14, 20);

      autoTable(doc, {
        startY: 24,
        theme: 'grid',
        headStyles: { fillColor: [11, 26, 48], textColor: [255, 255, 255] },
        head: [['Nama Sub-Tes', 'Hasil Mentah', 'Skor Norma', 'Indikator']],
        body: [
          ['Push-Up 60 Detik', `${tkji.pushUpRepetisi} reps`, `${tkji.skorPushUp}/100`, 'Daya Tahan Otot'],
          ['Vertical Jump', `${tkji.verticalJumpCm} cm`, `${tkji.skorVerticalJump}/100`, 'Power Tungkai'],
          ['Lari 12 Menit (Cooper)', `${tkji.cooperDistanceMeter} m`, `${tkji.skorCooper}/100`, 'Kapasitas Kardiorespirasi'],
          ['Sit to Stand 30 Detik', `${functional.sitToStandReps} reps`, `${functional.skorSitToStand}/100`, 'Kekuatan Tungkai Bawah'],
          ['Plank Stability', `${functional.plankSeconds} detik`, `${functional.skorPlank}/100`, 'Stabilitas Otot Inti'],
          ['Balance 1 Kaki', `${functional.balanceSeconds} detik`, `${functional.skorBalance}/100`, 'Keseimbangan Statis'],
          ['Sit and Reach', `${functional.sitAndReachCm} cm`, `${functional.skorSitAndReach}/100`, 'Fleksibilitas Sendi'],
          ['Step Test Recovery HR', `${functional.stepTestRecoveryPulse} bpm`, `${functional.skorStepTest}/100`, 'Denyut Nadi Pemulihan'],
        ],
      });

      let nextY = (doc as any).lastAutoTable.finalY || 100;

      // 5. VISUAL CHARTS (Radar & Bar Chart captured via html2canvas)
      const chartsElement = document.getElementById('charts-container-pdf');
      if (chartsElement) {
        try {
          const canvas = await html2canvas(chartsElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: '#ffffff',
            logging: false,
            onclone: (clonedDoc) => {
              // 1. Sanitize all <style> elements in cloned document to remove oklch syntax which html2canvas cannot parse
              const styleElements = clonedDoc.querySelectorAll('style');
              styleElements.forEach((style) => {
                if (style.textContent) {
                  style.textContent = style.textContent.replace(/oklch\([^)]+\)/gi, '#0b1a30');
                }
              });

              // 2. Sanitize inline styles on all elements
              const allElements = clonedDoc.querySelectorAll('*');
              allElements.forEach((node) => {
                const element = node as HTMLElement;
                if (element.style && element.style.cssText) {
                  if (element.style.cssText.includes('oklch')) {
                    element.style.cssText = element.style.cssText.replace(/oklch\([^)]+\)/gi, '#0b1a30');
                  }
                }
              });
            },
          });
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 182; // printable width mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          doc.setFont('helvetica', 'bold');
          doc.text('5. VISUALISASI GRAFIK RADAR & BAR CHART PROFIL', 14, nextY + 12);
          doc.addImage(imgData, 'PNG', 14, nextY + 16, imgWidth, imgHeight);
          nextY = nextY + 16 + imgHeight;
        } catch (err) {
          console.error('Failed capturing chart canvas for PDF:', err);
        }
      }

      // Check space for 6. REKOMENDASI
      if (nextY + 60 > 280) {
        doc.addPage();
        nextY = 20;
      } else {
        nextY += 12;
      }

      doc.setFont('helvetica', 'bold');
      doc.text('6. REKOMENDASI PROGRAM AKTIVITAS FITT', 14, nextY);

      autoTable(doc, {
        startY: nextY + 4,
        theme: 'grid',
        body: [
          ['Aktivitas Fisik Harian', recAktivitasFisik],
          ['Status Gizi (IMT)', recIMT],
          ['Push-Up (Daya Tahan Otot)', recPushUp],
          ['Vertical Jump (Power)', recVerticalJump],
          ['Lari 12 Menit (Kardio)', recCooperRun],
          ['Sit to Stand (Tungkai)', recSitToStand],
          ['Plank (Core)', recPlank],
          ['Balance (Keseimbangan)', recBalance],
          ['Sit and Reach (Fleksibilitas)', recSitAndReachFF],
          ['Step Test & Recovery HR', recStepTest],
          ['Program Daya Tahan', evaluation.rekomendasi.dayaTahan],
          ['Program Kekuatan', evaluation.rekomendasi.kekuatan],
          ['Program Fleksibilitas', evaluation.rekomendasi.fleksibilitas],
        ],
      });

      doc.save(`Laporan_Kebugaran_Lengkap_${peserta.nama.replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('Export PDF error:', err);
      alert('Gagal mengekspor PDF. Silakan coba lagi.');
    } finally {
      setIsExportingPDF(false);
    }
  };

  const handleExportExcel = () => {
    const data = [
      { 'Kategori Parameter': 'Identitas', 'Parameter': 'Nama Peserta', 'Nilai': peserta.nama },
      { 'Kategori Parameter': 'Identitas', 'Parameter': 'Jenis Kelamin', 'Nilai': peserta.jenisKelamin },
      { 'Kategori Parameter': 'Identitas', 'Parameter': 'Umur', 'Nilai': `${peserta.umur} Tahun` },
      { 'Kategori Parameter': 'Identitas', 'Parameter': 'Komunitas', 'Nilai': peserta.komunitas },
      { 'Kategori Parameter': 'Identitas', 'Parameter': 'Tanggal Tes', 'Nilai': tanggal },
      
      { 'Kategori Parameter': 'Statistik Ringkasan', 'Parameter': 'TOTAL SKOR AKHIR', 'Nilai': evaluation.totalSkor },
      { 'Kategori Parameter': 'Statistik Ringkasan', 'Parameter': 'KATEGORI AKHIR', 'Nilai': evaluation.kategoriAkhir },
      { 'Kategori Parameter': 'Statistik Ringkasan', 'Parameter': 'Rata-rata Skor Komponen', 'Nilai': meanScore },
      { 'Kategori Parameter': 'Statistik Ringkasan', 'Parameter': 'Komponen Terunggul', 'Nilai': `${highestComp.name} (${highestComp.score} Poin)` },
      { 'Kategori Parameter': 'Statistik Ringkasan', 'Parameter': 'Fokus Perbaikan Terbesar', 'Nilai': `${lowestComp.name} (${lowestComp.score} Poin)` },
      { 'Kategori Parameter': 'Statistik Ringkasan', 'Parameter': 'Delta HR Pemulihan (bpm)', 'Nilai': functional.recoveryHrDelta },

      { 'Kategori Parameter': 'Aktivitas Fisik', 'Parameter': 'Kategori Aktivitas', 'Nilai': aktivitas.kategoriAktivitas },
      { 'Kategori Parameter': 'Aktivitas Fisik', 'Parameter': 'Skor Aktivitas Fisik (15%)', 'Nilai': aktivitas.skorAktivitas },
      { 'Kategori Parameter': 'IMT / Status Gizi', 'Parameter': 'Nilai IMT (kg/m²)', 'Nilai': imt.nilaiIMT },
      { 'Kategori Parameter': 'IMT / Status Gizi', 'Parameter': 'Kategori IMT', 'Nilai': imt.kategoriIMT },
      { 'Kategori Parameter': 'IMT / Status Gizi', 'Parameter': 'Skor IMT (15%)', 'Nilai': imt.skorIMT },

      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Push-Up Repetisi', 'Nilai': tkji.pushUpRepetisi },
      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Skor Push-Up', 'Nilai': tkji.skorPushUp },
      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Vertical Jump (cm)', 'Nilai': tkji.verticalJumpCm },
      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Skor Vertical Jump', 'Nilai': tkji.skorVerticalJump },
      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Lari 12 Menit Jarak (m)', 'Nilai': tkji.cooperDistanceMeter },
      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Skor Lari 12 Menit', 'Nilai': tkji.skorCooper },
      { 'Kategori Parameter': 'Tes Kebugaran', 'Parameter': 'Total Skor Tes Kebugaran (35%)', 'Nilai': tkji.totalSkorTKJI },

      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Sit to Stand Repetisi', 'Nilai': functional.sitToStandReps },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Skor Sit to Stand', 'Nilai': functional.skorSitToStand },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Plank (detik)', 'Nilai': functional.plankSeconds },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Skor Plank', 'Nilai': functional.skorPlank },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Balance 1 Kaki (detik)', 'Nilai': functional.balanceSeconds },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Skor Balance', 'Nilai': functional.skorBalance },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Sit and Reach (cm)', 'Nilai': functional.sitAndReachCm },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Skor Sit and Reach', 'Nilai': functional.skorSitAndReach },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Step Test Recovery HR (bpm)', 'Nilai': functional.stepTestRecoveryPulse },
      { 'Kategori Parameter': 'Functional Fitness', 'Parameter': 'Total Skor Functional (35%)', 'Nilai': functional.totalSkorFunctional },

      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Aktivitas Fisik Harian', 'Nilai': recAktivitasFisik },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Status Gizi (IMT)', 'Nilai': recIMT },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Push-Up', 'Nilai': recPushUp },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Vertical Jump', 'Nilai': recVerticalJump },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Lari 12 Menit', 'Nilai': recCooperRun },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Sit to Stand', 'Nilai': recSitToStand },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Plank', 'Nilai': recPlank },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Balance 1 Kaki', 'Nilai': recBalance },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Sit and Reach', 'Nilai': recSitAndReachFF },
      { 'Kategori Parameter': 'Rekomendasi', 'Parameter': 'Step Test & Recovery HR', 'Nilai': recStepTest },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan_Lengkap');
    XLSX.writeFile(workbook, `Laporan_${peserta.nama.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleShare = () => {
    const text = `SRIWIJAYA SPORT TEC - Laporan Kebugaran Lengkap\nNama: ${peserta.nama}\nTotal Skor: ${evaluation.totalSkor}\nKategori: ${evaluation.kategoriAkhir}\nRata-rata Skor: ${meanScore}\nKomponen Terkuat: ${highestComp.name} (${highestComp.score} Poin)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Ringkasan statistik & hasil kebugaran berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden print:border-none print:shadow-none print:max-w-full">
      
      {/* Header Banner (Hidden on Print) */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800 print:hidden">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            10
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Laporan Hasil Tes Digital & Statistik</h2>
            <p className="text-xs text-slate-300">Format cetak resmi hasil monitoring kebugaran lengkap dengan grafik dan analisis</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 10 dari 12
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-6">
        
        {/* Paper Document Preview */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-4 sm:p-6 shadow-inner space-y-6 print:border-none print:p-0 print:shadow-none">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-800 pb-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <UnsriLogo size="lg" />
              <div>
                <h3 className="text-lg font-black text-slate-900 tracking-tight">SRIWIJAYA SPORT TEC</h3>
                <p className="text-xs text-slate-600 font-semibold">
                  UNIVERSITAS SRIWIJAYA • SISTEM MONITORING KEBUGARAN OLAHRAGA MASYARAKAT
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 block font-semibold">Tanggal Pengujian:</span>
              <span className="text-xs font-bold text-slate-800">{tanggal}</span>
            </div>
          </div>

          {/* Peserta Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Nama Peserta:</span>
              <strong className="text-slate-900 font-bold">{peserta.nama}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Umur / JK:</span>
              <strong className="text-slate-900 font-bold">{peserta.umur} Thn / {peserta.jenisKelamin}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">Komunitas:</span>
              <strong className="text-slate-900 font-bold">{peserta.komunitas}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block font-medium">No. HP:</span>
              <strong className="text-slate-900 font-bold">{peserta.noHp}</strong>
            </div>
          </div>

          {/* Ringkasan Hasil Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>RINGKASAN HASIL EVALUASI KEBUGARAN 5 DIMENSI</span>
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0b1a30] text-white">
                  <tr>
                    <th className="p-2.5 font-bold">Komponen Evaluasi</th>
                    <th className="p-2.5 font-bold text-center">Bobot</th>
                    <th className="p-2.5 font-bold text-center">Hasil Measurement</th>
                    <th className="p-2.5 font-bold text-center">Skor Norma</th>
                    <th className="p-2.5 font-bold text-right">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="p-2.5">Aktivitas Fisik Harian</td>
                    <td className="p-2.5 text-center text-slate-500">15%</td>
                    <td className="p-2.5 text-center">{aktivitas.jenisUtama}</td>
                    <td className="p-2.5 text-center font-bold">{aktivitas.skorAktivitas}</td>
                    <td className="p-2.5 text-right">
                      <span className={getCategoryStyle(aktivitas.kategoriAktivitas).badgeClass}>
                        {aktivitas.kategoriAktivitas}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Indeks Massa Tubuh (IMT)</td>
                    <td className="p-2.5 text-center text-slate-500">15%</td>
                    <td className="p-2.5 text-center">{imt.nilaiIMT} kg/m² ({imt.kategoriIMT})</td>
                    <td className="p-2.5 text-center font-bold">{imt.skorIMT}</td>
                    <td className="p-2.5 text-right">
                      <span className={getCategoryStyle(imt.kategoriIMT).badgeClass}>
                        {imt.kategoriIMT}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Tes Kebugaran</td>
                    <td className="p-2.5 text-center text-slate-500">35%</td>
                    <td className="p-2.5 text-center">Cooper: {tkji.cooperDistanceMeter}m</td>
                    <td className="p-2.5 text-center font-bold">{tkji.totalSkorTKJI}</td>
                    <td className="p-2.5 text-right">
                      <span className={getCategoryStyle(tkji.kategoriTKJI).badgeClass}>
                        {tkji.kategoriTKJI}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Functional Fitness</td>
                    <td className="p-2.5 text-center text-slate-500">35%</td>
                    <td className="p-2.5 text-center">Step Test: {functional.stepTestRecoveryPulse} bpm</td>
                    <td className="p-2.5 text-center font-bold">{functional.totalSkorFunctional}</td>
                    <td className="p-2.5 text-right">
                      <span className={getCategoryStyle(functional.kategoriFunctional).badgeClass}>
                        {functional.kategoriFunctional}
                      </span>
                    </td>
                  </tr>
                  <tr className="bg-yellow-50/80 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="p-2.5 uppercase">TOTAL SKOR AKHIR</td>
                    <td className="p-2.5 text-center text-amber-700">100%</td>
                    <td className="p-2.5 text-center text-slate-600">NORMA SRISPORT</td>
                    <td className="p-2.5 text-center text-amber-700 text-sm">{evaluation.totalSkor}</td>
                    <td className="p-2.5 text-right">
                      <span className={getCategoryStyle(evaluation.kategoriAkhir).badgeClass}>
                        {evaluation.kategoriAkhir.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* STATISTIK SUMMARY METRICS GRID */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2.5 uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <span>STATISTIK ANALISIS & INDIKATOR UTAMA</span>
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-blue-50/80 p-3 rounded-xl border border-blue-200">
                <span className="text-[10px] font-bold text-blue-800 uppercase block">Rata-Rata Komponen</span>
                <div className="text-lg font-extrabold text-blue-900 mt-0.5">{meanScore} <span className="text-xs font-normal text-blue-700">/100</span></div>
                <span className="text-[10px] text-blue-700 block">Rata-rata 5 dimensi</span>
              </div>
              <div className="bg-emerald-50/80 p-3 rounded-xl border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-800 uppercase block">Komponen Terunggul</span>
                <div className="text-sm font-bold text-emerald-900 truncate mt-0.5">{highestComp.name}</div>
                <span className="text-[10px] font-extrabold text-emerald-700 block">{highestComp.score} Poin</span>
              </div>
              <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-200">
                <span className="text-[10px] font-bold text-amber-800 uppercase block">Fokus Perbaikan</span>
                <div className="text-sm font-bold text-amber-900 truncate mt-0.5">{lowestComp.name}</div>
                <span className="text-[10px] font-extrabold text-amber-700 block">{lowestComp.score} Poin</span>
              </div>
              <div className="bg-purple-50/80 p-3 rounded-xl border border-purple-200">
                <span className="text-[10px] font-bold text-purple-800 uppercase block">Pemulihan HR</span>
                <div className="text-lg font-extrabold text-purple-900 mt-0.5">{functional.recoveryHrDelta} <span className="text-xs font-normal text-purple-700">bpm</span></div>
                <span className="text-[10px] text-purple-700 block">Penurunan Denyut Nadi</span>
              </div>
            </div>
          </div>

          {/* VISUAL CHARTS SECTION (RADAR & BAR CHART) */}
          <div id="charts-container-pdf" className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 bg-white p-2 rounded-xl" style={{ backgroundColor: '#ffffff' }}>
            
            {/* Radar Chart 5 Dimensions */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Profil Radar 5 Dimensi Kebugaran</span>
                </h5>
                <span className="text-[10px] font-semibold text-slate-500">Vs Benchmark 75</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#cbd5e1" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 9, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
                    <Radar name="Skor Peserta" dataKey="skor" stroke="#0b1a30" fill="#0b1a30" fillOpacity={0.35} />
                    <Radar name="Target Benchmark" dataKey="benchmark" stroke="#eab308" fill="#eab308" fillOpacity={0.15} strokeDasharray="3 3" />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Sub-Tests Bar Chart */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
              <div className="flex items-center justify-between mb-2">
                <h5 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
                  <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Komparasi Sub-Tes Lapangan</span>
                </h5>
                <span className="text-[10px] font-semibold text-slate-500">Skor Norma /100</span>
              </div>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={subTestsBarData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="test" tick={{ fontSize: 9, fill: '#475569' }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 9, fill: '#475569' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '8px' }} />
                    <Bar dataKey="skor" name="Skor Tes" fill="#16a34a" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>

          {/* Rekomendasi Section in Document */}
          <div className="space-y-2 pt-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>REKOMENDASI PROGRAM AKTIVITAS BERDASARKAN HASIL TES</span>
            </h4>
            <div className="border border-slate-200 rounded-xl p-3 bg-slate-50/80 space-y-2 text-xs">
              <div>
                <strong className="text-blue-900 block font-bold">1. Aktivitas Fisik ({aktivitas.kategoriAktivitas}):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recAktivitasFisik}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-emerald-900 block font-bold">2. Indeks Massa Tubuh / Status Gizi ({imt.kategoriIMT}):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recIMT}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-indigo-900 block font-bold">3. Push-Up 60 Detik / Daya Tahan Otot (Hasil: {tkji.pushUpRepetisi} reps):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recPushUp}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-amber-900 block font-bold">4. Vertical Jump / Power Tungkai (Hasil: {tkji.verticalJumpCm} cm):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recVerticalJump}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-rose-900 block font-bold">5. Lari 12 Menit / Kapasitas Kardiorespirasi (Hasil: {tkji.cooperDistanceMeter} m):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recCooperRun}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-cyan-900 block font-bold">6. Sit to Stand 30 Detik / Kekuatan Tungkai (Hasil: {functional.sitToStandReps} reps):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recSitToStand}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-teal-900 block font-bold">7. Plank / Core Stability (Hasil: {functional.plankSeconds} detik):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recPlank}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-sky-900 block font-bold">8. Balance 1 Kaki / Keseimbangan Statis (Hasil: {functional.balanceSeconds} detik):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recBalance}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-purple-900 block font-bold">9. Sit and Reach / Fleksibilitas (Hasil: {functional.sitAndReachCm} cm):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recSitAndReachFF}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-orange-900 block font-bold">10. Step Test Recovery / Kardiorespirasi (Hasil: {functional.stepTestRecoveryPulse} bpm):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recStepTest}</p>
              </div>
              <div className="pt-2 border-t border-slate-200">
                <strong className="text-emerald-900 block font-bold">11. Recovery Heart Rate / Pemulihan HR 1 Menit (Hasil: {functional.recoveryHrDelta} bpm):</strong>
                <p className="text-slate-700 leading-relaxed mt-0.5">{recRecoveryHR}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Action Export Buttons (Hidden on Print) */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 print:hidden">
          <button
            onClick={handlePrintDocument}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak A4 / Print Document</span>
          </button>

          <button
            onClick={handleExportPDF}
            disabled={isExportingPDF}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
          >
            <Printer className="w-4 h-4" />
            <span>{isExportingPDF ? 'Proses PDF & Grafik...' : 'Download PDF Laporan'}</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export Excel (.xlsx)</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>Bagikan Ringkasan</span>
          </button>
        </div>

        {/* Action Buttons (Hidden on Print) */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={onPrev}
            className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali</span>
          </button>

          <button
            type="button"
            onClick={onNext}
            className="inline-flex items-center space-x-2 px-6 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            <span>Lanjut ke Rapor Peserta</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};

