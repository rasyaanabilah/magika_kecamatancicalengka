/**
 * Component: StudentOverview
 * Deskripsi: Sub-komponen Ringkasan Portal Peserta Magang yang menampilkan
 * status pendaftaran, linimasa verifikasi, tautan grup WhatsApp, serta profil singkat.
 */

import React from "react";
import {
  FileText,
  AlertTriangle,
  Mail,
  Phone,
  MessageCircle,
  ExternalLink,
  Eye,
} from "lucide-react";
import { Application, User as UserType } from "../../types";

interface StudentOverviewProps {
  currentUser: UserType;
  application: Application | null;
  onNavigateForm: () => void;
  whatsappLink?: string;
  setActiveTab: (
    tab: "dashboard" | "permohonan" | "pengaturan" | "laporan" | "kelulusan",
  ) => void;
  setIsEditingProfile: (isEdit: boolean) => void;
}

const getInitials = (name: string) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function StudentOverview({
  currentUser,
  application,
  onNavigateForm,
  whatsappLink,
  setActiveTab,
  setIsEditingProfile,
}: StudentOverviewProps) {
  const instansiDisplay =
    application?.instansiPendidikan ??
    currentUser.instansiPendidikan ??
    currentUser.universitas ??
    "";

  const isProfileComplete = !!(
    instansiDisplay &&
    currentUser.prodi &&
    currentUser.noHp
  );

  const getStatusBadge = (status: Application["status"]) => {
    switch (status) {
      case "Lulus":
        return (
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300 flex items-center gap-1.5">
            <span className="h-2 w-2 bg-emerald-500 rounded-full animate-ping" />
            Lulus
          </span>
        );
      case "Ditolak":
        return (
          <span className="px-3 py-1.5 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-300 flex items-center gap-1.5">
            <span className="h-2 w-2 bg-rose-500 rounded-full" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="px-3 py-1.5 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-300 flex items-center gap-1.5">
            <span className="h-2 w-2 bg-amber-500 rounded-full animate-pulse" />
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="tab-content-dashboard">
      {/* PROFILE SUMMARY HERO CARD */}
      <section
        className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-6"
        id="student-profile-hero"
      >
        <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left w-full">
          <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-blue-500 p-1 bg-white shrink-0 shadow-md mx-auto md:mx-0 flex items-center justify-center">
            {currentUser.avatarUrl ? (
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.namaLengkap}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-extrabold text-xl rounded-xl">
                {getInitials(currentUser.namaLengkap)}
              </div>
            )}
          </div>
          <div className="flex-1 space-y-2">
            <div className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest leading-none text-center md:text-left">
              Selamat Datang di Portal MAGIKA
            </div>
            <h3 className="font-display font-extrabold text-lg md:text-xl text-slate-900 leading-tight text-center md:text-left">
              Halo, {currentUser.namaLengkap}. Selamat datang di Portal MAGIKA.
            </h3>
            {isProfileComplete ? (
              <div className="pt-1 text-center md:text-left">
                <p className="text-xs text-blue-600 font-semibold">
                  {instansiDisplay} • {currentUser.prodi}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-x-4 gap-y-1.5 text-[11px] text-slate-500 mt-2 font-medium">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> {currentUser.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> {currentUser.noHp}
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {!application ? (
        /* 1A: EMPTY STATE (NOT REGISTERED YET) */
        <div
          className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center space-y-6 shadow-xs max-w-xl mx-auto"
          id="dashboard-empty-state"
        >
          <div className="flex justify-center">
            <div className="h-16 w-16 bg-blue-50 border border-blue-100 rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="font-display font-extrabold text-lg text-slate-900">
              Pendaftaran Belum Tersedia
            </h4>
            <p className="text-slate-500 text-xs md:text-sm leading-relaxed max-w-md mx-auto">
              Anda belum melakukan pendaftaran magang di portal MAGIKA. Mulailah
              perjalanan karir Anda dengan mendaftar sekarang.
            </p>
          </div>
          <button
            onClick={onNavigateForm}
            id="dashboard-start-registration-btn"
            className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/15 hover:bg-blue-700 transition-all cursor-pointer"
          >
            Daftar Magang Sekarang
          </button>
        </div>
      ) : (
        /* 1B: TRACK STATE (APPLICATION SUBMITTED) */
        <div
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          id="dashboard-track-state"
        >
          {/* Left Column: Progress status log */}
          <div
            className={`${application.status === "Ditolak" ? "lg:col-span-12" : "lg:col-span-8"} space-y-6`}
          >
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Status Berkas Permohonan
                  </span>
                  <div className="text-xs text-slate-500 font-semibold mt-0.5">
                    ID Pendaftaran:{" "}
                    <span className="font-mono text-blue-600 font-bold">
                      {application.id}
                    </span>
                  </div>
                </div>
                {getStatusBadge(application.status)}
              </div>

              {/* Timeline status list */}
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="h-6 w-6 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                      ✓
                    </div>
                    <div className="h-12 w-[2px] bg-emerald-500" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">
                      Pendaftaran Berhasil Diajukan
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      Terekam sistem pada {application.tglDaftar}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      Data Anda dan lampiran persyaratan administrasi telah
                      berhasil terekam secara sah.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        application.status !== "Menunggu"
                          ? "bg-emerald-500 text-white"
                          : "bg-blue-600 text-white animate-pulse"
                      }`}
                    >
                      {application.status !== "Menunggu" ? "✓" : "2"}
                    </div>
                    <div
                      className={`h-12 w-[2px] ${
                        application.status === "Lulus" ||
                        application.status === "Ditolak"
                          ? "bg-emerald-500"
                          : "bg-slate-200"
                      }`}
                    />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">
                      Verifikasi Kelengkapan Berkas
                    </h5>
                    <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                      Status: {application.status}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {application.status === "Menunggu" &&
                        "Berkas Anda sedang masuk dalam antrean peninjauan petugas Kecamatan Cicalengka."}
                      {application.status === "Lulus" &&
                        "Berkas dinyatakan lengkap, valid, dan memenuhi kriteria penerimaan."}
                      {application.status === "Ditolak" &&
                        "Verifikasi selesai dengan beberapa kendala administrasi."}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        application.status === "Lulus"
                          ? "bg-emerald-500 text-white"
                          : application.status === "Ditolak"
                            ? "bg-rose-500 text-white"
                            : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {application.status === "Lulus" ? "✓" : "3"}
                    </div>
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800 text-xs">
                      Pengumuman Hasil & Magang
                    </h5>
                    <p className="text-xs text-slate-500 mt-1">
                      {application.status === "Lulus" &&
                        "Selamat! Anda berhak mengikuti magang."}
                      {application.status === "Ditolak" &&
                        "Pendaftaran ditolak. Silakan lihat alasan penolakan di bawah."}
                      {application.status !== "Lulus" &&
                        application.status !== "Ditolak" &&
                        "Tahap akhir keputusan kelulusan magang."}
                    </p>
                  </div>
                </div>
              </div>

              {/* Rejection / Resubmit Actions */}
              {application.status === "Ditolak" && (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                  <div className="flex items-start gap-2 text-rose-800 text-xs font-bold">
                    <AlertTriangle className="h-4.5 w-4.5 text-rose-600 shrink-0" />
                    <div>
                      <span>Alasan Penolakan:</span>
                      <p className="font-normal mt-1 text-rose-900">
                        {application.rejectionReason ||
                          "Berkas Anda belum sesuai ketentuan."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Grup WhatsApp dan Dokumen Kelulusan */}
          {application.status !== "Ditolak" && (
            <div className="lg:col-span-4 space-y-6">
              {/* accepted candidate widgets */}
              {application.status === "Lulus" ? (
                <>
                  {/* WA Group coordinator link widget */}
                  <div className="bg-emerald-600 text-white p-5 rounded-3xl space-y-3 shadow-lg shadow-emerald-500/10">
                    <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-white" />
                    </div>
                    <h5 className="font-bold text-sm">
                      Grup WhatsApp Koordinasi
                    </h5>
                    <p className="text-[11px] text-emerald-100 leading-relaxed">
                      Pendaftar yang diterima wajib bergabung ke grup WhatsApp
                      resmi koordinasi untuk koordinasi pembagian seksi dan
                      magang.
                    </p>
                    <a
                      href={
                        whatsappLink ||
                        "https://chat.whatsapp.com/mock-magika-cicalengka"
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-emerald-700 hover:bg-emerald-50 rounded-xl text-xs font-bold transition-all shadow-xs"
                    >
                      Gabung Grup WA <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>

                  {/* Digital Documents Download buttons */}
                  {application.kategoriPendaftar !== "siswa" && (
                    <div className="bg-white border border-slate-200 rounded-3xl p-5 space-y-3.5 shadow-xs">
                      <h6 className="text-xs font-bold text-slate-800">
                        Unduh Dokumen Kelulusan
                      </h6>

                      <button
                        onClick={() => setActiveTab("kelulusan")}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200/60 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer"
                      >
                        <div className="flex items-center gap-2 text-xs">
                          <FileText className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                          <div>
                            <div className="font-bold text-slate-700">
                              Surat Kelulusan Resmi
                            </div>
                            <p className="text-[9px] text-slate-400 mt-0.5 uppercase font-semibold">
                              Ditandatangan Camat • PDF
                            </p>
                          </div>
                        </div>
                        <Eye className="h-4 w-4 text-blue-500 shrink-0" />
                      </button>
                    </div>
                  )}
                </>
              ) : application.status === "Menunggu" ? (
                // pending candidate widgets
                <div className="bg-white border border-slate-200 rounded-3xl p-6 space-y-4 shadow-xs text-xs">
                  <h6 className="font-bold text-slate-800">
                    Panduan Verifikasi Administrasi
                  </h6>
                  <p className="text-slate-500 leading-relaxed text-xs">
                    Petugas kami akan memeriksa kecocokan data Anda bersama 2
                    berkas lampiran pendukung.
                  </p>
                  <div className="space-y-3 pt-2">
                    <div className="flex gap-2.5 items-start">
                      <span className="h-4 w-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                        1
                      </span>
                      <p className="text-slate-600">
                        Pastikan nomor handphone WhatsApp aktif untuk koordinasi
                        lanjutan jika diperlukan perbaikan berkas.
                      </p>
                    </div>
                    <div className="flex gap-2.5 items-start">
                      <span className="h-4 w-4 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold font-mono text-[10px] shrink-0">
                        2
                      </span>
                      <p className="text-slate-600">
                        Lacak hasil kelulusan secara langsung dari halaman ini
                        dalam waktu 3-7 hari kerja ke depan.
                      </p>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
