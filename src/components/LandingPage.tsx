/**
 * Component: LandingPage
 * Deskripsi: Halaman Utama Publik Portal MAGIKA Kecamatan Cicalengka,
 * menampilkan informasi program, carousel slideshow, persyaratan, tata tertib, dan alur pendaftaran.
 */

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  ArrowRight, 
  CheckCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Layers,
  GraduationCap,
  ExternalLink,
  Shirt,
  Lock,
  BookOpen
} from 'lucide-react';
import { motion } from 'motion/react';
import { Application } from '../types';
// @ts-ignore
import cicalengkaSlide1 from '../assets/images/cicalengka_slide1.jpeg';
// @ts-ignore
import cicalengkaSlide2 from '../assets/images/cicalengka_slide2.jpeg';
// @ts-ignore
import cicalengkaSlide3 from '../assets/images/cicalengka_slide3.jpeg';
// @ts-ignore
import cicalengkaSlide4 from '../assets/images/cicalengka_slide4.jpeg';
// @ts-ignore
import logoKabBandung from '../assets/images/logo_kab_bandung.png';
// @ts-ignore
import logoKecCicalengka from '../assets/images/logo_kec_cicalengka.png';
// @ts-ignore
import logoBanggaMelayani from '../assets/images/logo_bangga_melayani.png';
// @ts-ignore
import logoBerakhlak from '../assets/images/logo_berakhlak.png';
// @ts-ignore
import logoMagika from '../assets/images/logo_magika.png';

const slideImages = [
  { src: cicalengkaSlide1, alt: 'Slide 1 - Kantor Kecamatan Cicalengka' },
  { src: cicalengkaSlide2, alt: 'Slide 2 - Kegiatan Magang Digital' },
  { src: cicalengkaSlide3, alt: 'Slide 3 - Fasilitas Kerja Kecamatan' },
  { src: cicalengkaSlide4, alt: 'Slide 4 - Pelayanan Digital Kemasyarakatan' }
];

const sponsorLogos = [
  {
    id: 'kab-bandung',
    name: 'Kabupaten Bandung',
    src: logoKabBandung
  },
  {
    id: 'kec-cicalengka',
    name: 'Kec. Cicalengka',
    src: logoKecCicalengka
  },
  {
    id: 'bangga-melayani',
    name: 'Bangga Melayani',
    src: logoBanggaMelayani
  },
  {
    id: 'berakhlak',
    name: 'Berakhlak',
    src: logoBerakhlak
  }
];

interface SponsorLogoProps {
  logo: {
    id: string;
    name: string;
    src: string;
  };
}

const SponsorLogoItem: React.FC<SponsorLogoProps> = ({ logo }) => {
  return (
    <div className="flex flex-col items-center justify-center transition-all duration-350 transform hover:scale-105">
      <div className="h-16 md:h-20 flex items-center justify-center p-1">
        <img
          src={logo.src}
          alt={logo.name}
          className={`h-full w-auto object-contain max-h-[56px] md:max-h-[72px] filter drop-shadow-xs select-none border-0 outline-none ${logo.id === 'kec-cicalengka' ? 'rounded-xl md:rounded-2xl' : ''}`}
          referrerPolicy="no-referrer"
        />
      </div>
    </div>
  );
};

interface LandingPageProps {
  onNavigate: (view: string) => void;
  applications: Application[];
}

