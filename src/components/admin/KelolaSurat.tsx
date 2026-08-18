import React, { useState } from "react";
// @ts-ignore
import logoKabBandung from "../../assets/images/logo_kab_bandung.png";
import {
  Search,
  Filter,
  Archive,
  Plus,
  ArrowLeft,
  Edit,
  UserCheck,
  X,
  AlertCircle,
  FileText,
  Printer,
  Send,
  CheckCircle,
  Trash2,
  Award,
} from "lucide-react";
import { Application, Surat, SuratParticipant, User } from "../../types";
import { printLetter } from "../../utils/printLetter";

interface KelolaSuratProps {
  applications: Application[];
  users: User[];
  suratList: Surat[];
  onCreateSurat: (payload: Record<string, unknown>) => Promise<void>;
  onUpdateApplication: (app: Application) => void | Promise<void>;
  onDeleteSurat?: (id: string) => Promise<void>;
}

const getInitials = (name: string) => {
  if (!name) return "U";
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
};

export default function KelolaSurat({
  applications,
  users,
  suratList,
  onCreateSurat,
  onUpdateApplication,
  onDeleteSurat,
}: KelolaSuratProps) {
  const [suratTabSubMode, setSuratTabSubMode] = useState<"arsip" | "buat">(
    "arsip",
  );
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");

  const getNomorUrutFromSurat = (nomorSurat?: string): number => {
    if (!nomorSurat) return 0;
    const match = nomorSurat.match(/\d+/g);
    if (!match || match.length === 0) return 0;
    const lastMatch = match[match.length - 1];
    const parsed = Number(lastMatch);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const getNextNomorUrut = (tipe: "balasan" | "keterangan_magang"): string => {
    const maxSuratNumber = suratList.reduce((highest, surat) => {
      if (!surat || surat.tipeSurat !== tipe) {
        return highest;
      }

      return Math.max(highest, getNomorUrutFromSurat(surat.nomorSurat));
    }, 0);

    return String(maxSuratNumber + 1);
  };

  const formatNomorBalasanValue = (value: string): string => {
    if (!value) return "400.14.5.4/1/Sekret";
    const cleanValue = value
      .replace(/^400\.14\.5\.4\//i, "")
      .replace(/\/Sekret$/i, "");

    return cleanValue
      ? `400.14.5.4/${cleanValue}/Sekret`
      : "400.14.5.4/1/Sekret";
  };

  // Letter Type Selector: 'balasan' (Tipe A) vs 'keterangan_magang' (Tipe B)
  const [tipeSurat, setTipeSurat] = useState<"balasan" | "keterangan_magang">(
    "balasan",
  );

  // Draft States
  const suratKategori = "mahasiswa";
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
  const [recipientSearchTerm, setRecipientSearchTerm] = useState("");
  const [isRecipientDropdownOpen, setIsRecipientDropdownOpen] = useState(false);
  const [autocompleteSelectedApp, setAutocompleteSelectedApp] =
    useState<Application | null>(null);

  // === TIPE A: SURAT BALASAN FIELDS ===
  const [suratNo, setSuratNo] = useState(() =>
    formatNomorBalasanValue(`400.14.5.4/${getNextNomorUrut("balasan")}/Sekret`),
  );
  const [suratTgl, setSuratTgl] = useState(
    new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }),
  );
  const [suratSifat, setSuratSifat] = useState("");
  const [suratLampiran, setSuratLampiran] = useState("");
  const [suratPerihal, setSuratPerihal] = useState("");

  // Rujukan
  const [rujukanPengirim, setRujukanPengirim] = useState("");
  const [rujukanInstansi, setRujukanInstansi] = useState("");
  const [rujukanNo, setRujukanNo] = useState("");
  const [rujukanTgl, setRujukanTgl] = useState("");
  const [rujukanPerihal, setRujukanPerihal] = useState("");

  // Alamat & Tujuan
  const [suratKepadaJabatan, setSuratKepadaJabatan] = useState("");
  const [suratKepadaInstansi, setSuratKepadaInstansi] = useState("");
  const [suratTempat, setSuratTempat] = useState("");

  // Isi & TTD Camat
  const [suratIsi, setSuratIsi] = useState("");
  const [suratPenandatanganNama, setSuratPenandatanganNama] = useState(
    "CUCU HIDAYAT, S.H., M.M.",
  );
  const [suratPenandatanganJabatan, setSuratPenandatanganJabatan] =
    useState("CAMAT");
  const [suratPenandatanganNip, setSuratPenandatanganNip] = useState(
    "19710731 199811 1 001",
  );
  const [suratTembusan, setSuratTembusan] = useState(
    "1. Kepala Badan Kesbangpol Kabupaten Bandung.",
  );

  // === TIPE B: SURAT KETERANGAN MAGANG KERJA FIELDS ===
  const [suratNoKeterangan, setSuratNoKeterangan] = useState(() =>
    getNextNomorUrut("keterangan_magang"),
  );
  const [tglTerbitKeterangan, setTglTerbitKeterangan] =
    useState("3 Agustus 2026");
  const [pesertaNama, setPesertaNama] = useState("");
  const [pesertaNimNisn, setPesertaNimNisn] = useState("");
  const [pesertaProdiJurusan, setPesertaProdiJurusan] = useState("");
  const [pesertaInstansiPendidikan, setPesertaInstansiPendidikan] =
    useState("");
  const [tglMulaiMagang, setTglMulaiMagang] = useState("1 Juli 2026");
  const [tglSelesaiMagang, setTglSelesaiMagang] = useState("31 Agustus 2026");

  // Penandatangan Pejabat (Kasubag Umum & Kepegawaian)
  const [penandatanganNamaKet, setPenandatanganNamaKet] = useState(
    "Neni Runingdiyah, S.Kom",
  );
  const [penandatanganNipKet, setPenandatanganNipKet] = useState(
    "19810924 201004 2 001",
  );
  const [penandatanganJabatanKet, setPenandatanganJabatanKet] = useState(
    "Kasubag Umum dan Kepegawaian",
  );
  const [penandatanganInstansiKet, setPenandatanganInstansiKet] = useState(
    "Kecamatan Cicalengka",
  );
  const [penandatanganPangkatKet, setPenandatanganPangkatKet] =
    useState("Penata Tk.I");

  // Archive Filter
  const [archiveSearchTerm, setArchiveSearchTerm] = useState("");
  const [archiveKategoriFilter, setArchiveKategoriFilter] = useState<
    "all" | "mahasiswa" | "siswa"
  >("all");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetNo, setDeleteTargetNo] = useState("");
  const [deleteTargetPerihal, setDeleteTargetPerihal] = useState("");

  const handlePrintOfficialLetter = (appOrSurat: any) => {
    if (appOrSurat.tipeSurat === "keterangan_magang") {
      const firstP = appOrSurat.daftarPesertaSurat?.[0] || {};
      printLetter({
        tipeSurat: "keterangan_magang",
        nomorSurat: appOrSurat.nomorSurat || "-",
        tanggalKeluar: appOrSurat.tanggalKeluar || "",
        namaPeserta: appOrSurat.namaPeserta || firstP.nama || "",
        nimNisn: appOrSurat.nimNisn || firstP.nimNisn || "-",
        prodiJurusan: appOrSurat.prodiJurusan || firstP.jurusan || "-",
        instansiPendidikan:
          appOrSurat.instansiPendidikan || firstP.instansi || "-",
        tanggalMulai: appOrSurat.tanggalMulai || "",
        tanggalSelesai: appOrSurat.tanggalSelesai || "",
        penandatanganNama:
          appOrSurat.penandatanganNama || "Neni Runingdiyah, S.Kom",
        penandatanganNip:
          appOrSurat.penandatanganNip || "19810924 201004 2 001",
        penandatanganJabatan:
          appOrSurat.penandatanganJabatan || "Kasubag Umum dan Kepegawaian",
        penandatanganInstansi:
          appOrSurat.penandatanganInstansi || "Kecamatan Cicalengka",
        penandatanganPangkat: appOrSurat.penandatanganPangkat || "Penata Tk.I",
      });
    } else {
      let list: any[] = [];
      if (appOrSurat.daftarPesertaSurat) {
        list = appOrSurat.daftarPesertaSurat;
      } else {
        list = [
          {
            nama: appOrSurat.namaLengkap || "",
            nimNisn: appOrSurat.nim || appOrSurat.nisn || "-",
            jurusan: appOrSurat.prodi || appOrSurat.jurusan || "-",
            instansi:
              appOrSurat.instansiPendidikan ?? appOrSurat.universitas ?? "-",
          },
        ];
      }

      printLetter({
        tipeSurat: "balasan",
        nomorSurat: appOrSurat.nomorSurat || appOrSurat.suratPengantarNo || "-",
        tanggalKeluar:
          appOrSurat.tanggalKeluar || appOrSurat.suratPengantarTanggal || "-",
        lampiran:
          appOrSurat.lampiran || appOrSurat.suratPengantarLampiran || "-",
        perihal: appOrSurat.perihal || appOrSurat.suratPengantarPerihal || "-",
        sifat: appOrSurat.sifat || appOrSurat.suratPengantarSifat || "-",
        penandatanganNama:
          appOrSurat.penandatanganNama ||
          appOrSurat.suratPenandatanganNama ||
          "CUCU HIDAYAT, S.H., M.M.",
        penandatanganJabatan:
          appOrSurat.penandatanganJabatan ||
          appOrSurat.suratPenandatanganJabatan ||
          "CAMAT",
        penandatanganNip:
          appOrSurat.penandatanganNip ||
          appOrSurat.suratPenandatanganNip ||
          "19710731 199811 1 001",
        kepadaJabatan:
          appOrSurat.kepadaJabatan ||
          appOrSurat.suratKepadaJabatan ||
          "Dekan / Pimpinan",
        kepadaInstansi:
          appOrSurat.kepadaInstansi ||
          appOrSurat.suratKepadaInstansi ||
          "Instansi",
        tempat: appOrSurat.tempat || appOrSurat.suratTempat || "Tempat",
        rujukanPengirim: appOrSurat.rujukanPengirim || "Dekan / Kepala Sekolah",
        rujukanInstansi: appOrSurat.rujukanInstansi || "Instansi",
        rujukanNo: appOrSurat.rujukanNo || "-",
        rujukanTgl: appOrSurat.rujukanTgl || "-",
        rujukanPerihal: appOrSurat.rujukanPerihal || "-",
        isiSurat: appOrSurat.isiSurat || appOrSurat.suratPengantarIsi || "",
        tembusan:
          appOrSurat.tembusan ||
          appOrSurat.suratTembusan ||
          "1. Kepala Badan Kesbangpol Kabupaten Bandung.",
        daftarPesertaSurat: list,
        kategoriPendaftar: appOrSurat.kategoriPendaftar || "mahasiswa",
      });
    }
  };

  const handlePrintBulkOfficialLetter = () => {
    if (tipeSurat === "keterangan_magang") {
      const selectedApp =
        selectedRecipients.length > 0
          ? applications.find((a) => a.id === selectedRecipients[0])
          : autocompleteSelectedApp;

      const nama = pesertaNama || selectedApp?.namaLengkap || "";
      const nim = pesertaNimNisn || selectedApp?.nim || selectedApp?.nisn || "";
      const prodi =
        pesertaProdiJurusan || selectedApp?.prodi || selectedApp?.jurusan || "";
      const instansi =
        pesertaInstansiPendidikan ||
        (selectedApp?.instansiPendidikan ?? selectedApp?.universitas ?? "");

      printLetter({
        tipeSurat: "keterangan_magang",
        nomorSurat: suratNoKeterangan,
        tanggalKeluar: tglTerbitKeterangan,
        namaPeserta: nama,
        nimNisn: nim,
        prodiJurusan: prodi,
        instansiPendidikan: instansi,
        tanggalMulai: tglMulaiMagang,
        tanggalSelesai: tglSelesaiMagang,
        penandatanganNama: penandatanganNamaKet,
        penandatanganNip: penandatanganNipKet,
        penandatanganJabatan: penandatanganJabatanKet,
        penandatanganInstansi: penandatanganInstansiKet,
        penandatanganPangkat: penandatanganPangkatKet,
      });
    } else {
      const list = selectedRecipients
        .map((id) => (id ? applications.find((a) => a.id === id) : undefined))
        .filter((app): app is Application => !!app);

      if (!list || list.length === 0) return;

      printLetter({
        tipeSurat: "balasan",
        nomorSurat: suratNo,
        tanggalKeluar: suratTgl,
        sifat: suratSifat,
        lampiran: suratLampiran,
        perihal: suratPerihal,
        penandatanganNama: suratPenandatanganNama,
        penandatanganJabatan: suratPenandatanganJabatan,
        penandatanganNip: suratPenandatanganNip,
        kepadaJabatan: suratKepadaJabatan,
        kepadaInstansi: suratKepadaInstansi,
        tempat: suratTempat,
        rujukanPengirim,
        rujukanInstansi,
        rujukanNo,
        rujukanTgl,
        rujukanPerihal,
        isiSurat: suratIsi,
        tembusan: suratTembusan,
        kategoriPendaftar: suratKategori,
        daftarPesertaSurat: list.map((app) => ({
          nama: app.namaLengkap,
          nimNisn: app.nim || app.nisn || "-",
          jurusan: app.prodi || app.jurusan || "-",
          instansi: app.universitas || "-",
        })),
      });
    }
  };

  const handleBulkSendLetters = async () => {
    if (selectedRecipients.length === 0 && !pesertaNama) {
      alert("Silakan pilih minimal 1 penerima surat terlebih dahulu!");
      return;
    }

    try {
      if (tipeSurat === "keterangan_magang") {
        const resolvedFromSelection =
          selectedRecipients.length > 0
            ? selectedRecipients
                .map((recId) => applications.find((a) => a.id === recId))
                .filter((app): app is Application => !!app)
            : [];

        const selectedApp =
          resolvedFromSelection[0] || autocompleteSelectedApp || null;

        const matchedAppByName =
          !selectedApp && pesertaNama
            ? applications.find(
                (app) =>
                  app.namaLengkap?.trim().toLowerCase() ===
                  pesertaNama.trim().toLowerCase(),
              ) ||
              applications.find((app) =>
                app.namaLengkap
                  ?.toLowerCase()
                  .includes(pesertaNama.trim().toLowerCase()),
              )
            : null;

        const recipientApps =
          resolvedFromSelection.length > 0
            ? resolvedFromSelection
            : selectedApp
              ? [selectedApp]
              : matchedAppByName
                ? [matchedAppByName]
                : [];

        if (recipientApps.length === 0) {
          alert(
            "Penerima surat keterangan tidak ditemukan. Pilih nama peserta dari daftar yang tersedia terlebih dahulu.",
          );
          return;
        }

        const recName = pesertaNama || recipientApps[0]?.namaLengkap || "";
        const recNim =
          pesertaNimNisn ||
          recipientApps[0]?.nim ||
          recipientApps[0]?.nisn ||
          "-";
        const recProdi =
          pesertaProdiJurusan ||
          recipientApps[0]?.prodi ||
          recipientApps[0]?.jurusan ||
          "-";
        const recInstansi =
          pesertaInstansiPendidikan ||
          (recipientApps[0]?.instansiPendidikan ??
            recipientApps[0]?.universitas ??
            "-");

        const rawNo = suratNoKeterangan || "1";
        let formattedNo = rawNo;
        if (
          !rawNo.toLowerCase().includes("sekret") &&
          !rawNo.includes("400.14")
        ) {
          formattedNo = rawNo.replace(/[^0-9]/g, "");
        }

        const recipientIds = Array.from(
          new Set(
            recipientApps.flatMap((app) => {
              const studentUser = users.find(
                (u) => u.email.toLowerCase() === app.userEmail.toLowerCase(),
              );

              return [
                app.id,
                app.userEmail?.toLowerCase(),
                studentUser?.id,
                studentUser?.email?.toLowerCase(),
              ].filter(Boolean);
            }),
          ),
        );

        const payload = {
          tipeSurat: "keterangan_magang",
          nomorSurat: formattedNo,
          perihal: "Surat Keterangan Magang Kerja",
          tanggalKeluar: tglTerbitKeterangan,
          penerimaIds: recipientIds,
          namaPeserta: recName,
          nimNisn: recNim,
          prodiJurusan: recProdi,
          instansiPendidikan: recInstansi,
          tanggalMulai: tglMulaiMagang,
          tanggalSelesai: tglSelesaiMagang,
          penandatanganNama: penandatanganNamaKet,
          penandatanganNip: penandatanganNipKet,
          penandatanganJabatan: penandatanganJabatanKet,
          penandatanganInstansi: penandatanganInstansiKet,
          penandatanganPangkat: penandatanganPangkatKet,
          daftarPesertaSurat: recipientApps.map((app) => {
            const studentUser = users.find(
              (u) => u.email.toLowerCase() === app.userEmail.toLowerCase(),
            );
            return {
              id: studentUser?.id || app.id,
              email: app.userEmail?.toLowerCase(),
              nama: app.namaLengkap,
              nimNisn: app.nim || app.nisn || "-",
              jurusan: app.prodi || app.jurusan || "-",
              instansi: app.instansiPendidikan ?? app.universitas ?? "-",
            };
          }),
        };

        // 1. Save letter in database
        await onCreateSurat(payload);

        // 2. Set status to 'Selesai' or 'Lulus' for completed internship
        const promises = recipientIds.map(async (recId) => {
          const app = applications.find((a) => a.id === recId);
          if (app) {
            await onUpdateApplication({
              ...app,
              status: "Selesai",
            });
          }
        });
        await Promise.all(promises);

        setActionSuccessMsg(
          `Surat Keterangan Magang Kerja (${formattedNo}) berhasil diterbitkan untuk ${recName}.`,
        );
      } else {
        const list = selectedRecipients
          .map((id) => (id ? applications.find((a) => a.id === id) : undefined))
          .filter((app): app is Application => !!app);

        const firstApp = list[0];
        const tMulai =
          firstApp?.tanggalMulaiMagang ||
          firstApp?.tanggalMulai ||
          "2026-07-01";
        const tSelesai =
          firstApp?.tanggalSelesaiMagang ||
          firstApp?.tanggalSelesai ||
          "2026-10-01";

        const daftarPesertaSurat = selectedRecipients
          .map((recId) => {
            const app = applications.find((a) => a.id === recId);
            if (!app) return null;
            const isSiswa = app.kategoriPendaftar === "siswa";
            const studentUser = users.find(
              (u) => u.email.toLowerCase() === app.userEmail.toLowerCase(),
            );
            return {
              id: studentUser?.id || app.id,
              email: app.userEmail,
              nama: app.namaLengkap,
              nimNisn: isSiswa ? app.nisn || "-" : app.nim || "-",
              jurusan: isSiswa
                ? app.jurusan || app.prodi || "-"
                : app.prodi || app.jurusan || "-",
              instansi: app.instansiPendidikan ?? app.universitas ?? "-",
            };
          })
          .filter(Boolean);

        const extraRecipientIdentifiers = selectedRecipients.flatMap(
          (recId) => {
            const app = applications.find((a) => a.id === recId);
            if (!app) return [];
            const studentUser = users.find(
              (u) => u.email.toLowerCase() === app.userEmail.toLowerCase(),
            );

            const listIds = [recId, app.userEmail.toLowerCase()];
            if (studentUser) {
              listIds.push(studentUser.id);
              if (studentUser.email) {
                listIds.push(studentUser.email.toLowerCase());
              }
            }
            return listIds;
          },
        );

        const combinedPenerimaIds = Array.from(
          new Set(extraRecipientIdentifiers),
        ).filter(Boolean);

        const payload = {
          tipeSurat: "balasan",
          nomorSurat: suratNo,
          perihal: suratPerihal,
          isiSurat: suratIsi,
          tanggalKeluar: suratTgl,
          penerimaIds: combinedPenerimaIds,
          daftarPesertaSurat,
          sifat: suratSifat,
          lampiran: suratLampiran,
          penandatanganNama: suratPenandatanganNama,
          penandatanganJabatan: suratPenandatanganJabatan,
          penandatanganNip: suratPenandatanganNip,
          kepadaJabatan: suratKepadaJabatan,
          kepadaInstansi: suratKepadaInstansi,
          tempat: suratTempat,
          rujukanPengirim,
          rujukanInstansi,
          rujukanNo,
          rujukanTgl,
          rujukanPerihal,
          tembusan: suratTembusan,
          kategoriPendaftar: suratKategori,
          tanggalMulai: tMulai,
          tanggalSelesai: tSelesai,
        };

        // 1. Create archived master letter record
        await onCreateSurat(payload);

        // 2. Loop update application status to 'Lulus'
        const promises = selectedRecipients.map(async (recId) => {
          const app = applications.find((a) => a.id === recId);
          if (app) {
            const updatedApp: Application = {
              ...app,
              status: "Lulus",
            };
            await onUpdateApplication(updatedApp);
          }
        });
        await Promise.all(promises);

        setActionSuccessMsg(
          `Surat Balasan berhasil diterbitkan dan diarsipkan untuk ${selectedRecipients.length} penerima.`,
        );
      }

      setSelectedRecipients([]);
      setAutocompleteSelectedApp(null);
      setRecipientSearchTerm("");
      setSuratTabSubMode("arsip");
      setTimeout(() => setActionSuccessMsg(""), 5000);
    } catch (e) {
      console.error("Failed to send letters:", e);
    }
  };

  // Populate form fields based on recipient search selection
  const handleSelectAutocompleteResult = (app: Application) => {
    setAutocompleteSelectedApp(app);
    setRecipientSearchTerm(app.namaLengkap);
    setIsRecipientDropdownOpen(false);

    // Auto fill for Tipe B (Surat Keterangan Magang Kerja)
    setPesertaNama(app.namaLengkap || "");
    setPesertaNimNisn(app.nim || app.nisn || "");
    setPesertaProdiJurusan(app.prodi || app.jurusan || "");
    setPesertaInstansiPendidikan(
      app.instansiPendidikan ?? app.universitas ?? "",
    );
    setTglMulaiMagang(
      app.tanggalMulaiMagang || app.tanggalMulai || "1 Juli 2026",
    );
    setTglSelesaiMagang(
      app.tanggalSelesaiMagang || app.tanggalSelesai || "31 Agustus 2026",
    );

    // Auto-fill template values for Tipe A (Surat Balasan)
    const univName = app.instansiPendidikan ?? app.universitas ?? "";
    setSuratKepadaInstansi(univName);
    // Field lainnya tetap kosong dan diisi manual oleh Petugas.
    setSuratKepadaJabatan("");
    setSuratTempat("");

    setRujukanPengirim("");
    setRujukanInstansi("");
    setRujukanNo("");
    setRujukanTgl("");
    setRujukanPerihal("");

    setSuratIsi(
      `Sehubungan hal tersebut, pada prinsipnya kami tidak berkeberatan yang bersangkutan Melakukan Praktik Adaptasi Lapangan terhitung tanggal ${app.tanggalMulai || "1 Juli 2026"} Sampai ${app.tanggalSelesai || "28 Juli 2026"} sepanjang memenuhi persyaratan normatif, tidak bertentangan dengan peraturan perundang-undangan yang berlaku serta tidak mengganggu ketentraman dan ketertiban umum.`,
    );
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-arsip-surat-tab">
      {/* Header Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h4 className="font-display font-extrabold text-base text-slate-900 leading-none flex items-center gap-2">
            <Archive className="h-5 w-5 text-blue-600" />
            Kelola Surat Dinas & Balasan Resmi
          </h4>
          <p className="text-xs text-slate-500 mt-1.5">
            Buat, sesuaikan template, cetak, dan kirimkan Surat Balasan
            Permohonan Izin Magang maupun Surat Keterangan Magang Kerja
            (Kelulusan).
          </p>
        </div>
        <div className="shrink-0">
          {suratTabSubMode === "arsip" ? (
            <button
              type="button"
              onClick={() => setSuratTabSubMode("buat")}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/10 font-sans"
            >
              <Plus className="h-4.5 w-4.5" />
              Buat Surat Baru
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setSuratTabSubMode("arsip")}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 font-sans"
            >
              <ArrowLeft className="h-4.5 w-4.5" />
              Kembali ke Arsip
            </button>
          )}
        </div>
      </div>

      {actionSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
          <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* BUAT SURAT MODE */}
      {suratTabSubMode === "buat" && (
        <div className="max-w-4xl mx-auto space-y-6">
          {/* TAB SELECTOR SURAT */}
          <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-xs">
            <div className="text-xs font-extrabold text-slate-800 mb-2">
              Pilih Jenis Surat Yang Akan Dibuat:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setTipeSurat("balasan")}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                  tipeSurat === "balasan"
                    ? "bg-blue-50/80 border-blue-500 text-blue-900 shadow-sm ring-1 ring-blue-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <FileText
                  className={`h-5 w-5 shrink-0 mt-0.5 ${tipeSurat === "balasan" ? "text-blue-600" : "text-slate-400"}`}
                />
                <div>
                  <div className="font-extrabold text-xs">
                    Tipe A: Surat Balasan / Penerimaan Magang
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Surat resmi balasan permohonan izin praktik kerja / magang
                    untuk dikirim ke Kesbangpol.
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTipeSurat("keterangan_magang")}
                className={`p-3.5 rounded-2xl text-left border transition-all cursor-pointer flex items-start gap-3 ${
                  tipeSurat === "keterangan_magang"
                    ? "bg-emerald-50/80 border-emerald-500 text-emerald-900 shadow-sm ring-1 ring-emerald-500/20"
                    : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Award
                  className={`h-5 w-5 shrink-0 mt-0.5 ${tipeSurat === "keterangan_magang" ? "text-emerald-600" : "text-slate-400"}`}
                />
                <div>
                  <div className="font-extrabold text-xs">
                    Tipe B: Surat Keterangan Magang Kerja (Kelulusan)
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                    Surat resmi pernyataan bahwa peserta telah menyelesaikan
                    seluruh kegiatan magang di Kecamatan Cicalengka.
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-display">
                <Edit className="h-4 w-4 text-blue-600" />
                Langkah 1: Penerima Surat
              </h5>
              <p className="text-[11px] text-slate-500 mt-1">
                Cari pendaftar atau akun mahasiswa/siswa dari database untuk
                dimuat identitasnya.
              </p>
            </div>

            {/* Search Autocomplete Recipients */}
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Cari Penerima Surat (Daftar Akun & Pendaftar):
                </label>
                <p className="text-[10px] text-slate-500">
                  Ketik nama peserta untuk memuat detail datanya secara
                  otomatis.
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Ketik nama mahasiswa atau pendaftar..."
                  value={recipientSearchTerm}
                  onChange={(e) => {
                    setRecipientSearchTerm(e.target.value);
                    setIsRecipientDropdownOpen(true);
                  }}
                  onFocus={() => setIsRecipientDropdownOpen(true)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800"
                />
                {isRecipientDropdownOpen && (
                  <button
                    type="button"
                    onClick={() => setIsRecipientDropdownOpen(false)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] bg-slate-200 hover:bg-slate-300 text-slate-650 font-bold px-2 py-0.5 rounded-lg cursor-pointer"
                  >
                    Tutup
                  </button>
                )}
              </div>

              {/* Suggestions Dropdown */}
              {isRecipientDropdownOpen && (
                <div className="relative z-35">
                  <div className="absolute left-0 right-0 mt-1 max-h-60 overflow-y-auto bg-white border border-slate-200 rounded-2xl shadow-xl divide-y divide-slate-100">
                    {(() => {
                      const combinedCandidates: Application[] = [
                        ...applications,
                        ...users
                          .filter(
                            (u) =>
                              u.role === "student" &&
                              !applications.some(
                                (a) =>
                                  a.userEmail?.toLowerCase() ===
                                  u.email?.toLowerCase(),
                              ),
                          )
                          .map(
                            (u) =>
                              ({
                                id: u.id,
                                userEmail: u.email,
                                tglDaftar: new Date().toISOString(),
                                status: "Menunggu" as const,
                                namaLengkap: u.namaLengkap,
                                jenisKelamin: "Laki-laki" as const,
                                kategoriPendaftar:
                                  (u as any).kategoriPendaftar || "mahasiswa",
                                instansiPendidikan:
                                  u.instansiPendidikan ??
                                  u.universitas ??
                                  "Instansi",
                                prodi: u.prodi || "-",
                                nim: "-",
                                nik: "-",
                                noHp: u.noHp || "-",
                                alamatLengkap: "-",
                                fakultas: "-",
                                semester: "-",
                                durasi: "1 Bulan",
                                tanggalMulai: "2026-07-01",
                                tanggalSelesai: "2026-08-01",
                                tujuanMagang: "-",
                              }) as Application,
                          ),
                      ];

                      const filtered = combinedCandidates.filter((c) => {
                        const term = recipientSearchTerm.toLowerCase();
                        const instansiCandidate = (
                          c.instansiPendidikan ??
                          c.universitas ??
                          ""
                        ).toLowerCase();
                        return (
                          c.namaLengkap.toLowerCase().includes(term) ||
                          instansiCandidate.includes(term) ||
                          c.userEmail?.toLowerCase().includes(term) ||
                          c.nim?.toLowerCase().includes(term)
                        );
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-4 text-center text-slate-400 text-xs italic">
                            Tidak ada peserta yang cocok dengan nama "
                            {recipientSearchTerm}".
                          </div>
                        );
                      }

                      return filtered.map((app) => {
                        const isSiswa = app.kategoriPendaftar === "siswa";
                        const idNo = isSiswa ? app.nisn || "-" : app.nim || "-";
                        const pName = isSiswa
                          ? app.jurusan || app.prodi
                          : app.prodi;

                        return (
                          <div
                            key={app.id}
                            onClick={() => handleSelectAutocompleteResult(app)}
                            className="p-3 hover:bg-blue-50/50 transition-all flex items-start justify-between cursor-pointer"
                          >
                            <div className="flex-1">
                              <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                                <span>{app.namaLengkap}</span>
                                <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                                  {app.status || "Akun"}
                                </span>
                              </div>
                              <div className="text-[10px] text-slate-500 mt-0.5">
                                {pName} • NIM/NISN: {idNo}{" "}
                                {app.userEmail ? `• ${app.userEmail}` : ""}
                              </div>
                              <div className="text-[10px] font-bold text-blue-600 mt-0.5">
                                {app.instansiPendidikan ??
                                  app.universitas ??
                                  "Instansi"}
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              )}

              {/* Selected recipient previews */}
              {autocompleteSelectedApp && (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4.5 space-y-4 animate-fade-in">
                  <div className="flex items-center justify-between border-b border-slate-200/65 pb-2">
                    <h6 className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                      <UserCheck className="h-4.5 w-4.5 text-emerald-500" />
                      Detail Peserta Terpilih:
                    </h6>
                    <button
                      type="button"
                      onClick={() => {
                        setAutocompleteSelectedApp(null);
                        setRecipientSearchTerm("");
                      }}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-700">
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">
                        Nama Lengkap
                      </span>
                      <span className="font-bold text-slate-800">
                        {autocompleteSelectedApp.namaLengkap}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">
                        NIM / NISN
                      </span>
                      <span className="font-mono font-bold text-slate-850">
                        {autocompleteSelectedApp.nim ||
                          autocompleteSelectedApp.nisn ||
                          "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">
                        Program Studi / Jurusan
                      </span>
                      <span className="font-bold text-slate-800">
                        {autocompleteSelectedApp.prodi ||
                          autocompleteSelectedApp.jurusan ||
                          "-"}
                      </span>
                    </div>
                    <div>
                      <span className="block text-[10px] font-bold text-slate-400 uppercase">
                        Instansi Pendidikan
                      </span>
                      <span className="font-bold text-slate-800">
                        {autocompleteSelectedApp.instansiPendidikan ??
                          autocompleteSelectedApp.universitas ??
                          "-"}
                      </span>
                    </div>
                  </div>

                  {(() => {
                    const isAlreadyAdded = selectedRecipients.includes(
                      autocompleteSelectedApp.id,
                    );
                    return (
                      <div className="space-y-3 pt-2">
                        {isAlreadyAdded && (
                          <div className="bg-amber-50 border border-amber-200 text-amber-700 px-3 py-2 rounded-xl text-[11px] font-bold flex items-center gap-2">
                            <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
                            <span>
                              Peserta ini sudah ditambahkan ke dalam daftar!
                            </span>
                          </div>
                        )}

                        <button
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => {
                            if (!isAlreadyAdded) {
                              setSelectedRecipients((prev) => [
                                ...prev,
                                autocompleteSelectedApp.id,
                              ]);
                            }
                          }}
                          className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            isAlreadyAdded
                              ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                              : "bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-500/10"
                          }`}
                        >
                          <Plus className="h-4.5 w-4.5" />
                          Tambahkan Ke Daftar Kirim
                        </button>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* Recipients lists for Tipe A */}
              {tipeSurat === "balasan" && (
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700">
                    Daftar Peserta Terdaftar Sementara:
                  </label>

                  {selectedRecipients.length > 0 ? (
                    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[10px] text-slate-400 uppercase font-black">
                            <th className="py-2.5 px-4 text-center w-12">No</th>
                            <th className="py-2.5 px-3">Nama Lengkap</th>
                            <th className="py-2.5 px-3">NIM / NISN</th>
                            <th className="py-2.5 px-3">Program Studi</th>
                            <th className="py-2.5 px-4 text-right">Aksi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {selectedRecipients.map((recId, idx) => {
                            const app = applications.find(
                              (a) => a.id === recId,
                            );
                            if (!app) return null;
                            return (
                              <tr
                                key={app.id}
                                className="hover:bg-slate-50/50 transition-all text-slate-800"
                              >
                                <td className="py-2.5 px-4 text-center text-slate-400 font-bold">
                                  {idx + 1}
                                </td>
                                <td className="py-2.5 px-3 font-bold">
                                  {app.namaLengkap}
                                </td>
                                <td className="py-2.5 px-3 font-mono font-semibold">
                                  {app.nim || app.nisn || "-"}
                                </td>
                                <td className="py-2.5 px-3">
                                  {app.prodi || app.jurusan || "-"}
                                </td>
                                <td className="py-2.5 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      setSelectedRecipients((prev) =>
                                        prev.filter((id) => id !== app.id),
                                      )
                                    }
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-all cursor-pointer"
                                    title="Hapus peserta"
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-slate-400 text-[11px] italic bg-slate-50/50 border border-dashed border-slate-200 p-4 rounded-xl text-center">
                      Belum ada peserta yang ditambahkan ke daftar sementara.
                      Silakan cari nama peserta di atas.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* FORM FOR TIPE B: SURAT KETERANGAN MAGANG KERJA */}
          {tipeSurat === "keterangan_magang" && (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-display">
                  <Award className="h-4 w-4 text-emerald-600" />
                  Isi Form Surat Keterangan Magang Kerja
                </h5>
                <p className="text-[11px] text-slate-500 mt-1">
                  Lengkapi nomor surat, data peserta, tanggal pelaksanaan, dan
                  penandatangan Kasubag Umum & Kepegawaian.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Nomor Surat:
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                      400.14.5.4 /
                    </span>
                    <input
                      type="text"
                      value={suratNoKeterangan}
                      onChange={(e) => setSuratNoKeterangan(e.target.value)}
                      placeholder="Nomor urut"
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                    />
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                      / sekret
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Tanggal Terbit Surat:
                  </label>
                  <input
                    type="text"
                    value={tglTerbitKeterangan}
                    onChange={(e) => setTglTerbitKeterangan(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-emerald-500"
                  />
                </div>

                {/* Data Peserta */}
                <div className="md:col-span-2 bg-emerald-50/50 border border-emerald-150 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-extrabold text-emerald-900 flex items-center gap-2">
                    <UserCheck className="h-4 w-4 text-emerald-600" /> Data
                    Peserta Magang (Otomatis / Bisa Disesuaikan):
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Nama Lengkap Peserta:
                      </label>
                      <input
                        type="text"
                        value={pesertaNama}
                        onChange={(e) => setPesertaNama(e.target.value)}
                        placeholder="Nama Peserta Magang"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        NIM / NISN:
                      </label>
                      <input
                        type="text"
                        value={pesertaNimNisn}
                        onChange={(e) => setPesertaNimNisn(e.target.value)}
                        placeholder="NIM / NISN"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Program Studi / Jurusan:
                      </label>
                      <input
                        type="text"
                        value={pesertaProdiJurusan}
                        onChange={(e) => setPesertaProdiJurusan(e.target.value)}
                        placeholder="Program Studi"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Perguruan Tinggi / Sekolah:
                      </label>
                      <input
                        type="text"
                        value={pesertaInstansiPendidikan}
                        onChange={(e) =>
                          setPesertaInstansiPendidikan(e.target.value)
                        }
                        placeholder="Nama Kampus / Sekolah"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Tanggal Magang */}
                <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    Tanggal Pelaksanaan Magang Kerja:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Tanggal Mulai Magang:
                      </label>
                      <input
                        type="text"
                        value={tglMulaiMagang}
                        onChange={(e) => setTglMulaiMagang(e.target.value)}
                        placeholder="1 Juli 2026"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Tanggal Selesai Magang:
                      </label>
                      <input
                        type="text"
                        value={tglSelesaiMagang}
                        onChange={(e) => setTglSelesaiMagang(e.target.value)}
                        placeholder="31 Agustus 2026"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Pejabat Penandatangan (Kasubag) */}
                <div className="md:col-span-2 bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-800">
                    Pejabat Penandatangan Surat:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Nama Pejabat:
                      </label>
                      <input
                        type="text"
                        value={penandatanganNamaKet}
                        onChange={(e) =>
                          setPenandatanganNamaKet(e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        NIP Pejabat:
                      </label>
                      <input
                        type="text"
                        value={penandatanganNipKet}
                        onChange={(e) => setPenandatanganNipKet(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Jabatan:
                      </label>
                      <input
                        type="text"
                        value={penandatanganJabatanKet}
                        onChange={(e) =>
                          setPenandatanganJabatanKet(e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Pangkat / Golongan:
                      </label>
                      <input
                        type="text"
                        value={penandatanganPangkatKet}
                        onChange={(e) =>
                          setPenandatanganPangkatKet(e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">
                        Instansi:
                      </label>
                      <input
                        type="text"
                        value={penandatanganInstansiKet}
                        onChange={(e) =>
                          setPenandatanganInstansiKet(e.target.value)
                        }
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-emerald-500 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Actions Tipe B */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handlePrintBulkOfficialLetter}
                  className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Printer className="h-4 w-4" />
                  Pratinjau / Cetak PDF
                </button>
                <button
                  type="button"
                  onClick={handleBulkSendLetters}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-emerald-500/15"
                >
                  <Send className="h-4 w-4" />
                  Terbitkan Surat Keterangan
                </button>
              </div>
            </div>
          )}

          {/* FORM FOR TIPE A: SURAT BALASAN */}
          {tipeSurat === "balasan" && (
            <>
              {/* Step 2: Letter Details */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-display">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Langkah 2: Format & Data Kepala Surat
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Sesuaikan nomor, rujukan surat masuk dari instansi pengirim,
                    perihal, dan tanggal surat keluar.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-700">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Nomor Surat Dinas:
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                        400.14.5.4 /
                      </span>
                      <input
                        type="text"
                        value={suratNo
                          .replace(/^400\.14\.5\.4\//i, "")
                          .replace(/\/Sekret$/i, "")}
                        onChange={(e) =>
                          setSuratNo(
                            formatNomorBalasanValue(
                              `400.14.5.4/${e.target.value}/Sekret`,
                            ),
                          )
                        }
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                      />
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 shrink-0">
                        / Sekret
                      </span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Tanggal Surat Keluar:
                    </label>
                    <input
                      type="text"
                      value={suratTgl}
                      onChange={(e) => setSuratTgl(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Sifat:
                    </label>
                    <input
                      type="text"
                      value={suratSifat}
                      onChange={(e) => setSuratSifat(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Lampiran:
                    </label>
                    <input
                      type="text"
                      value={suratLampiran}
                      onChange={(e) => setSuratLampiran(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-400 mb-1">
                      Perihal Surat:
                    </label>
                    <input
                      type="text"
                      value={suratPerihal}
                      onChange={(e) => setSuratPerihal(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-extrabold text-slate-900 focus:outline-hidden focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Rujukan Surat Masuk */}
                <div className="bg-slate-50/50 border border-slate-150 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    Rujukan Surat Masuk (Sesuai Permohonan Kampus/Sekolah):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Pengirim (cth: Dekan/Kepsek):
                      </label>
                      <input
                        type="text"
                        value={rujukanPengirim}
                        onChange={(e) => setRujukanPengirim(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Nama Kampus/Sekolah:
                      </label>
                      <input
                        type="text"
                        value={rujukanInstansi}
                        onChange={(e) => setRujukanInstansi(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Nomor Surat Masuk:
                      </label>
                      <input
                        type="text"
                        value={rujukanNo}
                        onChange={(e) => setRujukanNo(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Tanggal Surat Masuk:
                      </label>
                      <input
                        type="text"
                        value={rujukanTgl}
                        onChange={(e) => setRujukanTgl(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>

                {/* Alamat Surat (Kepada Yth) */}
                <div className="bg-slate-50/50 border border-slate-150 p-4 rounded-2xl space-y-3">
                  <div className="text-xs font-bold text-slate-700">
                    Tujuan Surat Dinas (Kepada Yth.):
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Jabatan Penerima:
                      </label>
                      <input
                        type="text"
                        value={suratKepadaJabatan}
                        onChange={(e) => setSuratKepadaJabatan(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Instansi Penerima:
                      </label>
                      <input
                        type="text"
                        value={suratKepadaInstansi}
                        onChange={(e) => setSuratKepadaInstansi(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-1">
                        Kota / Tempat:
                      </label>
                      <input
                        type="text"
                        value={suratTempat}
                        onChange={(e) => setSuratTempat(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Editor Content */}
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2 font-display">
                    <Edit className="h-4 w-4 text-blue-600" />
                    Langkah 3: Tulis Isi Surat Dinas
                  </h5>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Isi inti surat resmi telah diisi secara otomatis berdasarkan
                    data peserta, silakan perbarui naskah secara bebas.
                  </p>
                </div>

                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Isi Inti Surat:
                    </label>
                    <textarea
                      rows={6}
                      value={suratIsi}
                      onChange={(e) => setSuratIsi(e.target.value)}
                      placeholder="Ketik isi pesan surat di sini..."
                      className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                    ></textarea>
                  </div>

                  {/* Signatory Settings (Penandatangan) */}
                  <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-slate-700">
                      Penandatangan Surat Resmi:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          Nama Camat / Kepala:
                        </label>
                        <input
                          type="text"
                          value={suratPenandatanganNama}
                          onChange={(e) =>
                            setSuratPenandatanganNama(e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          Jabatan:
                        </label>
                        <input
                          type="text"
                          value={suratPenandatanganJabatan}
                          onChange={(e) =>
                            setSuratPenandatanganJabatan(e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-850"
                        />
                      </div>
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 mb-0.5">
                          NIP:
                        </label>
                        <input
                          type="text"
                          value={suratPenandatanganNip}
                          onChange={(e) =>
                            setSuratPenandatanganNip(e.target.value)
                          }
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-850"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tembusan */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Tembusan (Bisa dipisah baris baru):
                    </label>
                    <textarea
                      rows={2}
                      value={suratTembusan}
                      onChange={(e) => setSuratTembusan(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden focus:border-blue-500 text-slate-800"
                    ></textarea>
                  </div>

                  {/* Form Actions Tipe A */}
                  <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        if (selectedRecipients.length === 0) {
                          alert("Pilih minimal 1 penerima!");
                          return;
                        }
                        handlePrintBulkOfficialLetter();
                      }}
                      className="px-4 py-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <Printer className="h-4 w-4" />
                      Pratinjau / Cetak PDF
                    </button>
                    <button
                      type="button"
                      onClick={handleBulkSendLetters}
                      className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/15"
                    >
                      <Send className="h-4 w-4" />
                      Kirim Surat & Lulus Peserta
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* SENT LETTERS ARCHIVE LIST */}
      {suratTabSubMode === "arsip" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 p-4 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={archiveSearchTerm}
                onChange={(e) => setArchiveSearchTerm(e.target.value)}
                placeholder="Cari nomor surat, nama peserta, instansi..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold text-slate-800 font-sans"
              />
            </div>

            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs text-slate-600">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <select
                value={archiveKategoriFilter}
                onChange={(e) =>
                  setArchiveKategoriFilter(e.target.value as any)
                }
                className="bg-transparent focus:outline-hidden font-bold cursor-pointer text-slate-800"
              >
                <option value="all">Semua Kategori</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="siswa">Siswa</option>
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="p-4">No. Surat & Jenis</th>
                    <th className="p-4">Penerima Surat (Peserta)</th>
                    <th className="p-4">Instansi Pendidikan</th>
                    <th className="p-4">Perihal / Keterangan</th>
                    <th className="p-4 text-center">Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {(() => {
                    const filteredArchive = suratList.filter((surat) => {
                      const isSiswa = surat.kategoriPendaftar === "siswa";
                      const matchesKategori =
                        archiveKategoriFilter === "all" ||
                        (archiveKategoriFilter === "siswa" && isSiswa) ||
                        (archiveKategoriFilter === "mahasiswa" && !isSiswa);

                      const sNo = surat.nomorSurat || "";
                      const sPerihal = surat.perihal || "";
                      const matchesSearch =
                        sNo
                          .toLowerCase()
                          .includes(archiveSearchTerm.toLowerCase()) ||
                        sPerihal
                          .toLowerCase()
                          .includes(archiveSearchTerm.toLowerCase()) ||
                        surat.namaPeserta
                          ?.toLowerCase()
                          .includes(archiveSearchTerm.toLowerCase()) ||
                        surat.daftarPesertaSurat?.some((p: SuratParticipant) =>
                          p.nama
                            ?.toLowerCase()
                            .includes(archiveSearchTerm.toLowerCase()),
                        ) ||
                        surat.daftarPesertaSurat?.some((p: SuratParticipant) =>
                          p.instansi
                            ?.toLowerCase()
                            .includes(archiveSearchTerm.toLowerCase()),
                        );

                      return matchesKategori && matchesSearch;
                    });

                    if (filteredArchive.length === 0) {
                      return (
                        <tr>
                          <td
                            colSpan={5}
                            className="text-center py-16 text-slate-400 text-xs font-semibold"
                          >
                            Tidak ditemukan arsip surat keluar. Surat otomatis
                            diarsipkan setelah diterbitkan.
                          </td>
                        </tr>
                      );
                    }

                    return filteredArchive.map((surat) => {
                      const isKetMagang =
                        surat.tipeSurat === "keterangan_magang";
                      const isSiswa = surat.kategoriPendaftar === "siswa";

                      let namesList =
                        surat.namaPeserta ||
                        surat.daftarPesertaSurat
                          ?.map((p: SuratParticipant) => p.nama)
                          .join(", ") ||
                        "Tidak ada nama";
                      let instansiList =
                        surat.instansiPendidikan ||
                        Array.from(
                          new Set(
                            surat.daftarPesertaSurat?.map(
                              (p: SuratParticipant) => p.instansi,
                            ),
                          ),
                        ).join(", ") ||
                        "Tidak ada instansi";

                      const firstRecipient = surat.daftarPesertaSurat?.[0];
                      const initials = getInitials(
                        surat.namaPeserta || firstRecipient?.nama || "P",
                      );

                      return (
                        <tr
                          key={surat.id}
                          className="hover:bg-slate-50/50 transition-colors text-[11px]"
                        >
                          <td className="p-3">
                            <div className="font-bold text-slate-800 font-mono text-[11px]">
                              {surat.nomorSurat || "-"}
                            </div>
                            <div className="flex items-center gap-1.5 mt-1">
                              {isKetMagang ? (
                                <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[9px] font-extrabold">
                                  Surat Ket. Magang
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 text-[9px] font-extrabold">
                                  Surat Balasan
                                </span>
                              )}
                              <span className="text-[9px] text-slate-400 font-bold">
                                {surat.tanggalKeluar || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <div className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center font-extrabold text-slate-700 text-[10px] uppercase">
                                {initials}
                              </div>
                              <div>
                                <div
                                  className="font-bold text-slate-900 max-w-sm truncate text-[11px]"
                                  title={namesList}
                                >
                                  {namesList}
                                </div>
                                <div className="text-[9px] text-slate-450 font-bold">
                                  {isSiswa ? "Siswa" : "Mahasiswa"}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3 font-sans font-semibold">
                            <div
                              className="font-bold text-slate-700 max-w-xs truncate text-[11px]"
                              title={instansiList}
                            >
                              {instansiList}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                              ID: {surat.id}
                            </div>
                          </td>
                          <td className="p-3">
                            <div
                              className="font-medium text-slate-600 max-w-xs truncate text-[11px]"
                              title={surat.perihal}
                            >
                              {surat.perihal || "Surat Keterangan Magang Kerja"}
                            </div>
                          </td>
                          <td className="p-3 text-center whitespace-nowrap space-x-1.5">
                            <button
                              onClick={() => handlePrintOfficialLetter(surat)}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs font-sans"
                            >
                              <Printer className="h-3 w-3" /> Cetak PDF
                            </button>
                            <button
                              onClick={() => {
                                setDeleteTargetId(surat.id);
                                setDeleteTargetNo(surat.nomorSurat || "");
                                setDeleteTargetPerihal(surat.perihal || "");
                                setDeleteConfirmOpen(true);
                              }}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer inline-flex items-center gap-1 shadow-xs font-sans"
                            >
                              <Trash2 className="h-3 w-3" /> Hapus
                            </button>
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Floating delete confirmation dialog */}
      {deleteConfirmOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in"
          id="delete-surat-confirm-modal"
        >
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 text-center">
            <div className="mx-auto h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center animate-bounce">
              <AlertCircle className="h-6 w-6" />
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">
                Konfirmasi Hapus Surat
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus arsip surat nomor{" "}
                <strong className="text-slate-800">{deleteTargetNo}</strong>{" "}
                dengan perihal{" "}
                <strong className="text-slate-800">
                  {deleteTargetPerihal}
                </strong>
                ? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetNo("");
                  setDeleteTargetPerihal("");
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={async () => {
                  if (onDeleteSurat && deleteTargetId) {
                    await onDeleteSurat(deleteTargetId);
                  }
                  setDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetNo("");
                  setDeleteTargetPerihal("");
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
