import React from 'react';
import { Menu, X, Building, Clipboard, Settings, LogOut } from 'lucide-react';
import { CamatTab } from '../../types';
// @ts-ignore
import logoMagika from '../../assets/images/logo_magika.png';

interface CamatMobileNavProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  activeTab: CamatTab;
  setActiveTab: (tab: CamatTab) => void;
  setSelectedAppId: (id: string | null) => void;
  onLogout: () => void;
}

/**
 * Component: CamatMobileNav
 * Deskripsi: Header dan Drawer Navigasi Seluler untuk Camat Portal
 */
export const CamatMobileNav: React.FC<CamatMobileNavProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
  activeTab,
  setActiveTab,
  setSelectedAppId,
  onLogout
}) => {
  return (
    <>
      {/* MOBILE HEADER */}
      <header className="h-16 border-b border-slate-200 bg-white px-4 md:px-8 flex lg:hidden items-center justify-between shrink-0 shadow-xs" id="camat-mobile-header">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-white border border-slate-200 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
            <img src={logoMagika} alt="Logo Magika" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
          </div>
          <div>
            <div className="font-display font-extrabold text-base text-slate-950 leading-none">MAGIKA</div>
            <div className="text-[9px] text-blue-500 font-bold uppercase tracking-wider font-mono">Camat Portal</div>
          </div>
        </div>
        
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-xl transition-all cursor-pointer"
        >
          <Menu className="h-6 w-6" />
        </button>
      </header>

      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" id="camat-mobile-drawer">
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-sm bg-slate-900 text-slate-400 h-full flex flex-col justify-between shadow-2xl p-6 z-10">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 bg-white border border-slate-800 rounded-xl flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                    <img src={logoMagika} alt="Logo Magika" className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div>
                    <div className="font-display font-extrabold text-base text-white leading-none">MAGIKA</div>
                    <div className="text-[9px] text-blue-500 font-bold uppercase tracking-wider font-mono">Camat Portal</div>
                  </div>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white cursor-pointer">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1.5 text-xs">
                <button 
                  onClick={() => { setActiveTab('pendaftar'); setSelectedAppId(null); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === 'pendaftar' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Building className="h-4 w-4" />
                  <span>Dashboard</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('laporan'); setSelectedAppId(null); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === 'laporan' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Clipboard className="h-4 w-4" />
                  <span>Laporan Akhir</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('setelan'); setSelectedAppId(null); setIsMobileMenuOpen(false); }}
                  className={`w-full px-4 py-3 rounded-xl font-semibold flex items-center gap-3 cursor-pointer ${
                    activeTab === 'setelan' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Setelan & Profil</span>
                </button>
              </nav>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <button onClick={() => { onLogout(); setIsMobileMenuOpen(false); }} className="w-full px-4 py-3 bg-slate-850 text-slate-400 font-semibold rounded-xl text-xs flex items-center gap-3 cursor-pointer">
                <LogOut className="h-4 w-4 text-red-500" />
                <span>Keluar Portal</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