export default function LandingPage({ onNavigate, applications }: LandingPageProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white" id="landing-container">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 glass-panel shadow-xs px-4 py-3 md:px-8 flex items-center justify-between" id="landing-navbar">
        <div className="flex items-center gap-2.5 sm:gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="h-8 w-8 sm:h-9 sm:w-9 bg-white border border-slate-200/80 rounded-lg sm:rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img src={logoMagika} alt="Logo Magika" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="font-display font-bold text-sm sm:text-base md:text-lg text-slate-900 leading-none tracking-tight">MAGIKA</div>
            <div className="text-[9px] sm:text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">Kecamatan Cicalengka</div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#beranda" className="hover:text-blue-600 transition-colors">Beranda</a>
          <a href="#tentang" className="hover:text-blue-600 transition-colors">Apa itu MAGIKA?</a>
          <a href="#persyaratan" className="hover:text-blue-600 transition-colors">Persyaratan</a>
          <a href="#peraturan" className="hover:text-blue-600 transition-colors">Tata Tertib</a>
          <a href="#alur" className="hover:text-blue-600 transition-colors">Alur</a>
          <a href="#kontak" className="hover:text-blue-600 transition-colors">Kontak</a>
          <button 
            onClick={() => onNavigate('track')} 
            className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-all flex items-center gap-1.5 cursor-pointer font-medium"
          >
            <Search className="h-3.5 w-3.5 text-blue-600" />
            Cek Status
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            id="nav-login-btn"
            onClick={() => onNavigate('login')}
            className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-medium text-slate-700 hover:text-blue-600 transition-colors"
          >
            Masuk
          </button>
          <button 
            id="nav-register-btn"
            onClick={() => onNavigate('register')}
            className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold bg-blue-600 text-white rounded-lg sm:rounded-xl shadow-xs hover:bg-blue-700 hover:shadow-md hover:shadow-blue-500/10 transition-all cursor-pointer"
          >
            Daftar Sekarang
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="beranda" className="relative py-10 lg:py-16 px-4 md:px-8 max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-y-6 lg:gap-x-12 items-center text-center lg:text-left">
        {/* Element A: Title Heading */}
        <motion.div 
          className="order-1 lg:col-span-7 flex flex-col items-center lg:items-start w-full"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-slate-950 tracking-tight leading-tight max-w-2xl">
            MAGIKA — Magang Digital <br className="hidden sm:inline" />
            <span className="text-blue-600">Kecamatan Cicalengka</span>
          </h1>
        </motion.div>

        {/* Element B: Automatic Slideshow Carousel */}
        <motion.div 
          className="w-full relative max-w-3xl lg:max-w-none lg:col-span-5 lg:col-start-8 lg:row-span-2 order-2"
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[22px] blur-sm opacity-15" />
          <div className="relative bg-white p-1 rounded-[22px] border border-slate-200/60 shadow-lg overflow-hidden aspect-video">
            {slideImages.map((slide, index) => (
              <div
                key={slide.src}
                className={`absolute inset-1 transition-opacity duration-1000 ease-in-out ${
                  index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                }`}
              >
                <img 
                  src={slide.src} 
                  alt={slide.alt} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover rounded-[18px] select-none"
                />
              </div>
            ))}
            {/* Slide indicator dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 z-20 bg-slate-900/40 backdrop-blur-xs py-1 px-2.5 rounded-full">
              {slideImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-1.5 w-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    index === currentSlide ? 'bg-white w-3.5' : 'bg-white/50 hover:bg-white/85'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* Element C: Subtitle and Call To Actions */}
        <motion.div 
          className="order-3 lg:col-span-7 flex flex-col items-center lg:items-start w-full space-y-4 sm:space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs sm:text-sm md:text-base text-slate-600 font-normal leading-relaxed max-w-2xl">
            Wujudkan potensi digitalmu bersama MAGIKA. Platform modern untuk menghubungkan para pendaftar magang dengan pengalaman kerja nyata di pemerintahan Kecamatan Cicalengka secara transparan dan terintegrasi.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2 justify-center lg:justify-start w-full sm:w-auto">
            <button 
              id="hero-register-btn"
              onClick={() => onNavigate('register')}
              className="px-5 py-3 sm:px-6 sm:py-3.5 bg-blue-600 text-white font-semibold rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0 duration-150 text-xs sm:text-sm"
            >
              Mulai Daftar <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse" />
            </button>
            <button 
              onClick={() => onNavigate('track')}
              className="px-5 py-3 sm:px-6 sm:py-3.5 bg-white text-slate-700 font-semibold border border-slate-200 hover:border-blue-300 hover:text-blue-600 rounded-lg sm:rounded-xl flex items-center justify-center gap-2 shadow-xs hover:shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0 duration-150 text-xs sm:text-sm cursor-pointer"
            >
              Cek Status Pendaftaran <Search className="h-3.5 w-3.5 text-slate-500" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Section 1: Apa itu MAGIKA? */}
      <section id="tentang" className="w-full bg-white py-14 px-4 md:px-8 border-t border-slate-200/80">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Apa itu <span className="text-blue-600">MAGIKA</span>?
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              MAGIKA (Magang Kecamatan Cicalengka) adalah portal resmi pelayanan dan pengelolaan program magang berbasis digital di Lingkungan Pemerintah Kecamatan Cicalengka. Portal ini dirancang untuk mempermudah proses pendaftaran, verifikasi berkas, hingga pemantauan kegiatan magang bagi siswa/mahasiswa secara transparan, efektif, dan terintegrasi.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold">
                <CheckCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Transparan</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Status verifikasi real-time</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold">
                <Layers className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Efektif & Mudah</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Pengajuan pendaftaran online</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-center gap-3 shadow-xs">
              <div className="h-10 w-10 bg-blue-100 text-blue-700 rounded-xl flex items-center justify-center shrink-0 font-bold">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-xs">Terintegrasi</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">Siswa SMA/SMK & Mahasiswa</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Persyaratan Berkas Section */}
      <section id="persyaratan" className="w-full bg-slate-50 py-14 px-4 md:px-8 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-slate-900 tracking-tight leading-none">
              Persyaratan Berkas Pendukung
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Sertakan berkas persyaratan di bawah ini ke dalam 1 folder Google Drive dan masukkan tautannya saat pendaftaran.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex gap-4 items-start hover:border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-bold border border-blue-100">1</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Surat Pengantar Kampus / Sekolah</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Surat keterangan izin magang resmi dari Kampus (Fakultas/Prodi/Instansi) untuk mahasiswa, atau dari Sekolah untuk siswa SMA/SMK, lengkap dengan nama pendaftar, periode magang, dan tanda tangan resmi.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex gap-4 items-start hover:border-blue-200 hover:shadow-md transition-all duration-300">
              <div className="h-10 w-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center shrink-0 font-bold border border-blue-100">2</div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">Surat Rekomendasi (Opsional)</h4>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Surat rekomendasi resmi dari dosen wali, ketua program studi, kepala sekolah, atau guru pendamping yang menyatakan kelayakan untuk mengikuti program magang di Kecamatan Cicalengka (jika ada).
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50/70 border border-blue-200/80 p-4 rounded-2xl flex items-start gap-3 text-xs text-blue-900 max-w-3xl mx-auto shadow-xs">
            <ExternalLink className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold block">Buku Panduan Penyusunan Berkas (Google Drive):</span>
              <p className="text-xs text-blue-800 leading-relaxed">
                Untuk melihat buku panduan penyusunan berkas, silakan{' '}
                <a 
                  href="https://drive.google.com/drive/folders/1NPM8E7j5i34Jov-qiRKvJA0nXw6PJKT8?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-extrabold text-blue-700 underline hover:text-blue-900 inline-flex items-center gap-1 bg-blue-100/80 px-2.5 py-0.5 rounded-md transition-all cursor-pointer hover:bg-blue-200/80"
                >
                  klik disini <ExternalLink className="h-3 w-3 inline" />
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Peraturan dan Tata Tertib Selama Magang */}
      <section id="peraturan" className="w-full bg-white py-14 px-4 md:px-8 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">
              Peraturan dan Tata Tertib Selama Magang Berlangsung
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Seluruh peserta magang wajib menaati poin-poin kedisiplinan dan tata tertib selama melaksanakan tugas di Lingkungan Pemerintah Kecamatan Cicalengka.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {/* Poin 1 */}
            <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0 border border-blue-100">
                  <Calendar className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">1. Aturan dan Alur Permohonan Izin</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ketentuan serta mekanisme pengajuan izin (sakit, halangan, dll.) bagi peserta magang.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-semibold text-blue-700">
                <CheckCircle className="h-3.5 w-3.5" /> Prosedur Permohonan Izin Kedinasan
              </div>
            </div>

            {/* Poin 2 */}
            <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0 border border-indigo-100">
                  <Shirt className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">2. Pakaian & Penampilan</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Aturan berpakaian rapi, sopan, dan formal (seperti kemeja / jas almamater) selama bertugas.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-semibold text-indigo-700">
                <CheckCircle className="h-3.5 w-3.5" /> Standar Berpakaian Formal
              </div>
            </div>

            {/* Poin 3 */}
            <div className="bg-slate-50/60 p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-300 hover:bg-white hover:shadow-md transition-all duration-300">
              <div className="space-y-3">
                <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0 border border-emerald-100">
                  <Lock className="h-6 w-6" />
                </div>
                <h4 className="font-bold text-slate-900 text-sm md:text-base">3. Etika & Kerahasiaan Data</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bersikap profesional, menjaga etika/nama baik instansi & almamater, serta menjaga kerahasiaan dokumen internal instansi.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200/60 flex items-center gap-2 text-[11px] font-semibold text-emerald-700">
                <CheckCircle className="h-3.5 w-3.5" /> Komitmen Integritas Instansi
              </div>
            </div>
          </div>

          {/* Google Drive Panduan Link Box */}
          <div className="bg-blue-50/80 border border-blue-200/90 p-5 rounded-2xl flex items-start gap-3.5 text-xs text-slate-800 max-w-4xl mx-auto shadow-xs">
            <BookOpen className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1.5 leading-relaxed">
              <span className="font-bold text-slate-900 block text-xs">Dokumen Panduan & Tata Tertib Magang:</span>
              <p className="text-xs text-slate-700">
                Untuk membaca detail lengkap mengenai peraturan, tata tertib, dan buku panduan magang, silakan{' '}
                <a 
                  href="https://drive.google.com/drive/folders/1KamR8pXS9Z0VYuMqFhaG6im0IhohMeHF?usp=sharing" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-extrabold text-blue-700 underline hover:text-blue-900 inline-flex items-center gap-1 bg-blue-100/80 px-2.5 py-0.5 rounded-md transition-all cursor-pointer shadow-2xs hover:bg-blue-200/80"
                >
                  klik disini <ExternalLink className="h-3 w-3 inline" />
                </a>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Alur Pendaftaran Section */}
      <section id="alur" className="py-12 bg-white px-4 md:px-8 border-y border-slate-200">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <h2 className="font-display text-2xl md:text-3xl font-extrabold tracking-tight leading-none text-slate-900">
              Alur Magang Digital <span className="text-blue-600">Pendaftar & Peserta</span>
            </h2>
            <p className="text-slate-500 text-xs md:text-sm">
              Proses pendaftaran mandiri secara daring hingga evaluasi akhir laporan program magang.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Horizontal line for desktop stepper connection */}
            <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-0.5 bg-slate-100 z-0" />
            
            <div className="flex flex-col items-center text-center space-y-3 z-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold font-display shadow-lg shadow-blue-500/20 text-base">1</div>
              <h4 className="font-bold text-sm text-slate-800">Daftar & Lengkapi Data</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Buat akun, masuk ke portal, dan lengkapi data pribadi Anda.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 z-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold font-display shadow-lg shadow-blue-500/20 text-base">2</div>
              <h4 className="font-bold text-sm text-slate-800">Link Google Drive</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Sertakan 1 link folder Google Drive yang berisi berkas administrasi pendukung.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 z-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold font-display shadow-lg shadow-blue-500/20 text-base">3</div>
              <h4 className="font-bold text-sm text-slate-800">Verifikasi Berkas</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Tinjau status verifikasi dan hasil kelulusan secara real-time.</p>
            </div>

            <div className="flex flex-col items-center text-center space-y-3 z-10 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 shadow-xs hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300">
              <div className="h-12 w-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-extrabold font-display shadow-lg shadow-blue-500/20 text-base">4</div>
              <h4 className="font-bold text-sm text-slate-800">Evaluasi & Laporan</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">Kirim laporan akhir kegiatan magang setelah masa program magang selesai dilaksanakan.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Logos & Sponsors Section */}
      <section className="py-12 bg-slate-100/85 border-t border-slate-200/80 px-4 md:px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto space-y-6 relative z-10">
          <div className="text-center">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest font-sans">
              Didukung & Bekerjasama Dengan
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 lg:gap-12">
            {sponsorLogos.map((logo) => (
              <SponsorLogoItem key={logo.id} logo={logo} />
            ))}
          </div>
        </div>
      </section>

      {/* Kontak & Footer Section */}
      <footer id="kontak" className="bg-slate-950 text-slate-400 pt-10 pb-6 px-4 md:px-8 border-t border-slate-900">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 pb-8 border-b border-slate-800">
          <div className="md:col-span-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                <img src={logoMagika} alt="Logo Magika" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="font-display font-bold text-lg text-white leading-none">MAGIKA</div>
                <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">Kecamatan Cicalengka</div>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              Sistem pendaftaran magang digital Kecamatan Cicalengka, Kabupaten Bandung. Platform modern penunjang kemitraan daerah bersama para pendaftar bertalenta.
            </p>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Hubungi Kami</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex gap-2 items-start">
                <MapPin className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Jl. Raya Timur Cicalengka No. 344, Desa Cicalengka Kulon, Kecamatan Cicalengka, Kabupaten Bandung, Jawa Barat 40395</span>
              </li>
              <li className="flex gap-2 items-center">
                <Phone className="h-4 w-4 text-blue-500 shrink-0" />
                <span>(022) 7949205</span>
              </li>
              <li className="flex gap-2 items-center">
                <Mail className="h-4 w-4 text-blue-500 shrink-0" />
                <span>kec.cicalengka@bandung.go.id</span>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider">Jam Pelayanan Kantor</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex gap-2 items-center">
                <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Senin - Kamis: 08:00 - 15:30 WIB</span>
              </li>
              <li className="flex gap-2 items-center">
                <Clock className="h-4 w-4 text-blue-500 shrink-0" />
                <span>Jumat: 08:00 - 16:00 WIB</span>
              </li>
              <li className="flex gap-2 items-center">
                <Calendar className="h-4 w-4 text-slate-500 shrink-0" />
                <span>Sabtu - Minggu: Tutup (Hari Libur Nasional)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 MAGICKA Cicalengka District. Digital Empowerment for School and University Students. All Rights Reserved. By Programmer Rasyaa Nabilah.
          </div>
        </div>
      </footer>
    </div>
  );
}
