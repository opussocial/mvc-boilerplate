import { Terminal } from 'lucide-react';

interface DebugConsoleProps {
  activeTab: string;
  recentData: any[];
}

export default function DebugConsole({ activeTab, recentData }: DebugConsoleProps) {
  return (
    <div className="mt-12 bg-[#1A1A1A] text-[#E4E3E0] p-6 shadow-2xl overflow-hidden border-t-4 border-[#333] relative group">
      <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none uppercase font-black text-6xl tracking-tighter">
        TERMINAL_V2
      </div>
      
      <div className="flex items-center gap-3 mb-4 sticky top-0 bg-[#1A1A1A] py-1 z-10">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
        </div>
        <div className="h-4 w-[1px] bg-[#333]" />
        <Terminal className="w-4 h-4 text-emerald-500 opacity-80" />
        <span className="font-mono text-[9px] uppercase tracking-[0.3em] font-black text-emerald-500/80">
          Kernel_Debugger::{activeTab}
        </span>
      </div>

      <div className="font-mono text-[11px] h-40 overflow-y-auto custom-scrollbar space-y-1">
        <div className="text-emerald-400 font-bold tracking-tight">&gt;&gt; MOUNTED FILE SYSTEM: SQLITE_CORE</div>
        <div className="text-emerald-400 font-bold tracking-tight">&gt;&gt; BUFFER LOADED: {activeTab.toUpperCase()}</div>
        <div className="opacity-40">-- STACK_TRACE: 0x00021FF ... EXECUTED</div>
        
        {recentData.length > 0 ? (
          recentData.slice(0, 8).map((d, i) => (
            <div key={i} className="group/line flex gap-3 hover:bg-white/5 py-0.5 px-1 truncate">
              <span className="text-white/20 font-light select-none">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-blue-400 font-medium tracking-tighter uppercase shrink-0">GET_HIT:</span>
              <code className="opacity-80 group-hover/line:opacity-100 transition-opacity">
                {JSON.stringify(d).slice(0, 100)}...
              </code>
            </div>
          ))
        ) : (
          <div className="text-amber-500/60 italic">-- AWAITING_INPUT_STREAM_SYNC ...</div>
        )}
        
        <div className="pt-2 animate-pulse text-emerald-500">_</div>
      </div>
    </div>
  );
}
