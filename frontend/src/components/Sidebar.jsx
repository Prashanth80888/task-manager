import React, { useContext } from 'react';
import { LayoutDashboard, CheckCircle2, Clock, LogOut, Zap, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

// Accept props from Dashboard
const Sidebar = ({ activeFilter, setActiveFilter }) => {
  const { logout, user } = useContext(AuthContext);

  const menuItems = [
    { id: 'all', label: 'Terminal', icon: LayoutDashboard },
    { id: 'pending', label: 'Pending', icon: Clock },
    { id: 'completed', label: 'Verified', icon: CheckCircle2 },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-950 flex flex-col p-6 fixed left-0 top-0 z-20 border-r border-white/5">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-600/40">
          <Zap className="text-white" size={16} />
        </div>
        <span className="text-lg font-black tracking-tighter text-white uppercase italic">
          Task<span className="text-indigo-500">Core</span>
        </span>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveFilter(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-bold tracking-tight ${
              activeFilter === item.id 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20' 
                : 'text-slate-500 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <item.icon size={18} /> {item.label}
          </button>
        ))}
        
        {user?.role === 'admin' && (
          <div className="mt-10 pt-6 border-t border-white/5">
            <p className="px-4 text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-4">Internal Systems</p>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 transition-all text-sm font-bold border border-transparent hover:border-rose-500/20">
              <Shield size={18} /> Global Override
            </button>
          </div>
        )}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 px-2 mb-6">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-sm">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-white truncate leading-none mb-1">{user?.name}</p>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">{user?.role}</p>
          </div>
        </div>
        <button 
          onClick={logout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-rose-500 transition-colors text-xs font-black uppercase tracking-widest bg-white/5 rounded-xl border border-white/5 hover:border-rose-500/20"
        >
          <LogOut size={16} /> End Session
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;