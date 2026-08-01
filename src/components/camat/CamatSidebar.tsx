import React from 'react';
import { Building, Clipboard, Settings, LogOut } from 'lucide-react';
import { CamatTab } from '../../types';
// @ts-ignore
import logoMagika from '../../assets/images/logo_magika.png';

interface CamatSidebarProps {
  activeTab: CamatTab;
  setActiveTab: (tab: CamatTab) => void;
  setSelectedAppId: (id: string | null) => void;
  onLogout: () => void;
}

/**
 * Component: CamatSidebar
 * Deskripsi: Sidebar permanen untuk desktop dengan navigasi menu Camat Portal
 */
export const CamatSidebar: React.FC<CamatSidebarProps> = ({
  activeTab,
  setActiveTab,
  setSelectedAppId,
  onLogout
}) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-400 hidden lg:flex flex-col justify-between shrink-0 sticky top-0 h-screen overflow-y-auto border-r border-slate-800" id="camat-sidebar">
      <div className="p-6 space-y-8">
        {/* Header Logo MAGIKA Camat Portal */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-md">
            <img src={logoMagika} alt="Logo Magika" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="font-display font-extrabold text-base text-white leading-none">MAGIKA</div>
            <div className="text-[9px] text-blue-500 font-bold uppercase tracking-wider font-mono mt-1">Camat Portal</div>
          </div>
        </div>

        {/* Menu Navigasi Utama */}
        <nav className="space-y-1 text-xs">
          <button 
            onClick={() => { setActiveTab('pendaftar'); setSelectedAppId(null); }}
            className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'pendaftar' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Building className="h-4 w-4" />
            <span>Dashboard</span>
          </button>
          
          <button 
            onClick={() => { setActiveTab('laporan'); setSelectedAppId(null); }}
            className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'laporan' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Clipboard className="h-4 w-4" />
            <span>Laporan Akhir</span>
          </button>

          <button 
            onClick={() => { setActiveTab('setelan'); setSelectedAppId(null); }}
            className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 transition-all cursor-pointer ${
              activeTab === 'setelan' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Setelan & Profil</span>
          </button>
        </nav>
      </div>

      {/* Tombol Keluar Portal */}
      <div className="p-6 border-t border-slate-800">
        <button 
          onClick={onLogout}
          className="w-full px-4 py-3 bg-slate-850 hover:bg-rose-950/40 hover:text-rose-400 text-slate-400 font-semibold rounded-xl text-xs flex items-center gap-3 transition-all cursor-pointer"
        >
          <LogOut className="h-4 w-4 text-rose-500" />
          <span>Keluar Portal</span>
        </button>
      </div>
    </aside>
  );
};
