import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Trash2, X, AlertCircle, Plus, Eye, Edit } from 'lucide-react';
import { User } from '../../types';

interface DaftarAkunProps {
  users: User[];
  currentUser?: User;
  onDeleteUser: (id: string) => void;
  onCreateUser: (newUser: User) => void;
  onUpdateUser: (updatedUser: User) => void;
}

export default function DaftarAkun({
  users,
  currentUser,
  onDeleteUser,
  onCreateUser,
  onUpdateUser
}: DaftarAkunProps) {
  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Form Fields State
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formRole, setFormRole] = useState<'admin' | 'camat' | 'student'>('admin');
  const [formPassword, setFormPassword] = useState('');
  const [formError, setFormError] = useState('');

  // Delete Confirm State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState('');

  const openCreateModal = () => {
    setModalMode('create');
    setSelectedUser(null);
    setFormName('');
    setFormEmail('');
    setFormRole('admin');
    setFormPassword('');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormName(user.namaLengkap);
    setFormEmail(user.email);
    setFormRole((user.role as any) === 'student' ? 'student' : (user.role as any));
    setFormPassword(user.password || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const openViewModal = (user: User) => {
    setModalMode('view');
    setSelectedUser(user);
    setFormName(user.namaLengkap);
    setFormEmail(user.email);
    setFormRole((user.role as any) === 'student' ? 'student' : (user.role as any));
    setFormPassword(user.password || '');
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!formName.trim() || !formEmail.trim() || !formPassword.trim()) {
      setFormError('Semua kolom wajib diisi.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formEmail.trim())) {
      setFormError('Format email tidak valid.');
      return;
    }

    if (modalMode === 'create') {
      const emailExists = users.some(u => u.email.toLowerCase() === formEmail.trim().toLowerCase());
      if (emailExists) {
        setFormError('Alamat email sudah terdaftar.');
        return;
      }

      const newUser: User = {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        namaLengkap: formName.trim(),
        email: formEmail.trim().toLowerCase(),
        password: formPassword.trim(),
        role: formRole,
        username: formEmail.trim().split('@')[0]
      };
      onCreateUser(newUser);
    } else {
      if (selectedUser) {
        const updatedUser: User = {
          ...selectedUser,
          namaLengkap: formName.trim(),
          email: formEmail.trim().toLowerCase(),
          password: formPassword.trim(),
          role: formRole
        };
        onUpdateUser(updatedUser);
      }
    }

    setIsModalOpen(false);
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteTargetId(id);
    setDeleteTargetName(name);
    setDeleteConfirmOpen(true);
  };

  const executeDelete = () => {
    if (deleteTargetId) {
      onDeleteUser(deleteTargetId);
      setDeleteConfirmOpen(false);
      setDeleteTargetId(null);
      setDeleteTargetName('');
    }
  };

  // Filter & Search users
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.namaLengkap.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = 
      roleFilter === 'All' || 
      user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fade-in" id="admin-kelola-akun-tab">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="font-display font-extrabold text-base text-slate-900 leading-none">Daftar Akun Pengguna</h4>
          <p className="text-xs text-slate-500 mt-1.5">Daftar kredensial, peranan (role), dan akun otentikasi aktif sistem MAGIKA.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-blue-500/10 font-sans"
        >
          <Plus className="h-4 w-4" /> Tambah Akun Baru
        </button>
      </div>

      {/* SEARCH & FILTER CONTROLS */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/50 focus:bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-xs font-semibold transition-all outline-none text-slate-800 font-sans"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative shrink-0">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold transition-all outline-none appearance-none cursor-pointer text-slate-850"
            >
              <option value="All">Semua Role</option>
              <option value="admin">Admin</option>
              <option value="camat">Camat</option>
              <option value="student">Pendaftar (Peserta)</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* USER LIST TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Nama Lengkap & Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Password</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={user.id || `user-idx-${index}`} className="hover:bg-slate-50/50 transition-colors text-xs">
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-[13px]">{user.namaLengkap}</div>
                      {user.username && <div className="text-[10px] text-slate-400 mt-0.5 font-mono">@{user.username}</div>}
                    </td>
                    <td className="p-4 font-semibold text-slate-650">{user.email}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        user.role === 'admin' 
                          ? 'bg-amber-50 text-amber-700 border border-amber-100' 
                          : user.role === 'camat'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : 'bg-blue-50 text-blue-700 border border-blue-100'
                      }`}>
                        {user.role === 'student' ? 'Pendaftar' : user.role === 'admin' ? 'Admin' : user.role === 'camat' ? 'Camat' : user.role}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-[11px] text-slate-500">
                      {user.password || '••••••••'}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap space-x-1">
                      <button
                        onClick={() => openViewModal(user)}
                        title="Detail User"
                        className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg text-xs transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => openEditModal(user)}
                        title="Edit User"
                        className="p-1.5 bg-slate-50 hover:bg-slate-600 text-slate-600 hover:text-white rounded-lg text-xs transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </button>
                      {currentUser?.id !== user.id ? (
                        <button
                          onClick={() => handleDeleteClick(user.id, user.namaLengkap)}
                          title="Hapus Akun"
                          className="p-1.5 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      ) : (
                        <span className="text-[10px] text-slate-400 font-semibold italic inline-block min-w-[32px]">Akun Anda</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-slate-400 text-xs font-medium">
                    Tidak ada data pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER MANAGEMENT MODAL OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="user-modal-container">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">
                {modalMode === 'create' && 'Tambah User Baru'}
                {modalMode === 'edit' && 'Ubah Data User'}
                {modalMode === 'view' && 'Detail Akun Pengguna'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 bg-red-50 border border-red-100 text-red-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              <div className="space-y-4">
                {/* Nama Lengkap */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'view'}
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Contoh: Muhammad Petugas"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold disabled:opacity-75 disabled:bg-slate-100 text-slate-800"
                  />
                </div>

                {/* Email */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Alamat Email *</label>
                  <input 
                    type="email" 
                    required
                    disabled={modalMode === 'view'}
                    value={formEmail}
                    onChange={(e) => setFormEmail(e.target.value)}
                    placeholder="contoh@magika.go.id"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-semibold disabled:opacity-75 disabled:bg-slate-100 text-slate-800"
                  />
                </div>

                {/* Role */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Peranan / Role *</label>
                  <select
                    disabled={modalMode === 'view'}
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-bold disabled:opacity-75 disabled:bg-slate-100 cursor-pointer text-slate-800"
                  >
                    <option value="admin">Admin</option>
                    <option value="camat">Camat</option>
                    <option value="student">Pendaftar (Peserta)</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700">Kunci Sandi (Password) *</label>
                  <input 
                    type="text" 
                    required
                    disabled={modalMode === 'view'}
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                    placeholder="Masukkan password rahasia"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-blue-500 font-mono font-bold disabled:opacity-75 disabled:bg-slate-100 text-slate-800"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold rounded-xl transition-all cursor-pointer"
                >
                  {modalMode === 'view' ? 'Tutup' : 'Batal'}
                </button>
                {modalMode !== 'view' && (
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-all cursor-pointer"
                  >
                    {modalMode === 'create' ? 'Tambah Akun' : 'Simpan Perubahan'}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in" id="delete-confirm-modal">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-sm w-full p-6 space-y-6 text-center">
            <div className="mx-auto h-12 w-12 bg-rose-50 text-rose-600 rounded-full flex items-center justify-center">
              <AlertCircle className="h-6 w-6" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">
                Konfirmasi Hapus
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Apakah Anda yakin ingin menghapus data pengguna <strong className="text-slate-800">{deleteTargetName}</strong>? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteConfirmOpen(false);
                  setDeleteTargetId(null);
                  setDeleteTargetName('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl transition-all cursor-pointer shadow-md shadow-rose-500/10"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
