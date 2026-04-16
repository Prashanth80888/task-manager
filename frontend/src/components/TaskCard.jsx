import React from 'react';
import { Calendar, Trash2, Edit3, CheckCircle } from 'lucide-react';

const TaskCard = ({ task, onEdit, onDelete }) => {
  const isCompleted = task.status === 'completed';

  return (
    <div className="glass-panel p-6 group hover:border-indigo-500/30 transition-all duration-300 relative overflow-hidden">
      {/* Status Glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] opacity-20 -mr-10 -mt-10 ${isCompleted ? 'bg-emerald-500' : 'bg-orange-500'}`} />
      
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          isCompleted ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' : 'border-orange-500/30 text-orange-400 bg-orange-500/10'
        }`}>
          {task.status}
        </span>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(task)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Edit3 size={16} />
          </button>
          <button onClick={() => onDelete(task._id)} className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors">
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors">{task.title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 font-medium">{task.description}</p>

      <div className="flex items-center justify-between border-t border-white/5 pt-4">
        <div className="flex items-center gap-2 text-slate-500">
          <Calendar size={14} />
          <span className="text-[11px] font-bold uppercase tracking-tight">
            {new Date(task.createdAt).toLocaleDateString()}
          </span>
        </div>
        {isCompleted && <CheckCircle className="text-emerald-500" size={18} />}
      </div>
    </div>
  );
};

export default TaskCard;