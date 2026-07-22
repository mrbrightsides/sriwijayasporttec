import React, { useEffect, useState } from 'react';
import {
  AssessmentRecord,
  AktivitasFisik,
  DataFunctionalFitness,
  DataIMT,
  DataTKJI,
  Peserta,
  UserProfile,
} from './types';
import {
  INITIAL_ASSESSMENTS,
  INITIAL_PESERTA,
  createSampleAssessmentRecord,
} from './data/mockData';
import {
  calculateAktivitasFisik,
  calculateFunctionalFitness,
  calculateIMT,
  calculateTKJI,
  evaluateSriwijayaSportTec,
} from './utils/normaCalculator';

import { Header } from './components/Header';
import { Sidebar, MainNavTab } from './components/Sidebar';
import { StepFlowNav } from './components/StepFlowNav';

import { Screen1Login } from './components/screens/Screen1Login';
import { Screen2DataPeserta } from './components/screens/Screen2DataPeserta';
import { Screen3AktivitasFisik } from './components/screens/Screen3AktivitasFisik';
import { Screen4HitungIMT } from './components/screens/Screen4HitungIMT';
import { Screen5TesTKJI } from './components/screens/Screen5TesTKJI';
import { Screen6FunctionalFitness } from './components/screens/Screen6FunctionalFitness';
import { Screen7AnalisisSistem } from './components/screens/Screen7AnalisisSistem';
import { Screen8KategoriHasil } from './components/screens/Screen8KategoriHasil';
import { Screen9RekomendasiAktivitas } from './components/screens/Screen9RekomendasiAktivitas';
import { Screen10CetakLaporan } from './components/screens/Screen10CetakLaporan';
import { Screen11DashboardSummary } from './components/screens/Screen11DashboardSummary';
import { Screen12Selesai } from './components/screens/Screen12Selesai';

import { DataPesertaList } from './components/DataPesertaList';
import { PengaturanView } from './components/PengaturanView';

