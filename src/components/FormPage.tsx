/**
 * Component: FormPage
 * Deskripsi: Halaman Form Pendaftaran Magang multi-step (Data Pribadi, Instansi
 * Pendidikan, Rencana Magang, Upload Link Google Drive Berkas).
 */

import React, { useState } from "react";
import {
  Check,
  ShieldAlert,
  ArrowLeft,
  ArrowRight,
  ClipboardCheck,
  AlertCircle,
  Folder,
  Link2,
} from "lucide-react";
import { Application, User as UserType, Gender, LamaMagang } from "../types";
// @ts-ignore
import logoMagika from "../assets/images/logo_magika.png";

interface FormPageProps {
  currentUser: UserType;
  onNavigateDashboard: () => void;
  onSubmitSuccess: (newApplication: Application) => void;
}

type FormStep = "pribadi" | "kampus" | "magang" | "berkas" | "sukses";

export default function FormPage({
  currentUser,
  onNavigateDashboard,
  onSubmitSuccess,
}: FormPageProps) {
  const stepOrder: FormStep[] = [
    "pribadi",
    "kampus",
    "magang",
    "berkas",
    "sukses",
  ];
  const [step, setStep] = useState<FormStep>("pribadi");
  const [error, setError] = useState("");

  // Step 1: Data Pribadi
  const [namaLengkap, setNamaLengkap] = useState(currentUser.namaLengkap);
  const [jenisKelamin, setJenisKelamin] = useState<Gender>("Laki-laki");
  const [noHp, setNoHp] = useState(currentUser.noHp || "");
  const [alamatLengkap, setAlamatLengkap] = useState("");
  const [kategoriPendaftar, setKategoriPendaftar] = useState<
    "mahasiswa" | "siswa"
  >("mahasiswa");
  const isMahasiswa = kategoriPendaftar === "mahasiswa";

  // Step 2: Data Kampus / Sekolah & Akademik
  const [universitas, setUniversitas] = useState(currentUser.universitas || "");
  const [nim, setNim] = useState("");
  const [nisn, setNisn] = useState("");
  const [kelas, setKelas] = useState("Kelas XII");
  const [jurusan, setJurusan] = useState("");
  const [fakultas, setFakultas] = useState("");
  const [prodi, setProdi] = useState(currentUser.prodi || "");
  const [semester, setSemester] = useState("Semester 5");

  // Step 3: Data Magang
  const [durasi, setDurasi] = useState<LamaMagang>("3 Bulan");
  const [isCustomDurasi, setIsCustomDurasi] = useState(false);
  const [customDurasi, setCustomDurasi] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState("2026-07-15");
  const [tanggalSelesai, setTanggalSelesai] = useState("2026-10-15");
  const [tujuanMagang, setTujuanMagang] = useState("");

  // Step 4: Link Google Drive Berkas Persyaratan
  const [linkDrive, setLinkDrive] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submittedApp, setSubmittedApp] = useState<Application | null>(null);

  // Step Validations
  const validatePribadi = () => {
    if (!namaLengkap) return "Nama Lengkap wajib diisi.";
    if (!jenisKelamin) return "Jenis Kelamin wajib dipilih.";
    if (!noHp) return "Nomor HP wajib diisi.";
    if (!alamatLengkap) return "Alamat Lengkap wajib diisi.";
    return null;
  };

  const validateKampus = () => {
    if (!universitas) return "Nama Instansi Pendidikan wajib diisi.";
    if (kategoriPendaftar === "mahasiswa") {
      if (!nim) return "Nomor Induk Mahasiswa (NIM) wajib diisi.";
      if (!fakultas) return "Fakultas wajib diisi.";
      if (!prodi) return "Program Studi wajib diisi.";
      if (!semester) return "Semester berjalan wajib diisi.";
    } else {
      if (!nisn) return "Nomor Induk Siswa Nasional (NISN) wajib diisi.";
      if (!jurusan) return "Jurusan wajib diisi.";
      if (!kelas) return "Kelas wajib diisi.";
    }
    return null;
  };

  const validateMagang = () => {
    if (!tanggalMulai || !tanggalSelesai)
      return "Tanggal pelaksanaan magang wajib diisi.";
    if (!tujuanMagang || tujuanMagang.length < 20)
      return "Tujuan magang wajib ditulis minimal 20 karakter.";
    return null;
  };

  const validateBerkas = () => {
    if (!linkDrive || !linkDrive.trim())
      return "Link Google Drive berkas persyaratan wajib diisi.";
    const cleanUrl = linkDrive.trim().toLowerCase();
    if (!cleanUrl.startsWith("http://") && !cleanUrl.startsWith("https://")) {
      return "Harap masukkan format URL Link Google Drive yang valid (dimulai dengan http:// atau https://).";
    }
    if (!agreeTerms) return "Anda harus menyetujui pernyataan kebenaran data.";
    return null;
  };

  const handleNext = () => {
    setError("");

    const validator =
      step === "pribadi"
        ? validatePribadi
        : step === "kampus"
          ? validateKampus
          : step === "magang"
            ? validateMagang
            : undefined;

    const err = validator?.();
    if (err) {
      setError(err);
      return;
    }

    const nextStep = stepOrder[stepOrder.indexOf(step) + 1];
    if (nextStep) setStep(nextStep);
  };

  const handleBack = () => {
    setError("");
    const previousStep = stepOrder[stepOrder.indexOf(step) - 1];
    if (previousStep) setStep(previousStep);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const err = validateBerkas();
    if (err) {
      setError(err);
      return;
    }

    setIsUploading(true);
    try {
      // Hasilkan detail aplikasi acak
      const registrationNumber = `MAG-2026-${Math.floor(10000 + Math.random() * 90000)}`;

      const newApplication: Application = {
        id: registrationNumber,
        userEmail: (currentUser.email || "").toLowerCase().trim(),
        tglDaftar: new Date().toISOString().split("T")[0],
        status: "Menunggu",
        namaLengkap,
        jenisKelamin,
        noHp,
        alamatLengkap,

        kategoriPendaftar,
        nim: isMahasiswa ? nim || "" : "",
        nisn: !isMahasiswa ? nisn || "" : "",
        kelas: !isMahasiswa ? kelas || "" : "",
        jurusan: !isMahasiswa ? jurusan || "" : "",

        universitas,
        fakultas: isMahasiswa ? fakultas || "" : "",
        prodi: isMahasiswa ? prodi || "" : jurusan || "",
        semester: isMahasiswa ? semester || "" : kelas || "",

        durasi,
        tanggalMulai,
        tanggalSelesai,
        tujuanMagang,
        linkDrive: linkDrive.trim(),
      };

      try {
        // Import Firestore dynamically and write to DB immediately so the data is in the database and listeners trigger instantly
        const { db } = await import("../firebase");
        const { doc, setDoc } = await import("firebase/firestore");

        await setDoc(
          doc(db, "pendaftar_magang", registrationNumber),
          newApplication,
        );

        // Perbarui profil siswa dengan data dari formulir pendaftaran.
        if (currentUser && currentUser.role === "student") {
          const updatedUser = {
            ...currentUser,
            universitas: newApplication.universitas,
            prodi: newApplication.prodi,
            noHp: newApplication.noHp,
          };
          await setDoc(doc(db, "users", currentUser.id), updatedUser);
        }
      } catch (dbErr: any) {
        console.error("Firestore save failed:", dbErr);
        throw new Error(
          "Gagal menyimpan data pendaftaran ke Firestore. Harap periksa koneksi internet Anda.",
        );
      }

      setSubmittedApp(newApplication);
      setStep("sukses");

      // WhatsApp Admin integration
      try {
        const message = `Hallo Admin, saya pendaftar baru.\nNama: ${namaLengkap}\nInstansi: ${universitas}\nAlamat: ${alamatLengkap}\nTerima kasih`;
        const waLink = `https://wa.me/6283844165405?text=${encodeURIComponent(message)}`;
        window.location.href = waLink;
      } catch (waErr: any) {
        console.error("WhatsApp redirect failed:", waErr);
        alert(
          "Pendaftaran Anda telah berhasil disimpan! Namun gagal membuka aplikasi WhatsApp secara otomatis.",
        );
      }
    } catch (uploadErr: any) {
      console.error("Firebase submit failed:", uploadErr);
      const errMsg =
        uploadErr?.message ||
        "Gagal menyimpan data pendaftaran ke Firestore. Harap periksa koneksi internet Anda.";
      setError(errMsg);
      alert(`Pendaftaran Gagal: ${errMsg}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFinish = () => {
    if (submittedApp) {
      onSubmitSuccess(submittedApp);
    }
  };

  // membantu untuk menggambar tab progres
  const renderStepTab = (id: FormStep, label: string, num: number) => {
    const isCompleted = stepOrder.indexOf(step) > stepOrder.indexOf(id);
    const isActive = step === id;

    return (
      <div className="flex items-center gap-2" id={`step-tab-${id}`}>
        <div
          className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold font-display transition-all ${
            isCompleted
              ? "bg-emerald-500 text-white"
              : isActive
                ? "bg-blue-600 text-white shadow-xs"
                : "bg-slate-100 text-slate-400"
          }`}
        >
          {isCompleted ? <Check className="h-4 w-4" /> : num}
        </div>
        <span
          className={`text-xs font-bold tracking-tight hidden md:inline ${
            isActive
              ? "text-blue-600"
              : isCompleted
                ? "text-emerald-500"
                : "text-slate-400"
          }`}
        >
          {label}
        </span>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-slate-50 font-sans p-4 md:p-8 flex flex-col justify-between"
      id="form-container"
    >
      {/* Upper Brand */}
      <header className="max-w-4xl mx-auto w-full flex items-center justify-between pb-6 border-b border-slate-200">
        <button
          onClick={onNavigateDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img
              src={logoMagika}
              alt="Logo Magika"
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="font-display font-bold text-sm text-slate-900">
            MAGIKA Portal
          </span>
        </div>
      </header>

      {/* Main Panel Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full py-8">
        {step !== "sukses" && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-8 shadow-xs">
            {/* Steps Progress Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-5 overflow-x-auto gap-4 scrollbar-none">
              {renderStepTab("pribadi", "Data Pribadi", 1)}
              <div className="h-[2px] bg-slate-100 flex-1 min-w-[20px]" />
              {renderStepTab("kampus", "Instansi Pendidikan", 2)}
              <div className="h-[2px] bg-slate-100 flex-1 min-w-[20px]" />
              {renderStepTab("magang", "Data Magang", 3)}
              <div className="h-[2px] bg-slate-100 flex-1 min-w-[20px]" />
              {renderStepTab("berkas", "Upload Berkas", 4)}
            </div>

            {/* Error alerts */}
            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-2xl flex gap-2.5 items-center">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 text-rose-600" />
                <span>{error}</span>
              </div>
            )}

            {/* FORM CONTAINER */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* STEP 1: DATA PRIBADI */}
              {step === "pribadi" && (
                <div
                  className="space-y-4 animate-fade-in"
                  id="form-step-pribadi"
                >
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 leading-none">
                      Lengkapi Data Diri Anda
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Identitas diri resmi sesuai KTP yang aktif untuk proses
                      peninjauan berkas.
                    </p>
                  </div>

                  {/* Selector Kategori Pendaftar */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-xs font-bold text-slate-800">
                        Kategori Pendaftar Magang
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Sesuaikan dengan status pendidikan aktif Anda saat ini.
                      </p>
                    </div>
                    <div className="flex bg-slate-200/60 p-1 rounded-xl w-fit shrink-0">
                      <button
                        type="button"
                        onClick={() => setKategoriPendaftar("mahasiswa")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          kategoriPendaftar === "mahasiswa"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Mahasiswa
                      </button>
                      <button
                        type="button"
                        onClick={() => setKategoriPendaftar("siswa")}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          kategoriPendaftar === "siswa"
                            ? "bg-blue-600 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Siswa
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Nama Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={namaLengkap}
                        onChange={(e) => setNamaLengkap(e.target.value)}
                        placeholder="Nama lengkap sesuai KTP"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Jenis Kelamin <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={jenisKelamin}
                        onChange={(e) =>
                          setJenisKelamin(e.target.value as Gender)
                        }
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
                        required
                      >
                        <option value="" disabled>
                          -- Pilih Jenis Kelamin --
                        </option>
                        <option value="Laki-laki">Laki-laki</option>
                        <option value="Perempuan">Perempuan</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Nomor WhatsApp Aktif{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={noHp}
                        onChange={(e) =>
                          setNoHp(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="Contoh: 081234567890"
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Alamat Lengkap Sesuai KTP{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={alamatLengkap}
                      onChange={(e) => setAlamatLengkap(e.target.value)}
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan/desa, kabupaten, kode pos"
                      rows={3}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all resize-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: DATA KAMPUS / SEKOLAH */}
              {step === "kampus" && (
                <div
                  className="space-y-4 animate-fade-in"
                  id="form-step-kampus"
                >
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 leading-none">
                      {kategoriPendaftar === "siswa"
                        ? "Informasi Akademik & Jurusan Sekolah"
                        : "Informasi Akademik (Instansi Pendidikan)"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {kategoriPendaftar === "siswa"
                        ? "Lengkapi data sekolah tempat Anda saat ini menempuh studi (SMA/SMK/MA)."
                        : "Lengkapi data perguruan tinggi tempat Anda saat ini menempuh studi (Universitas/Institut/Politeknik)."}
                    </p>
                  </div>

                  {kategoriPendaftar === "mahasiswa" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Nama Universitas / Kampus{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={universitas}
                          onChange={(e) => setUniversitas(e.target.value)}
                          placeholder="Contoh: Universitas Padjadjaran"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Nomor Induk Mahasiswa (NIM){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={nim}
                          onChange={(e) => setNim(e.target.value)}
                          placeholder="Masukkan NIM Anda"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono font-bold text-slate-800"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Fakultas <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={fakultas}
                          onChange={(e) => setFakultas(e.target.value)}
                          placeholder="Contoh: Ilmu Komputer atau FISIP"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Program Studi <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={prodi}
                          onChange={(e) => setProdi(e.target.value)}
                          placeholder="Contoh: Teknik Informatika"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1.5 md:col-span-2">
                        <label className="text-xs font-semibold text-slate-700">
                          Semester Berjalan{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        >
                          <option value="Semester 1">
                            Semester 1 (Mahasiswa)
                          </option>
                          <option value="Semester 2">
                            Semester 2 (Mahasiswa)
                          </option>
                          <option value="Semester 3">
                            Semester 3 (Mahasiswa)
                          </option>
                          <option value="Semester 4">
                            Semester 4 (Mahasiswa)
                          </option>
                          <option value="Semester 5">
                            Semester 5 (Mahasiswa)
                          </option>
                          <option value="Semester 6">
                            Semester 6 (Mahasiswa)
                          </option>
                          <option value="Semester 7">
                            Semester 7 (Mahasiswa)
                          </option>
                          <option value="Semester 8">
                            Semester 8 (Atau ke atas)
                          </option>
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Nama Sekolah (Instansi Pendidikan){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={universitas}
                          onChange={(e) => setUniversitas(e.target.value)}
                          placeholder="Contoh: SMKN 1 Cicalengka"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Nomor Induk Siswa Nasional (NISN){" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={nisn}
                          onChange={(e) => setNisn(e.target.value)}
                          placeholder="Masukkan NISN Anda"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono font-bold text-slate-800"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Jurusan / Peminatan{" "}
                          <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={jurusan}
                          onChange={(e) => setJurusan(e.target.value)}
                          placeholder="Contoh: Rekayasa Perangkat Lunak atau IPS"
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-slate-700">
                          Kelas <span className="text-rose-500">*</span>
                        </label>
                        <select
                          value={kelas}
                          onChange={(e) => setKelas(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                          required
                        >
                          <option value="Kelas X">Kelas X (SMA/SMK)</option>
                          <option value="Kelas XI">Kelas XI (SMA/SMK)</option>
                          <option value="Kelas XII">Kelas XII (SMA/SMK)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: DATA MAGANG */}
              {step === "magang" && (
                <div
                  className="space-y-4 animate-fade-in"
                  id="form-step-magang"
                >
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 leading-none">
                      Rencana Magang
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sesuaikan target pencapaian serta rencana durasi magang
                      Anda di pemerintahan Kecamatan.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-semibold text-slate-700">
                        Lama Durasi Magang{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={isCustomDurasi ? "Lainnya" : durasi}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === "Lainnya") {
                            setIsCustomDurasi(true);
                            setDurasi(customDurasi || "");
                          } else {
                            setIsCustomDurasi(false);
                            setDurasi(val);
                          }
                        }}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
                        required
                      >
                        <option value="1 Bulan">
                          1 Bulan (Periode Pendek)
                        </option>
                        <option value="2 Bulan">2 Bulan</option>
                        <option value="3 Bulan">
                          3 Bulan (Standar Kampus)
                        </option>
                        <option value="6 Bulan">6 Bulan (Skema MBKM)</option>
                        <option value="Lainnya">Lainnya</option>
                      </select>
                      {isCustomDurasi && (
                        <input
                          type="text"
                          value={customDurasi}
                          onChange={(e) => {
                            setCustomDurasi(e.target.value);
                            setDurasi(e.target.value);
                          }}
                          placeholder="Ketik durasi magang manual (cth: 4 Bulan, 45 Hari)"
                          className="w-full px-4 py-2.5 mt-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
                          required
                        />
                      )}
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Tanggal Mulai Magang{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={tanggalMulai}
                        onChange={(e) => setTanggalMulai(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono"
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-700">
                        Tanggal Selesai Magang{" "}
                        <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={tanggalSelesai}
                        onChange={(e) => setTanggalSelesai(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">
                      Tujuan & Harapan Magang{" "}
                      <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      value={tujuanMagang}
                      onChange={(e) => setTujuanMagang(e.target.value)}
                      placeholder="Jelaskan secara singkat apa yang ingin Anda pelajari dan kontribusi digital apa yang ingin Anda berikan kepada Kecamatan Cicalengka..."
                      rows={4}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all resize-none"
                      required
                    />
                  </div>
                </div>
              )}

              {/* STEP 4: LINK GOOGLE DRIVE BERKAS */}
              {step === "berkas" && (
                <div
                  className="space-y-6 animate-fade-in"
                  id="form-step-berkas"
                >
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 leading-none">
                      Link Google Drive Berkas Persyaratan
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Sertakan 1 tautan folder Google Drive yang berisi Surat
                      Pengantar Kampus/Sekolah dan berkas pendukung lainnya.
                    </p>
                  </div>

                  <div className="space-y-3 bg-white p-5 border border-slate-200 rounded-2xl shadow-xs">
                    <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                      <Folder className="h-4 w-4 text-blue-600" />
                      Link Folder Google Drive Persyaratan{" "}
                      <span className="text-rose-500">*</span>
                    </label>

                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Link2 className="h-4 w-4" />
                      </div>
                      <input
                        type="url"
                        value={linkDrive}
                        onChange={(e) => setLinkDrive(e.target.value)}
                        placeholder="https://drive.google.com/drive/folders/..."
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 focus:bg-white rounded-xl text-xs font-mono font-semibold focus:outline-hidden focus:border-blue-500 transition-all"
                        required
                      />
                    </div>

                    <div className="bg-amber-50 border border-amber-200 p-3.5 rounded-xl space-y-1 text-amber-900">
                      <p className="text-xs leading-relaxed font-semibold">
                        Upload semua persyaratan berkas ke link drive yang anda
                        telah buat dan link harus bisa di akses oleh semua
                        orang, berikut panduan yang harus anda cermati [
                        <a
                          href="https://drive.google.com/drive/folders/1NPM8E7j5i34Jov-qiRKvJA0nXw6PJKT8?usp=sharing"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-extrabold underline text-blue-700 hover:text-blue-900 cursor-pointer"
                        >
                          klik disini buku panduan berkas
                        </a>
                        ]
                      </p>
                    </div>
                  </div>

                  <div className="bg-amber-50/60 border border-amber-200 p-4 rounded-2xl space-y-3">
                    <div className="flex gap-2.5 items-start text-amber-800 text-xs font-semibold">
                      <AlertCircle className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>Pernyataan Kebenaran Data Administrasi:</span>
                    </div>
                    <div className="flex items-start gap-2.5 pl-7">
                      <input
                        type="checkbox"
                        id="form-agree-checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="rounded border-amber-400 text-amber-700 focus:ring-amber-500 mt-0.5"
                      />
                      <label
                        htmlFor="form-agree-checkbox"
                        className="text-[11px] text-amber-900 leading-relaxed font-medium cursor-pointer"
                      >
                        Saya dengan ini menjamin secara hukum bahwa seluruh
                        dokumen berkas persyaratan yang tersimpan pada link
                        Google Drive yang saya kirimkan di portal MAGIKA adalah
                        asli, sah, valid, dan dapat dipertanggungjawabkan
                        kebenarannya.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* ACTION BUTTON FOOTER */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-6">
                {step !== "pribadi" ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="px-5 py-2.5 text-xs font-semibold border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-50 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Sebelumnya
                  </button>
                ) : (
                  <div />
                )}

                {step === "berkas" ? (
                  <button
                    type="submit"
                    id="form-submit-btn"
                    disabled={isUploading}
                    className="px-6 py-3 bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUploading ? (
                      <>
                        <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Mengunggah & Menyimpan...
                      </>
                    ) : (
                      <>
                        <ClipboardCheck className="h-4.5 w-4.5" />
                        Ajukan Pendaftaran
                      </>
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-3 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    Selanjutnya
                    <ArrowRight className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {/* STEP 5: SUCCESS REDIRECT VIEW */}
        {step === "sukses" && submittedApp && (
          <div
            className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 text-center space-y-8 shadow-xl max-w-2xl mx-auto animate-fade-in"
            id="form-success-wrapper"
          >
            <div className="flex justify-center">
              <div className="h-20 w-20 bg-emerald-50 text-emerald-500 border border-emerald-200 rounded-full flex items-center justify-center animate-pulse">
                <Check className="h-10 w-10 text-emerald-600 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-3">
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-950 tracking-tight leading-none">
                Pendaftaran Berhasil!
              </h2>
              <p className="text-slate-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
                Selamat! Berkas pendaftaran magang Anda telah berhasil kami
                terima. Silakan simpan nomor pendaftaran Anda di bawah untuk
                pengecekan berkala.
              </p>
            </div>

            {/* Registration Details Card representation */}
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-4 max-w-md mx-auto relative overflow-hidden">
              <div className="absolute top-0 right-0 h-16 w-16 bg-blue-500/5 rounded-full translate-x-4 -translate-y-4" />

              <div className="border-b border-slate-200/60 pb-3 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Nomor Pendaftaran
                  </span>
                  <div className="text-base font-extrabold font-mono text-blue-600">
                    {submittedApp.id}
                  </div>
                </div>
                <div className="px-2.5 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded-lg border border-amber-200 flex items-center gap-1 animate-pulse">
                  <span className="h-1.5 w-1.5 bg-amber-500 rounded-full" />
                  Menunggu
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">
                    Nama Pendaftar:
                  </span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {submittedApp.namaLengkap}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">
                    {submittedApp.kategoriPendaftar === "siswa"
                      ? "Asal Sekolah:"
                      : "Universitas Asal:"}
                  </span>
                  <div className="font-bold text-slate-800 mt-0.5">
                    {submittedApp.universitas}
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-medium">
                    Tanggal Daftar:
                  </span>
                  <div className="font-bold text-slate-800 mt-0.5 font-mono">
                    {submittedApp.tglDaftar}
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleFinish}
                id="success-dashboard-btn"
                className="px-6 py-3 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-700 transition-all cursor-pointer shadow-md shadow-blue-500/15"
              >
                Kembali ke Dashboard
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-4xl mx-auto w-full text-center text-[11px] text-slate-400 pt-6 border-t border-slate-200">
        © 2026 MAGIKA Kecamatan Cicalengka. Digital Empowerment for Students.
        All Rights Reserved.
      </footer>
    </div>
  );
}
