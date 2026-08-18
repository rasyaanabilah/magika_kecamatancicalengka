import React, { useState } from "react";
import {
  PieChart,
  ClipboardCheck,
  Clipboard,
  Archive,
  UserCheck,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
} from "lucide-react";
import { Application, ApplicationStatus, Surat, User } from "../../types";

// Import modular sub-components
import DashboardOverview from "./DashboardOverview.tsx";
import DataPendaftaran from "./DataPendaftaran";
import LaporanMagang from "./LaporanMagang";
import DaftarAkun from "./DaftarAkun";
import SetelanProfil from "./SetelanProfil";
import KelolaSurat from "./KelolaSurat";
// @ts-ignore
import logoMagika from "../../assets/images/logo_magika.png";

interface AdminDashboardProps {
  applications: Application[];
  onUpdateStatus: (
    id: string,
    status: ApplicationStatus,
    noteOrReason: string,
  ) => void;
  onLogout: () => void;
  onUpdateApplication?: (updatedApp: Application) => void;
  whatsappLink?: string;
  setWhatsappLink?: (link: string) => void;
  onCreateApplication?: (newApp: Application) => void;
  onDeleteApplication?: (id: string) => void;
  currentUser?: User;
  users?: User[];
  onAddUser?: (user: User) => void;
  onUpdateUser?: (user: User) => void;
  onDeleteUser?: (id: string) => void;
  suratList?: Surat[];
  onCreateSurat?: (suratPayload: Record<string, unknown>) => Promise<void>;
  onDeleteSurat?: (id: string) => Promise<void>;
}

