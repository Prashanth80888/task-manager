import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Target, Layers } from 'lucide-react';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [task, setTask] = useState({ title: '', description: '', priority: 'medium' });

  useEffect(() => {
    if (initialData) setTask(initialData);
    else setTask({ title: '', description: '', priority: 'medium' });
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
        {/* Dark Backdrop */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        {/* Modal Body */}
        <motion.div 
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-lg bg-[#0f172a] border border-white/10 rounded-[2.5rem] p-10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden"
        >
          {/* Decorative Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />

          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-500/20">
                <Target size={20} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-white tracking-tight">
                  {initialData ? 'Edit Protocol' : 'New Deployment'}
                </h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-0.5">Core System Update</p>
              </div>
            </div>
            <button 
              onClick={onClose} 
              className="p-2 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>

          <form 
            onSubmit={(e) => { e.preventDefault(); onSubmit(task); }} 
            className="space-y-6"
          >
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Task Identifier</label>
              <input 
                type="text" 
                placeholder="e.g. Database Migration" 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-bold text-base"
                value={task.title} 
                onChange={e => setTask({...task, title: e.target.value})} 
                required 
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Operational Details</label>
              <textarea 
                placeholder="Briefly describe the objective..." 
                className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium text-sm min-h-[140px] resize-none leading-relaxed"
                value={task.description} 
                onChange={e => setTask({...task, description: e.target.value})} 
                required 
              />
            </div>

            {/* Actions & Priority */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
                  <Layers size={16} />
                </div>
                <select 
                  className="w-full bg-slate-950 border border-white/10 rounded-2xl pl-12 pr-6 py-4 text-slate-100 font-bold text-xs uppercase tracking-widest focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer"
                  value={task.priority} 
                  onChange={e => setTask({...task, priority: e.target.value})}
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Standard</option>
                  <option value="high">Critical</option>
                </select>
              </div>

              <button 
                type="submit" 
                className="flex-[1.5] bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl px-8 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 shadow-xl shadow-indigo-600/20 transition-all hover:translate-y-[-2px] active:scale-95 group"
              >
                {initialData ? 'Sync Changes' : 'Execute Plan'} 
                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default TaskModal;