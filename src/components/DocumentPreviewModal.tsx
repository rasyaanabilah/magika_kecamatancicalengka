import React from 'react';
import { X, Download, FileText, ExternalLink } from 'lucide-react';
import { Application, FileData } from '../types';

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileName: string;
  fileType: string;
  application: Application;
}

export const openUploadedFileDirectly = (file: { name: string; url?: string }): boolean => {
  if (!file || !file.url) return false;
  
  const isImgFile = file.name.toLowerCase().endsWith('.jpg') || 
                    file.name.toLowerCase().endsWith('.jpeg') || 
                    file.name.toLowerCase().endsWith('.png') ||
                    file.name.toLowerCase().endsWith('.webp');

  if (isImgFile) return false; // Biarkan berkas terbuka di dalam modal secara normal

  try {
    const dataURI = file.url;
    if (!dataURI.startsWith('data:')) {
      window.open(dataURI, '_blank');
      return true;
    }
    const parts = dataURI.split(',');
    const byteString = atob(parts[1]);
    const mimeString = parts[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([ab], { type: mimeString });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
    return true;
  } catch (e) {
    console.error("Gagal membuka berkas secara langsung", e);
    window.open(file.url, '_blank');
    return true;
  }
};

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  fileName,
  fileType,
  application,
}) => {
  if (!isOpen) return null;

  const labelMap: Record<string, string> = {
    suratPengantar: 'Surat Pengantar Kampus / Sekolah',
    suratRekomendasi: 'Surat Rekomendasi Resmi'
  };

  const displayName = labelMap[fileType] || 'Dokumen Unggahan';

  const isImgFile = fileName.toLowerCase().endsWith('.jpg') || 
                    fileName.toLowerCase().endsWith('.jpeg') || 
                    fileName.toLowerCase().endsWith('.png') ||
                    fileName.toLowerCase().endsWith('.webp');

  const activeFile = application?.files?.[fileType as keyof typeof application.files] as FileData | undefined;

  const isImg = isImgFile || (activeFile && activeFile.type && activeFile.type.startsWith('image/'));

  React.useEffect(() => {
    if (isOpen && !isImg && activeFile && activeFile.url) {
      // Memicu pengalihan otomatis / buka tab baru secara otomatis jika dokumen berupa PDF/Non-Image
      handleOpenFull();
    }
  }, [isOpen, fileType]);

  const handleOpenFull = () => {
    try {
      if (activeFile && activeFile.url) {
        const dataURI = activeFile.url;
        if (!dataURI.startsWith('data:')) {
          window.open(dataURI, '_blank');
          return;
        }
        const parts = dataURI.split(',');
        const byteString = atob(parts[1]);
        const mimeString = parts[0].split(':')[1].split(';')[0];
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: mimeString });
        const targetUrl = URL.createObjectURL(blob);
        window.open(targetUrl, '_blank');
      }
    } catch (e) {
      console.error("Gagal membuka dokumen", e);
      if (activeFile && activeFile.url) {
        window.open(activeFile.url, '_blank');
      }
    }
  };

  const handleExportPDF = () => {
    if (activeFile && activeFile.url) {
      const link = document.createElement('a');
      link.href = activeFile.url;
      link.download = activeFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-100 flex items-center justify-center p-4 overflow-y-auto"
      id="document-preview-modal-root"
    >
      {/* Latar belakang gelap buram */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Kotak Dialog Modal */}
      <div 
        className="relative bg-white border border-slate-200 w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] animate-scale-in text-xs font-sans z-10"
        id="document-preview-modal-box"
      >
        {/* Bagian Kepala (Header) */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-display font-extrabold text-sm text-slate-800 leading-tight">
                  {displayName}
                </h4>
                {activeFile && activeFile.url && (
                  <button
                    onClick={handleOpenFull}
                    title="Buka dokumen di jendela baru dalam ukuran asli"
                    className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Buka Ukuran Asli
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5 leading-none">
                {fileName} • BERKAS RESMI PESERTA
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all cursor-pointer"
            title="Tutup Pratinjau"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Bagian Isi Konten */}
        <div className="p-6 md:p-8 overflow-y-auto bg-slate-100/40 flex-1 flex flex-col items-center">
          
          {/* Representasi Kertas Utama */}
          <div className="w-full bg-white border border-slate-200 rounded-2xl shadow-xl relative font-sans overflow-hidden min-h-[400px] max-w-4xl p-4 md:p-6">
            
            {activeFile && activeFile.url ? (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
                {activeFile.type.startsWith('image/') || isImgFile ? (
                  <div className="w-full flex justify-center p-1">
                    <img 
                      src={activeFile.url} 
                      alt={activeFile.name} 
                      className="max-w-full max-h-[70vh] object-contain rounded-xl border border-slate-100 shadow-md"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : activeFile.type === 'application/pdf' || activeFile.name.toLowerCase().endsWith('.pdf') ? (
                  <div className="w-full h-[70vh] flex flex-col">
                    <iframe 
                      src={activeFile.url} 
                      title={activeFile.name} 
                      className="w-full h-full border border-slate-200 rounded-xl shadow-inner"
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-4 py-12">
                    <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
                      <FileText className="h-8 w-8" />
                    </div>
                    <div>
                      <h5 className="font-bold text-sm text-slate-800">{activeFile.name}</h5>
                      <p className="text-[11px] text-slate-400 font-mono mt-1">Format: {activeFile.type || 'Dokumen'} • Ukuran: {activeFile.size}</p>
                      <p className="text-[11px] text-slate-500 max-w-sm mx-auto mt-2.5">
                        Berkas ini berhasil diunggah secara sah melalui portal MAGIKA. Klik tombol di bawah jika Anda ingin mengunduh atau mencetak berkas ini secara langsung.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full min-h-[400px] flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="h-16 w-16 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-150 shadow-sm">
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-slate-600">Berkas Belum Diunggah</h5>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-2.5">
                    Peserta belum mengunggah dokumen {displayName} ini atau berkas tidak tersedia.
                  </p>
                </div>
              </div>
            )}
            
          </div>
        </div>

        {/* Bagian Kaki (Footer) */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-slate-100 shrink-0 bg-slate-50/50">
          <p className="text-[10px] text-slate-400 font-bold font-mono">
            PORTAL REKRUTMEN MAGIKA • VERIFIED DIGITAL DOCUMENT
          </p>
          <div className="flex gap-2">
            <button 
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-50 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
            >
              Tutup
            </button>
            {activeFile && activeFile.url && (
              <button 
                onClick={handleExportPDF}
                className="px-4.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Unduh Berkas
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