export default function App() {
  // User Session
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sriwijaya_user');
    return saved
      ? JSON.parse(saved)
      : {
          username: 'admin_sriwijaya',
          name: 'Dr. Arif Hidayat M.Pd',
          role: 'admin',
          institution: 'Universitas Sriwijaya',
          isLoggedIn: true,
        };
  });

  // State: Peserta List
  const [pesertaList, setPesertaList] = useState<Peserta[]>(() => {
    const saved = localStorage.getItem('sriwijaya_peserta');
    return saved ? JSON.parse(saved) : INITIAL_PESERTA;
  });

  // State: Assessment Records
  const [records, setRecords] = useState<AssessmentRecord[]>(() => {
    const saved = localStorage.getItem('sriwijaya_records');
    return saved ? JSON.parse(saved) : INITIAL_ASSESSMENTS;
  });

  // Navigation & Flow
  const [activeStep, setActiveStep] = useState<number>(11); // Default to Dashboard (Step 11) or Login
  const [activeTab, setActiveTab] = useState<MainNavTab>('dashboard');

  // Currently Selected Peserta for Form
  const [currentPeserta, setCurrentPeserta] = useState<Peserta>(pesertaList[0] || INITIAL_PESERTA[0]);

  // Form States for current active measurement
  const [currentAktivitas, setCurrentAktivitas] = useState<AktivitasFisik>(() =>
    calculateAktivitasFisik('Jogging/Lari', '3–4 kali/minggu', '≥60 menit', 'Sedang', ['Jalan Kaki', 'Senam'])
  );

  const [currentIMT, setCurrentIMT] = useState<DataIMT>(() =>
    calculateIMT(currentPeserta.id === 'P001' ? 170 : 168, 68)
  );

  const [currentTKJI, setCurrentTKJI] = useState<DataTKJI>(() =>
    calculateTKJI(currentPeserta.jenisKelamin, 2500, 48, 58, 8.2, 32)
  );

  const [currentFunctional, setCurrentFunctional] = useState<DataFunctionalFitness>(() =>
    calculateFunctionalFitness(currentPeserta.umur, 27, 130, 50, 28, 92, 88, 110)
  );

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sriwijaya_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('sriwijaya_peserta', JSON.stringify(pesertaList));
  }, [pesertaList]);

  useEffect(() => {
    localStorage.setItem('sriwijaya_records', JSON.stringify(records));
  }, [records]);

  // Handle Login / Logout
  const handleLoginSuccess = (newUser: UserProfile) => {
    setUser(newUser);
    setActiveStep(11); // Go to Dashboard
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser((prev) => ({ ...prev, isLoggedIn: false }));
    setActiveStep(1); // Go to Login
  };

  // Save Peserta
  const handleSavePeserta = (peserta: Peserta) => {
    const exists = pesertaList.some((p) => p.id === peserta.id);
    let updatedList: Peserta[];
    if (exists) {
      updatedList = pesertaList.map((p) => (p.id === peserta.id ? peserta : p));
    } else {
      updatedList = [peserta, ...pesertaList];
    }
    setPesertaList(updatedList);
    setCurrentPeserta(peserta);
  };

  // Build current assessment record from form state
  const currentRecord: AssessmentRecord = {
    id: `REC-${currentPeserta.id}`,
    peserta: currentPeserta,
    aktivitas: currentAktivitas,
    imt: currentIMT,
    tkji: currentTKJI,
    functional: currentFunctional,
    evaluation: evaluateSriwijayaSportTec(currentAktivitas, currentIMT, currentTKJI, currentFunctional),
    tanggal: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
  };

  // Save record when completing steps
  const saveCurrentRecord = () => {
    const existingIndex = records.findIndex((r) => r.peserta.id === currentPeserta.id);
    let updatedRecords: AssessmentRecord[];
    if (existingIndex >= 0) {
      updatedRecords = [...records];
      updatedRecords[existingIndex] = currentRecord;
    } else {
      updatedRecords = [currentRecord, ...records];
    }
    setRecords(updatedRecords);
  };

  // Handle Tab Selection from Sidebar
  const handleSelectTab = (tab: MainNavTab) => {
    setActiveTab(tab);
    if (tab === 'dashboard') setActiveStep(11);
    else if (tab === 'peserta') setActiveStep(2);
    else if (tab === 'aktivitas') setActiveStep(3);
    else if (tab === 'imt') setActiveStep(4);
    else if (tab === 'tkji') setActiveStep(5);
    else if (tab === 'functional') setActiveStep(6);
    else if (tab === 'laporan') setActiveStep(10);
    else if (tab === 'pengaturan') setActiveStep(1);
  };

  // Select participant for test
  const handleSelectPesertaForTest = (peserta: Peserta) => {
    setCurrentPeserta(peserta);
    // Find existing assessment if present
    const existing = records.find((r) => r.peserta.id === peserta.id);
    if (existing) {
      setCurrentAktivitas(existing.aktivitas);
      setCurrentIMT(existing.imt);
      setCurrentTKJI(existing.tkji);
      setCurrentFunctional(existing.functional);
    } else {
      // default template
      setCurrentIMT(calculateIMT(170, 68));
    }
    setActiveTab('tes');
    setActiveStep(3); // Start test at Aktivitas Fisik
  };

  const handleAddNewPeserta = () => {
    const newId = `P${String(pesertaList.length + 1).padStart(3, '0')}`;
    const newPeserta: Peserta = {
      id: newId,
      nama: '',
      jenisKelamin: 'Laki-laki',
      tanggalLahir: '1998-05-10',
      umur: 28,
      komunitas: 'Runner Palembang',
      noHp: '',
      alamat: 'Palembang, Sumatera Selatan',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setCurrentPeserta(newPeserta);
    setActiveTab('tes');
    setActiveStep(2);
  };

  const handleDeletePeserta = (id: string) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus peserta ini?')) {
      setPesertaList(pesertaList.filter((p) => p.id !== id));
      setRecords(records.filter((r) => r.peserta.id !== id));
    }
  };

  // Render main content area depending on current step / tab
  const renderContent = () => {
    if (!user.isLoggedIn || activeStep === 1) {
      return <Screen1Login onLoginSuccess={handleLoginSuccess} />;
    }

    if (activeTab === 'peserta') {
      return (
        <DataPesertaList
          pesertaList={pesertaList}
          records={records}
          onSelectPesertaForTest={handleSelectPesertaForTest}
          onViewReport={(peserta, rec) => {
            setCurrentPeserta(peserta);
            if (rec) {
              setCurrentAktivitas(rec.aktivitas);
              setCurrentIMT(rec.imt);
              setCurrentTKJI(rec.tkji);
              setCurrentFunctional(rec.functional);
            } else {
              setCurrentIMT(calculateIMT(170, 68));
            }
            setActiveTab('laporan');
            setActiveStep(10);
          }}
          onAddNewPeserta={handleAddNewPeserta}
          onSavePeserta={handleSavePeserta}
          onDeletePeserta={handleDeletePeserta}
        />
      );
    }

    if (activeTab === 'pengaturan') {
      return <PengaturanView />;
    }

    // Step-by-Step Flow Screen Switching
    switch (activeStep) {
      case 1:
        return <Screen1Login onLoginSuccess={handleLoginSuccess} />;
      case 2:
        return (
          <Screen2DataPeserta
            currentPeserta={currentPeserta}
            onSavePeserta={handleSavePeserta}
            onNext={() => setActiveStep(3)}
          />
        );
      case 3:
        return (
          <Screen3AktivitasFisik
            currentAktivitas={currentAktivitas}
            onSaveAktivitas={(akt) => {
              setCurrentAktivitas(akt);
              saveCurrentRecord();
            }}
            onPrev={() => setActiveStep(2)}
            onNext={() => setActiveStep(4)}
          />
        );
      case 4:
        return (
          <Screen4HitungIMT
            peserta={currentPeserta}
            currentIMT={currentIMT}
            onSaveIMT={(imtData) => {
              setCurrentIMT(imtData);
              saveCurrentRecord();
            }}
            onPrev={() => setActiveStep(3)}
            onNext={() => setActiveStep(5)}
          />
        );
      case 5:
        return (
          <Screen5TesTKJI
            peserta={currentPeserta}
            currentTKJI={currentTKJI}
            onSaveTKJI={(tkjiData) => {
              setCurrentTKJI(tkjiData);
              saveCurrentRecord();
            }}
            onPrev={() => setActiveStep(4)}
            onNext={() => setActiveStep(6)}
          />
        );
      case 6:
        return (
          <Screen6FunctionalFitness
            peserta={currentPeserta}
            currentFunctional={currentFunctional}
            onSaveFunctional={(funcData) => {
              setCurrentFunctional(funcData);
              saveCurrentRecord();
            }}
            onPrev={() => setActiveStep(5)}
            onNext={() => setActiveStep(7)}
          />
        );
      case 7:
        return (
          <Screen7AnalisisSistem
            record={currentRecord}
            onPrev={() => setActiveStep(6)}
            onNext={() => {
              saveCurrentRecord();
              setActiveStep(8);
            }}
          />
        );
      case 8:
        return (
          <Screen8KategoriHasil
            record={currentRecord}
            onPrev={() => setActiveStep(7)}
            onNext={() => setActiveStep(9)}
          />
        );
      case 9:
        return (
          <Screen9RekomendasiAktivitas
            record={currentRecord}
            onPrev={() => setActiveStep(8)}
            onNext={() => setActiveStep(10)}
          />
        );
      case 10:
        return (
          <Screen10CetakLaporan
            record={currentRecord}
            onPrev={() => setActiveStep(9)}
            onNext={() => setActiveStep(11)}
          />
        );
      case 11:
        return (
          <Screen11DashboardSummary
            records={records}
            pesertaList={pesertaList}
            onSelectPesertaForTest={handleSelectPesertaForTest}
            onPrev={() => setActiveStep(10)}
            onNext={() => setActiveStep(12)}
          />
        );
      case 12:
        return (
          <Screen12Selesai
            onReturnToDashboard={() => {
              setActiveStep(11);
              setActiveTab('dashboard');
            }}
            onNewAssessment={handleAddNewPeserta}
          />
        );
      default:
        return (
          <Screen11DashboardSummary
            records={records}
            pesertaList={pesertaList}
            onSelectPesertaForTest={handleSelectPesertaForTest}
            onPrev={() => setActiveStep(10)}
            onNext={() => setActiveStep(12)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800 flex flex-col">
      {/* Header Bar */}
      <Header
        user={user}
        onLogout={handleLogout}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />

      {/* Top Workflow Navigator (1 to 12) */}
      {user.isLoggedIn && (
        <StepFlowNav
          currentStep={activeStep}
          onSelectStep={(stepNum) => {
            setActiveStep(stepNum);
            setActiveTab('dashboard');
          }}
        />
      )}

      {/* Main Body with Sidebar & Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {user.isLoggedIn && (
          <Sidebar
            activeTab={activeTab}
            onSelectTab={handleSelectTab}
            onLogout={handleLogout}
          />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
