/**
 * Component: StudentReport
 * Deskripsi: Sub-komponen Laporan Akhir Magang bagi mahasiswa untuk mengunggah
 * tautan laporan hasil kegiatan magang ke Firestore.
 */

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  CheckCircle2 
} from 'lucide-react';
import { Application } from '../../types';

interface StudentReportProps {
  application: Application;
  onUpdateApplication: (updatedApp: Application) => Promise<void>;
}

export default function StudentReport({
  application,
  onUpdateApplication
}: StudentReportProps) {
  const [laporanTitle, setLaporanTitle] = useState('');
  const [laporanRingkasan, setLaporanRingkasan] = useState('');
  const [laporanFile, setLaporanFile] = useState<string | null>(null);
  const [laporanSuccess, setLaporanSuccess] = useState(false);
  const [laporanError, setLaporanError] = useState<string | null>(null);
  const [isUploadingLaporan, setIsUploadingLaporan] = useState(false);
  const [isEditingLaporan, setIsEditingLaporan] = useState(false);

  useEffect(() => {
    if (application?.laporan) {
      setLaporanTitle(application.laporan.judul);
      setLaporanRingkasan(application.laporan.ringkasan || '');
      setLaporanFile(application.laporan.fileName);
      if (!isEditingLaporan) {
        setLaporanSuccess(true);
      }
    } else {
      setLaporanTitle('');
      setLaporanRingkasan('');
      setLaporanFile(null);
      setLaporanSuccess(false);
    }
  }, [application, isEditingLaporan]);

  const handleLaporanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLaporanError('');
    if (!laporanTitle || !laporanFile) {
      setLaporanError('Mohon isi judul dan masukkan link Google Drive laporan terlebih dahulu.');
      return;
    }

    if (!laporanFile.trim().startsWith('http://') && !laporanFile.trim().startsWith('https://')) {
      setLaporanError('Tautan harus berupa URL yang valid (dimulai dengan http:// atau https://).');
      return;
    }
    
    setIsUploadingLaporan(true);
    try {
      const updatedApp: Application = {
        ...application,
        laporan: {
          judul: laporanTitle,
          ringkasan: laporanRingkasan,
          fileName: laporanFile.trim(),
          fileSize: 'Google Drive Link',
          uploadedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
          status: 'Menunggu',
          fileData: laporanFile.trim()
        }
      };
      await onUpdateApplication(updatedApp);
      setLaporanSuccess(true);
      setIsEditingLaporan(false);
    } catch (err: any) {
      console.error("Gagal mengirim laporan magang:", err);
      setLaporanError(err.message || 'Gagal menyimpan laporan akhir ke Firestore.');
    } finally {
      setIsUploadingLaporan(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in font-sans" id="tab-content-laporan">
      <div>
        <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Unggah Laporan Akhir Magang</h4>
        <p className="text-xs text-slate-500 mt-1">Setelah masa penugasan selesai, lengkapi data laporan akhir Anda untuk kebutuhan evaluasi kegiatan program magang oleh Kepala Seksi dan Camat.</p>
      </div>

      {laporanSuccess && application?.laporan ? (
        <div className="space-y-6">
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-3 text-emerald-850 text-xs font-semibold">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-slate-900 text-sm">Laporan Akhir Berhasil Dikirim!</p>
              <p className="text-slate-600 font-normal">Berkas laporan Anda telah ter-sinkronisasi ke sistem. Kepala Seksi dan Camat dapat langsung meninjau data laporan riil Anda.</p>
              <div className="pt-1 flex gap-2">
                <span className="text-slate-400 font-normal">Diunggah pada: {application.laporan.uploadedAt}</span>
              </div>
            </div>
          </div>

          <div className="border border-slate-150 rounded-2xl p-5 space-y-4 bg-slate-50/50">
            <div>
              <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Judul Laporan Magang</span>
              <span className="font-extrabold text-slate-800 text-sm">{application.laporan.judul}</span>
            </div>

            {application.laporan.ringkasan && (
              <div>
                <span className="text-slate-400 font-bold block uppercase text-[9px] tracking-wider">Ringkasan Laporan</span>
                <p className="text-slate-600 text-xs mt-1 text-justify leading-relaxed">{application.laporan.ringkasan}</p>
              </div>
            )}

            <div className="pt-2 border-t border-slate-150 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <FileText className="h-4 w-4 text-blue-600" />
                <span>Dokumen: <a href={application.laporan.fileData || application.laporan.fileName} target="_blank" rel="noopener noreferrer" className="font-extrabold text-blue-600 hover:underline">Buka File</a></span>
              </div>
              <button 
                onClick={() => {
                  setIsEditingLaporan(true);
                  setLaporanSuccess(false);
                }}
                className="px-4 py-2 border border-amber-200 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-xl text-xs transition-colors cursor-pointer"
              >
                Ubah Laporan
              </button>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleLaporanSubmit} className="space-y-5 max-w-xl">
          {laporanError && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-800 text-xs font-semibold rounded-2xl flex items-center gap-2 animate-fade-in">
              <span className="inline-block w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
              {laporanError}
            </div>
          )}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Judul Laporan Magang</label>
            <input 
              type="text" 
              value={laporanTitle}
              onChange={(e) => setLaporanTitle(e.target.value)}
              placeholder="Contoh: Digitalisasi Pengelolaan Kearsipan Kependudukan Cicalengka" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Ringkasan Laporan</label>
            <textarea 
              value={laporanRingkasan}
              onChange={(e) => setLaporanRingkasan(e.target.value)}
              placeholder="Tulis ringkasan laporan akhir, latar belakang program, dan tujuan integrasi sistem digital Anda..." 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-medium"
              rows={3}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Dokumen Laporan (Link Google Drive)</label>
            <input 
              type="url" 
              value={laporanFile || ''}
              onChange={(e) => setLaporanFile(e.target.value)}
              placeholder="Tempelkan link Google Drive laporan di sini..." 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
              required
            />
            <p className="text-[11px] text-amber-600 font-medium leading-relaxed mt-1">
              ⚠️ PENTING: Pastikan setelan berbagi (share settings) berkas di Google Drive Anda telah diatur ke 'Siapa saja yang memiliki link dapat melihat / pengakses lihat' agar laporan dapat diperiksa oleh Petugas dan Camat.
            </p>
          </div>

          <div className="pt-2 flex gap-3">
            <button 
              type="submit"
              disabled={isUploadingLaporan}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
            >
              {isUploadingLaporan ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Mengunggah...
                </>
              ) : (
                'Kirim Laporan Akhir'
              )}
            </button>
            {application?.laporan && (
              <button 
                type="button"
                onClick={() => {
                  setIsEditingLaporan(false);
                  setLaporanSuccess(true);
                }}
                className="px-5 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl cursor-pointer transition-colors"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
