/**
 * Component: StudentDashboard
 * Deskripsi: Halaman Utama Portal Peserta Magang yang mengelola navigasi tab
 * (Ikhtisar, Berkas Permohonan, Laporan Akhir, Dokumen Kelulusan, dan Pengaturan).
 */

import React, { useState } from "react";
import {
  User as UserIcon,
  FileText,
  Award,
  Settings,
  LogOut,
  Clipboard,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Application, Surat, User as UserType } from "../../types";

// Import modular components
import StudentOverview from "./StudentOverview";
import StudentApplication from "./StudentApplication";
import StudentGraduation from "./StudentGraduation";
import StudentReport from "./StudentReport";
import StudentSettings from "./StudentSettings";
// @ts-ignore
import logoMagika from "../../assets/images/logo_magika.png";

interface StudentDashboardProps {
  currentUser: UserType;
  applications: Application[];
  onNavigateForm: () => void;
  onResubmitApplication: (application: Application) => void;
  onLogout: () => void;
  onDeleteApplication: () => void; // Untuk keperluan testing / reset form pendaftaran
  whatsappLink?: string;
  onUpdateApplication?: (updatedApp: Application) => Promise<void> | void;
  onUpdateUser?: (updatedUser: UserType) => void;
  suratList?: Surat[];
}

