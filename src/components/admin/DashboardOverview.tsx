import React from 'react';
import { 
  GraduationCap, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Calendar, 
  FileCheck 
} from 'lucide-react';
import { User as UserType, Application } from '../../types';
import { getInitials, getAppEffectiveStatus } from './utils.ts';

interface DashboardOverviewProps {
  currentUser: UserType | null;
  applications: Application[];
}

export default function DashboardOverview({
  currentUser,
  applications = []
}: DashboardOverviewProps) {
  const totalCount = applications.length;
  const pendingCount = applications.filter(app => app.status === 'Menunggu').length;
  const acceptedCount = applications.filter(app => app.status === 'Lulus').length;
  const rejectedCount = applications.filter(app => app.status === 'Ditolak').length;
  const ongoingCount = applications.filter(app => app.status === 'Sedang Magang' || (app.status === 'Lulus' && getAppEffectiveStatus(app) === 'Sedang Magang')).length;
  const completedCount = applications.filter(app => app.status === 'Selesai' || (app.status === 'Lulus' && getAppEffectiveStatus(app) === 'Selesai')).length;

  return (
    <div className="space-y-8 animate-fade-in" id="admin-dashboard-tab">
      {/* Welcome Greeting Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-blue-900/10 relative overflow-hidden flex flex-col md:flex-row items-center gap-6" id="welcome-greeting-card">
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 opacity-10">
          <GraduationCap className="h-64 w-64" />
        </div>
        
        {/* Profile Photo Display */}
        <div className="h-20 w-20 rounded-2xl overflow-hidden border-2 border-white/30 p-1 bg-white/10 shrink-0 shadow-lg flex items-center justify-center relative z-10" id="profile-avatar-wrapper">
          {currentUser?.avatarUrl ? (
            <img 
              src={currentUser.avatarUrl} 
              alt={currentUser.namaLengkap || 'Petugas'} 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover rounded-xl"
            />
          ) : (
            <div className="w-full h-full bg-blue-500 text-white flex items-center justify-center font-extrabold text-xl rounded-xl">
              {getInitials(currentUser?.namaLengkap || '')}
            </div>
          )}
        </div>

        <div className="relative z-10 space-y-2 flex-1 text-center md:text-left">
          <h1 className="font-display text-xl md:text-2xl font-black tracking-tight" id="welcome-title">
            Selamat Datang, {currentUser?.namaLengkap || currentUser?.email || 'Petugas'} di Sistem Administrasi MAGIKA
          </h1>
          <p className="text-blue-100 font-medium text-xs md:text-sm tracking-wide">
            Halaman Pemeriksaan Berkas & Pembaruan Status
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <section className="grid grid-cols-2 lg:grid-cols-3 gap-6" id="statistics-section">
        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-xs" id="stat-card-total">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Total Pendaftar</span>
            <span className="text-3xl font-black font-mono text-slate-950 block mt-2">{totalCount}</span>
          </div>
          <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-xs" id="stat-card-pending">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Menunggu</span>
            <span className="text-3xl font-black font-mono text-amber-600 block mt-2">{pendingCount}</span>
          </div>
          <div className="h-12 w-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Clock className="h-6 w-6 animate-pulse" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-xs" id="stat-card-accepted">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Lolos Seleksi</span>
            <span className="text-3xl font-black font-mono text-emerald-600 block mt-2">{acceptedCount}</span>
          </div>
          <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <CheckCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-xs" id="stat-card-rejected">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Ditolak</span>
            <span className="text-3xl font-black font-mono text-rose-600 block mt-2">{rejectedCount}</span>
          </div>
          <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shrink-0">
            <XCircle className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-xs" id="stat-card-ongoing">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Magang Berlangsung</span>
            <span className="text-3xl font-black font-mono text-indigo-600 block mt-2">{ongoingCount}</span>
          </div>
          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <Calendar className="h-6 w-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between shadow-xs" id="stat-card-completed">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Magang Selesai</span>
            <span className="text-3xl font-black font-mono text-teal-600 block mt-2">{completedCount}</span>
          </div>
          <div className="h-12 w-12 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileCheck className="h-6 w-6" />
          </div>
        </div>
      </section>

      {/* Instructions & Guidelines */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6" id="instructions-container">
        <h4 className="font-display font-black text-slate-900 text-lg">
          Panduan Evaluasi Berkas MAGIKA
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed">
          Sebagai Petugas program Magang Digital Kecamatan Cicalengka (MAGIKA), Anda memiliki wewenang penuh untuk mengevaluasi kesesuaian dokumen administrasi calon peserta, menyunting Surat Dinas resmi kelulusan, dan memantau pelaporan berkas akhir. Berikut alur kerja panduan evaluasi:
        </p>
        
        <div className="space-y-4 pt-2">
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 font-mono">01</div>
            <div className="text-xs">
              <h5 className="font-bold text-slate-800">Verifikasi Berkas Pendukung</h5>
              <p className="text-slate-500 mt-1 leading-relaxed">Cek kelengkapan Surat Pengantar Kampus dan Surat Rekomendasi pada halaman <b>Data Pendaftaran</b> dengan menekan tombol <b>Detail / Tinjau</b>.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 font-mono">02</div>
            <div className="text-xs">
              <h5 className="font-bold text-slate-800">Tentukan Keputusan Status</h5>
              <p className="text-slate-500 mt-1 leading-relaxed">Pembaruan status dari "Menunggu" ke "Lulus" atau "Ditolak". Berikan catatan koordinasi yang jelas.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0 font-mono">03</div>
            <div className="text-xs">
              <h5 className="font-bold text-slate-800">Penerbitan Surat Dinas Kelulusan</h5>
              <p className="text-slate-500 mt-1 leading-relaxed">Untuk calon magang berstatus "Lulus", sistem akan secara otomatis memformat draf Surat Dinas Resmi. Petugas dapat mengedit nomor surat, lampiran, perihal, dan inti surat sebelum dicetak.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
