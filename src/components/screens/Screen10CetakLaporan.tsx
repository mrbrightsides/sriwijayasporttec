import React from 'react';
import { AssessmentRecord } from '../../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { ArrowLeft, ArrowRight, Download, FileSpreadsheet, Printer, Share2, CheckCircle2 } from 'lucide-react';
import { UnsriLogo } from '../UnsriLogo';
import {
  getRekomendasiAktivitasFisik,
  getRekomendasiIMT,
  getRekomendasiPushUp,
  getRekomendasiVerticalJump,
  getRekomendasiCooperRun,
} from '../../utils/normaCalculator';

interface Screen10CetakLaporanProps {
  record: AssessmentRecord;
  onPrev: () => void;
  onNext: () => void;
}

export const Screen10CetakLaporan: React.FC<Screen10CetakLaporanProps> = ({
  record,
  onPrev,
  onNext,
}) => {
  const { peserta, evaluation, imt, tkji, functional, aktivitas, tanggal } = record;

  const recAktivitasFisik = evaluation.rekomendasi.aktivitasFisik || getRekomendasiAktivitasFisik(aktivitas.kategoriAktivitas);
  const recIMT = evaluation.rekomendasi.imt || getRekomendasiIMT(imt.kategoriIMT);
  const recPushUp = evaluation.rekomendasi.pushUp || getRekomendasiPushUp(tkji.skorPushUp);
  const recVerticalJump = evaluation.rekomendasi.verticalJump || getRekomendasiVerticalJump(tkji.skorVerticalJump);
  const recCooperRun = evaluation.rekomendasi.cooperRun || getRekomendasiCooperRun(tkji.skorCooper);

  const handleExportPDF = () => {
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
    doc.text('IDENTITAS PESERTA', 14, 45);

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
    const lastY = (doc as any).lastAutoTable.finalY || 80;
    doc.text('RINGKASAN HASIL EVALUASI KEBUGARAN', 14, lastY + 12);

    autoTable(doc, {
      startY: lastY + 16,
      theme: 'striped',
      headStyles: { fillColor: [11, 26, 48], textColor: [255, 255, 255] },
      head: [['Komponen Evaluasi', 'Skor Nilai', 'Kategori']],
      body: [
        ['Aktivitas Fisik (15%)', `${aktivitas.skorAktivitas}/100`, aktivitas.kategoriAktivitas],
        ['Indeks Massa Tubuh (IMT) (15%)', `${imt.skorIMT}/100`, imt.kategoriIMT],
        ['Tes TKJI (35%)', `${tkji.totalSkorTKJI}/100`, tkji.kategoriTKJI],
        ['Functional Fitness (35%)', `${functional.totalSkorFunctional}/100`, functional.kategoriFunctional],
        ['TOTAL SKOR AKHIR', `${evaluation.totalSkor}/100`, evaluation.kategoriAkhir.toUpperCase()],
      ],
    });

    // Rekomendasi
    const lastY2 = (doc as any).lastAutoTable.finalY || 140;
    doc.text('REKOMENDASI PROGRAM AKTIVITAS BERDASARKAN HASIL TES', 14, lastY2 + 12);

    autoTable(doc, {
      startY: lastY2 + 16,
      theme: 'grid',
      body: [
        ['Aktivitas Fisik Harian', recAktivitasFisik],
        ['Status Gizi (IMT)', recIMT],
        ['Push-Up 60 Detik (Daya Tahan Otot)', recPushUp],
        ['Vertical Jump (Power Tungkai)', recVerticalJump],
        ['Lari 12 Menit (Cooper Test)', recCooperRun],
        ['Daya Tahan Kardiorespirasi Umum', evaluation.rekomendasi.dayaTahan],
        ['Kekuatan & Daya Tahan Otot Umum', evaluation.rekomendasi.kekuatan],
        ['Fleksibilitas Sendi', evaluation.rekomendasi.fleksibilitas],
        ['Aktivitas Harian Aktif', evaluation.rekomendasi.aktivitasHarian],
      ],
    });

    doc.save(`Laporan_Kebugaran_${peserta.nama.replace(/\s+/g, '_')}.pdf`);
  };

  const handleExportExcel = () => {
    const data = [
      { 'Parameter': 'Nama Peserta', 'Nilai': peserta.nama },
      { 'Parameter': 'Jenis Kelamin', 'Nilai': peserta.jenisKelamin },
      { 'Parameter': 'Umur', 'Nilai': `${peserta.umur} Tahun` },
      { 'Parameter': 'Komunitas', 'Nilai': peserta.komunitas },
      { 'Parameter': 'Tanggal Tes', 'Nilai': tanggal },
      { 'Parameter': 'Kategori Aktivitas Fisik', 'Nilai': aktivitas.kategoriAktivitas },
      { 'Parameter': 'Skor Aktivitas Fisik', 'Nilai': aktivitas.skorAktivitas },
      { 'Parameter': 'Rekomendasi Aktivitas Fisik', 'Nilai': recAktivitasFisik },
      { 'Parameter': 'Nilai IMT', 'Nilai': imt.nilaiIMT },
      { 'Parameter': 'Kategori IMT', 'Nilai': imt.kategoriIMT },
      { 'Parameter': 'Skor IMT', 'Nilai': imt.skorIMT },
      { 'Parameter': 'Rekomendasi IMT', 'Nilai': recIMT },
      { 'Parameter': 'Push-Up Repetisi', 'Nilai': tkji.pushUpRepetisi },
      { 'Parameter': 'Rekomendasi Push-Up', 'Nilai': recPushUp },
      { 'Parameter': 'Vertical Jump (cm)', 'Nilai': tkji.verticalJumpCm },
      { 'Parameter': 'Rekomendasi Vertical Jump', 'Nilai': recVerticalJump },
      { 'Parameter': 'Lari 12 Menit Jarak (m)', 'Nilai': tkji.cooperDistanceMeter },
      { 'Parameter': 'Rekomendasi Lari 12 Menit', 'Nilai': recCooperRun },
      { 'Parameter': 'Skor TKJI', 'Nilai': tkji.totalSkorTKJI },
      { 'Parameter': 'Skor Functional Fitness', 'Nilai': functional.totalSkorFunctional },
      { 'Parameter': 'TOTAL SKOR KEBUGARAN', 'Nilai': evaluation.totalSkor },
      { 'Parameter': 'KATEGORI AKHIR', 'Nilai': evaluation.kategoriAkhir },
    ];

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan_Kebugaran');
    XLSX.writeFile(workbook, `Laporan_${peserta.nama.replace(/\s+/g, '_')}.xlsx`);
  };

  const handleShare = () => {
    const text = `SRIWIJAYA SPORT TEC - Laporan Kebugaran\nNama: ${peserta.nama}\nTotal Skor: ${evaluation.totalSkor}\nKategori: ${evaluation.kategoriAkhir}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      alert('Ringkasan hasil berhasil disalin ke clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
      
      {/* Header Banner */}
      <div className="bg-[#0b1a30] text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-yellow-500 text-slate-950 font-black flex items-center justify-center text-xs">
            10
          </div>
          <div>
            <h2 className="text-base font-bold text-white">Laporan Hasil Tes Digital</h2>
            <p className="text-xs text-slate-300">Format cetak resmi hasil monitoring kebugaran Sriwijaya Sport Tec</p>
          </div>
        </div>
        <div className="text-xs font-semibold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full">
          Tahap 10 dari 12
        </div>
      </div>

      <div className="p-6 space-y-6">
        
        {/* Paper Document Preview */}
        <div className="bg-white border-2 border-slate-300 rounded-2xl p-6 shadow-inner space-y-6">
          
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
              <span className="text-[10px] text-slate-500 block">Nama Peserta:</span>
              <strong className="text-slate-900">{peserta.nama}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Umur / JK:</span>
              <strong className="text-slate-900">{peserta.umur} Thn / {peserta.jenisKelamin}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">Komunitas:</span>
              <strong className="text-slate-900">{peserta.komunitas}</strong>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block">No. HP:</span>
              <strong className="text-slate-900">{peserta.noHp}</strong>
            </div>
          </div>

          {/* Ringkasan Hasil Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 mb-2 uppercase tracking-wider">
              RINGKASAN HASIL EVALUASI KEBUGARAN
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
              <table className="w-full text-left">
                <thead className="bg-[#0b1a30] text-white">
                  <tr>
                    <th className="p-2.5 font-bold">Komponen</th>
                    <th className="p-2.5 font-bold text-center">Hasil Measurement</th>
                    <th className="p-2.5 font-bold text-center">Skor Norma</th>
                    <th className="p-2.5 font-bold text-right">Kategori</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                  <tr>
                    <td className="p-2.5">Aktivitas Fisik (15%)</td>
                    <td className="p-2.5 text-center">{aktivitas.jenisUtama}</td>
                    <td className="p-2.5 text-center font-bold">{aktivitas.skorAktivitas}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{aktivitas.kategoriAktivitas}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Indeks Massa Tubuh (15%)</td>
                    <td className="p-2.5 text-center">{imt.nilaiIMT} ({imt.kategoriIMT})</td>
                    <td className="p-2.5 text-center font-bold">{imt.skorIMT}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{imt.kategoriIMT}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Tes TKJI (35%)</td>
                    <td className="p-2.5 text-center">Cooper: {tkji.cooperDistanceMeter}m</td>
                    <td className="p-2.5 text-center font-bold">{tkji.totalSkorTKJI}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{tkji.kategoriTKJI}</td>
                  </tr>
                  <tr>
                    <td className="p-2.5">Functional Fitness (35%)</td>
                    <td className="p-2.5 text-center">Step Test: {functional.stepTestRecoveryPulse} bpm</td>
                    <td className="p-2.5 text-center font-bold">{functional.totalSkorFunctional}</td>
                    <td className="p-2.5 text-right font-bold text-emerald-700">{functional.kategoriFunctional}</td>
                  </tr>
                  <tr className="bg-yellow-50 font-black text-slate-900 border-t-2 border-slate-300">
                    <td className="p-2.5 uppercase">TOTAL SKOR AKHIR</td>
                    <td className="p-2.5 text-center">NORMA SRISPORT</td>
                    <td className="p-2.5 text-center text-amber-700 text-sm">{evaluation.totalSkor}</td>
                    <td className="p-2.5 text-right text-emerald-800 text-sm">{evaluation.kategoriAkhir.toUpperCase()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Rekomendasi Section in Document */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              REKOMENDASI PROGRAM AKTIVITAS BERDASARKAN HASIL TES
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
            </div>
          </div>

        </div>

        {/* Action Export Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <button
            onClick={handleExportPDF}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#0b1a30] hover:bg-[#122847] text-yellow-400 font-bold text-xs rounded-xl shadow-md transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak PDF Laporan</span>
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

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
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
            <span>Lanjut ke Dashboard Monitoring</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
