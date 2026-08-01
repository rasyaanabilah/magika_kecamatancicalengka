import React from 'react';
import { 
  GraduationCap, 
  Users, 
  CheckCircle, 
  Clock, 
  X, 
  FileSpreadsheet, 
  Search, 
  Printer, 
  Download, 
  Eye 
} from 'lucide-react';
import { Application, User } from '../../types';
import { getInitials, handleExportCSV, handlePrintRekap } from './utils';

interface CamatDashboardTabProps {
  currentUser: User | null;
  applications: Application[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (filter: string) => void;
  onSelectApp: (id: string) => void;
}

/**
 * Component: CamatDashboardTab
 * Deskripsi: Tampilan utama Dashboard Camat yang menyajikan banner ringkasan executive, 
 * statistik pendaftaran, serta tabel audit data pemohon magang terfilter.
 */
export const CamatDashboardTab: React.FC<CamatDashboardTabProps> = ({
  currentUser,
  applications,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  onSelectApp
}) => {
  // Statistik Pendaftar
  const totalCount = applications.length;
  const pendingCount = applications.filter(a => a.status === 'Menunggu').length;
  const acceptedCount = applications.filter(a => a.status === 'Lulus').length;
  const rejectedCount = applications.filter(a => a.status === 'Ditolak').length;
  const applicationsWithReports = applications.filter(app => app.laporan);

  // Penyaringan Data
  const filteredApps = applications.filter(app => {
    const matchesSearch = (
      app.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.universitas.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'Semua' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Executive Greeting */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10">
          <GraduationCap className="h-64 w-64" />
        </div>

        {/* Profile Photo Display */}
        <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/30 p-1 bg-white/10 shrink-0 shadow-lg flex items-center justify-center relative z-10">
          {currentUser?.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.namaLengkap || 'Camat'} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-emerald-500 text-white flex items-center justify-center font-extrabold text-xl rounded-xl">
              {getInitials(currentUser?.namaLengkap || '')}
            </div>
          )}
        </div>

        <div className="relative z-10 space-y-2 flex-1 text-center md:text-left">
          <h1 className="font-display text-xl md:text-2xl font-black tracking-tight">
            Selamat Datang, {currentUser?.namaLengkap || currentUser?.email || 'Camat'}
          </h1>
          <p className="text-blue-50 font-medium text-xs md:text-sm tracking-wide">
            Dashboard
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Pengajuan</span>
            <span className="text-xl font-extrabold font-mono text-slate-900 block mt-1">{totalCount}</span>
          </div>
          <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Users className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lulus</span>
            <span className="text-xl font-extrabold font-mono text-emerald-600 block mt-1">{acceptedCount}</span>
          </div>
          <div className="h-9 w-9 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Menunggu</span>
            <span className="text-xl font-extrabold font-mono text-blue-600 block mt-1">{pendingCount}</span>
          </div>
          <div className="h-9 w-9 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <Clock className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Ditolak / Gugur</span>
            <span className="text-xl font-extrabold font-mono text-rose-600 block mt-1">{rejectedCount}</span>
          </div>
          <div className="h-9 w-9 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center shrink-0">
            <X className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-4 rounded-2xl flex items-center justify-between shadow-xs">
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Laporan Selesai</span>
            <span className="text-xl font-extrabold font-mono text-blue-800 block mt-1">{applicationsWithReports.length}</span>
          </div>
          <div className="h-9 w-9 bg-blue-50 text-blue-800 rounded-xl flex items-center justify-center shrink-0">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
        </div>
      </section>

      {/* Audit List Table Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
          <div>
            <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Daftar Pengajuan Masuk</h4>
            <p className="text-xs text-slate-400 mt-1">Lakukan audit berkas pendaftaran dan pemantauan penempatan magang peserta.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4.5 w-4.5 text-slate-400" />
              <input 
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama, kampus..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
              />
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative w-full sm:w-44">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold focus:outline-hidden transition-all cursor-pointer appearance-none"
              >
                <option value="Semua">Semua Status</option>
                <option value="Menunggu">Menunggu</option>
                <option value="Lulus">Lulus</option>
                <option value="Ditolak">Ditolak</option>
              </select>
              <div className="absolute right-2.5 top-2.5 pointer-events-none text-slate-400">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                </svg>
              </div>
            </div>
            
            <button 
              onClick={() => handlePrintRekap(filteredApps)}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="h-4 w-4" /> Cetak Lembar Rekap
            </button>
            <button 
              onClick={() => handleExportCSV(filteredApps)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
            >
              <Download className="h-4 w-4" /> Ekspor rekap Excel
            </button>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full border-collapse text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50/70 text-slate-500 font-bold border-b border-slate-100 uppercase tracking-wider text-[9px]">
                <th className="p-4">No. Pendaftaran</th>
                <th className="p-4">Calon Peserta</th>
                <th className="p-4">Universitas / Sekolah</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredApps.length > 0 ? (
                filteredApps.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-700">{app.id}</td>
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-[13px]">{app.namaLengkap}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 font-medium">{app.userEmail}</div>
                    </td>
                    <td className="p-4 font-semibold text-slate-700">{app.universitas}</td>
                    <td className="p-4">
                      {app.status === 'Lulus' && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[10px] font-bold rounded-md border border-emerald-200">Lulus</span>}
                      {app.status === 'Ditolak' && <span className="px-2 py-0.5 bg-rose-50 text-rose-700 text-[10px] font-bold rounded-md border border-rose-200">Ditolak</span>}
                      {app.status === 'Menunggu' && <span className="px-2 py-0.5 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-md border border-amber-200">Menunggu</span>}
                    </td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => onSelectApp(app.id)}
                        className="px-3 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs"
                      >
                        <Eye className="h-3.5 w-3.5" /> Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-xs">
                    Tidak ada pendaftar yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
