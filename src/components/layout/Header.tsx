import { Database, RefreshCcw, Plus, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  loading: boolean;
  onRefresh: () => void;
  onAddRow: () => void;
}

export default function Header({ loading, onRefresh, onAddRow }: HeaderProps) {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <header className="h-[65px] border-b-2 border-[#141414] px-4 md:px-8 flex items-center justify-between sticky top-0 bg-[#E4E3E0] z-30 shadow-sm">
      <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate('/dashboard/admin_home')}>
        <div className="bg-[#141414] p-1.5">
          <Database className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex flex-col">
          <h1 className="font-mono text-sm font-black tracking-tighter uppercase italic leading-none text-[#141414]">MVC SQLITE_EXPLORER</h1>
          <span className="text-[9px] font-mono uppercase font-bold opacity-30 tracking-[0.2em] leading-none mt-1">Version_4.19_Stable</span>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* User Badge */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 bg-white border border-[#141414]/10 rounded-full group cursor-default">
           <div className="w-6 h-6 rounded-full bg-[#141414] flex items-center justify-center">
              <User className="w-3 h-3 text-[#E4E3E0]" />
           </div>
           <div className="flex flex-col">
              <span className="text-[10px] font-bold uppercase leading-none font-mono">{user.name?.split(' ')[1] || 'ADMIN'}</span>
              <span className="text-[8px] font-mono opacity-40 leading-none uppercase tracking-widest">{user.role_code || 'GUEST'}</span>
           </div>
        </div>

        <div className="h-8 w-[1px] bg-[#141414]/10 hidden lg:block" />

        <div className="flex items-center gap-2">
          <button 
            onClick={onRefresh}
            disabled={loading}
            title="Refresh Core Cache"
            className="p-2 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-none disabled:opacity-50 group"
          >
            <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          </button>
          
          <button 
            onClick={onAddRow}
            className="flex items-center gap-2 px-4 py-2 bg-[#141414] text-[#E4E3E0] font-mono text-[10px] uppercase font-black tracking-widest hover:bg-[#333] transition-colors active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span className="hidden sm:inline">GEN_ROW</span>
          </button>

          <button 
            onClick={handleLogout}
            title="Terminate Session"
            className="p-2 hover:bg-rose-500 hover:text-white transition-colors rounded-none border border-transparent hover:border-rose-600"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
