import React, { useState } from 'react';
import { CamatDashboardProps, CamatTab } from '../../types';
import { CamatSidebar } from './CamatSidebar';
import { CamatMobileNav } from './CamatMobileNav';
import { CamatDashboardTab } from './CamatDashboardTab';
import { CamatApplicationDetail } from './CamatApplicationDetail';
import { CamatLaporanTab } from './CamatLaporanTab';
import { CamatProfileTab } from './CamatProfileTab';

/**
 * Component: CamatDashboard
 * Deskripsi: Dashboard Executive untuk Bapak Camat Cicalengka,
 * mengorkestrasi navigasi sidebar, statistik pendaftar, audit berkas pendaftaran, 
 * peninjauan laporan akhir magang, dan setelan profil.
 */
export const CamatDashboard: React.FC<CamatDashboardProps> = ({
  applications,
  onLogout,
  currentUser,
  onUpdateApplication,
  onUpdateUser
}) => {
  // State Navigasi
  const [activeTab, setActiveTab] = useState<CamatTab>('pendaftar');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // State Pencarian & Filter
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('Semua');

  // State Detail Pendaftar & Laporan
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [activeLaporanPreviewId, setActiveLaporanPreviewId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  // State Form Profil Camat
  const [profileName, setProfileName] = useState<string>(currentUser?.namaLengkap || 'Bapak Camat Cicalengka');
  const [profilePhone, setProfilePhone] = useState<string>(currentUser?.noHp || '081234567890');
  const [profileEmail, setProfileEmail] = useState<string>(currentUser?.email || 'camat@cicalengka.go.id');
  const [profilePassword, setProfilePassword] = useState<string>(currentUser?.password || 'camat123');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string>(currentUser?.avatarUrl || '');
  const [settingsSuccessAlert, setSettingsSuccessAlert] = useState<string | null>(null);

  // Pendaftar yang sedang dipilih untuk audit detail
  const selectedApp = applications.find(a => a.id === selectedAppId);

  // Fungsi Hapus Laporan
  const handleDeleteLaporan = (appId: string) => {
    if (onUpdateApplication) {
      const targetApp = applications.find(a => a.id === appId);
      if (targetApp) {
        const updatedApp = { ...targetApp };
        delete updatedApp.laporan;
        onUpdateApplication(updatedApp);
      }
    }
  };

  // Fungsi Simpan Profil
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser && currentUser) {
      const updatedUser = {
        ...currentUser,
        namaLengkap: profileName,
        noHp: profilePhone,
        email: profileEmail,
        password: profilePassword,
        avatarUrl: profileAvatarUrl
      };
      onUpdateUser(updatedUser);
      setSettingsSuccessAlert('Profil Bapak Camat berhasil diperbarui.');
      setTimeout(() => setSettingsSuccessAlert(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-blue-500 selection:text-white" id="camat-portal-container">
      {/* DESKTOP SIDEBAR */}
      <CamatSidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedAppId={setSelectedAppId}
        onLogout={onLogout}
      />

      {/* MOBILE HEADER & DRAWER */}
      <CamatMobileNav 
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        setSelectedAppId={setSelectedAppId}
        onLogout={onLogout}
      />

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8" id="camat-main">
          
          {/* TAB 1: EXECUTIVE BRIEF & PENDAFTAR LIST */}
          {activeTab === 'pendaftar' && (
            <>
              {!selectedApp ? (
                <CamatDashboardTab 
                  currentUser={currentUser}
                  applications={applications}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  statusFilter={statusFilter}
                  setStatusFilter={setStatusFilter}
                  onSelectApp={(id) => setSelectedAppId(id)}
                />
              ) : (
                <CamatApplicationDetail 
                  selectedApp={selectedApp}
                  onBack={() => setSelectedAppId(null)}
                />
              )}
            </>
          )}

          {/* TAB 2: LAPORAN MAGANG VIEW */}
          {activeTab === 'laporan' && (
            <CamatLaporanTab 
              applications={applications}
              activeLaporanPreviewId={activeLaporanPreviewId}
              setActiveLaporanPreviewId={setActiveLaporanPreviewId}
              confirmDeleteId={confirmDeleteId}
              setConfirmDeleteId={setConfirmDeleteId}
              onDeleteLaporan={handleDeleteLaporan}
            />
          )}

          {/* TAB 3: SETELAN & PROFIL */}
          {activeTab === 'setelan' && (
            <CamatProfileTab 
              profileName={profileName}
              setProfileName={setProfileName}
              profilePhone={profilePhone}
              setProfilePhone={setProfilePhone}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              profilePassword={profilePassword}
              setProfilePassword={setProfilePassword}
              profileAvatarUrl={profileAvatarUrl}
              setProfileAvatarUrl={setProfileAvatarUrl}
              settingsSuccessAlert={settingsSuccessAlert}
              handleSaveProfile={handleSaveProfile}
            />
          )}

        </main>
      </div>
    </div>
  );
};

export default CamatDashboard;
