/**
 * Component: AuthPages
 * Deskripsi: Halaman Otentikasi (Masuk & Daftar) untuk pendaftar dan pengguna
 * dengan dukungan login email/password, Google OAuth.
 */

import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  ShieldAlert, 
  Check, 
  Eye, 
  EyeOff
} from 'lucide-react';
import { motion } from 'motion/react';
// @ts-ignore
import logoMagika from '../assets/images/logo_magika.png';

interface AuthPagesProps {
  initialView: 'login' | 'register';
  onNavigateHome: () => void;
  onLoginWithEmail: (email: string, password: string) => Promise<void>;
  onLoginWithGoogle: () => Promise<void>;
  onRegisterWithEmail: (email: string, password: string, name: string) => Promise<void>;
  onRegisterWithGoogle: () => Promise<void>;
}

export default function AuthPages({ 
  initialView, 
  onNavigateHome, 
  onLoginWithEmail,
  onLoginWithGoogle,
  onRegisterWithEmail,
  onRegisterWithGoogle
}: AuthPagesProps) {
  const [view, setView] = useState<'login' | 'register'>(initialView);
  const [showPassword, setShowPassword] = useState(false);
  
  // Login Form States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register Form States
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regAgree, setRegAgree] = useState(true);
  const [regError, setRegError] = useState('');
  const [regSuccess, setRegSuccess] = useState('');

  // Google Auth State
  const [googleError, setGoogleError] = useState('');

  const handleGoogleSignIn = async () => {
    setGoogleError('');
    setLoginError('');
    setRegError('');
    try {
      if (view === 'login') {
        await onLoginWithGoogle();
      } else {
        await onRegisterWithGoogle();
      }
    } catch (err: any) {
      console.error("Google Auth failed:", err);
      let errMsg = 'Gagal masuk dengan Google.';
      if (err.message && err.message.includes('belum terdaftar')) {
        errMsg = err.message;
      } else if (err.code === 'auth/popup-closed-by-user') {
        errMsg = 'Proses login dibatalkan karena jendela pop-up ditutup.';
      }
      setGoogleError(errMsg);
      if (view === 'login') {
        setLoginError(errMsg);
      } else {
        setRegError(errMsg);
      }
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginEmail || !loginPassword) {
      setLoginError('Semua kolom wajib diisi.');
      return;
    }

    try {
      await onLoginWithEmail(loginEmail, loginPassword);
    } catch (err: any) {
      console.error("Firebase Auth login failed:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setLoginError('Alamat email atau kata sandi salah.');
      } else if (err.message) {
        setLoginError(err.message);
      } else {
        setLoginError('Alamat email atau kata sandi salah.');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setRegError('Semua kolom wajib diisi.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    try {
      await onRegisterWithEmail(regEmail, regPassword, regName);
      setRegSuccess('Pendaftaran akun berhasil! Anda akan diarahkan ke Dashboard dalam beberapa saat.');
    } catch (err: any) {
      console.error("Firebase Auth sign up failed:", err);
      if (err.code === 'auth/email-already-in-use') {
        setRegError('Alamat email sudah digunakan oleh akun lain.');
      } else if (err.message) {
        setRegError(err.message);
      } else {
        setRegError('Gagal melakukan pendaftaran akun.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between font-sans selection:bg-blue-500 selection:text-white" id="auth-container">
      {/* Upper header action */}
      <header className="px-4 py-4 md:px-8 flex items-center justify-between" id="auth-header">
        <button 
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Beranda
        </button>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-white border border-slate-200 rounded-lg flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img src={logoMagika} alt="Logo Magika" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <span className="font-display font-extrabold text-sm text-slate-900 tracking-tight">MAGIKA</span>
        </div>
      </header>

      {/* Main card panel split */}
      <main className="flex-1 flex items-center justify-center px-4 py-8" id="auth-main">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xl max-w-xl w-full p-8 md:p-10 flex flex-col justify-between min-h-[550px]">
          
          {view === 'login' ? (
              // LOGIN FORM
              <div className="space-y-6" id="login-form-wrapper">
                <div>
                  <h2 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-none">Selamat Datang</h2>
                  <p className="text-slate-500 text-xs md:text-sm mt-2">
                    Silakan masuk ke akun Anda untuk mengakses portal dan memantau perkembangan pendaftaran magang Anda di Kecamatan Cicalengka.
                  </p>
                </div>

                {loginError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl flex gap-2 items-center">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-red-500" />
                    <span>{loginError}</span>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Alamat Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input 
                        type="email" 
                        id="login-email-input"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="contoh: nabilah@unpad.ac.id" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700">Kata Sandi</label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        id="login-password-input"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="••••••••" 
                        className="w-full pl-11 pr-11 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-3 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                        required
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 cursor-pointer p-1"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>



                  <button 
                    type="submit"
                    id="submit-login-btn"
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl text-sm hover:bg-blue-700 transition-all cursor-pointer flex justify-center items-center gap-2"
                  >
                    Masuk Sekarang
                  </button>

                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">atau masuk dengan</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl text-sm hover:bg-slate-50 transition-all cursor-pointer flex justify-center items-center gap-2.5 shadow-xs hover:border-slate-300"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.41 7.59l3.79 2.94C6.1 7.37 8.85 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.31 3.49l3.58 2.78c2.1-1.94 3.79-5.17 3.79-8.42z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.2 14.53c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.41 6.83C.51 8.63 0 10.63 0 12.75s.51 4.12 1.41 5.92l3.79-2.94z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.58-2.78c-.99.66-2.26 1.06-3.79 1.06-3.15 0-5.9-2.33-6.8-5.49L1.41 15.8C3.37 19.72 7.35 23 12 23z"
                      />
                    </svg>
                    <span>Masuk dengan Google</span>
                  </button>


                </form>

                <div className="text-center">
                  <p className="text-xs text-slate-500">
                    Belum punya akun?{' '}
                    <button 
                      onClick={() => {
                        setView('register');
                        setLoginError('');
                      }}
                      className="text-blue-600 font-bold hover:underline cursor-pointer"
                    >
                      Daftar akun baru
                    </button>
                  </p>
                </div>


              </div>
            ) : (
              // REGISTER FORM
              <div className="space-y-6 animate-fade-in" id="register-form-wrapper">
                <div className="space-y-2">
                  <h2 className="font-display text-2xl md:text-3xl font-black text-slate-950 tracking-tight leading-none pt-1">
                    Buat Akun Baru
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm leading-relaxed font-medium">
                    Daftar akun hari ini untuk memproses verifikasi dan pendaftaran magang Anda secara digital.
                  </p>
                </div>

                {regError && (
                  <div className="p-3.5 bg-rose-50 border border-rose-100 text-rose-700 text-xs font-semibold rounded-2xl flex gap-2.5 items-center shadow-xs">
                    <ShieldAlert className="h-5 w-5 shrink-0 text-rose-500" />
                    <span>{regError}</span>
                  </div>
                )}

                {regSuccess && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold rounded-2xl flex gap-2.5 items-center shadow-xs">
                    <Check className="h-5 w-5 shrink-0 text-emerald-500 animate-bounce" />
                    <span>{regSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {/* Name Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">Nama Lengkap Sesuai KTM / KTP</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="text" 
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="contoh: Nabilah Rasyaa" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Email Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">Alamat Email Institusi / Pribadi</label>
                    <div className="relative group">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      </div>
                      <input 
                        type="email" 
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="contoh: nabilah@unpad.ac.id" 
                        className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">Kata Sandi</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input 
                          type="password" 
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-slate-700 tracking-wide uppercase">Konfirmasi Sandi</label>
                      <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="h-4.5 w-4.5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                        </div>
                        <input 
                          type="password" 
                          value={regConfirmPassword}
                          onChange={(e) => setRegConfirmPassword(e.target.value)}
                          placeholder="••••••••" 
                          className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 hover:border-slate-300 rounded-2xl text-sm font-medium focus:outline-hidden focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 transition-all placeholder:text-slate-400"
                          required
                        />
                      </div>
                    </div>
                  </div>



                  {/* Submit Button */}
                  <button 
                    type="submit"
                    id="submit-register-btn"
                    className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-extrabold rounded-2xl text-sm shadow-md shadow-blue-600/10 hover:shadow-lg hover:shadow-blue-600/20 active:scale-98 transition-all cursor-pointer flex justify-center items-center gap-2"
                  >
                    Mulai Registrasi Akun
                  </button>

                  <div className="relative flex py-1.5 items-center">
                    <div className="flex-grow border-t border-slate-100"></div>
                    <span className="flex-shrink mx-3 text-slate-400 text-[10px] font-bold uppercase tracking-wider">atau daftar dengan</span>
                    <div className="flex-grow border-t border-slate-100"></div>
                  </div>

                  <button 
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="w-full py-3.5 bg-white border border-slate-200 text-slate-700 font-bold rounded-2xl text-sm hover:bg-slate-50 active:scale-98 transition-all cursor-pointer flex justify-center items-center gap-2.5 shadow-xs hover:border-slate-300"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12 5.04c1.66 0 3.2.57 4.38 1.69l3.27-3.27C17.67 1.54 14.98 1 12 1 7.35 1 3.37 3.68 1.41 7.59l3.79 2.94C6.1 7.37 8.85 5.04 12 5.04z"
                      />
                      <path
                        fill="#4285F4"
                        d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.43c-.28 1.44-1.09 2.67-2.31 3.49l3.58 2.78c2.1-1.94 3.79-5.17 3.79-8.42z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.2 14.53c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.41 6.83C.51 8.63 0 10.63 0 12.75s.51 4.12 1.41 5.92l3.79-2.94z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c3.24 0 5.97-1.07 7.96-2.92l-3.58-2.78c-.99.66-2.26 1.06-3.79 1.06-3.15 0-5.9-2.33-6.8-5.49L1.41 15.8C3.37 19.72 7.35 23 12 23z"
                      />
                    </svg>
                    <span>Daftar dengan Google</span>
                  </button>
                </form>

                {/* Already have an account text link */}
                <div className="text-center pt-2">
                  <p className="text-xs text-slate-500 font-medium">
                    Sudah memiliki akun terdaftar?{' '}
                    <button 
                      type="button"
                      onClick={() => {
                        setView('login');
                        setRegError('');
                      }}
                      className="text-blue-600 font-extrabold hover:underline cursor-pointer"
                    >
                      Masuk di sini
                    </button>
                  </p>
                </div>
              </div>
            )}
        </div>
      </main>



      {/* Footer */}
      <footer className="px-4 py-4 text-center text-xs text-slate-400 border-t border-slate-200 bg-white" id="auth-footer">
        © 2026 MAGIKA Kecamatan Cicalengka. Digital Empowerment for Students. All Rights Reserved.
      </footer>
    </div>
  );
}
