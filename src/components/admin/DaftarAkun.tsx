import React, { useState } from 'react';
import { Search, Filter, ChevronDown, Eye, X } from 'lucide-react';
import { User } from '../../types';

interface DaftarAkunProps {
  users: User[]; 
}

export default function DaftarAkun({ users }: DaftarAkunProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');

  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [selectedUser, setSelectedUser] = useState<User | null>(null); 

  const openViewModal = (user: User) => { 
    setSelectedUser(user); 
    setIsModalOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      user.namaLengkap.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      (user.username?.toLowerCase().includes(search) ?? false);

    const matchesRole =
      roleFilter === 'All' ||
      user.role.toLowerCase() === roleFilter.toLowerCase();

    return matchesSearch && matchesRole;
  });

  const getRoleLabel = (role: User['role']) => {
    if (role === 'student') return 'Pendaftar';
    if (role === 'admin') return 'Admin';
    if (role === 'camat') return 'Camat';
    return role;
  };

  return (
    <div className="space-y-6 animate-fade-in" id="admin-daftar-akun-tab">

      {/* HEADER */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs">
        <div>
          <h4 className="font-display font-extrabold text-base text-slate-900">
            Daftar Akun Pengguna
          </h4>

          <p className="text-xs text-slate-500 mt-1.5">
            Daftar akun pengguna yang terdaftar pada sistem.
          </p>
        </div> 
      </div>

      {/* SEARCH & FILTER */}
      <div className="bg-white border border-slate-200 p-4 rounded-3xl shadow-xs flex flex-col sm:flex-row gap-4">

        {/* SEARCH */}
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

        {/* ROLE FILTER */}
        <div className="relative shrink-0">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl text-xs font-bold transition-all outline-none appearance-none cursor-pointer text-slate-800"
          >
            <option value="All">Semua Role</option>
            <option value="admin">Admin</option>
            <option value="camat">Camat</option>
            <option value="student">Pendaftar</option>
          </select>

          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">

          <table className="w-full text-left border-collapse">

            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                <th className="p-4">Nama Lengkap</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Detail</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">

              {filteredUsers.length > 0 ? (

                filteredUsers.map((user, index) => (

                  <tr
                    key={user.id || `user-idx-${index}`}
                    className="hover:bg-slate-50/50 transition-colors text-xs"
                  >

                    {/* NAMA */}
                    <td className="p-4">
                      <div className="font-bold text-slate-800 text-[13px]">
                        {user.namaLengkap}
                      </div>

                      {user.username && (
                        <div className="text-[10px] text-slate-400 mt-0.5 font-mono">
                          @{user.username}
                        </div>
                      )}
                    </td>

                    {/* EMAIL */}
                    <td className="p-4 font-semibold text-slate-650">
                      {user.email}
                    </td>

                    {/* ROLE */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                          user.role === 'admin'
                            ? 'bg-amber-50 text-amber-700 border border-amber-100'
                            : user.role === 'camat'
                              ? 'bg-purple-50 text-purple-700 border border-purple-100'
                              : 'bg-blue-50 text-blue-700 border border-blue-100'
                        }`}
                      >
                        {getRoleLabel(user.role)}
                      </span>
                    </td>

                    {/* DETAIL */}
                    <td className="p-4 text-center">
                      <button
                        onClick={() => openViewModal(user)}
                        title="Lihat Detail"
                        className="p-1.5 bg-blue-50 hover:bg-blue-600 text-blue-600 hover:text-white rounded-lg transition-all cursor-pointer inline-flex items-center justify-center shadow-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </button> 
                    </td>

                  </tr>

                ))

              ) : (

                <tr>
                  <td
                    colSpan={4}
                    className="text-center py-12 text-slate-400 text-xs font-medium"
                  >
                    Tidak ada data pengguna yang cocok dengan kriteria pencarian.
                  </td>
                </tr>

              )}

            </tbody>

          </table>

        </div>
      </div>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedUser && (

        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">

          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-md w-full p-6 md:p-8">

            <div className="flex items-center justify-between border-b border-slate-100 pb-4">

              <h3 className="font-display font-black text-slate-900 text-base md:text-lg">
                Detail Akun Pengguna
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

            </div>

            <div className="space-y-4 mt-6 text-xs">

              <div>
                <p className="font-bold text-slate-500 mb-1">
                  Nama Lengkap
                </p>

                <p className="font-semibold text-slate-800">
                  {selectedUser.namaLengkap}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-500 mb-1">
                  Email
                </p>

                <p className="font-semibold text-slate-800">
                  {selectedUser.email}
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-500 mb-1">
                  Role
                </p>

                <p className="font-semibold text-slate-800">
                  {getRoleLabel(selectedUser.role)}
                </p>
              </div>

              {selectedUser.username && (
                <div>
                  <p className="font-bold text-slate-500 mb-1">
                    Username
                  </p>

                  <p className="font-semibold text-slate-800">
                    @{selectedUser.username}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100">
                <p className="text-[11px] text-slate-400">
                  Password akun tidak ditampilkan demi keamanan.
                </p>
              </div>

            </div>

            <div className="flex justify-end pt-6">

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Tutup
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
} 