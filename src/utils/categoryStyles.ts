export interface CategoryStyle {
  textClass: string;
  badgeClass: string;
  pdfTextColor: [number, number, number];
  pdfBgColor: [number, number, number];
}

export const getCategoryStyle = (categoryStr: string): CategoryStyle => {
  const cat = (categoryStr || '').toLowerCase().trim();

  // 1. Sangat Baik / Sangat Tinggi / Sangat Aktif
  if (cat.includes('sangat baik') || cat.includes('sangat tinggi') || cat.includes('sangat aktif')) {
    return {
      textClass: 'text-blue-700 font-bold',
      badgeClass: 'bg-blue-100 text-blue-800 border border-blue-300 font-bold px-2.5 py-1 rounded-full text-xs inline-block shadow-xs',
      pdfTextColor: [29, 78, 216],   // #1d4ed8 Blue-700
      pdfBgColor: [219, 234, 254],   // #dbeafe Blue-100
    };
  }

  // 2. Baik / Tinggi / Normal / Aktif
  if (cat.includes('baik') || cat === 'tinggi' || cat.includes('normal') || cat.includes('aktif')) {
    return {
      textClass: 'text-emerald-700 font-bold',
      badgeClass: 'bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold px-2.5 py-1 rounded-full text-xs inline-block shadow-xs',
      pdfTextColor: [4, 120, 87],    // #047857 Emerald-700
      pdfBgColor: [209, 250, 229],   // #d1fae5 Emerald-100
    };
  }

  // 3. Cukup / Sedang
  if (cat.includes('cukup') || cat.includes('sedang')) {
    return {
      textClass: 'text-amber-800 font-bold',
      badgeClass: 'bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2.5 py-1 rounded-full text-xs inline-block shadow-xs',
      pdfTextColor: [180, 83, 9],    // #b45309 Amber-700
      pdfBgColor: [254, 243, 199],   // #fef3c7 Amber-100
    };
  }

  // 4. Kurang / Rendah / Kurus / Overweight / Gemuk
  if (cat === 'kurang' || cat.includes('rendah') || cat.includes('kurus') || cat.includes('overweight') || cat.includes('gemuk')) {
    return {
      textClass: 'text-orange-800 font-bold',
      badgeClass: 'bg-orange-100 text-orange-950 border border-orange-300 font-bold px-2.5 py-1 rounded-full text-xs inline-block shadow-xs',
      pdfTextColor: [194, 65, 12],   // #c2410c Orange-700
      pdfBgColor: [255, 237, 213],   // #ffedd5 Orange-100
    };
  }

  // 5. Sangat Kurang / Sangat Rendah / Obesitas / Sangat Kurus
  if (cat.includes('sangat kurang') || cat.includes('sangat rendah') || cat.includes('obesitas') || cat.includes('sangat kurus')) {
    return {
      textClass: 'text-rose-800 font-bold',
      badgeClass: 'bg-rose-100 text-rose-950 border border-rose-300 font-bold px-2.5 py-1 rounded-full text-xs inline-block shadow-xs',
      pdfTextColor: [190, 18, 60],   // #be123c Rose-700
      pdfBgColor: [254, 226, 226],   // #fee2e2 Rose-100
    };
  }

  // Default fallback
  return {
    textClass: 'text-slate-700 font-bold',
    badgeClass: 'bg-slate-100 text-slate-800 border border-slate-300 font-bold px-2.5 py-1 rounded-full text-xs inline-block shadow-xs',
    pdfTextColor: [51, 65, 85],     // #334155 Slate-700
    pdfBgColor: [241, 245, 249],    // #f1f5f9 Slate-100
  };
};
