/**
 * Component: StudentApplication
 * Deskripsi: Sub-komponen Berkas Permohonan Magang yang menampilkan
 * tautan Google Drive berkas pendaftaran dan panduan berkas.
 */

import React from 'react';
import { Folder, ExternalLink } from 'lucide-react';
import { Application } from '../../types';

interface StudentApplicationProps {
  application: Application | null;
  onNavigateForm: () => void;
}

export default function StudentApplication({
  application,
  onNavigateForm
}: StudentApplicationProps) {
  const driveLink = application?.linkDrive || 'https://drive.google.com/drive/folders/1NPM8E7j5i34Jov-qiRKvJA0nXw6PJKT8?usp=sharing';

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in" id="tab-content-permohonan">
      <div>
        <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Berkas Permohonan Magang</h4>
        <p className="text-xs text-slate-500 mt-1">Daftar kelengkapan form pendaftaran serta berkas digital Google Drive yang tersimpan di sistem.</p>
      </div>

      {application ? (
        <div className="space-y-6">
          {/* Summary grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
            <div>
              <div className="text-slate-400 font-medium">Nomor Pendaftaran</div>
              <div className="font-extrabold text-slate-800 font-mono text-sm mt-1">{application.id}</div>
            </div>
            <div>
              <div className="text-slate-400 font-medium">Durasi / Periode Penugasan</div>
              <div className="font-bold text-slate-800 mt-1">{application.durasi} ({application.tanggalMulai} s.d. {application.tanggalSelesai})</div>
            </div>
          </div>

          {/* Google Drive Link Section */}
          <div className="space-y-4">
            <h5 className="font-bold text-xs text-slate-800 border-b border-slate-100 pb-2">Link Google Drive Berkas Persyaratan Administrasi</h5>
            <div className="p-5 bg-white border border-slate-200 rounded-2xl space-y-4 shadow-xs">
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                  <Folder className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-extrabold text-slate-900 text-xs">Folder Berkas Pendukung (Surat Pengantar & Rekomendasi)</p>
                  <p className="text-[11px] text-slate-500 font-mono break-all mt-1 bg-slate-50 p-2 rounded-lg border border-slate-100">
                    {driveLink}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-100">
                <a 
                  href={driveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Buka Folder Berkas (Google Drive)
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-slate-400 text-xs">
          Anda belum melakukan pendaftaran berkas permohonan. Silakan klik tab Dashboard untuk memulai pendaftaran.
        </div>
      )}
    </div>
  );
}
