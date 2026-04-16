import React, { useState, useEffect, useContext } from 'react';
import Sidebar from '../components/Sidebar';
import TaskModal from '../components/TaskModal';
import { AuthContext } from '../context/AuthContext';
import API from '../api/axios';
import { Plus, Trash2, Edit3, CheckCircle2, Clock, ListChecks, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState({ open: false, data: null });
  
  // NEW: Filter State
  const [activeFilter, setActiveFilter] = useState('all'); 

  const fetchTasks = async () => {
    try {
      const { data } = await API.get('/tasks');
      setTasks(data);
    } catch (err) {
      toast.error("Network Sync Error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  // NEW: Filter Logic
  const filteredTasks = tasks.filter(task => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'pending') return task.status !== 'completed';
    if (activeFilter === 'completed') return task.status === 'completed';
    return true;
  });

  const stats = [
    { label: 'Total Protocols', value: tasks.length, icon: ListChecks, color: 'text-indigo-400' },
    { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckCircle2, color: 'text-emerald-400' },
    { label: 'In Progress', value: tasks.filter(t => t.status !== 'completed').length, icon: Clock, color: 'text-orange-400' },
  ];

  const handleTaskAction = async (taskData) => {
    try {
      if (modal.data) {
        await API.put(`/tasks/${modal.data._id}`, taskData);
        toast.success("Sync Successful");
      } else {
        await API.post('/tasks', taskData);
        toast.success("Deployment Active");
      }
      setModal({ open: false, data: null });
      fetchTasks();
    } catch (err) {
      toast.error("Execution failed");
    }
  };

  const deleteTask = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Permanent Purge?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      toast.success("Record Deleted");
      fetchTasks();
    } catch (err) {
      toast.error("Purge Failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex overflow-hidden font-sans">
      <div className="fixed inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -z-10" />
      
      {/* PASSING PROPS TO SIDEBAR */}
      <Sidebar activeFilter={activeFilter} setActiveFilter={setActiveFilter} />

      <main className="flex-1 ml-64 overflow-y-auto relative z-10">
        <div className="p-8 lg:p-12 max-w-7xl mx-auto">
          
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
            <div>
              <h1 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                Command Center <Zap className="text-indigo-500 fill-indigo-500" size={28} />
              </h1>
              <p className="text-slate-400 mt-2 font-medium">Manage and monitor your active project deployments.</p>
            </div>
            <button 
              onClick={() => setModal({ open: true, data: null })}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-2xl shadow-indigo-600/40 group active:scale-95"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
              Deploy New Task
            </button>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {stats.map((stat, i) => (
              <div key={i} className="bg-slate-900/40 border border-white/5 p-6 rounded-3xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-4">
                  <stat.icon size={20} className={stat.color} />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Live Status</span>
                </div>
                <h3 className="text-3xl font-black text-white">{stat.value}</h3>
                <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-tighter">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-xs font-black uppercase tracking-[0.3em] text-indigo-500 whitespace-nowrap">
              {activeFilter === 'all' ? 'Active Protocols' : `${activeFilter} Protocols`}
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-indigo-500/50 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              [1, 2, 3].map(n => <div key={n} className="h-56 bg-slate-900/20 rounded-3xl animate-pulse border border-white/5" />)
            ) : (
              // USE filteredTasks instead of tasks
              filteredTasks.map((task) => (
                <div 
                  key={task._id} 
                  className="group bg-[#0f172a]/60 p-7 rounded-[2rem] border border-white/10 hover:border-indigo-500/50 transition-all shadow-2xl backdrop-blur-sm flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start mb-6">
                      <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        task.status === 'completed' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : 'border-indigo-500/20 text-indigo-400 bg-indigo-500/5'
                      }`}>
                        {task.status || 'Pending'}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setModal({ open: true, data: task })} className="p-2 text-slate-500 hover:text-white hover:bg-white/5 rounded-xl transition-all"><Edit3 size={16} /></button>
                        <button onClick={(e) => deleteTask(task._id, e)} className="p-2 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-xl transition-all"><Trash2 size={16} /></button>
                      </div>
                    </div>

                    <h3 className="text-white font-bold text-xl mb-3 tracking-tight group-hover:text-indigo-400 transition-colors">
                      {task.title}
                    </h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
                      {task.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-6 border-t border-white/5 mt-auto">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                    <div className={`w-2 h-2 rounded-full ${task.status === 'completed' ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-indigo-500 shadow-[0_0_10px_#6366f1]'}`} />
                  </div>
                </div>
              ))
            )}
          </div>

          {filteredTasks.length === 0 && !loading && (
            <div className="bg-slate-950 border border-white/5 rounded-[3rem] p-24 text-center">
              <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap size={24} className="text-slate-700" />
              </div>
              <p className="text-slate-400 text-lg font-bold">No {activeFilter} tasks found.</p>
            </div>
          )}
        </div>

        <TaskModal 
          isOpen={modal.open} 
          onClose={() => setModal({ open: false, data: null })} 
          onSubmit={handleTaskAction} 
          initialData={modal.data} 
        />
      </main>
    </div>
  );
};

export default UserDashboard;