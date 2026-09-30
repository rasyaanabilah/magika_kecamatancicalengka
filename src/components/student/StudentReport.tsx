/**
 * Component: StudentReport
 * Deskripsi: Sub-komponen Laporan Akhir Magang bagi mahasiswa untuk mengunggah
 * tautan laporan hasil kegiatan magang ke Firestore.
 */

import React, { useState } from "react";
import { FileText, CheckCircle2, Pencil, Plus, X } from "lucide-react";
import { Application, User } from "../../types";

interface StudentReportProps {
  currentUser: User;
  applications: Application[];
  onUpdateApplication: (updatedApp: Application) => Promise<void>;
}

export default function StudentReport({
  currentUser,
  applications,
  onUpdateApplication,
}: StudentReportProps) {
  const [laporanTitle, setLaporanTitle] = useState("");
  const [laporanRingkasan, setLaporanRingkasan] = useState("");
  const [laporanFile, setLaporanFile] = useState<string | null>(null);
  const [laporanError, setLaporanError] = useState<string | null>(null);
  const [isUploadingLaporan, setIsUploadingLaporan] = useState(false);
  const [formMode, setFormMode] = useState<"new" | "edit" | null>(null);
  const [selectedApplicationId, setSelectedApplicationId] = useState("");

  const reportableApplications = applications.filter(
    (application) => application.status === "Lulus" && !application.laporan,
  );
  const archivedApplications = applications.filter(
    (application) => application.laporan,
  );

  const startNewReport = () => {
    const firstApplication = reportableApplications[0];
    if (!firstApplication) return;
    setSelectedApplicationId(firstApplication.id);
    setLaporanTitle("");
    setLaporanRingkasan("");
    setLaporanFile(null);
    setLaporanError(null);
    setFormMode("new");
  };

  const startEditingReport = (application: Application) => {
    setSelectedApplicationId(application.id);
    setLaporanTitle(application.laporan?.judul || "");
    setLaporanRingkasan(application.laporan?.ringkasan || "");
    setLaporanFile(application.laporan?.fileName || null);
    setLaporanError(null);
    setFormMode("edit");
  };

  const handleLaporanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLaporanError("");
    const application = applications.find(
      (item) => item.id === selectedApplicationId,
    );
    if (!application) {
      setLaporanError("Pilih pendaftaran yang akan dikaitkan dengan laporan.");
      return;
    }
    if (
      formMode === "new" &&
      (application.status !== "Lulus" || application.laporan)
    ) {
      setLaporanError(
        "Pendaftaran ini belum memenuhi syarat atau sudah memiliki laporan.",
      );
      return;
    }
    if (!laporanTitle || !laporanFile) {
      setLaporanError("Mohon isi judul dan tautan Google Drive laporan.");
      return;
    }

    if (
      !laporanFile.trim().startsWith("http://") &&
      !laporanFile.trim().startsWith("https://")
    ) {
      setLaporanError("Tautan harus dimulai dengan http:// atau https://.");
      return;
    }

    setIsUploadingLaporan(true);
    try {
      const updatedApp: Application = {
        ...application,
        laporan: {
          userId: currentUser.id,
          pendaftarId: application.id,
          judul: laporanTitle,
          ringkasan: laporanRingkasan,
          fileName: laporanFile.trim(),
          fileSize: "Google Drive Link",
          uploadedAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          fileData: laporanFile.trim(),
        },
      };
      await onUpdateApplication(updatedApp);
      setFormMode(null);
    } catch (err: any) {
      console.error("Gagal mengirim laporan magang:", err);
      setLaporanError(
        err.message || "Gagal menyimpan laporan akhir ke Firestore.",
      );
    } finally {
      setIsUploadingLaporan(false);
    }
  };

  return (
    <div
      className="space-y-5 animate-fade-in font-sans"
      id="tab-content-laporan"
    >
      <section className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div>
          <h4 className="font-display font-extrabold text-base text-slate-900">
            Laporan Akhir Magang
          </h4>
          <p className="text-xs text-slate-500 mt-1">
            Arsip laporan untuk seluruh pendaftaran pada akun Anda.
          </p>
        </div>
        {reportableApplications.length > 0 && (
          <button
            type="button"
            onClick={startNewReport}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-all duration-200 hover:shadow-sm cursor-pointer flex items-center gap-2"
          >
            <Plus className="h-4 w-4" /> Upload Laporan
          </button>
        )}
      </section>

      {formMode && (
        <form
          onSubmit={handleLaporanSubmit}
          className="space-y-4 border-b border-slate-200 pb-5"
        >
          <div className="flex items-center justify-between gap-3">
            <h5 className="font-bold text-sm text-slate-900">
              {formMode === "edit" ? "Ubah Laporan" : "Upload Laporan Baru"}
            </h5>
            <button
              type="button"
              onClick={() => setFormMode(null)}
              aria-label="Tutup formulir"
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="space-y-1.5 max-w-xl">
            <label
              className="text-xs font-bold text-slate-700"
              htmlFor="report-registration"
            >
              Nomor Pendaftaran
            </label>
            {formMode === "new" ? (
              <select
                id="report-registration"
                value={selectedApplicationId}
                onChange={(event) =>
                  setSelectedApplicationId(event.target.value)
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              >
                {applications.map((application) => {
                  const isReportable =
                    application.status === "Lulus" && !application.laporan;
                  const unavailableReason = application.laporan
                    ? " (sudah ada laporan)"
                    : application.status !== "Lulus"
                      ? " (belum berstatus Lulus)"
                      : "";

                  return (
                    <option
                      key={application.id}
                      value={application.id}
                      disabled={!isReportable}
                    >
                      {application.id}
                      {unavailableReason}
                    </option>
                  );
                })}
              </select>
            ) : (
              <p className="text-xs font-mono font-bold text-slate-800">
                {selectedApplicationId}
              </p>
            )}
          </div>

          {laporanError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-lg">
              {laporanError}
            </div>
          )}

          <div className="space-y-3.5 max-w-xl">
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold text-slate-700"
                htmlFor="report-title"
              >
                Judul Laporan Magang
              </label>
              <input
                id="report-title"
                type="text"
                value={laporanTitle}
                onChange={(event) => setLaporanTitle(event.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold text-slate-700"
                htmlFor="report-summary"
              >
                Ringkasan Laporan
              </label>
              <textarea
                id="report-summary"
                value={laporanRingkasan}
                onChange={(event) => setLaporanRingkasan(event.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                rows={3}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label
                className="text-xs font-bold text-slate-700"
                htmlFor="report-file"
              >
                Dokumen Laporan (Link Google Drive)
              </label>
              <input
                id="report-file"
                type="url"
                value={laporanFile || ""}
                onChange={(event) => setLaporanFile(event.target.value)}
                placeholder="Tempelkan link Google Drive laporan di sini"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                required
              />
              <p className="text-[11px] text-amber-700">
                Pastikan akses Google Drive mengizinkan petugas dan camat
                melihat berkas.
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isUploadingLaporan}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg disabled:opacity-50 transition-all duration-200 hover:shadow-sm cursor-pointer"
            >
              {isUploadingLaporan
                ? "Menyimpan..."
                : formMode === "edit"
                  ? "Simpan Perubahan"
                  : "Kirim Laporan"}
            </button>
            <button
              type="button"
              onClick={() => setFormMode(null)}
              className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-lg transition-colors duration-200 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      <section className="space-y-3" aria-labelledby="report-archive-title">
        <h5
          id="report-archive-title"
          className="font-bold text-sm text-slate-900"
        >
          Arsip Laporan ({archivedApplications.length})
        </h5>
        {archivedApplications.length > 0 ? (
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {archivedApplications.map((application) => {
              const report = application.laporan!;
              return (
                <article
                  key={application.id}
                  className="py-3.5 flex flex-wrap items-start justify-between gap-3"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="font-mono text-xs font-bold text-blue-700">
                      No. Pendaftaran: {report.pendaftarId || application.id}
                    </p>
                    <p className="font-bold text-sm text-slate-900">
                      {report.judul}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {report.uploadedAt} · Akun:{" "}
                      {report.userId || currentUser.id}
                    </p>
                    {report.ringkasan && (
                      <p className="text-xs text-slate-600 mt-2">
                        {report.ringkasan}
                      </p>
                    )}
                    <a
                      href={report.fileData || report.fileName}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-1"
                    >
                      <FileText className="h-3.5 w-3.5" /> Buka / Unduh Laporan
                    </a>
                  </div>
                  <button
                    type="button"
                    onClick={() => startEditingReport(application)}
                    className="px-3 py-1.5 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs transition-colors duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Ubah Laporan
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center text-xs text-slate-500">
            Belum ada laporan akhir yang diarsipkan.
            {reportableApplications.length === 0 &&
              " Tombol upload tersedia setelah pendaftaran berstatus Lulus."}
          </div>
        )}
      </section>
    </div>
  );
}
