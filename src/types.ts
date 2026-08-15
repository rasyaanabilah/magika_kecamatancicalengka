/**
 * File: types.ts
 * Deskripsi: Definisi interface dan tipe data global untuk aplikasi MAGIKA
 * (Tipe gender, aplikasi magang, pengguna, berkas, dan jenis surat).
 */

export type Gender = "Laki-laki" | "Perempuan";

export type LamaMagang = "1 Bulan" | "2 Bulan" | "3 Bulan" | "6 Bulan" | string;

export type ApplicationStatus =
  | "Menunggu"
  | "Lulus"
  | "Ditolak"
  | "Sedang Magang"
  | "Selesai";

export interface FileData {
  name: string;
  size: string;
  type: string;
  uploadedAt: string;
  url?: string;
}

export interface Application {
  id: string; // e.g. MAG-2026-00015
  userEmail: string;
  tglDaftar: string;
  status: ApplicationStatus;
  statusNote?: string;

  // Data Pribadi
  namaLengkap: string;
  jenisKelamin: Gender;
  noHp: string;
  alamatLengkap: string;

  // Kategori Pendaftar
  kategoriPendaftar?: "mahasiswa" | "siswa";
  nim?: string;
  nisn?: string;
  kelas?: string;
  jurusan?: string;

  // Data Kampus / Sekolah
  universitas?: string; // Legacy field: masih dipertahankan untuk data lama
  instansiPendidikan?: string; // Field baru untuk data pendaftaran baru
  fakultas: string; // Hanya untuk mahasiswa
  prodi: string; // Program Studi (untuk mahasiswa) / Jurusan (untuk siswa)
  semester: string; // Hanya untuk mahasiswa

  // Data Magang
  durasi: LamaMagang;
  tanggalMulai: string;
  tanggalSelesai: string;
  tujuanMagang: string;
  tanggalMulaiMagang?: string;
  tanggalSelesaiMagang?: string;

  // Dokumen & Berkas Pendukung (Link Google Drive)
  linkDrive?: string;
  files?: {
    suratPengantar?: FileData | null;
    suratRekomendasi?: FileData | null;
  };

  // Admin / Camat Feedback
  verifiedBy?: string;
  verifiedAt?: string;
  rejectionReason?: string;

  // Kelola Surat Dinas
  suratPengantarNo?: string;
  suratPengantarTanggal?: string;
  suratPengantarIsi?: string;
  suratPengantarLampiran?: string;
  suratPengantarPerihal?: string;
  suratPengantarSifat?: string;
  suratKepadaJabatan?: string;
  suratKepadaInstansi?: string;
  suratTempat?: string;
  rujukanPengirim?: string;
  rujukanInstansi?: string;
  rujukanNo?: string;
  rujukanTgl?: string;
  rujukanPerihal?: string;
  suratTembusan?: string;
  suratRekomendasiNo?: string;
  suratRekomendasiTanggal?: string;
  suratRekomendasiIsi?: string;
  suratRekomendasiLampiran?: string;
  suratRekomendasiPerihal?: string;
  suratRekomendasiSifat?: string;
  suratPenandatanganNama?: string;
  suratPenandatanganNip?: string;
  suratPenandatanganJabatan?: string;

  // Laporan Akhir Magang
  laporan?: {
    judul: string;
    ringkasan?: string;
    deskripsi?: string;
    fileName: string;
    fileSize: string;
    uploadedAt: string;
    status?: string;
    fileData?: string;
  };
}

export interface User {
  id: string;
  email: string;
  namaLengkap: string;
  role: "student" | "admin" | "camat";
  username?: string;
  universitas?: string;
  instansiPendidikan?: string;
  prodi?: string;
  noHp?: string;
  avatarUrl?: string;
}

/**
 * Prop interface untuk CamatDashboard
 */
export interface CamatDashboardProps {
  applications: Application[];
  onLogout: () => void;
  currentUser: User | null;
  onUpdateApplication?: (app: Application) => void;
  onUpdateUser?: (user: User) => void;
}

/**
 * Tipe Tab Navigasi Camat Portal
 */
export type CamatTab = "pendaftar" | "laporan" | "setelan";
