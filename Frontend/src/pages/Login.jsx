import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import api from '../api';
import { Mail, Lock, ArrowRight, Loader2, Plane } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await api.post('/auth/login', { email, password });
      setAuth({ name: response.data.name, email: response.data.email }, response.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-md relative z-10 shadow-journal-lg border-white/60 p-10"
      >
        <div className="text-center mb-10">
          <div className="w-14 h-14 bg-gradient-to-br from-peach to-salmon rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md border border-white/50">
            <Plane className="w-7 h-7 text-white rotate-45" />
          </div>
          <h1 className="text-3xl font-display font-bold mb-2 text-eggplant">Welcome Back</h1>
          <p className="text-eggplant-muted font-medium">Ready for your next adventure?</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-eggplant-muted ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eggplant/40" />
              <input 
                type="email" 
                required
                className="input-field w-full pl-12 font-medium"
                placeholder="kavya@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-eggplant-muted ml-1 uppercase tracking-widest flex justify-between items-center">
              <span>Password</span>
              <a href="#" className="text-salmon hover:underline normal-case tracking-normal">Forgot?</a>
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-eggplant/40" />
              <input 
                type="password" 
                required
                className="input-field w-full pl-12 font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-base mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Log in to Traveloop <ArrowRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-eggplant-muted font-medium border-t border-eggplant/5 pt-6">
          Don't have an account? <Link to="/signup" className="text-salmon font-bold hover:underline">Create one here</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
