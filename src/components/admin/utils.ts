import { Application, ApplicationStatus } from '../../types';

/**
 * Mengambil inisial dari nama lengkap pengguna (maksimal 2 huruf pertama).
 */
export const getInitials = (name: string): string => {
  if (!name) return 'A';
  return name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

/**
 * Mengonversi berbagai format tanggal (string, Firestore Timestamp, Date)
 * menjadi objek Date JavaScript standar di timezone lokal tanpa jam/menit/detik.
 */
export const parseToDate = (dateVal: any): Date | null => {
  if (!dateVal) return null;
  
  // Firestore Timestamp check
  if (typeof dateVal.toDate === 'function') {
    try {
      const d = dateVal.toDate();
      if (d instanceof Date && !isNaN(d.getTime())) {
        const res = new Date(d.getTime());
        res.setHours(0, 0, 0, 0);
        return res;
      }
    } catch (e) {
      console.error("Error parsing native Firestore Timestamp:", e);
    }
  }
  
  // Firestore Timestamp lookalike object (offline/serialized representation)
  if (typeof dateVal === 'object' && typeof dateVal.seconds === 'number') {
    try {
      const d = new Date(dateVal.seconds * 1000);
      if (d instanceof Date && !isNaN(d.getTime())) {
        const res = new Date(d.getTime());
        res.setHours(0, 0, 0, 0);
        return res;
      }
    } catch (e) {
      console.error("Error parsing Timestamp-like object:", e);
    }
  }
  
  if (dateVal instanceof Date) {
    if (!isNaN(dateVal.getTime())) {
      const res = new Date(dateVal.getTime());
      res.setHours(0, 0, 0, 0);
      return res;
    }
    return null;
  }
  
  if (typeof dateVal === 'string') {
    const trimmed = dateVal.trim();
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10) - 1;
      const day = parseInt(match[3], 10);
      const d = new Date(year, month, day, 0, 0, 0, 0);
      if (!isNaN(d.getTime())) return d;
    }
  }
  
  try {
    const d = new Date(dateVal);
    if (!isNaN(d.getTime())) {
      const res = new Date(d.getTime());
      res.setHours(0, 0, 0, 0);
      return res;
    }
  } catch (e) {
    console.error("Error parsing generic dateVal:", e);
  }
  
  return null;
};

/**
 * Menghitung status efektif pendaftar magang secara real-time berdasarkan
 * status kelulusan dan rentang tanggal mulai/selesai magang yang aktif.
 */
export const getAppEffectiveStatus = (app?: Application): ApplicationStatus => {
  if (!app) return 'Menunggu';
  const status = app.status || 'Menunggu';
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (status === 'Sedang Magang') {
    return 'Sedang Magang';
  }
  if (status === 'Selesai') {
    return 'Selesai';
  }

  if (status !== 'Lulus') {
    return status;
  }

  const startVal = app?.tanggalMulaiMagang || app?.tanggalMulai;
  const endVal = app?.tanggalSelesaiMagang || app?.tanggalSelesai;

  const startDate = parseToDate(startVal);
  const endDate = parseToDate(endVal);

  if (!startDate) return 'Lulus';

  if (today >= startDate) {
    if (endDate) {
      if (today <= endDate) {
        return 'Sedang Magang';
      } else {
        return 'Selesai';
      }
    }
    return 'Sedang Magang'; // Fallback if no end date but has started
  }

  return 'Lulus';
};

/**
 * Memformat string atau objek tanggal menjadi format bahasa Indonesia
 * Contoh: "2026-07-19" -> "19 Juli 2026"
 */
export const formatIndoDate = (dateStr?: any): string => {
  if (!dateStr) return '-';
  try {
    const d = parseToDate(dateStr);
    if (d) {
      const year = d.getFullYear();
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const monthIdx = d.getMonth();
      const day = d.getDate();
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${day} ${monthNames[monthIdx]} ${year}`;
      }
    }
  } catch (e) {
    console.error("formatIndoDate error:", e);
  }
  return typeof dateStr === 'string' ? dateStr : '-';
};

/**
 * Memformat tanggal ke label Bulan dan Tahun (misal: "Juli 2026").
 */
export const getBulanTahunLabel = (dateStr?: any): string => {
  if (!dateStr) return 'Lainnya';
  try {
    const d = parseToDate(dateStr);
    if (d) {
      const year = d.getFullYear();
      const monthNames = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
      ];
      const monthIdx = d.getMonth();
      if (monthIdx >= 0 && monthIdx < 12) {
        return `${monthNames[monthIdx]} ${year}`;
      }
    }
  } catch (e) {
    console.error("getBulanTahunLabel error:", e);
  }
  return 'Lainnya';
};

/**
 * Mengambil tanggal mulai magang efektif/pengajuan lalu diformat ke label Bulan-Tahun.
 */
export const getStartMonthYear = (app: any): string => {
  const dateStr = app?.tanggalMulaiMagang || app?.tanggalMulai;
  return getBulanTahunLabel(dateStr);
};
