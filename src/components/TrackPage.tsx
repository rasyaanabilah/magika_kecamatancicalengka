/**
 * Component: TrackPage
 * Deskripsi: Halaman Pelacakan Status Pendaftaran Magang publik
 * berdasarkan Nomor Pendaftaran (contoh: MAG-2026-XXXXX).
 */

import React, { useState, useEffect } from "react";
import {
  Search,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  XCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Application } from "../types";
// @ts-ignore
import logoMagika from "../assets/images/logo_magika.png";

interface TrackPageProps {
  applications: Application[];
  onNavigateHome: () => void;
  initialSearchId?: string | null;
}

export default function TrackPage({
  applications,
  onNavigateHome,
  initialSearchId,
}: TrackPageProps) {
  const [searchId, setSearchId] = useState(initialSearchId || "");
  const [searched, setSearched] = useState(!!initialSearchId);
  const [matchedAppId, setMatchedAppId] = useState<string | null>(
    initialSearchId || null,
  );
  const [directMatchedApp, setDirectMatchedApp] = useState<Application | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState("");
  const [isSearchingDirect, setIsSearchingDirect] = useState(false);

  // Derived dynamically from parent array to ensure real-time reactive updates
  const matchedApp =
    (matchedAppId
      ? applications.find((app) => app.id === matchedAppId)
      : null) || directMatchedApp;

  useEffect(() => {
    if (initialSearchId) {
      setSearchId(initialSearchId);
      setSearched(true);
      handleSearch(initialSearchId);
    }
  }, [initialSearchId]);

  const handleSearch = async (idToSearch: string) => {
    const cleanId = idToSearch.trim().toUpperCase();
    if (!cleanId) return;

    setDirectMatchedApp(null);
    const found = applications.find(
      (app) => (app.id || "").toUpperCase() === cleanId,
    );
    if (found) {
      setMatchedAppId(found.id);
      setErrorMsg("");
      setSearched(true);
    } else {
      setIsSearchingDirect(true);
      try {
        const { doc, getDoc } = await import("firebase/firestore");
        const { db } = await import("../firebase");
        const docRef = doc(db, "pendaftar_magang", cleanId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const { id: _ignoredId, ...rest } = data as Application;
          const appWithId: Application = {
            ...rest,
            id: docSnap.id,
          };
          setDirectMatchedApp(appWithId);
          setMatchedAppId(docSnap.id || cleanId);
          setErrorMsg("");
        } else {
          setMatchedAppId(null);
          setDirectMatchedApp(null);
          setErrorMsg(
            "Nomor pendaftaran tidak ditemukan atau belum terdaftar. Pastikan format penulisan benar (contoh: MAG-2026-00010).",
          );
        }
      } catch (err) {
        console.error(
          "Failed to fetch application directly from Firestore:",
          err,
        );
        setMatchedAppId(null);
        setDirectMatchedApp(null);
        setErrorMsg(
          "Nomor pendaftaran tidak ditemukan atau belum terdaftar. Pastikan format penulisan benar (contoh: MAG-2026-00010).",
        );
      } finally {
        setIsSearchingDirect(false);
        setSearched(true);
      }
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchId);
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans flex flex-col justify-between selection:bg-blue-500 selection:text-white"
      id="track-page-root"
    >
      {/* Header */}
      <nav
        className="bg-white border-b border-slate-200 sticky top-0 z-40 px-4 py-3 md:px-8 flex items-center justify-between"
        id="track-nav"
      >
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={onNavigateHome}
        >
          <div className="h-9 w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src={logoMagika}
              alt="Logo Magika"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <div className="font-display font-bold text-base text-slate-900 leading-none tracking-tight">
              MAGIKA
            </div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
              Kecamatan Cicalengka
            </div>
          </div>
        </div>

        <button
          onClick={onNavigateHome}
          className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Beranda
        </button>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 md:py-12 space-y-8">
        {/* Title Banner */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-slate-950 tracking-tight">
            Cek Status <span className="text-blue-600">Pendaftaran</span> Anda
          </h1>
          <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
            Masukkan Nomor Pendaftaran unik yang Anda dapatkan setelah
            mengirimkan berkas registrasi untuk meninjau progres verifikasi dari
            tim Kecamatan Cicalengka.
          </p>
        </div>

        {/* Search Card Section */}
        <div className="max-w-xl mx-auto bg-white border border-slate-200 p-5 rounded-3xl shadow-xl shadow-slate-100 space-y-4">
          <form onSubmit={onSubmit} className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              Nomor Pendaftaran Magang
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchId}
                  onChange={(e) => {
                    setSearchId(e.target.value);
                    if (errorMsg) setErrorMsg("");
                  }}
                  placeholder="Contoh: MAG-2026-00010"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-2xl text-sm focus:outline-hidden focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all font-semibold uppercase placeholder:normal-case placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>
              <button
                type="submit"
                disabled={isSearchingDirect}
                className="py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-2xl transition-all cursor-pointer shadow-md shadow-blue-500/10 flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed min-w-[140px]"
              >
                {isSearchingDirect ? (
                  <>
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Mencari...
                  </>
                ) : (
                  <>
                    Cek Status <Search className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Guidelines on where to find the registration ID */}
          {!searched && (
            <div className="bg-blue-50/50 border border-blue-100 p-3.5 rounded-2xl flex gap-3 items-start text-xs">
              <AlertCircle className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-blue-800">
                  Bagaimana Cara Mengetahui Nomor Pendaftaran?
                </span>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  Nomor pendaftaran dapat Anda lihat setelah masuk ke{" "}
                  <span className="font-semibold text-blue-600">
                    Dashboard Pendaftar
                  </span>{" "}
                  pada bagian atas kartu berkas aktif atau histori pendaftaran.
                  Format nomor resmi adalah{" "}
                  <span className="font-mono font-bold text-slate-700">
                    MAG-YYYY-XXXXX
                  </span>
                  .
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Results Area */}
        <AnimatePresence mode="wait">
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {matchedApp ? (
                <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
                  {matchedApp.status === "Lulus" && (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-8 md:p-10 text-center space-y-4 shadow-md">
                      <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <CheckCircle className="h-8 w-8 text-emerald-600" />
                      </div>
                      <h2 className="font-display font-black text-2xl md:text-3xl text-emerald-950 tracking-tight">
                        Selamat! Anda Dinyatakan Lulus Seleksi
                      </h2>
                      <p className="text-emerald-800 text-sm md:text-base font-semibold max-w-lg mx-auto leading-relaxed">
                        Pendaftaran Anda dengan nomor{" "}
                        <span className="font-mono bg-emerald-100/50 px-2 py-0.5 rounded-md text-emerald-900 font-bold">
                          {matchedApp.id}
                        </span>{" "}
                        dinyatakan LULUS. Silakan login ke akun Anda dan unduh
                        surat untuk dikirim ke Badan Kesatuan Bangsa dan Politik Kabupaten Bandung.
                      </p>
                    </div>
                  )}

                  {matchedApp.status === "Menunggu" && (
                    <div className="bg-amber-50 border border-amber-200 rounded-3xl p-8 md:p-10 text-center space-y-4 shadow-md">
                      <div className="h-16 w-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <Clock className="h-8 w-8 text-amber-600 animate-pulse" />
                      </div>
                      <h2 className="font-display font-black text-2xl md:text-3xl text-amber-950 tracking-tight">
                        Berkas Anda Sedang Dalam Proses Verifikasi
                      </h2>
                      <p className="text-amber-800 text-sm md:text-base font-semibold max-w-lg mx-auto leading-relaxed">
                        Pendaftaran Anda dengan nomor{" "}
                        <span className="font-mono bg-amber-100/50 px-2 py-0.5 rounded-md text-amber-900 font-bold">
                          {matchedApp.id}
                        </span>{" "}
                        sedang ditinjau oleh tim Kecamatan Cicalengka.
                      </p>
                      <p className="text-slate-500 text-xs max-w-md mx-auto">
                        Status saat ini:{" "}
                        <span className="px-2.5 py-1 bg-amber-100 border border-amber-300 rounded-lg text-amber-800 font-bold uppercase tracking-wider text-[10px]">
                          {matchedApp.status}
                        </span>
                      </p>
                      <div className="text-xs bg-amber-50/50 p-4 rounded-2xl border border-amber-100 text-left text-amber-800 leading-relaxed font-medium max-w-md mx-auto">
                        <span className="font-bold">Informasi:</span> Proses
                        peninjauan berkas pendaftaran membutuhkan waktu 1-3 hari
                        kerja. Silakan cek berkala halaman ini.
                      </div>
                    </div>
                  )}

                  {matchedApp.status === "Ditolak" && (
                    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 md:p-10 text-center space-y-4 shadow-md">
                      <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-inner">
                        <AlertCircle className="h-8 w-8 text-rose-600" />
                      </div>
                      <h2 className="font-display font-black text-2xl md:text-3xl text-rose-950 tracking-tight">
                        Pendaftaran Ditolak
                      </h2>
                      <p className="text-rose-800 text-sm md:text-base font-semibold max-w-lg mx-auto leading-relaxed">
                        Pendaftaran Anda dengan nomor{" "}
                        <span className="font-mono bg-rose-100/50 px-2 py-0.5 rounded-md text-rose-900 font-bold">
                          {matchedApp.id}
                        </span>{" "}
                        dinyatakan ditolak.
                      </p>
                      {matchedApp.rejectionReason && (
                        <div className="bg-white border border-rose-200 p-5 rounded-2xl max-w-md mx-auto text-left shadow-xs space-y-2">
                          <span className="font-bold text-rose-900 text-xs uppercase tracking-wider block border-b border-rose-100 pb-1.5">
                            Alasan Penolakan:
                          </span>
                          <p className="text-rose-950 text-xs font-bold leading-relaxed">
                            "{matchedApp.rejectionReason}"
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="max-w-md mx-auto text-center space-y-4 bg-white border border-slate-200 p-8 rounded-3xl shadow-sm">
                  <div className="h-16 w-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto">
                    <XCircle className="h-8 w-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-slate-900 text-lg">
                      Nomor Pendaftaran Tidak Terdaftar
                    </h3>
                    <p className="text-slate-500 text-xs leading-relaxed">
                      {errorMsg ||
                        "Nomor pendaftaran tidak ditemukan atau belum terdaftar. Silakan periksa kembali."}
                    </p>
                  </div>
                  <div className="text-xs bg-slate-50 p-3 rounded-2xl border border-slate-200 text-left text-slate-600 leading-relaxed font-medium space-y-1">
                    <span className="font-bold text-slate-800">
                      Tips Pencarian:
                    </span>
                    <ul className="list-disc pl-4 space-y-0.5 text-[11px]">
                      <li>
                        Pastikan Anda menyertakan tanda hubung (
                        <span className="font-mono font-bold">-</span>) dengan
                        benar.
                      </li>
                      <li>
                        Nomor pendaftaran peka terhadap penulisan kapital
                        (contoh:{" "}
                        <span className="font-mono font-bold text-slate-800">
                          MAG-2026-00001
                        </span>
                        ).
                      </li>
                      <li>
                        Jika baru mendaftar, pastikan berkas telah berhasil
                        dikirim dengan status Sukses.
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 text-center text-xs border-t border-slate-800 mt-12">
        <div className="max-w-5xl mx-auto px-4 space-y-2">
          <div className="font-bold text-slate-200">
            MAGIKA Kecamatan Cicalengka
          </div>
          <div className="text-[11px]">
            © 2026 MAGICKA Cicalengka District. Digital Empowerment for School and University Students. All Rights Reserved. By Programmer Rasyaa Nabilah.
          </div>
        </div>
      </footer>
    </div>
  );
}
