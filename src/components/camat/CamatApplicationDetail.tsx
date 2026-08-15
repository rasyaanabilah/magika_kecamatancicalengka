import React from "react";
import { ArrowLeft, Folder, ExternalLink } from "lucide-react";
import { Application } from "../../types";

interface CamatApplicationDetailProps {
  selectedApp: Application;
  onBack: () => void;
}

/**
 * Component: CamatApplicationDetail
 * Deskripsi: Halaman rinci audit berkas pendaftaran calon peserta magang untuk Bapak Camat,
 * menampilkan biodata pribadi, data pendidikan, tautan folder Google Drive, serta status administrasi.
 */
export const CamatApplicationDetail: React.FC<CamatApplicationDetailProps> = ({
  selectedApp,
  onBack,
}) => {
  return (
    <div className="space-y-6 animate-fade-in" id="camat-full-page-detail">
      {/* Tombol Kembali & Bar Status */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <button
          onClick={onBack}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali ke Dashboard
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-bold">
            Status Evaluasi Berkas:
          </span>
          {selectedApp.status === "Lulus" && (
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300">
              Lulus
            </span>
          )}
          {selectedApp.status === "Ditolak" && (
            <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-300">
              Ditolak
            </span>
          )}
          {selectedApp.status === "Menunggu" && (
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-300">
              Menunggu
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Extensive Data sheets */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal & Campus Summary */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs text-xs text-slate-600">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">
                Biodata Calon Magang
              </h4>
              <span className="font-mono text-[10px] text-slate-400">
                ID DAFTAR: {selectedApp.id}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Data Pribadi */}
              <div className="space-y-2.5">
                <h5 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-50 pb-1.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" />{" "}
                  Profil Pribadi
                </h5>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      Nama Lengkap:
                    </span>
                    <span className="font-extrabold text-slate-800 text-xs">
                      {selectedApp.namaLengkap}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      Gender:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedApp.jenisKelamin}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      No. HP WA:
                    </span>
                    <span className="font-mono text-slate-800 font-bold">
                      {selectedApp.noHp}
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 font-semibold block mb-0.5">
                      Alamat Lengkap KTP:
                    </span>
                    <p className="text-slate-750 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl leading-relaxed break-words whitespace-pre-wrap overflow-hidden [word-break:break-word] w-full max-w-full">
                      {selectedApp.alamatLengkap}
                    </p>
                  </div>
                </div>
              </div>

              {/* Data Kampus */}
              <div className="space-y-2.5">
                <h5 className="font-extrabold text-slate-800 text-[10px] uppercase tracking-wider border-b border-slate-50 pb-1.5 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full" />{" "}
                  Profil Pendidikan
                </h5>
                <div className="space-y-1.5">
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      Instansi Pendidikan:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedApp.instansiPendidikan ?? "-"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      Fakultas / Kelas:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedApp.fakultas || "-"}
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      Jurusan:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedApp.prodi} (Semester {selectedApp.semester})
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-slate-400 font-semibold shrink-0 w-36">
                      Durasi Magang:
                    </span>
                    <span className="text-slate-800 font-bold">
                      {selectedApp.durasi} ({selectedApp.tanggalMulai} s.d{" "}
                      {selectedApp.tanggalSelesai})
                    </span>
                  </div>
                  <div className="space-y-1 pt-1">
                    <span className="text-slate-400 font-semibold block mb-0.5">
                      Tujuan & Motivasi Magang:
                    </span>
                    <p className="text-slate-750 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl leading-relaxed italic break-words whitespace-pre-wrap overflow-hidden [word-break:break-word] w-full max-w-full">
                      "{selectedApp.tujuanMagang}"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Google Drive Link on Camat audit page */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-4 shadow-xs">
            <h4 className="font-display font-extrabold text-base text-slate-900 border-b border-slate-100 pb-3">
              Berkas Lampiran Persyaratan (Google Drive)
            </h4>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-slate-800 text-xs">
                    Folder Berkas Pendukung Peserta
                  </p>
                  <p className="text-[11px] text-slate-500 font-mono break-all mt-1 bg-white p-2 rounded-lg border border-slate-200">
                    {selectedApp.linkDrive ||
                      "https://drive.google.com/drive/folders/1NPM8E7j5i34Jov-qiRKvJA0nXw6PJKT8?usp=sharing"}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200/60">
                <a
                  href={
                    selectedApp.linkDrive ||
                    "https://drive.google.com/drive/folders/1NPM8E7j5i34Jov-qiRKvJA0nXw6PJKT8?usp=sharing"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Buka Folder Berkas
                  (Google Drive)
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Decisions read-only or timeline notes */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 text-white p-6 rounded-3xl space-y-4 shadow-lg shadow-slate-900/10 text-xs">
            <h5 className="font-display font-extrabold text-base leading-none">
              Status Administrasi
            </h5>

            <div className="space-y-4 pt-2">
              <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-1">
                <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                  Keputusan Akhir:
                </span>
                <span className="font-bold text-sm text-blue-400">
                  {selectedApp.status}
                </span>
              </div>

              {selectedApp.statusNote && (
                <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl space-y-1">
                  <span className="text-slate-400 block font-semibold text-[10px] uppercase">
                    Catatan Koordinasi:
                  </span>
                  <p className="text-slate-200 leading-relaxed font-mono text-[11px]">
                    {selectedApp.statusNote}
                  </p>
                </div>
              )}

              {selectedApp.rejectionReason && (
                <div className="p-3 bg-rose-950/40 border border-rose-900 text-rose-200 rounded-xl space-y-1">
                  <span className="text-rose-400 block font-semibold text-[10px] uppercase">
                    Alasan Penolakan:
                  </span>
                  <p className="text-rose-100 leading-relaxed">
                    {selectedApp.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
