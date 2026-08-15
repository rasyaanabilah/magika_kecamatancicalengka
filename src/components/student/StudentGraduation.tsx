/**
 * Component: StudentGraduation
 * Deskripsi: Sub-komponen Dokumen Kelulusan Magang untuk melihat dan mencetak
 * Surat Balasan Penerimaan / Surat Keterangan Magang Kerja (Kelulusan).
 */

import React from "react";
import { Printer, Clock, AlertTriangle, Award, FileCheck } from "lucide-react";
import { Application, User as UserType } from "../../types";
import { printLetter } from "../../utils/printLetter";

interface StudentGraduationProps {
  currentUser: UserType;
  application: Application;
  studentSurat?: any;
  studentSuratList?: any[];
}

export default function StudentGraduation({
  currentUser,
  application,
  studentSurat,
  studentSuratList = [],
}: StudentGraduationProps) {
  const suratListForStudent =
    studentSuratList.length > 0
      ? studentSuratList
      : studentSurat
        ? [studentSurat]
        : [];

  const suratKeterangan = suratListForStudent.find(
    (s) => s.tipeSurat === "keterangan_magang",
  );
  const suratBalasan = suratListForStudent.find(
    (s) => s.tipeSurat === "balasan",
  );

  // Only consider true if admin has generated/sent an official letter to this student
  const hasOfficialLetter = suratListForStudent.length > 0;

  const handlePrintKeteranganMagang = (targetSurat?: any) => {
    const s = targetSurat || suratKeterangan || studentSurat;
    printLetter({
      tipeSurat: "keterangan_magang",
      nomorSurat: s?.nomorSurat || "271",
      tanggalKeluar: s?.tanggalKeluar || "3 Agustus 2026",
      namaPeserta:
        s?.namaPeserta || application?.namaLengkap || currentUser.namaLengkap,
      nimNisn:
        s?.nimNisn ||
        application?.nim ||
        application?.nisn ||
        currentUser.prodi ||
        "-",
      prodiJurusan:
        s?.prodiJurusan ||
        application?.prodi ||
        application?.jurusan ||
        currentUser.prodi ||
        "-",
      instansiPendidikan:
        s?.instansiPendidikan ||
        application?.instansiPendidikan ||
        application?.universitas ||
        currentUser.instansiPendidikan ||
        currentUser.universitas ||
        "Universitas Ma'soem",
      tanggalMulai:
        s?.tanggalMulai ||
        application?.tanggalMulaiMagang ||
        application?.tanggalMulai ||
        "1 Juli 2026",
      tanggalSelesai:
        s?.tanggalSelesai ||
        application?.tanggalSelesaiMagang ||
        application?.tanggalSelesai ||
        "31 Agustus 2026",
      penandatanganNama: s?.penandatanganNama || "Neni Runingdiyah, S.Kom",
      penandatanganNip: s?.penandatanganNip || "19810924 201004 2 001",
      penandatanganJabatan:
        s?.penandatanganJabatan || "Kasubag Umum dan Kepegawaian",
      penandatanganInstansi: s?.penandatanganInstansi || "Kecamatan Cicalengka",
      penandatanganPangkat: s?.penandatanganPangkat || "Penata Tk.I",
    });
  };

  const handlePrintBalasan = (targetSurat?: any) => {
    const s = targetSurat || suratBalasan || studentSurat;
    let list: any[] = [];
    if (s?.daftarPesertaSurat) {
      list = s.daftarPesertaSurat;
    } else {
      list = [
        {
          nama: application?.namaLengkap || currentUser.namaLengkap,
          nimNisn: application?.nim || application?.nisn || "-",
          jurusan: application?.prodi || application?.jurusan || "-",
          instansi:
            application?.instansiPendidikan ?? application?.universitas ?? "-",
        },
      ];
    }

    printLetter({
      tipeSurat: "balasan",
      nomorSurat:
        s?.nomorSurat ||
        application?.suratPengantarNo ||
        "400.14.5.4/270/Sekret",
      tanggalKeluar:
        s?.tanggalKeluar ||
        application?.suratPengantarTanggal ||
        "31 Maret 2026",
      lampiran: s?.lampiran || application?.suratPengantarLampiran || "-",
      perihal:
        s?.perihal ||
        application?.suratPengantarPerihal ||
        "Balasan Permohonan Izin Praktik Adaptasi Lapangan",
      sifat: s?.sifat || application?.suratPengantarSifat || "Penting / Segera",
      penandatanganNama:
        s?.penandatanganNama ||
        application?.suratPenandatanganNama ||
        "CUCU HIDAYAT, S.H., M.M.",
      penandatanganJabatan:
        s?.penandatanganJabatan ||
        application?.suratPenandatanganJabatan ||
        "CAMAT",
      penandatanganNip:
        s?.penandatanganNip ||
        application?.suratPenandatanganNip ||
        "19710731 199811 1 001",
      kepadaJabatan:
        s?.kepadaJabatan ||
        application?.suratKepadaJabatan ||
        "Dekan / Pimpinan",
      kepadaInstansi:
        s?.kepadaInstansi ||
        application?.suratKepadaInstansi ||
        application?.instansiPendidikan ||
        application?.universitas ||
        "Instansi Pendidikan",
      tempat: s?.tempat || application?.suratTempat || "Tempat",
      rujukanPengirim:
        s?.rujukanPengirim ||
        application?.rujukanPengirim ||
        "Dekan / Pimpinan",
      rujukanInstansi:
        s?.rujukanInstansi ||
        application?.rujukanInstansi ||
        application?.instansiPendidikan ||
        application?.universitas ||
        "Instansi",
      rujukanNo:
        s?.rujukanNo || application?.rujukanNo || "267/FKOM-UM/III/2026",
      rujukanTgl: s?.rujukanTgl || application?.rujukanTgl || "30 Maret 2026",
      rujukanPerihal:
        s?.rujukanPerihal ||
        application?.rujukanPerihal ||
        "Izin Praktik Adaptasi Lapangan",
      isiSurat:
        s?.isiSurat ||
        application?.suratPengantarIsi ||
        `Sehubungan hal tersebut, pada prinsipnya kami tidak berkeberatan yang bersangkutan Melakukan Praktik Adaptasi Lapangan terhitung tanggal ${application?.tanggalMulai || "1 Juli 2026"} Sampai ${application?.tanggalSelesai || "28 Juli 2026"} sepanjang memenuhi persyaratan normatif.`,
      tembusan:
        s?.tembusan ||
        application?.suratTembusan ||
        "1. Kepala Badan Kesbangpol Kabupaten Bandung.",
      daftarPesertaSurat: list,
      kategoriPendaftar: application?.kategoriPendaftar || "mahasiswa",
    });
  };

  return (
    <div
      className="space-y-6 animate-fade-in max-w-4xl mx-auto"
      id="tab-content-kelulusan-wrapper"
    >
      {/* Container */}
      <div
        className="bg-white border border-slate-200/80 rounded-3xl p-6 md:p-8 shadow-xs space-y-6 font-sans"
        id="tab-content-kelulusan"
      >
        <div className="space-y-1 border-b border-slate-100 pb-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-extrabold">
            <Award className="h-3.5 w-3.5 text-blue-600" /> Dokumen Kelulusan
            Magang
          </div>
          <h3 className="font-display font-extrabold text-xl text-slate-900 leading-tight">
            Dokumen & Surat Kelulusan Resmi
          </h3>
          <p className="text-xs text-slate-500">
            Cetak dan unduh Surat Keterangan Magang Kerja (Kelulusan) serta
            Surat Balasan Permohonan Resmi dari Kecamatan Cicalengka.
          </p>
        </div>

        {/* List of Available Documents */}
        {hasOfficialLetter ? (
          <div className="space-y-4">
            {suratKeterangan && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-emerald-300 transition-all">
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                    <FileCheck className="h-3 w-3 text-emerald-600" /> Surat
                    Kelulusan Magang
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Surat Keterangan Magang Kerja
                  </h4>
                  <p className="text-xs text-slate-500">
                    Surat bukti resmi bahwa Anda telah menyelesaikan kegiatan
                    magang kerja di Kecamatan Cicalengka.
                  </p>
                </div>
                <button
                  onClick={() => handlePrintKeteranganMagang(suratKeterangan)}
                  className="w-full sm:w-auto px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 font-sans"
                >
                  <Printer className="h-4 w-4" /> Cetak Surat Keterangan
                </button>
              </div>
            )}

            {suratBalasan && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-blue-300 transition-all">
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                    <FileCheck className="h-3 w-3 text-blue-600" /> Surat
                    Penerimaan / Izin
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    Surat Balasan Permohonan Magang
                  </h4>
                  <p className="text-xs text-slate-500">
                    Surat jawaban resmi atas surat permohonan izin magang dari
                    kampus/sekolah Anda.
                  </p>
                </div>
                <button
                  onClick={() => handlePrintBalasan(suratBalasan)}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 font-sans"
                >
                  <Printer className="h-4 w-4" /> Cetak Surat Balasan
                </button>
              </div>
            )}

            {!suratKeterangan && !suratBalasan && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 hover:border-blue-300 transition-all">
                <div className="space-y-1 text-center sm:text-left flex-1">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800 font-extrabold text-[10px]">
                    <FileCheck className="h-3 w-3 text-blue-600" /> Surat Resmi
                    Kecamatan
                  </div>
                  <h4 className="font-bold text-slate-900 text-base">
                    {studentSurat?.perihal || "Surat Kelulusan / Balasan Resmi"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    Dokumen resmi dari Kecamatan Cicalengka untuk Anda.
                  </p>
                </div>
                <button
                  onClick={() => {
                    if (studentSurat?.tipeSurat === "keterangan_magang") {
                      handlePrintKeteranganMagang(studentSurat);
                    } else {
                      handlePrintBalasan(studentSurat);
                    }
                  }}
                  className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 shrink-0 font-sans"
                >
                  <Printer className="h-4 w-4" /> Cetak Dokumen
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-8 text-center space-y-3">
            <div className="mx-auto h-12 w-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center shadow-xs">
              <Clock className="h-6 w-6" />
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="font-bold text-sm text-slate-900">
                Surat / Dokumen Belum Diterbitkan
              </h4>
              <p className="text-slate-600 text-xs leading-relaxed font-medium">
                Mohon tunggu dan tinjau terus dokumen kelulusan. Petugas
                Kecamatan Cicalengka belum mengirimkan surat resmi untuk akun
                Anda.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Notice */}
      {hasOfficialLetter && (
        <div className="p-4 bg-blue-50 border border-blue-200/80 rounded-2xl flex items-start gap-3 shadow-2xs">
          <AlertTriangle className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="text-xs text-blue-900 space-y-1">
            <div className="font-extrabold">Informasi Penyerahan Berkas:</div>
            <p className="leading-relaxed text-blue-800">
              Dokumen Surat Balasan Permohonan Magang harap di cetak dan
              diserahkan ke Badan Kesatuan Bangsa dan Politik Kabupaten Bandung.
              Paling lambat 7 hari kerja setelah dokumen diterbitkan. Pastikan
              membawa dokumen asli dan fotokopi persyaratan administrasi yang
              telah diserahkan sebelumnya.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
