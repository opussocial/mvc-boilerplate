import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Terminal, Database, ShieldCheck, Loader2 } from 'lucide-react';

export default function Install() {
  const [status, setStatus] = useState<'idle' | 'installing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInstall = async () => {
    setStatus('installing');
    setErrorMessage('');
    try {
      const resp = await fetch('/api/install', { method: 'POST' });
      const data = await resp.json();
      
      if (resp.ok && data.success) {
        // Mock login
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        setStatus('success');
        setTimeout(() => {
          navigate(data.redirect);
        }, 1500);
      } else {
        setErrorMessage(data.error || 'System initialization failed');
        setStatus('error');
      }
    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || 'Connection failure');
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-[#E4E3E0] font-mono flex items-center justify-center p-6 selection:bg-[#E4E3E0] selection:text-[#141414]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full border border-[#333] p-8 shadow-2xl bg-[#1A1A1A] relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500/20">
          <motion.div 
            initial={{ width: 0 }}
            animate={status === 'installing' ? { width: '100%' } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="h-full bg-emerald-500" 
          />
        </div>

        <div className="flex items-center gap-3 mb-8 opacity-60">
          <Database className="w-5 h-5" />
          <span className="text-[10px] tracking-[0.3em] font-black uppercase">System_Bootstrap_v2.0</span>
        </div>

        <h1 className="text-3xl font-black uppercase tracking-tighter mb-4 leading-none">
          {status === 'success' ? 'Initialization Complete' : 'MVC_System Installation'}
        </h1>
        
        <p className="text-sm opacity-50 mb-10 leading-relaxed italic">
          {status === 'idle' && "Press the trigger to provision the SQLite core, register the primary Administrator, and establish security directives."}
          {status === 'installing' && "Allocating sectors, mapping relational integrity, generating keys..."}
          {status === 'success' && (
            <div className="space-y-2">
              <div>Administrative privileges granted. Use the following to re-access:</div>
              <div className="bg-white/5 p-2 rounded text-[10px] non-italic font-bold">
                EMAIL: admin@mvc.system<br/>
                PASS: admin123
              </div>
            </div>
          )}
          {status === 'error' && (
            <div className="text-rose-400">
              <div className="font-black mb-1 text-xs">FATAL_ERROR: BOOTSTRAP_FAIL</div>
              <div className="italic opacity-80 break-words">{errorMessage || "Verify relational core accessibility."}</div>
            </div>
          )}
        </p>

        <div className="space-y-4">
          {status === 'idle' && (
            <button 
              onClick={handleInstall}
              className="w-full py-4 bg-emerald-500 text-[#141414] font-black uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center gap-3 group"
            >
              Execute Install
              <ShieldCheck className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          )}

          {status === 'installing' && (
            <div className="flex items-center justify-center gap-3 py-4 border border-[#333] italic opacity-80">
              <Loader2 className="w-5 h-5 animate-spin" />
              Processing_Payload...
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-emerald-500/30 text-emerald-400 italic">
               AUTH_TOKEN_ESTABLISHED
            </div>
          )}

          {status === 'error' && (
            <button 
              onClick={() => setStatus('idle')}
              className="w-full py-4 bg-rose-500 text-white font-black uppercase tracking-widest hover:bg-rose-400 transition-colors"
            >
              Retry_Bootstrap
            </button>
          )}
        </div>

        <div className="mt-12 flex items-center gap-2 opacity-20 text-[10px] font-bold">
          <Terminal className="w-3 h-3" />
          <span>DB: data.db // ROLE: ADMIN // PERM: ALL</span>
        </div>
      </motion.div>
    </div>
  );
}
