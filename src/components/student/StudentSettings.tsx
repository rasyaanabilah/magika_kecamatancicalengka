/**
 * Component: StudentSettings
 * Deskripsi: Sub-komponen Pengaturan Profil Peserta Magang untuk memperbarui
 * informasi akun dan kontak pengguna.
 */

import React, { useState } from 'react';
import { User as UserType } from '../../types';

interface StudentSettingsProps {
  currentUser: UserType;
  onUpdateUser?: (updatedUser: UserType) => void;
}

const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join('').toUpperCase();
};

export default function StudentSettings({
  currentUser,
  onUpdateUser
}: StudentSettingsProps) {
  const [editName, setEditName] = useState(currentUser.namaLengkap || '');
  const [editUniv, setEditUniv] = useState(currentUser.universitas || '');
  const [editProdi, setEditProdi] = useState(currentUser.prodi || '');
  const [editPhone, setEditPhone] = useState(currentUser.noHp || '');
  const [editAvatarUrl, setEditAvatarUrl] = useState(currentUser.avatarUrl || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingProfile(true);
    try {
      let finalAvatarUrl = editAvatarUrl;
      if (editAvatarUrl && editAvatarUrl.startsWith('data:')) {
        const { uploadToStorage } = await import('../../firebase');
        finalAvatarUrl = await uploadToStorage(
          editAvatarUrl,
          `avatar_${currentUser.id}.png`,
          'avatars'
        );
      }

      const updatedUser: UserType = {
        ...currentUser,
        namaLengkap: editName,
        universitas: editUniv,
        prodi: editProdi,
        noHp: editPhone,
        avatarUrl: finalAvatarUrl
      };
      if (onUpdateUser) {
        onUpdateUser(updatedUser);
      } else {
        currentUser.namaLengkap = editName;
        currentUser.universitas = editUniv;
        currentUser.prodi = editProdi;
        currentUser.noHp = editPhone;
        currentUser.avatarUrl = finalAvatarUrl;
      }
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      console.error("Gagal menyimpan foto profil ke Firebase Storage:", err);
      alert('Gagal mengunggah foto profil ke Firebase Storage.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 animate-fade-in" id="tab-content-pengaturan">
      <div>
        <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Informasi Profil Akun</h4>
        <p className="text-xs text-slate-500 mt-1">Sesuaikan informasi kontak dan data akademis untuk kebutuhan validasi birokrasi.</p>
      </div>

      <form onSubmit={handleSaveProfile} className="space-y-4 max-w-xl">
        {/* Profile Picture Upload/Preview Section */}
        <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-slate-50 border border-slate-200/60 rounded-2xl">
          <div className="h-16 w-16 rounded-full border-2 border-blue-500 p-0.5 bg-white shrink-0 shadow-xs flex items-center justify-center overflow-hidden">
            {editAvatarUrl ? (
              <img 
                src={editAvatarUrl} 
                alt="Foto Profil" 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-linear-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-lg rounded-full">
                {getInitials(editName)}
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
                        setEditAvatarUrl(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {editAvatarUrl && (
                <button 
                  type="button" 
                  onClick={() => setEditAvatarUrl('')}
                  className="px-3 py-1.5 bg-white hover:bg-rose-50 border border-rose-200 hover:border-rose-300 text-rose-600 font-semibold text-[11px] rounded-lg transition-all cursor-pointer"
                >
                  Hapus Foto
                </button>
              )}
            </div>
            <p className="text-[10px] text-slate-400">Rekomendasi ukuran persegi, maks 2MB (PNG, JPG, atau JPEG)</p>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nama Lengkap</label>
          <input 
            type="text" 
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-semibold"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Asal Universitas / Sekolah</label>
            <input 
              type="text" 
              value={editUniv}
              onChange={(e) => setEditUniv(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700">Jurusan</label>
            <input 
              type="text" 
              value={editProdi}
              onChange={(e) => setEditProdi(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Nomor Handphone (WhatsApp)</label>
          <input 
            type="text" 
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:border-blue-500 focus:bg-white transition-all font-mono"
            required
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isSavingProfile}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            {isSavingProfile ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Perubahan Profil'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