export default function StudentDashboard({
  currentUser,
  applications,
  onNavigateForm,
  onResubmitApplication,
  onLogout,
  whatsappLink,
  onUpdateApplication,
  onUpdateUser,
  suratList = [],
}: StudentDashboardProps) {
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    string | null
  >(null);
  const application =
    applications.find((app) => app.id === selectedApplicationId) ||
    applications[0] ||
    null;
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "permohonan" | "pengaturan" | "laporan" | "kelulusan"
  >("dashboard");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setIsEditingProfile] = useState(false);

  const applicationIds = new Set(applications.map((app) => app.id));
  const normalizedStudentEmail = (currentUser.email || "").trim().toLowerCase();
  const isStudentRecipient = (recipientId?: string) => {
    if (!recipientId) return false;
    return (
      recipientId === currentUser.id ||
      applicationIds.has(recipientId) ||
      recipientId.trim().toLowerCase() === normalizedStudentEmail
    );
  };

  // Cocokkan surat dengan seluruh riwayat pendaftaran akun, bukan hanya yang sedang dipilih.
  const studentSuratList = (suratList || []).filter(
    (s) =>
      s.penerimaIds?.some(isStudentRecipient) ||
      s.daftarPesertaSurat?.some(
        (p) =>
          isStudentRecipient(p.id) ||
          p.email?.trim().toLowerCase() === normalizedStudentEmail,
      ),
  );
  const studentSurat = studentSuratList.length > 0 ? studentSuratList[0] : null;

  React.useEffect(() => {
    if (
      activeTab === "kelulusan" &&
      application?.kategoriPendaftar === "siswa" &&
      studentSuratList.length === 0
    ) {
      setActiveTab("dashboard");
    }
  }, [activeTab, application, studentSuratList.length]);

  const handleUpdateApplication = async (updatedApp: Application) => {
    if (onUpdateApplication) {
      await onUpdateApplication(updatedApp);
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-blue-500 selection:text-white"
      id="student-portal-container"
    >
      {/* DESKTOP SIDEBAR - Hidden on mobile, sticky on desktop */}
      <aside
        className="w-60 bg-slate-900 text-slate-400 hidden lg:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-slate-800"
        id="student-desktop-sidebar"
      >
        <div className="p-5 space-y-6">
          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <img
                src={logoMagika}
                alt="Logo Magika"
                className="h-full w-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="font-display font-extrabold text-base text-white leading-none">
                MAGIKA
              </div>
              <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                Portal Peserta
              </div>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="space-y-1 text-xs">
            {/* Dashboard Utama */}
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <UserIcon className="h-4 w-4" />
              <span>Dashboard Utama</span>
            </button>

            {/* Berkas Permohonan */}
            <button
              onClick={() => setActiveTab("permohonan")}
              className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                activeTab === "permohonan"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <FileText className="h-4 w-4" />
              <span>Berkas Permohonan</span>
            </button>

            {/* Dokumen Kelulusan (Only if Accepted and NOT siswa) */}
            {(studentSuratList.length > 0 ||
              (application &&
                ["Lulus", "Selesai"].includes(application.status) &&
                application.kategoriPendaftar !== "siswa")) && (
              <button
                onClick={() => setActiveTab("kelulusan")}
                className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                  activeTab === "kelulusan"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Award className="h-4 w-4" />
                <span>Dokumen Kelulusan</span>
              </button>
            )}

            {/* Satu halaman laporan untuk seluruh riwayat pendaftaran akun */}
            {applications.length > 0 && (
              <button
                onClick={() => setActiveTab("laporan")}
                className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                  activeTab === "laporan"
                    ? "bg-blue-600 text-white"
                    : "hover:bg-slate-800 hover:text-slate-200"
                }`}
              >
                <Clipboard className="h-4 w-4" />
                <span>Laporan Akhir</span>
              </button>
            )}

            {/* Profil & Pengaturan */}
            <button
              onClick={() => setActiveTab("pengaturan")}
              className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                activeTab === "pengaturan"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Profil & Pengaturan</span>
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full px-3.5 py-2.5 bg-slate-850 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 font-semibold rounded-lg text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER - Only visible on screens < lg */}
      <header
        className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white/90 px-4 md:px-6 flex lg:hidden items-center justify-between shrink-0 shadow-sm backdrop-blur-md"
        id="student-header"
      >
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src={logoMagika}
              alt="Logo Magika"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-display font-extrabold text-base text-slate-900 leading-none">
              MAGIKA
            </div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Portal Peserta
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMenuOpen(true)}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
          id="student-hamburger-btn"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* MOBILE DRAWER NAVIGATION - Overlay menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-50 flex lg:hidden"
            id="student-drawer-container"
          >
            {/* Backdrop blur overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Drawer container panel */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-72 max-w-sm bg-slate-900 text-slate-400 h-full flex flex-col justify-between shadow-2xl z-10 p-5"
            >
              <div className="space-y-6">
                {/* Logo and close */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 bg-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      <img
                        src={logoMagika}
                        alt="Logo Magika"
                        className="h-full w-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <div className="font-display font-extrabold text-base text-white leading-none">
                        MAGIKA
                      </div>
                      <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
                        Portal Peserta
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-all cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Navigation Menus */}
                <nav className="space-y-1.5 text-xs">
                  {/* Dashboard Utama */}
                  <button
                    onClick={() => {
                      setActiveTab("dashboard");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                      activeTab === "dashboard"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <UserIcon className="h-4 w-4" />
                    <span>Dashboard Utama</span>
                  </button>

                  {/* Berkas Permohonan */}
                  <button
                    onClick={() => {
                      setActiveTab("permohonan");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                      activeTab === "permohonan"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <FileText className="h-4 w-4" />
                    <span>Berkas Permohonan</span>
                  </button>

                  {/* Dokumen Kelulusan */}
                  {(studentSuratList.length > 0 ||
                    (application &&
                      ["Lulus", "Selesai"].includes(application.status) &&
                      application.kategoriPendaftar !== "siswa")) && (
                    <button
                      onClick={() => {
                        setActiveTab("kelulusan");
                        setIsMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                        activeTab === "kelulusan"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Award className="h-4 w-4" />
                      <span>Dokumen Kelulusan</span>
                    </button>
                  )}

                  {/* Satu halaman laporan untuk seluruh riwayat pendaftaran akun */}
                  {applications.length > 0 && (
                    <button
                      onClick={() => {
                        setActiveTab("laporan");
                        setIsMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                        activeTab === "laporan"
                          ? "bg-blue-600 text-white"
                          : "hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      <Clipboard className="h-4 w-4" />
                      <span>Laporan Akhir</span>
                    </button>
                  )}

                  {/* Profil & Pengaturan */}
                  <button
                    onClick={() => {
                      setActiveTab("pengaturan");
                      setIsMenuOpen(false);
                    }}
                    className={`w-full px-3.5 py-2.5 rounded-lg font-semibold flex items-center gap-3 transition-all duration-200 cursor-pointer ${
                      activeTab === "pengaturan"
                        ? "bg-blue-600 text-white"
                        : "hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <Settings className="h-4 w-4" />
                    <span>Profil & Pengaturan</span>
                  </button>
                </nav>
              </div>

              {/* Logout inside drawer */}
              <div className="pt-5 border-t border-slate-800">
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-850 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 font-semibold rounded-lg text-xs flex items-center gap-3 transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 text-rose-500" />
                  <span>Keluar Sesi</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <main
          className="flex-1 p-4 sm:p-5 lg:p-6 overflow-y-auto space-y-6"
          id="student-main-content"
        >
          {/* Active Tab rendering */}
          {activeTab === "dashboard" && (
            <StudentOverview
              currentUser={currentUser}
              application={application}
              onNavigateForm={onNavigateForm}
              onResubmitApplication={onResubmitApplication}
              whatsappLink={whatsappLink}
              setActiveTab={setActiveTab}
              setIsEditingProfile={setIsEditingProfile}
            >
              {applications.length > 0 && (
                <section
                  className="space-y-3"
                  aria-labelledby="student-application-history-title"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h2
                      id="student-application-history-title"
                      className="font-display font-extrabold text-sm text-slate-900"
                    >
                      Riwayat Pendaftaran ({applications.length})
                    </h2>
                    <button
                      onClick={onNavigateForm}
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      Daftar Magang Lagi
                    </button>
                  </div>
                  <div className="divide-y divide-slate-200 border border-slate-200 bg-white rounded-xl overflow-hidden shadow-xs">
                    {applications.map((app) => (
                      <button
                        key={app.id}
                        onClick={() => setSelectedApplicationId(app.id)}
                        aria-pressed={application?.id === app.id}
                        className={`w-full px-4 py-2.5 text-left transition-colors duration-200 cursor-pointer ${
                          application?.id === app.id
                            ? "bg-blue-50"
                            : "hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                          <span className="font-mono text-xs font-bold text-slate-800">
                            {app.id}
                          </span>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {app.status} · {app.tglDaftar}
                          </span>
                        </span>
                        <span className="mt-1 block truncate text-xs text-slate-600">
                          {app.tujuanMagang || "Pendaftaran magang"}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              )}
            </StudentOverview>
          )}

          {activeTab === "permohonan" && (
            <StudentApplication
              application={application}
              onNavigateForm={onNavigateForm}
            />
          )}

          {activeTab === "kelulusan" && application && (
            <StudentGraduation
              currentUser={currentUser}
              application={application}
              applications={applications}
              studentSurat={studentSurat}
              studentSuratList={studentSuratList}
            />
          )}

          {activeTab === "laporan" && application && (
            <StudentReport
              currentUser={currentUser}
              applications={applications}
              onUpdateApplication={handleUpdateApplication}
            />
          )}

          {activeTab === "pengaturan" && (
            <StudentSettings
              currentUser={currentUser}
              onUpdateUser={onUpdateUser}
            />
          )}
        </main>
      </div>
    </div>
  );
}
