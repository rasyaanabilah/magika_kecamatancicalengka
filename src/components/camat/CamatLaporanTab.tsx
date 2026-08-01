import React from 'react';
import { Eye, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Application } from '../../types';

interface CamatLaporanTabProps {
  applications: Application[];
  activeLaporanPreviewId: string | null;
  setActiveLaporanPreviewId: (id: string | null) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  onDeleteLaporan: (appId: string) => void;
}

/**
 * Component: CamatLaporanTab
 * Deskripsi: Tab peninjauan Laporan Akhir magang untuk Bapak Camat,
 * mencakup daftar laporan yang masuk, pratinjau lembar laporan high-fidelity, dan modal konfirmasi hapus.
 */
export const CamatLaporanTab: React.FC<CamatLaporanTabProps> = ({
  applications,
  activeLaporanPreviewId,
  setActiveLaporanPreviewId,
  confirmDeleteId,
  setConfirmDeleteId,
  onDeleteLaporan
}) => {
  const applicationsWithReports = applications.filter(app => app.laporan);
  const activeLaporanPreview = applications.find(a => a.id === activeLaporanPreviewId);

  return (
    <div className="space-y-6 animate-fade-in" id="camat-laporan-tab">
      {!activeLaporanPreview ? (
        // Tabel Daftar Laporan Masuk
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
          <div className="p-6 border-b border-slate-150">
            <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Daftar Unggahan Laporan Magang</h4>
            <p className="text-xs text-slate-500 mt-1.5">Seluruh laporan akhir yang diselesaikan dan diunggah resmi oleh peserta magang aktif.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                  <th className="p-4">Peserta Magang</th>
                  <th className="p-4">Asal Instansi / Universitas</th>
                  <th className="p-4">Judul Laporan Magang</th>
                  <th className="p-4">Tanggal Unggah</th>
                  <th className="p-4 text-center">Tindakan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {applicationsWithReports.length > 0 ? (
                  applicationsWithReports.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/50 transition-colors text-xs">
                      <td className="p-4">
                        <div className="font-bold text-slate-850">{app.namaLengkap}</div>
                        <div className="text-[10px] text-slate-400 font-semibold mt-0.5">{app.id}</div>
                      </td>
                      <td className="p-4 font-semibold text-slate-700">{app.universitas}</td>
                      <td className="p-4 font-bold text-blue-700 max-w-xs truncate" title={app.laporan?.judul}>
                        {app.laporan?.judul}
                      </td>
                      <td className="p-4 font-medium text-slate-500 font-mono text-[10px]">{app.laporan?.uploadedAt}</td>
                      <td className="p-4 text-center whitespace-nowrap space-x-1.5">
                        <button 
                          onClick={() => setActiveLaporanPreviewId(app.id)}
                          className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Eye className="h-3.5 w-3.5" /> Pratinjau Laporan
                        </button>
                        <button 
                          onClick={() => setConfirmDeleteId(app.id)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Hapus
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-400 text-xs">
                      Belum ada berkas laporan magang yang diunggah oleh peserta program magang.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        // Lembar Pratinjau Laporan High-Fidelity
        <div className="space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4">
            <button 
              onClick={() => setActiveLaporanPreviewId(null)}
              className="px-4 py-2 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Laporan
            </button>
          </div>

          <div className="bg-slate-100 p-4 md:p-8 rounded-3xl border border-slate-200 max-w-3xl mx-auto shadow-inner">
            <div className="bg-white border border-slate-300 shadow-xl rounded-2xl p-6 md:p-12 font-sans text-slate-800 text-xs md:text-sm space-y-6 md:space-y-8 leading-relaxed max-w-2xl mx-auto min-h-[500px]">
              
              {/* Document Cover Header */}
              <div className="text-center space-y-3 pb-6 border-b border-slate-200">
                <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-widest font-mono">Laporan Akhir Penugasan • MAGIKA</span>
                <h3 className="font-display font-black text-slate-900 text-sm md:text-lg uppercase leading-snug">
                  {activeLaporanPreview.laporan?.judul}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  Kecamatan Cicalengka Kabupaten Bandung
                </p>
              </div>

              {/* Author Credentials */}
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-2xl text-[10px] md:text-xs grid grid-cols-1 md:grid-cols-2 gap-3 font-sans">
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wider">Nama Penyusun</span>
                  <span className="font-extrabold text-slate-800 text-sm">{activeLaporanPreview.namaLengkap}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wider">Nomor Pendaftaran</span>
                  <span className="font-bold text-slate-700 font-mono text-[11px]">{activeLaporanPreview.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-bold block uppercase text-[8px] tracking-wider">Instansi Perguruan Tinggi</span>
                  <span className="font-bold text-slate-700">{activeLaporanPreview.universitas}</span>
                </div>
              </div>

              {/* File Lampiran */}
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl text-[10px] md:text-xs flex items-center justify-between font-sans gap-4">
                <div className="flex-1 min-w-0">
                  <span className="text-blue-600 font-bold block uppercase text-[8px] tracking-wider">Berkas Dokumen Lampiran</span>
                  <span className="font-extrabold text-slate-800 text-[10px] md:text-xs break-all block mt-0.5 leading-snug">
                    {activeLaporanPreview.laporan?.fileName}
                  </span>
                  <span className="text-slate-400 font-mono text-[9px] block mt-0.5">
                    ({activeLaporanPreview.laporan?.fileSize || '3.2 MB'})
                  </span>
                </div>
                <a 
                  href={activeLaporanPreview.laporan?.fileData || activeLaporanPreview.laporan?.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs shrink-0"
                >
                  Buka File
                </a>
              </div>

              {/* Ringkasan */}
              <div className="space-y-4 text-justify leading-relaxed text-slate-700 text-xs">
                <h5 className="font-extrabold text-slate-900 border-b border-slate-100 pb-1 font-sans text-[11px] uppercase tracking-wider">RINGKASAN LAPORAN</h5>
                <p>
                  {activeLaporanPreview.laporan?.ringkasan || 'Tidak ada ringkasan.'}
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus Laporan */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" id="laporan-delete-confirm-modal">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 text-center">
            <div className="mx-auto h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">
                Konfirmasi Hapus Laporan
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data laporan akhir milik peserta <strong className="text-slate-800">{applications.find(a => a.id === confirmDeleteId)?.namaLengkap}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteLaporan(confirmDeleteId);
                  setConfirmDeleteId(null);
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
              >
                Ya, Hapus Laporan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
