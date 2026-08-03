import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  Check, 
  X, 
  Trash2, 
  Eye, 
  Clock, 
  XCircle, 
  Printer,
  AlertTriangle,
  Plus,
  ClipboardCheck,
  ArrowLeft,
  FileText,
  CheckCircle,
  Pencil,
  Folder,
  ExternalLink,
  Link2
} from 'lucide-react';
import { Application, ApplicationStatus } from '../../types';
import { 
  formatIndoDate, 
  getAppEffectiveStatus, 
  getStartMonthYear, 
  parseToDate 
} from './utils.ts';

interface DataPendaftaranProps {
  applications: Application[];
  onUpdateStatus: (id: string, status: ApplicationStatus, noteOrReason: string) => void;
  onUpdateApplication: (updatedApp: Application) => void;
  onCreateApplication: (newApp: Application) => void;
  onDeleteApplication: (id: string) => void;
}

export default function DataPendaftaran({
  applications,
  onUpdateStatus,
  onUpdateApplication,
  onCreateApplication,
  onDeleteApplication
}: DataPendaftaranProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [bulanFilter, setBulanFilter] = useState('All');
  const [tahunFilter, setTahunFilter] = useState('All');
  const [customTahunInput, setCustomTahunInput] = useState('');

  // Navigation & Detail state
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Success alert
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // CRUD state
  const [isCrudModalOpen, setIsCrudModalOpen] = useState(false);
  const [crudMode, setCrudMode] = useState<'create' | 'edit'>('create');
  const [editingAppId, setEditingAppId] = useState<string | null>(null);

  // Form Fields
  const [formNama, setFormNama] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formNoHp, setFormNoHp] = useState('');
  const [formJenisKelamin, setFormJenisKelamin] = useState<'Laki-laki' | 'Perempuan'>('Laki-laki');
  const [formKategori, setFormKategori] = useState<'mahasiswa' | 'siswa'>('mahasiswa');
  const [formNim, setFormNim] = useState('');
  const [formNisn, setFormNisn] = useState('');
  const [formUniversitas, setFormUniversitas] = useState('');
  const [formFakultas, setFormFakultas] = useState('');
  const [formProdi, setFormProdi] = useState('');
  const [formSemester, setFormSemester] = useState('1');
  const [formDurasi, setFormDurasi] = useState('1 Bulan');
  const [formTanggalMulai, setFormTanggalMulai] = useState('');
  const [formTanggalSelesai, setFormTanggalSelesai] = useState('');
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('Menunggu');
  const [formTujuan, setFormTujuan] = useState('');
  const [formLinkDrive, setFormLinkDrive] = useState('');

  // Modals state
  const [acceptTargetApp, setAcceptTargetApp] = useState<Application | null>(null);
  const [rejectTargetApp, setRejectTargetApp] = useState<Application | null>(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  const showSuccess = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 4000);
  };

  const handleOpenCreate = () => {
    setCrudMode('create');
    setEditingAppId(null);
    setFormNama('');
    setFormEmail('');
    setFormNoHp('');
    setFormJenisKelamin('Laki-laki');
    setFormKategori('mahasiswa');
    setFormNim('');
    setFormNisn('');
    setFormUniversitas('');
    setFormFakultas('');
    setFormProdi('');
    setFormSemester('1');
    setFormDurasi('1 Bulan');
    setFormTanggalMulai('');
    setFormTanggalSelesai('');
    setFormStatus('Menunggu');
    setFormTujuan('');
    setFormLinkDrive('');
    setIsCrudModalOpen(true);
  };

  const handleOpenEdit = (app: Application) => {
    setCrudMode('edit');
    setEditingAppId(app.id);
    setFormNama(app.namaLengkap);
    setFormEmail(app.userEmail || '');
    setFormNoHp(app.noHp);
    setFormJenisKelamin(app.jenisKelamin as any || 'Laki-laki');
    setFormKategori(app.kategoriPendaftar || 'mahasiswa');
    setFormNim(app.nim || '');
    setFormNisn(app.nisn || '');
    setFormUniversitas(app.universitas);
    setFormFakultas(app.fakultas || '');
    setFormProdi(app.prodi || '');
    setFormSemester(app.semester || '1');
    setFormDurasi(app.durasi);
    setFormTanggalMulai(app.tanggalMulai);
    setFormTanggalSelesai(app.tanggalSelesai);
    setFormStatus(app.status);
    setFormTujuan(app.tujuanMagang);
    setFormLinkDrive(app.linkDrive || '');
    setIsCrudModalOpen(true);
  };

  const handleSaveCrud = (e: React.FormEvent) => {
    e.preventDefault();
    if (crudMode === 'create') {
      const newApp: Application = {
        id: 'MJK-' + Math.floor(100000 + Math.random() * 900000),
        namaLengkap: formNama,
        userEmail: formEmail,
        noHp: formNoHp,
        jenisKelamin: formJenisKelamin,
        alamatLengkap: 'Diinput oleh Petugas',
        universitas: formUniversitas,
        fakultas: formKategori === 'mahasiswa' ? formFakultas : '',
        prodi: formProdi,
        semester: formSemester,
        durasi: formDurasi,
        tanggalMulai: formTanggalMulai,
        tanggalSelesai: formTanggalSelesai,
        tujuanMagang: formTujuan,
        status: formStatus,
        tglDaftar: new Date().toISOString().split('T')[0],
        kategoriPendaftar: formKategori,
        nim: formKategori === 'mahasiswa' ? formNim : undefined,
        nisn: formKategori === 'siswa' ? formNisn : undefined,
        jurusan: formProdi,
        kelas: formSemester,
        linkDrive: formLinkDrive.trim()
      };
      onCreateApplication(newApp);
      showSuccess('Data pendaftaran baru berhasil ditambahkan.');
    } else {
      const existing = applications.find(a => a.id === editingAppId);
      if (existing) {
        const updatedApp: Application = {
          ...existing,
          namaLengkap: formNama,
          userEmail: formEmail,
          noHp: formNoHp,
          jenisKelamin: formJenisKelamin,
          universitas: formUniversitas,
          fakultas: formKategori === 'mahasiswa' ? formFakultas : '',
          prodi: formProdi,
          semester: formSemester,
          durasi: formDurasi,
          tanggalMulai: formTanggalMulai,
          tanggalSelesai: formTanggalSelesai,
          tujuanMagang: formTujuan,
          status: formStatus,
          kategoriPendaftar: formKategori,
          nim: formKategori === 'mahasiswa' ? formNim : undefined,
          nisn: formKategori === 'siswa' ? formNisn : undefined,
          jurusan: formProdi,
          kelas: formSemester,
          linkDrive: formLinkDrive.trim()
        };
        onUpdateApplication(updatedApp);
        showSuccess('Perubahan data pendaftaran berhasil disimpan.');
      }
    }
    setIsCrudModalOpen(false);
  };

  // Extract unique years present in applications
  const dbYears = applications
    .map(app => {
      const dateStr = app.tanggalMulaiMagang || app.tanggalMulai;
      if (dateStr) {
        try {
          const d = parseToDate(dateStr);
          if (d) return String(d.getFullYear());
        } catch {}
      }
      return null;
    })
    .filter((y): y is string => !!y);

  const baseYear = 2025;
  const currentYear = new Date().getFullYear();
  const generatedYears: string[] = [];
  for (let year = baseYear; year <= currentYear + 5; year++) {
    generatedYears.push(String(year));
  }
  const finalAvailableYears = Array.from(new Set([...generatedYears, ...dbYears])).sort();

  // Filter history list
  const filteredHistoryApps = applications.filter(app => {
    if (!app) return false;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = app.namaLengkap?.toLowerCase().includes(term);
      const matchId = app.id?.toLowerCase().includes(term);
      const matchUni = app.universitas?.toLowerCase().includes(term);
      const matchProdi = app.prodi?.toLowerCase().includes(term);
      if (!matchName && !matchId && !matchUni && !matchProdi) return false;
    }

    // Status filter
    if (statusFilter !== 'All') {
      const effStatus = getAppEffectiveStatus(app);
      if (effStatus !== statusFilter) return false;
    }

    // Month filter
    if (bulanFilter !== 'All') {
      const dateStr = app.tanggalMulaiMagang || app.tanggalMulai;
      if (!dateStr) return false;
      try {
        const d = parseToDate(dateStr);
        if (d) {
          const monthPart = String(d.getMonth() + 1).padStart(2, '0');
          if (monthPart !== bulanFilter) return false;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    }

    // Year filter
    if (tahunFilter !== 'All') {
      const dateStr = app.tanggalMulaiMagang || app.tanggalMulai;
      if (!dateStr) return false;
      try {
        const d = parseToDate(dateStr);
        if (d) {
          const yearPart = String(d.getFullYear());
          const targetYear = tahunFilter === 'custom' ? customTahunInput : tahunFilter;
          if (targetYear && yearPart !== targetYear) return false;
        } else {
          return false;
        }
      } catch {
        return false;
      }
    }

    return true;
  });

  // Grouping Selesai, Sedang Magang, Lulus, Menunggu
  const groupedHistoryMap: { [key: string]: typeof filteredHistoryApps } = {};
  const rejectedHistoryList: typeof filteredHistoryApps = [];
  const waitingHistoryList: typeof filteredHistoryApps = [];

  filteredHistoryApps.forEach(app => {
    const effStatus = getAppEffectiveStatus(app);
    if (effStatus === 'Ditolak') {
      rejectedHistoryList.push(app);
    } else if (effStatus === 'Menunggu') {
      waitingHistoryList.push(app);
    } else {
      const monthYearLabel = getStartMonthYear(app);
      if (!groupedHistoryMap[monthYearLabel]) {
        groupedHistoryMap[monthYearLabel] = [];
      }
      groupedHistoryMap[monthYearLabel].push(app);
    }
  });

  const sortedMonthKeys = Object.keys(groupedHistoryMap).sort((a, b) => {
    const appA = groupedHistoryMap[a]?.[0];
    const appB = groupedHistoryMap[b]?.[0];
    const dateA = appA?.tanggalMulaiMagang || appA?.tanggalMulai || '';
    const dateB = appB?.tanggalMulaiMagang || appB?.tanggalMulai || '';
    return dateA.localeCompare(dateB);
  });

  // Print function
  const handlePrintRiwayat = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const rowsHtml = filteredHistoryApps.map((app, index) => {
      const prodiText = app.prodi || '-';
      const startTgl = formatIndoDate(app.tanggalMulaiMagang || app.tanggalMulai);
      const endTgl = formatIndoDate(app.tanggalSelesaiMagang || app.tanggalSelesai);
      const periodeText = `${startTgl} - ${endTgl}`;
      const judulLaporan = app.laporan?.judul || '-';

      return `
        <tr>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd; text-align: center;">${index + 1}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd; font-family: monospace; white-space: nowrap;">${app.id}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd;"><b>${app.namaLengkap}</b></td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd;">${app.universitas}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd;">${prodiText}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd;">${judulLaporan}</td>
          <td style="padding: 10px 8px; border-bottom: 1px solid #ddd; white-space: nowrap; font-size: 11px;">${periodeText}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>Laporan Riwayat Pendaftaran MAGIKA</title>
          <style>
            @page { size: A4 landscape; margin: 0mm; }
            body { font-family: Arial, sans-serif; margin: 1.5cm; color: #333; }
            .meta-info { text-align: right; margin-bottom: 15px; font-size: 11px; color: #555; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px; }
            .header h2 { margin: 0; font-size: 18px; text-transform: uppercase; }
            .header p { margin: 5px 0 0 0; font-size: 12px; color: #555; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 11px; }
            th { background-color: #f1f5f9; color: #1e293b; padding: 10px 8px; font-weight: bold; text-align: left; border-top: 1px solid #333; border-bottom: 2px solid #333; text-transform: uppercase; }
            td { padding: 8px; border-bottom: 1px solid #e2e8f0; }
            @media print { body { margin: 1.5cm; } }
          </style>
        </head>
          <div class="header">
            <h2>Rekap Riwayat Pendaftaran Magang</h2>
            <p>Kecamatan Cicalengka - Program Pemberdayaan Digital MAGIKA</p>
          </div>
          <div class="meta-info">
            Tanggal Cetak: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
          <table>
            <thead>
              <tr>
                <th style="text-align: center; width: 40px;">No</th>
                <th style="width: 100px;">No. Daftar</th>
                <th>Nama Lengkap</th>
                <th>Instansi Pendidikan</th>
                <th>Program Studi</th>
                <th>Judul Laporan</th>
                <th>Periode Magang</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || '<tr><td colspan="7" style="text-align:center; padding: 20px;">Tidak ada data ditemukan</td></tr>'}
            </tbody>
          </table>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleExecuteAccept = () => {
    if (!acceptTargetApp) return;
    onUpdateStatus(acceptTargetApp.id, 'Lulus', 'Berkas pendaftaran diterima');
    onUpdateApplication({
      ...acceptTargetApp,
      status: 'Lulus',
      statusNote: 'Berkas pendaftaran diterima'
    });
    setAcceptTargetApp(null);
    showSuccess('Berkas pendaftaran berhasil disetujui.');
  };

  const handleExecuteReject = () => {
    if (!rejectTargetApp) return;
    const reason = rejectionReasonInput.trim() || 'Berkas tidak memenuhi syarat';
    onUpdateStatus(rejectTargetApp.id, 'Ditolak', reason);
    onUpdateApplication({
      ...rejectTargetApp,
      status: 'Ditolak',
      statusNote: reason,
      rejectionReason: reason
    });
    setRejectTargetApp(null);
    setRejectionReasonInput('');
    showSuccess('Berkas pendaftaran berhasil ditolak.');
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (deleteTargetId) {
      onDeleteApplication(deleteTargetId);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetName('');
      showSuccess('Data pendaftaran berhasil dihapus.');
      if (selectedAppId === deleteTargetId) {
        setSelectedAppId(null);
      }
    }
  };

  const selectedApp = applications.find(a => a.id === selectedAppId);

  // If a specific application detail is opened, show full detail page directly
  if (selectedAppId && selectedApp) {
    return (
      <div className="space-y-6 animate-fade-in" id="admin-full-page-detail">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <button 
            onClick={() => setSelectedAppId(null)}
            className="px-4 py-2 border border-slate-200 hover:bg-slate-100 bg-white text-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-xs"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Data Pendaftaran
          </button>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Status Berkas Saat Ini:</span>
            {getAppEffectiveStatus(selectedApp) === 'Lulus' && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300">Lulus (Diterima)</span>}
            {getAppEffectiveStatus(selectedApp) === 'Ditolak' && <span className="px-3 py-1 bg-rose-100 text-rose-800 text-xs font-bold rounded-lg border border-rose-300">Ditolak</span>}
            {getAppEffectiveStatus(selectedApp) === 'Sedang Magang' && <span className="px-3 py-1 bg-sky-100 text-sky-800 text-xs font-bold rounded-lg border border-sky-300">Sedang Magang</span>}
            {getAppEffectiveStatus(selectedApp) === 'Selesai' && <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-300">Selesai</span>}
            {getAppEffectiveStatus(selectedApp) === 'Menunggu' && <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-lg border border-amber-300">Menunggu</span>}
          </div>
        </div>

        {actionSuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex gap-3 items-center">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <span>{actionSuccessMsg}</span>
          </div>
        )}

        <div className="flex flex-col gap-6">
          <div className="w-full space-y-6">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-display font-extrabold text-base text-slate-900">Dokumen Pendaftaran Peserta</h4>
                <span className="text-[10px] font-mono text-slate-400 font-bold">ID: {selectedApp.id}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                <div className="space-y-4">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" /> Data Pribadi Calon Magang
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Nama Lengkap:</span>
                      <span className="font-bold text-slate-800 text-sm">{selectedApp.namaLengkap}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Jenis Kelamin:</span>
                      <span className="text-slate-800 font-bold text-sm">{selectedApp.jenisKelamin}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">No. HP WA:</span>
                      <span className="font-mono text-slate-800 font-bold text-sm">{selectedApp.noHp}</span>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Alamat Lengkap KTP:</span>
                      <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl leading-relaxed break-words whitespace-pre-wrap overflow-hidden [word-break:break-word] w-full max-w-full">
                        {selectedApp.alamatLengkap}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] border-b border-slate-100 pb-2 flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" /> Data Akademik & Program Studi
                  </h5>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Instansi Pendidikan:</span>
                      <span className="text-slate-800 font-bold text-sm">{selectedApp.universitas}</span>
                    </div>
                    {selectedApp.kategoriPendaftar === 'siswa' ? (
                      <>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">NISN:</span>
                          <span className="text-slate-800 font-bold font-mono text-sm">{selectedApp.nisn || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Kelas:</span>
                          <span className="text-slate-800 font-bold text-sm">{selectedApp.kelas || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Jurusan / Peminatan:</span>
                          <span className="text-slate-800 font-bold text-sm">{selectedApp.jurusan || selectedApp.prodi}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        {selectedApp.nim && (
                          <div className="flex items-start gap-2">
                            <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">NIM:</span>
                            <span className="text-slate-800 font-bold font-mono text-sm">{selectedApp.nim}</span>
                          </div>
                        )}
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Fakultas:</span>
                          <span className="text-slate-800 font-bold text-sm">{selectedApp.fakultas || '-'}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Program Studi:</span>
                          <span className="text-slate-800 font-bold text-sm">{selectedApp.prodi} (Semester {selectedApp.semester})</span>
                        </div>
                      </>
                    )}
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-semibold text-slate-400 shrink-0 w-36">Periode Magang:</span>
                      <span className="text-slate-800 font-bold text-sm">{selectedApp.durasi} ({selectedApp.tanggalMulai} s.d {selectedApp.tanggalSelesai})</span>
                    </div>
                    <div className="space-y-1 pt-1">
                      <span className="text-xs font-semibold text-slate-400 block mb-1">Tujuan & Motivasi Magang:</span>
                      <p className="text-sm text-slate-700 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl leading-relaxed italic break-words whitespace-pre-wrap overflow-hidden [word-break:break-word] w-full max-w-full">
                        "{selectedApp.tujuanMagang}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Drive Link */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <h5 className="font-bold text-slate-800 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-blue-500 rounded-full" /> Link Google Drive Berkas Pendukung (Surat Pengantar & Rekomendasi)
                </h5>
                
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                      <Folder className="h-4.5 w-4.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-800 text-xs">Folder Tautan Google Drive Berkas</p>
                      <p className="text-[11px] text-slate-500 font-mono break-all mt-0.5">
                        {selectedApp.linkDrive ? selectedApp.linkDrive : 'Belum ada tautan Google Drive.'}
                      </p>
                    </div>
                  </div>

                 <a
                    href={selectedApp.linkDrive || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => {
                      if (!selectedApp.linkDrive) e.preventDefault();
                    }}
                    className={`px-4 py-2 text-white font-extrabold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0 ${
                      selectedApp.linkDrive
                        ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                        : 'bg-slate-300 cursor-not-allowed pointer-events-none'
                    }`}
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    Buka Link Drive Peserta
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Accept Confirmation overlay inside detail page */}
        {acceptTargetApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 text-center">
              <div className="mx-auto h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
                <Check className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h3 className="font-display font-black text-slate-900 text-base">Konfirmasi Terima</h3>
                <p className="text-xs text-slate-500">Apakah Anda yakin ingin menerima pendaftaran dari <strong className="text-slate-800">{acceptTargetApp.namaLengkap}</strong>?</p>
              </div>
              <div className="flex justify-center gap-3">
                <button onClick={() => setAcceptTargetApp(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Batal</button>
                <button onClick={handleExecuteAccept} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md">Ya, Terima</button>
              </div>
            </div>
          </div>
        )}

        {/* Reject Confirmation overlay inside detail page */}
        {rejectTargetApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
            <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6">
              <div className="text-center space-y-4">
                <div className="mx-auto h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                  <X className="h-6 w-6" />
                </div>
                <h3 className="font-display font-black text-slate-900 text-base text-center">Konfirmasi Tolak</h3>
                <p className="text-xs text-slate-500 text-center">Berikan alasan penolakan untuk <strong className="text-slate-800">{rejectTargetApp.namaLengkap}</strong>:</p>
              </div>
              <textarea
                rows={3}
                value={rejectionReasonInput}
                onChange={(e) => setRejectionReasonInput(e.target.value)}
                placeholder="Alasan penolakan..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden mt-4 font-semibold"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button onClick={() => setRejectTargetApp(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Batal</button>
                <button onClick={handleExecuteReject} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md">Tolak</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in" id="admin-riwayat-tab">
      {actionSuccessMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex gap-3 items-center shadow-xs">
          <CheckCircle className="h-5 w-5 text-emerald-600" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display font-extrabold text-xl text-slate-900 leading-none">Data Pendaftaran</h3>
          <p className="text-xs text-slate-500 mt-1.5">Sistem monitoring terpusat seluruh data pendaftaran magang.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/10 font-sans"
            id="btn-tambah-pendaftaran-manual-riwayat"
          >
            <Plus className="h-4 w-4" /> Tambah Pendaftar Manual
          </button>
          
          <button 
            onClick={handlePrintRiwayat}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-blue-500/10 font-sans"
          >
            <Printer className="h-4 w-4" /> Cetak Laporan / Unduh PDF
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <section className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col xl:flex-row xl:items-center justify-between gap-4 shadow-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari nama, kampus, ID pendaftaran..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 cursor-pointer text-slate-800"
            >
              <option value="All">Semua Status</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Sedang Magang">Sedang Magang</option>
              <option value="Selesai">Selesai</option>
              <option value="Ditolak">Ditolak</option>
              <option value="Lulus">Lulus</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Bulan Mulai:</span>
            <select
              value={bulanFilter}
              onChange={(e) => setBulanFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 cursor-pointer text-slate-800"
            >
              <option value="All">Semua Bulan</option>
              <option value="01">Januari</option>
              <option value="02">Februari</option>
              <option value="03">Maret</option>
              <option value="04">April</option>
              <option value="05">Mei</option>
              <option value="06">Juni</option>
              <option value="07">Juli</option>
              <option value="08">Agustus</option>
              <option value="09">September</option>
              <option value="10">Oktober</option>
              <option value="11">November</option>
              <option value="12">Desember</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tahun Mulai:</span>
            <select
              value={tahunFilter}
              onChange={(e) => {
                setTahunFilter(e.target.value);
                if (e.target.value !== 'custom') {
                  setCustomTahunInput('');
                }
              }}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 cursor-pointer text-slate-800"
            >
              <option value="All">Semua Tahun</option>
              {finalAvailableYears.map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
              <option value="custom">Ketik Manual...</option>
            </select>

            {tahunFilter === 'custom' && (
              <input
                type="text"
                placeholder="e.g. 2026"
                value={customTahunInput}
                onChange={(e) => setCustomTahunInput(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-blue-500 text-slate-800 w-36"
              />
            )}
          </div>
        </div>
      </section>

      {/* Grid groups */}
      <div className="space-y-8">
        {/* Waiting */}
        {waitingHistoryList.length > 0 && (
          <div className="bg-white border border-amber-200 rounded-3xl overflow-hidden shadow-xs shadow-amber-500/5">
            <div className="p-4 bg-amber-50/50 border-b border-amber-100 flex items-center justify-between px-6">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-amber-100/80 text-amber-600 flex items-center justify-center">
                  <Clock className="h-4 w-4 animate-pulse" />
                </div>
                <div>
                  <h4 className="font-display font-black text-sm text-amber-900 leading-none">Pendaftaran Menunggu Persetujuan (Belum Diproses)</h4>
                  <p className="text-[10px] text-amber-600 font-bold mt-1">Total: {waitingHistoryList.length} Peserta Menunggu</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 pl-6">ID Daftar</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Asal Instansi & Program Studi</th>
                    <th className="p-4">Periode Magang</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {waitingHistoryList.map((app) => (
                    <tr key={app.id} className="hover:bg-amber-50/10 transition-colors">
                      <td className="p-4 pl-6 font-mono text-[11px] font-bold text-slate-500">{app.id}</td>
                      <td className="p-4 font-semibold text-slate-900">{app.namaLengkap}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{app.universitas}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {app.kategoriPendaftar === 'siswa' 
                            ? `${app.jurusan || app.prodi} (${app.kelas || app.semester})` 
                            : `${app.prodi} (Semester ${app.semester})`
                          }
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-800">
                          {formatIndoDate(app.tanggalMulaiMagang || app.tanggalMulai)} s.d.
                        </div>
                        <div className="font-semibold text-slate-800">
                          {formatIndoDate(app.tanggalSelesaiMagang || app.tanggalSelesai)}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200">
                          Menunggu
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap space-x-1">
                        <button 
                          onClick={() => setAcceptTargetApp(app)}
                          title="Terima"
                          className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => {
                            setRejectTargetApp(app);
                            setRejectionReasonInput('');
                          }}
                          title="Tolak"
                          className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setSelectedAppId(app.id)}
                          title="Lihat Detail / Tinjau Berkas"
                          className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <ClipboardCheck className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(app)}
                          title="Edit Data Pendaftar"
                          className="p-2 bg-slate-50 hover:bg-slate-600 text-slate-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Monthly lists */}
        {sortedMonthKeys.map((monthKey) => {
          const appsInMonth = groupedHistoryMap[monthKey] || [];
          if (appsInMonth.length === 0) return null;

          return (
            <div key={monthKey} className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
              <div className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between px-6">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-900 leading-none">Bulan {monthKey}</h4>
                    <p className="text-[10px] text-slate-500 mt-1">Total: {appsInMonth.length} Peserta Magang</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                      <th className="p-4 pl-6">ID Daftar</th>
                      <th className="p-4">Nama Lengkap</th>
                      <th className="p-4">Asal Instansi & Program Studi</th>
                      <th className="p-4">Periode Magang</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {appsInMonth.map((app) => {
                      const effStatus = getAppEffectiveStatus(app);
                      return (
                        <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="p-4 pl-6 font-mono text-[11px] font-bold text-slate-500">{app.id}</td>
                          <td className="p-4 font-semibold text-slate-900">{app.namaLengkap}</td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-700">{app.universitas}</div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {app.kategoriPendaftar === 'siswa' 
                                ? `${app.jurusan || app.prodi} (${app.kelas || app.semester})` 
                                : `${app.prodi} (Semester ${app.semester})`
                              }
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-800">
                              {formatIndoDate(app.tanggalMulaiMagang || app.tanggalMulai)} s.d.
                            </div>
                            <div className="font-semibold text-slate-800">
                              {formatIndoDate(app.tanggalSelesaiMagang || app.tanggalSelesai)}
                            </div>
                          </td>
                          <td className="p-4">
                            {effStatus === 'Sedang Magang' && (
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 text-[10px] font-bold rounded-md border border-sky-200">
                                Sedang Magang
                              </span>
                            )}
                            {effStatus === 'Selesai' && (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">
                                Selesai
                              </span>
                            )}
                            {effStatus === 'Lulus' && (
                              <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-200">
                                Lulus
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center whitespace-nowrap space-x-1">
                            <button 
                              onClick={() => setSelectedAppId(app.id)}
                              title="Lihat Detail / Tinjau Berkas"
                              className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                            >
                              <ClipboardCheck className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleOpenEdit(app)}
                              title="Edit Data Pendaftar"
                              className="p-2 bg-slate-50 hover:bg-slate-600 text-slate-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button 
                              onClick={() => handleDelete(app.id, app.namaLengkap)}
                              title="Hapus Berkas"
                              className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}

        {/* Rejected */}
        {rejectedHistoryList.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="p-4 bg-slate-50 border-b border-slate-150 flex items-center justify-between px-6">
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <XCircle className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 leading-none">Berkas Ditolak / Tidak Memenuhi Syarat</h4>
                  <p className="text-[10px] text-slate-500 mt-1">Total: {rejectedHistoryList.length} Pendaftaran</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="p-4 pl-6">ID Daftar</th>
                    <th className="p-4">Nama Lengkap</th>
                    <th className="p-4">Asal Instansi & Program Studi</th>
                    <th className="p-4">Alasan Penolakan Berkas</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rejectedHistoryList.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/40 transition-colors">
                      <td className="p-4 pl-6 font-mono text-[11px] font-bold text-slate-500">{app.id}</td>
                      <td className="p-4 font-semibold text-slate-900">{app.namaLengkap}</td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700">{app.universitas}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
                          {app.kategoriPendaftar === 'siswa' 
                            ? `${app.jurusan || app.prodi} (${app.kelas || app.semester})` 
                            : `${app.prodi} (Semester ${app.semester})`
                          }
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 italic max-w-xs truncate" title={app.rejectionReason || app.statusNote}>
                        {app.rejectionReason || app.statusNote || 'Tidak disebutkan'}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-md border border-rose-200">
                          Ditolak
                        </span>
                      </td>
                      <td className="p-4 text-center whitespace-nowrap space-x-1">
                        <button 
                          onClick={() => setSelectedAppId(app.id)}
                          title="Lihat Detail / Tinjau Berkas"
                          className="p-2 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <ClipboardCheck className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleOpenEdit(app)}
                          title="Edit Data Pendaftar"
                          className="p-2 bg-slate-50 hover:bg-slate-600 text-slate-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(app.id, app.namaLengkap)}
                          title="Hapus Berkas"
                          className="p-2 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Empty state */}
        {sortedMonthKeys.length === 0 && rejectedHistoryList.length === 0 && waitingHistoryList.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center shadow-xs">
            <div className="h-12 w-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-6 w-6" />
            </div>
            <h5 className="font-display font-extrabold text-base text-slate-800 leading-none">Tidak Ada Data Ditemukan</h5>
            <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
              Silakan sesuaikan kriteria pencarian atau filter status dan bulan mulai magang Anda.
            </p>
          </div>
        )}
      </div>

      {/* CRUD Add/Edit Modal */}
      {isCrudModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">
                {crudMode === 'create' ? 'Tambah Data Pendaftar Baru' : `Ubah Data Pendaftar: ${editingAppId}`}
              </h3>
              <button 
                onClick={() => setIsCrudModalOpen(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCrud} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="font-bold text-slate-700">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    required
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Contoh: Muhammad Rafli"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Email</label>
                  <input 
                    type="email" 
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="email@mahasiswa.ac.id (Opsional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">No. HP WhatsApp</label>
                  <input 
                    type="text" 
                    value={formNoHp}
                    onChange={(e) => setFormNoHp(e.target.value)}
                    placeholder="08xxxxxxxxxx (Opsional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-mono font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jenis Kelamin</label>
                  <select 
                    value={formJenisKelamin}
                    onChange={(e) => setFormJenisKelamin(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kategori Pendaftar *</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setFormKategori('mahasiswa')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        formKategori === 'mahasiswa'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Mahasiswa
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormKategori('siswa')}
                      className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all cursor-pointer ${
                        formKategori === 'siswa'
                          ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/10'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Siswa
                    </button>
                  </div>
                </div>

                {formKategori === 'mahasiswa' ? (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">NIM (Nomor Induk Mahasiswa)</label>
                    <input 
                      type="text" 
                      value={formNim}
                      onChange={(e) => setFormNim(e.target.value)}
                      placeholder="Masukkan NIM (Opsional)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                    />
                  </div>
                ) : (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">NISN (Nomor Induk Siswa)</label>
                    <input 
                      type="text" 
                      value={formNisn}
                      onChange={(e) => setFormNisn(e.target.value)}
                      placeholder="Masukkan NISN (Opsional)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Asal Instansi Pendidikan *</label>
                  <input 
                    type="text" 
                    required
                    value={formUniversitas}
                    onChange={(e) => setFormUniversitas(e.target.value)}
                    placeholder="Contoh: Universitas Padjadjaran atau SMKN 1 Cicalengka"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>

                {formKategori === 'mahasiswa' && (
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700">Fakultas</label>
                    <input 
                      type="text" 
                      value={formFakultas}
                      onChange={(e) => setFormFakultas(e.target.value)}
                      placeholder="Contoh: MIPA / Teknik (Opsional)"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-medium text-slate-800"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Jurusan / Program Studi</label>
                  <input 
                    type="text" 
                    value={formProdi}
                    onChange={(e) => setFormProdi(e.target.value)}
                    placeholder="Contoh: Teknik Informatika (Opsional)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">
                    {formKategori === 'mahasiswa' ? 'Semester' : 'Kelas'}
                  </label>
                  <input 
                    type="text" 
                    value={formSemester}
                    onChange={(e) => setFormSemester(e.target.value)}
                    placeholder={formKategori === 'mahasiswa' ? "Contoh: 5 (Opsional)" : "Contoh: XI (11) (Opsional)"}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Durasi Magang *</label>
                  <select 
                    required
                    value={['1 Bulan', '2 Bulan', '3 Bulan', '6 Bulan'].includes(formDurasi) ? formDurasi : (formDurasi ? 'Lainnya' : '1 Bulan')}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === 'Lainnya') {
                        setFormDurasi('');
                      } else {
                        setFormDurasi(val);
                      }
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-800 cursor-pointer"
                  >
                    <option value="1 Bulan">1 Bulan</option>
                    <option value="2 Bulan">2 Bulan</option>
                    <option value="3 Bulan">3 Bulan</option>
                    <option value="6 Bulan">6 Bulan</option>
                    <option value="Lainnya">Lainnya</option>
                  </select>
                  {!['1 Bulan', '2 Bulan', '3 Bulan', '6 Bulan'].includes(formDurasi) && (
                    <input 
                      type="text"
                      value={formDurasi}
                      onChange={(e) => setFormDurasi(e.target.value)}
                      placeholder="Ketik durasi magang manual"
                      className="w-full px-3 py-2 mt-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                      required
                    />
                  )}
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Mulai Magang *</label>
                  <input 
                    type="date" 
                    required
                    value={formTanggalMulai}
                    onChange={(e) => setFormTanggalMulai(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Tanggal Selesai Magang *</label>
                  <input 
                    type="date" 
                    required
                    value={formTanggalSelesai}
                    onChange={(e) => setFormTanggalSelesai(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-slate-800"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Status Pendaftaran</label>
                  <select 
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold text-blue-600 cursor-pointer"
                  >
                    <option value="Menunggu">Menunggu</option>
                    <option value="Lulus">Lulus</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Link Google Drive Berkas Pendukung</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <input
                    type="url"
                    value={formLinkDrive}
                    onChange={(e) => setFormLinkDrive(e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-hidden focus:border-blue-500 font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">Tujuan & Motivasi Magang</label>
                <textarea 
                  rows={3}
                  value={formTujuan}
                  onChange={(e) => setFormTujuan(e.target.value)}
                  placeholder="Ceritakan singkat motivasi program magang..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-medium leading-relaxed text-slate-800"
                />
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setIsCrudModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10"
                >
                  {crudMode === 'create' ? 'Tambah Data' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 text-center">
            <div className="mx-auto h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">Konfirmasi Hapus</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pendaftar <strong className="text-slate-800">{deleteTargetName}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetName('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accept Confirmation Modal */}
      {acceptTargetApp && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 text-center">
            <div className="mx-auto h-12 w-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">Konfirmasi Terima</h3>
              <p className="text-xs text-slate-500">Apakah Anda yakin ingin menerima pendaftaran dari <strong className="text-slate-800">{acceptTargetApp.namaLengkap}</strong>? Status akan diubah langsung menjadi <strong className="text-emerald-600">Lulus</strong>.</p>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={() => setAcceptTargetApp(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Batal</button>
              <button onClick={handleExecuteAccept} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-emerald-500/10">Ya, Terima</button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {rejectTargetApp && (
        <div className="fixed inset-0 z-[105] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6">
            <div className="text-center space-y-4">
              <div className="mx-auto h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
                <X className="h-6 w-6" />
              </div>
              <h3 className="font-display font-black text-slate-900 text-base text-center">Konfirmasi Tolak</h3>
              <p className="text-xs text-slate-500 text-center">Berikan alasan penolakan untuk <strong className="text-slate-800">{rejectTargetApp.namaLengkap}</strong>:</p>
            </div>
            <textarea
              rows={3}
              value={rejectionReasonInput}
              onChange={(e) => setRejectionReasonInput(e.target.value)}
              placeholder="Contoh: Dokumen lampiran kurang lengkap atau rusak."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden mt-4 font-semibold"
            />
            <div className="mt-6 flex justify-end gap-3">
              <button onClick={() => setRejectTargetApp(null)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl">Batal</button>
              <button onClick={handleExecuteReject} className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-500/10">Tolak</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
