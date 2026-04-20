import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, Terminal, Loader2, ArrowRight, Mail } from 'lucide-react';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const resp = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await resp.json();

      if (data.success) {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        navigate('/dashboard/admin_home');
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Connection to auth core failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans flex items-center justify-center p-6 selection:bg-[#141414] selection:text-[#E4E3E0]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full"
      >
        <div className="flex items-center gap-2 mb-12 opacity-30 justify-center">
          <Terminal className="w-5 h-5" />
          <span className="font-mono text-xs uppercase font-black tracking-[0.4em]">Register_Node_0x2</span>
        </div>

        <div className="bg-white p-10 shadow-2xl border-t-8 border-[#141414] group relative">
          <div className="absolute -top-4 -right-4 bg-[#141414] text-[#E4E3E0] p-2 rotate-12 font-mono text-[10px] uppercase font-bold tracking-widest hidden group-hover:block transition-all">
            New_Entry
          </div>

          <h1 className="text-4xl font-mono font-black uppercase tracking-tighter mb-2 italic">Create_Account</h1>
          <p className="font-serif italic text-sm opacity-50 mb-8">Establish new identity in the administrative registry.</p>

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-black opacity-40 flex items-center gap-2">
                <User className="w-3 h-3" /> Full_Name
              </label>
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Agent 001"
                className="w-full bg-[#f5f5f5] p-3 text-sm font-mono border-b-2 border-transparent focus:border-[#141414] transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-black opacity-40 flex items-center gap-2">
                <Mail className="w-3 h-3" /> Identity_Handle
              </label>
              <input 
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@mvc.system"
                className="w-full bg-[#f5f5f5] p-3 text-sm font-mono border-b-2 border-transparent focus:border-[#141414] transition-all outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-mono text-[10px] uppercase font-black opacity-40 flex items-center gap-3">
                <Lock className="w-3 h-3" /> Security_Key
              </label>
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="********"
                className="w-full bg-[#f5f5f5] p-3 text-sm font-mono border-b-2 border-transparent focus:border-[#141414] transition-all outline-none"
              />
            </div>

            {error && (
              <div className="text-rose-600 font-mono text-[10px] uppercase font-black italic bg-rose-50 p-2 animate-bounce">
                !! WARNING: {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#141414] text-[#E4E3E0] font-mono font-black uppercase tracking-[0.2em] hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  Commit_Registration
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-[#f0f0f0] flex justify-between items-center opacity-40">
            <div className="font-mono text-[8px] uppercase">Login system: ready</div>
            <div className="font-mono text-[8px] uppercase tracking-widest cursor-pointer hover:underline" onClick={() => navigate('/login')}>Back_to_Login</div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