export default function AdminDashboard({
  applications = [],
  onUpdateStatus,
  onLogout,
  onUpdateApplication = () => {},
  whatsappLink = "",
  setWhatsappLink = () => {},
  onCreateApplication = () => {},
  onDeleteApplication = () => {},
  currentUser,
  users = [],
  onUpdateUser = () => {},
  suratList = [],
  onCreateSurat = async () => {},
  onDeleteSurat = async () => {},
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    | "dashboard"
    | "riwayat"
    | "laporan"
    | "kelola-akun"
    | "setelan-profil"
    | "arsip-surat"
  >("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [autoOpenCreateModal, setAutoOpenCreateModal] = useState(false);

  const handleDeleteLaporan = (appId: string) => {
    const app = applications.find((a) => a.id === appId);
    if (app && onUpdateApplication) {
      onUpdateApplication({
        ...app,
        laporan: undefined,
      });
    }
  };

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col lg:flex-row font-sans selection:bg-blue-500 selection:text-white"
      id="admin-portal-container"
    >
      {/* DESKTOP SIDEBAR - Sticky & Permanent */}
      <aside
        className="w-64 bg-slate-900 text-slate-400 hidden lg:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-slate-800"
        id="admin-sidebar"
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
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
                Portal Petugas
              </div>
            </div>
          </div>

          <nav className="space-y-1 text-xs">
            <button
              onClick={() => setActiveTab("dashboard")}
              className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <PieChart className="h-4 w-4" />
              <span>Dashboard Petugas</span>
            </button>

            <button
              onClick={() => setActiveTab("riwayat")}
              className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "riwayat"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <ClipboardCheck className="h-4 w-4" />
              <span>Data Pendaftaran</span>
            </button>

            <button
              onClick={() => setActiveTab("laporan")}
              className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "laporan"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Clipboard className="h-4 w-4" />
              <span>Laporan Magang</span>
            </button>

            <button
              onClick={() => setActiveTab("arsip-surat")}
              className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "arsip-surat"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Archive className="h-4 w-4" />
              <span>Kelola Surat</span>
            </button>

            <button
              onClick={() => setActiveTab("kelola-akun")}
              className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "kelola-akun"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <UserCheck className="h-4 w-4" />
              <span>Daftar Akun</span>
            </button>

            <button
              onClick={() => setActiveTab("setelan-profil")}
              className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
                activeTab === "setelan-profil"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                  : "hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              <Settings className="h-4 w-4" />
              <span>Setelan & Profil</span>
            </button>
          </nav>
        </div>

        <div className="p-6 border-t border-slate-800">
          <button
            onClick={onLogout}
            className="w-full px-4 py-3 bg-slate-850 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 font-semibold rounded-xl text-xs flex items-center gap-3 transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4 text-rose-500" />
            <span>Keluar Portal</span>
          </button>
        </div>
      </aside>

      {/* MOBILE HEADER & DRAWER */}
      <header
        className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex lg:hidden items-center justify-between shrink-0 shadow-xs"
        id="admin-mobile-header"
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
            <div className="font-display font-extrabold text-base text-slate-950 leading-none">
              MAGIKA
            </div>
            <div className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Portal Petugas
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 flex lg:hidden"
          id="admin-mobile-drawer"
        >
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-72 max-w-sm bg-slate-900 text-slate-400 h-full flex flex-col justify-between shadow-2xl p-6 z-10">
            <div className="space-y-8">
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
                      Portal Petugas
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1.5 text-xs">
                <button
                  onClick={() => {
                    setActiveTab("dashboard");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === "dashboard"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <PieChart className="h-4 w-4" />
                  <span>Dashboard Petugas</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("riwayat");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === "riwayat"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <ClipboardCheck className="h-4 w-4" />
                  <span>Data Pendaftaran</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("laporan");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === "laporan"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Clipboard className="h-4 w-4" />
                  <span>Laporan Magang</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("arsip-surat");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === "arsip-surat"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Archive className="h-4 w-4" />
                  <span>Kelola Surat</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("kelola-akun");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === "kelola-akun"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Daftar Akun</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("setelan-profil");
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === "setelan-profil"
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800 hover:text-slate-200"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Setelan & Profil</span>
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button
                onClick={() => {
                  onLogout();
                  setIsMobileMenuOpen(false);
                }}
                className="w-full px-4 py-3 bg-slate-850 text-slate-400 font-semibold rounded-xl text-xs flex items-center gap-3 cursor-pointer"
              >
                <LogOut className="h-4 w-4 text-red-500" />
                <span>Keluar Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* CONTENT PANELS */}
        <main
          className="flex-1 p-4 md:p-8 overflow-y-auto space-y-8 animate-fade-in"
          id="admin-main"
        >
          {/* TAB 1: DASHBOARD STATISTIK */}
          {activeTab === "dashboard" && (
            <DashboardOverview
              currentUser={currentUser ?? null}
              applications={applications}
            />
          )}

          {/* TAB 3: DATA PENDAFTARAN */}
          {activeTab === "riwayat" && (
            <DataPendaftaran
              applications={applications}
              onUpdateStatus={onUpdateStatus}
              onDeleteApplication={onDeleteApplication}
              onUpdateApplication={onUpdateApplication || (() => {})}
              onCreateApplication={onCreateApplication || (() => {})}
            />
          )}

          {/* TAB 4: LAPORAN MAGANG */}
          {activeTab === "laporan" && (
            <LaporanMagang
              applications={applications}
              onDeleteLaporan={handleDeleteLaporan}
            />
          )}

          {/* TAB 5: KELOLA SURAT */}
          {activeTab === "arsip-surat" && (
            <KelolaSurat
              applications={applications}
              users={users}
              suratList={suratList}
              onCreateSurat={onCreateSurat}
              onUpdateApplication={onUpdateApplication}
              onDeleteSurat={onDeleteSurat}
            />
          )}

          {/* TAB 6: DAFTAR AKUN */}
          {activeTab === "kelola-akun" && <DaftarAkun users={users} />}

          {/* TAB 7: SETELAN & PROFIL */}
          {activeTab === "setelan-profil" && currentUser && (
            <SetelanProfil
              currentUser={currentUser}
              onUpdateUser={onUpdateUser}
              onUpdateGroupLink={setWhatsappLink}
              groupLink={whatsappLink}
            />
          )}
        </main>
      </div>
    </div>
  );
}
