import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { Users, Trash2, ShieldCheck, Mail, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/auth/admin/users');
      setUsers(data);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Banish this user from the system?")) return;
    try {
      await API.delete(`/auth/admin/users/${id}`);
      toast.success("User Expunged");
      fetchUsers();
    } catch (err) {
      toast.error("Operation Failed");
    }
  };

  return (
    <div className="bg-slate-900/20 border border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl mt-12">
      <div className="p-8 border-b border-white/5 flex justify-between items-center">
        <h2 className="text-xl font-bold text-white flex items-center gap-3">
          <Users className="text-rose-500" size={20} /> Identity Ledger
        </h2>
        <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-3 py-1 rounded-full border border-indigo-500/20">
          {users.length} TOTAL OPERATORS
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-white/[0.02] text-[10px] text-slate-500 uppercase tracking-widest">
              <th className="px-8 py-4">User</th>
              <th className="px-8 py-4">Role</th>
              <th className="px-8 py-4">Status</th>
              <th className="px-8 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map(u => (
              <tr key={u._id} className="hover:bg-white/[0.01] transition-all">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-rose-600 flex items-center justify-center font-bold text-white text-xs">
                      {u.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{u.name}</p>
                      <p className="text-[10px] text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${u.role === 'admin' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-800 text-slate-400'}`}>
                    {u.role.toUpperCase()}
                  </span>
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-bold">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ACTIVE
                  </div>
                </td>
                <td className="px-8 py-5 text-right">
                  {u.role !== 'admin' && (
                    <button onClick={() => handleDelete(u._id)} className="text-slate-600 hover:text-rose-500 transition-colors">
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserManagement;