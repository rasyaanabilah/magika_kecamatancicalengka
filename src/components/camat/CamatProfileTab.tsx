import React from 'react';
import { CheckCircle } from 'lucide-react';
import { getInitials } from './utils';

interface CamatProfileTabProps {
  profileName: string;
  setProfileName: (val: string) => void;
  profilePhone: string;
  setProfilePhone: (val: string) => void;
  profileEmail: string;
  setProfileEmail: (val: string) => void;
  profilePassword: string;
  setProfilePassword: (val: string) => void;
  profileAvatarUrl: string;
  setProfileAvatarUrl: (val: string) => void;
  settingsSuccessAlert: string | null;
  handleSaveProfile: (e: React.FormEvent) => void;
}

/**
 * Component: CamatProfileTab
 * Deskripsi: Form setelan profil Camat untuk mengubah data pribadi, foto profil/avatar, email, dan password.
 */
export const CamatProfileTab: React.FC<CamatProfileTabProps> = ({
  profileName,
  setProfileName,
  profilePhone,
  setProfilePhone,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  profileAvatarUrl,
  setProfileAvatarUrl,
  settingsSuccessAlert,
  handleSaveProfile
}) => {
  return (
    <div className="space-y-6 animate-fade-in" id="camat-setelan-tab">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 max-w-2xl mx-auto shadow-xs">
        <div className="border-b border-slate-100 pb-4 mb-6">
          <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Pengaturan Profil Camat</h4>
          <p className="text-xs text-slate-500 mt-1.5 font-medium">Kelola informasi data diri, foto profil, dan kata sandi akun Camat Anda secara mandiri.</p>
        </div>

        {settingsSuccessAlert && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-3 text-xs font-semibold animate-fade-in mb-6">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-600 shrink-0" />
            <span>{settingsSuccessAlert}</span>
          </div>
        )}

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          {/* Profile Picture Upload/Preview Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
            <div className="h-16 w-16 rounded-full border-2 border-emerald-500 p-0.5 bg-white shrink-0 shadow-xs flex items-center justify-center overflow-hidden">
              {profileAvatarUrl ? (
                <img 
                  src={profileAvatarUrl} 
                  alt="Foto Profil" 
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-linear-to-br from-emerald-500 to-teal-600 text-white flex items-center justify-center font-bold text-lg rounded-full">
                  {getInitials(profileName)}
                </div>
              )}
            </div>
            <div className="space-y-1.5 flex-1 text-center sm:text-left">
              <label className="text-xs font-bold text-slate-700 block">Foto Profil Camat</label>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <label className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg cursor-pointer transition-all">
                  Unggah Foto
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        const file = e.target.files[0];
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setProfileAvatarUrl(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                {profileAvatarUrl && (
                  <button 
                    type="button" 
                    onClick={() => setProfileAvatarUrl('')}
                    className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-600 font-semibold text-[11px] rounded-lg transition-all cursor-pointer"
                  >
                    Hapus Foto
                  </button>
                )}
              </div>
              <p className="text-[10px] text-slate-400">Rekomendasi ukuran persegi, maks 2MB (PNG, JPG, atau JPEG)</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-slate-500 font-semibold block">Nama Lengkap</label>
              <input
                type="text"
                required
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl font-medium transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 font-semibold block">Nomor Telepon / WhatsApp</label>
              <input
                type="text"
                required
                value={profilePhone}
                onChange={(e) => setProfilePhone(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl font-medium transition-all outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-500 font-semibold block">Alamat Email</label>
            <input
              type="email"
              required
              value={profileEmail}
              onChange={(e) => setProfileEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl font-medium transition-all outline-none font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-slate-500 font-semibold block">Kata Sandi (Password)</label>
            <input
              type="text"
              required
              value={profilePassword}
              onChange={(e) => setProfilePassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-emerald-500 rounded-xl font-medium transition-all outline-none font-mono"
            />
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-all shadow-md shadow-emerald-600/10 cursor-pointer"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
