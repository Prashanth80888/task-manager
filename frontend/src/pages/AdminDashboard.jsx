import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserManagement from './UserManagement'; // IMPORT THE NEW COMPONENT
import API from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { 
  Shield, Users, Database, Activity, 
  Trash2, RefreshCw, Search, Terminal, 
  ShieldAlert, Cpu, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [allTasks, setAllTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'users'

  // 1. HARD SECURITY CHECK
  useEffect(() => {
    if (user && user.role !== 'admin') {
      toast.error("UNAUTHORIZED: Admin clearance required.");
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/tasks/admin/all'); 
      setAllTasks(data);
    } catch (err) {
      toast.error(`SYSTEM_ERROR: Data Retrieval Failed`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    if (user?.role === 'admin') fetchAllData(); 
  }, [user]);

  const purgeTask = async (id) => {
    if (!window.confirm("CRITICAL: Purge this node from the master ledger?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Protocol Purged");
      setAllTasks(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      toast.error("Purge Failed");
    }
  };

  const filteredTasks = allTasks.filter(task => 
    task.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    task.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden font-sans text-slate-200">
      <Sidebar activeFilter="admin" setActiveFilter={() => {}} />

      <main className="flex-1 ml-64 overflow-y-auto relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="p-8 lg:p-12 max-w-7xl mx-auto relative z-10">
          
          {/* Header */}
          <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert size={14} className="text-rose-500 animate-pulse" />
                <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Auth.Admin_Root</span>
              </div>
              <h1 className="text-5xl font-black text-white tracking-tighter uppercase">
                Global <span className="text-rose-500 italic">Override</span>
              </h1>
              
              {/* Tab Switcher */}
              <div className="flex gap-2 mt-6 bg-white/5 p-1 rounded-xl border border-white/5 w-fit">
                <button 
                  onClick={() => setActiveTab('tasks')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 ${activeTab === 'tasks' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <Layers size={14} /> MASTER TASKS
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all flex items-center gap-2 ${activeTab === 'users' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' : 'text-slate-500 hover:text-white'}`}
                >
                  <Users size={14} /> USER IDENTITY
                </button>
              </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-72">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input 
                  type="text"
                  placeholder="Search master records..."
                  className="w-full bg-slate-900/80 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-xs text-white focus:border-rose-500/50 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button onClick={fetchAllData} className="p-3 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
          </header>

          {/* Render Active Tab Content */}
          <AnimatePresence mode="wait">
            {activeTab === 'tasks' ? (
              <motion.div 
                key="tasks"
                initial={{ opacity: 0, x: -20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: 20 }}
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                  {[
                    { label: 'Total Tasks', value: allTasks.length, icon: Database, color: 'text-indigo-400' },
                    { label: 'System Health', value: '98.2%', icon: Cpu, color: 'text-emerald-400' },
                    { label: 'Active Sessions', value: 'Live', icon: Activity, color: 'text-amber-400' },
                    { label: 'Admin Access', value: 'Root', icon: Shield, color: 'text-rose-400' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                      <stat.icon size={18} className={`${stat.color} mb-4`} />
                      <h3 className="text-2xl font-black text-white">{stat.value}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Task Table */}
                <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-white/[0.02] border-b border-white/5">
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">Operator</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase">Directive</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase text-center">Status</th>
                        <th className="px-8 py-6 text-[10px] font-black text-slate-500 uppercase text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredTasks.map((task) => (
                        <tr key={task._id} className="hover:bg-rose-500/[0.02] transition-all group">
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-black text-slate-400">
                                {task.user?.name?.charAt(0) || 'U'}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-slate-200">{task.user?.name || 'Ghost'}</p>
                                <p className="text-[9px] text-slate-500 font-mono">{task.user?.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <p className="text-xs font-bold text-white group-hover:text-rose-500 uppercase tracking-tight transition-colors">{task.title}</p>
                          </td>
                          <td className="px-8 py-5 text-center">
                            <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full border ${task.status === 'completed' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5' : 'border-amber-500/30 text-amber-400 bg-amber-500/5'}`}>
                              {task.status}
                            </span>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button onClick={() => purgeTask(task._id)} className="p-2 text-slate-500 hover:text-white hover:bg-rose-600 rounded-lg transition-all">
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="users"
                initial={{ opacity: 0, x: 20 }} 
                animate={{ opacity: 1, x: 0 }} 
                exit={{ opacity: 0, x: -20 }}
              >
                <UserManagement />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;