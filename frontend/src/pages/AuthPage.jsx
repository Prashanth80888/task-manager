import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Star, Briefcase, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

// Staggered Animation Logic
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

// Fixed Card Component
const FloatingStatCard = ({ icon: Icon, color, title, desc, delay, offsetClass = "" }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.8 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`glass-panel px-6 py-4 flex items-center gap-4 border-indigo-500/10 shadow-lg w-full max-w-[320px] ${offsetClass}`}
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg ${color}`}>
      <Icon className="text-white w-5 h-5" />
    </div>
    <div className="flex-1">
      <p className="font-bold text-white text-sm tracking-tight">{title}</p>
      <p className="text-slate-400 text-[11px] leading-tight font-medium">{desc}</p>
    </div>
    <CheckCircle2 className="w-4 h-4 text-indigo-500" />
  </motion.div>
);

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false); // New state for Admin toggle
  const [adminSecret, setAdminSecret] = useState(''); // New state for Secret Key
  const [localLoading, setLocalLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  
  const { login, register, user, loading: authLoading } = useContext(AuthContext); 
  const navigate = useNavigate();

  // Helper function to handle role-based navigation
  const handleNavigation = (currentUser) => {
    if (currentUser?.role === 'admin') {
      navigate('/admin/override', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  // CRITICAL: Force redirect once the user state is detected
  useEffect(() => {
    if (!authLoading && user) {
      handleNavigation(user);
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (localLoading) return;
    
    setLocalLoading(true);

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        if (result) {
          toast.success(result.role === 'admin' ? 'Root Access Granted' : 'Access granted, Pro!');
          handleNavigation(result);
        }
      } else {
        // Pass the role and secret key to the register function
        const role = isAdminMode ? 'admin' : 'user';
        const result = await register(formData.name, formData.email, formData.password, role, adminSecret);
        
        if (result) {
          toast.success(role === 'admin' ? 'Admin Account Created!' : 'Account created successfully!');
          setIsLogin(true); 
          setFormData(prev => ({ ...prev, password: '' }));
          setAdminSecret('');
        }
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Authorization failed';
      toast.error(errorMessage);
    } finally {
      setLocalLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 lg:p-10 relative overflow-hidden font-sans selection:bg-indigo-500/30">
      <div className="premium-bg" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="glass-panel w-full max-w-[1200px] grid lg:grid-cols-2 overflow-hidden shadow-[0_0_100px_rgba(99,102,241,0.1)] min-h-[700px] z-10"
      >
        {/* LEFT SIDE: BRANDING */}
        <div className="hidden lg:flex flex-col justify-between p-16 bg-white/[0.01] border-r border-white/[0.05] relative overflow-hidden">
          <motion.div variants={itemVariants} className="flex items-center gap-3 z-10">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/40">
              <Star className="text-white fill-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase text-white">
              TaskMaster<span className="text-indigo-500">.Pro</span>
            </span>
          </motion.div>

          <div className="relative z-10 space-y-12">
            <motion.div variants={itemVariants}>
              <h1 className="text-6xl font-black leading-[1.05] tracking-tighter mb-6 text-white">
                Master Your<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Workspaces.
                </span>
              </h1>
              <p className="text-lg text-slate-400 max-w-[400px] leading-relaxed font-medium">
                The next generation engine for elite teams. <br/>Precision-engineered for productivity.
              </p>
            </motion.div>

            <div className="space-y-5">
              <FloatingStatCard 
                icon={Zap} color="bg-orange-500 shadow-orange-500/20" 
                title="Real-time Syncing" desc="Connected to global task cloud" delay={0.4} 
              />
              <FloatingStatCard 
                icon={Briefcase} color="bg-emerald-500 shadow-emerald-500/20" 
                title="Project Analytics" desc="3 urgent deadlines optimized" delay={0.6}
                offsetClass="ml-10 border-white/10 bg-white/5" 
              />
            </div>
          </div>

          <motion.p variants={itemVariants} className="text-[10px] text-slate-500 tracking-[0.3em] uppercase font-bold">
            Enterprise Edition v1.0 © 2026
          </motion.p>
        </div>

        {/* RIGHT SIDE: AUTH FORM */}
        <div className="p-8 lg:p-20 flex flex-col justify-center bg-slate-950/20">
          <motion.div variants={itemVariants} className="mb-12 text-center lg:text-left">
            <h2 className="text-4xl font-black mb-3 tracking-tight text-white">{isLogin ? 'Log In' : 'Create Access'}</h2>
            <p className="text-slate-400 text-lg font-medium">Authenticate your session to continue.</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  key="name-input"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-6"
                >
                  <div className="relative group overflow-hidden">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      placeholder="Full Name" 
                      className="glass-input pl-16 py-4 text-white placeholder:text-slate-600"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>

                  {/* Admin Toggle Switch */}
                  <div className="flex items-center gap-3 p-1">
                    <button
                      type="button"
                      onClick={() => setIsAdminMode(!isAdminMode)}
                      className={`w-10 h-5 rounded-full transition-colors relative ${isAdminMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${isAdminMode ? 'left-6' : 'left-1'}`} />
                    </button>
                    <span className="text-sm font-bold text-slate-400">Apply for Admin Privileges</span>
                  </div>

                  {/* Secret Key Input Field */}
                  {isAdminMode && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="relative group"
                    >
                      <ShieldCheck className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 transition-colors" />
                      <input 
                        type="password" 
                        placeholder="Admin Secret Key" 
                        className="glass-input pl-16 py-4 text-white placeholder:text-indigo-400 ring-1 ring-indigo-500/30"
                        value={adminSecret}
                        onChange={(e) => setAdminSecret(e.target.value)}
                        required
                      />
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="email" 
                placeholder="Business Email" 
                className="glass-input pl-16 py-4 text-white placeholder:text-slate-600"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
              <input 
                type="password" 
                placeholder="Secure Password" 
                className="glass-input pl-16 py-4 text-white placeholder:text-slate-600"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </motion.div>

            <motion.div variants={itemVariants} className="pt-6">
              <button 
                type="submit" 
                disabled={localLoading}
                className="btn-primary w-full py-5 group text-lg flex items-center justify-center gap-2 font-bold tracking-tight"
              >
                {localLoading ? (
                  <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    {isLogin ? 'Authenticate' : 'Request Access'}
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div variants={itemVariants} className="mt-12 text-center text-slate-500 font-medium">
            {isLogin ? "New to the platform?" : "Already a member?"}
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setIsAdminMode(false);
              }}
              className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 transition-colors border-b border-indigo-500/20"
            >
              {isLogin ? 'Register Now' : 'Sign In'}
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;