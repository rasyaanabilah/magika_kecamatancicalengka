import React, { useState } from 'react';
import { UserCheck, CheckCircle, Settings } from 'lucide-react';
import { User } from '../../types';

interface SetelanProfilProps {
  currentUser: User;
  onUpdateUser: (updatedUser: User) => void;
  onUpdateGroupLink: (newLink: string) => void;
  groupLink: string;
}

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

export default function SetelanProfil({
  currentUser,
  onUpdateUser,
  onUpdateGroupLink,
  groupLink
}: SetelanProfilProps) {
  // Profil state
  const [profileName, setProfileName] = useState(currentUser.namaLengkap);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.noHp || '');
  const [profilePassword, setProfilePassword] = useState(currentUser.password || '');
  const [profileAvatarUrl, setProfileAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [profileSuccessAlert, setProfileSuccessAlert] = useState('');

  // Whatsapp Link state
  const [groupLinkInput, setGroupLinkInput] = useState(groupLink);
  const [settingsSuccessAlert, setSettingsSuccessAlert] = useState('');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccessAlert('');

    const updatedUser: User = {
      ...currentUser,
      namaLengkap: profileName.trim(),
      email: profileEmail.trim().toLowerCase(),
      noHp: profilePhone.trim(),
      password: profilePassword.trim(),
      avatarUrl: profileAvatarUrl,
      username: profileEmail.trim().split('@')[0]
    };

    onUpdateUser(updatedUser);
    setProfileSuccessAlert('Profil Anda berhasil diperbarui.');
    setTimeout(() => setProfileSuccessAlert(''), 4000);
  };

  const handleSaveGroupLink = (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsSuccessAlert('');

    onUpdateGroupLink(groupLinkInput.trim());
    setSettingsSuccessAlert('Tautan grup WhatsApp koordinasi berhasil diperbarui.');
    setTimeout(() => setSettingsSuccessAlert(''), 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-setelan-profil-tab">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div>
          <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Setelan & Profil</h4>
          <p className="text-xs text-slate-500 mt-1.5">Kelola data diri akun Anda dan perbarui konfigurasi tautan WhatsApp grup koordinasi pendaftar.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* COLUMN 1: EDIT PROFILE */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
          <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-600" />
            <h5 className="font-display font-extrabold text-sm text-slate-900">Profil Saya</h5>
          </div>

          {profileSuccessAlert && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{profileSuccessAlert}</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            {/* Profile Picture Upload/Preview Section */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
              <div className="h-16 w-16 rounded-full border-2 border-blue-500 p-0.5 bg-white shrink-0 shadow-xs flex items-center justify-center overflow-hidden">
                {profileAvatarUrl ? (
                  <img 
                    src={profileAvatarUrl} 
                    alt="Foto Profil" 
                    className="w-full h-full object-cover rounded-full"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg rounded-full">
                    {getInitials(profileName)}
                  </div>
                )}
              </div>
              <div className="space-y-1.5 flex-1 text-center sm:text-left">
                <label className="text-xs font-bold text-slate-700 block">Foto Profil</label>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  <label className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[11px] rounded-lg cursor-pointer transition-all">
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
                  className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl font-bold transition-all outline-none text-slate-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold block">Nomor Telepon / WA</label>
                <input
                  type="text"
                  required
                  value={profilePhone}
                  onChange={(e) => setProfilePhone(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl font-bold transition-all outline-none font-mono text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 font-semibold block">Email</label>
              <input
                type="email"
                required
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl font-bold transition-all outline-none text-slate-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 font-semibold block">Kata Sandi (Password)</label>
              <input
                type="text"
                required
                value={profilePassword}
                onChange={(e) => setProfilePassword(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl font-bold transition-all outline-none font-mono text-slate-800"
              />
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all cursor-pointer shadow-md shadow-blue-500/10 font-sans"
              >
                Simpan Perubahan Profil
              </button>
            </div>
          </form>
        </div>

        {/* COLUMN 2: WA GROUP LINK SETTINGS */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-xs">
            <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-600" />
              <h5 className="font-display font-extrabold text-sm text-slate-900">Grup Koordinasi Pendaftar</h5>
            </div>

            {settingsSuccessAlert && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 animate-fade-in">
                <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>{settingsSuccessAlert}</span>
              </div>
            )}

            <form onSubmit={handleSaveGroupLink} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="text-slate-500 font-semibold block">Tautan Grup WhatsApp</label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    placeholder="https://chat.whatsapp.com/..."
                    value={groupLinkInput}
                    onChange={(e) => setGroupLinkInput(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl font-bold transition-all outline-none font-mono text-slate-800"
                  />
                </div>
                <p className="text-[10px] text-slate-400 leading-normal">
                  Masukkan link grup WhatsApp koordinasi resmi yang akan dibagikan secara otomatis ke halaman pendaftar yang statusnya telah diubah menjadi <strong>Lulus</strong> atau <strong>Sedang Magang</strong>.
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-emerald-500/10 text-center font-sans text-xs"
                >
                  Perbarui Link Grup
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
