import { motion, AnimatePresence } from 'motion/react';
import { Activity } from 'lucide-react';
import { EntityType } from '../../hooks/useDashboardData.ts';

interface DataGridProps {
  activeTab: EntityType;
  data: any[];
}

export default function DataGrid({ activeTab, data }: DataGridProps) {
  return (
    <div className="border border-[#141414] overflow-hidden bg-white/50 backdrop-blur-md shadow-lg transition-transform hover:-translate-y-1 duration-300">
      {/* Table Header */}
      <div className="grid grid-cols-4 md:grid-cols-6 bg-[#141414] text-[#E4E3E0] border-b border-[#141414] p-4 uppercase font-mono text-[10px] tracking-[0.2em] opacity-90 font-black">
        {activeTab === 'users' && <>
          <div className="col-span-1">ID</div>
          <div className="col-span-1 md:col-span-1">NAME</div>
          <div className="col-span-1 md:col-span-2">EMAIL</div>
          <div className="hidden md:block">ROLE</div>
          <div className="hidden md:block text-right">TIME</div>
        </>}
        {activeTab === 'roles' && <>
          <div className="col-span-1">ID</div>
          <div className="col-span-2">NAME</div>
          <div className="col-span-2">CODE</div>
          <div className="hidden md:block text-right">TIME</div>
        </>}
        {activeTab === 'permissions' && <>
          <div className="col-span-1">ID</div>
          <div className="col-span-2">NAME</div>
          <div className="col-span-2">CODE</div>
          <div className="hidden md:block text-right">TIME</div>
        </>}
        {activeTab === 'tokens' && <>
          <div className="col-span-1">ID</div>
          <div className="col-span-1 md:col-span-2">USER</div>
          <div className="col-span-1 md:col-span-2">TOKEN</div>
          <div className="hidden md:block">TYPE</div>
        </>}
        {activeTab === 'config' && <>
          <div className="col-span-2">KEY</div>
          <div className="col-span-2">VALUE</div>
          <div className="hidden md:block col-span-2 text-right">UPD_AT</div>
        </>}
        {activeTab === 'feature-switches' && <>
          <div className="col-span-2">NAME</div>
          <div className="col-span-1">STATUS</div>
          <div className="col-span-2 hidden md:block">DESC</div>
          <div className="hidden md:block col-span-1 text-right">TIME</div>
        </>}
        {activeTab === 'event-logs' && <>
          <div className="col-span-1 md:col-span-1 text-red-500">TYPE</div>
          <div className="col-span-3 md:col-span-3">MSG</div>
          <div className="hidden md:block col-span-2 text-right">STAMP</div>
        </>}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-[#141414]/10 bg-white/40">
        <AnimatePresence mode="popLayout" initial={false}>
          {data.length === 0 ? (
            <div className="p-16 text-center text-sm font-mono opacity-50 uppercase tracking-widest italic animate-pulse">
              NO_RECORDS_INDEXED
            </div>
          ) : (
            data.map((row, idx) => (
              <motion.div 
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.05 }}
                key={row.id || row.key || row.name}
                className="grid grid-cols-4 md:grid-cols-6 p-4 text-xs md:text-sm font-mono items-center hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors cursor-crosshair group active:scale-[0.99] relative"
              >
                {activeTab === 'users' && <>
                  <div className="col-span-1 truncate opacity-60">#{row.id}</div>
                  <div className="col-span-1 md:col-span-1 font-bold uppercase tracking-tight">{row.name}</div>
                  <div className="col-span-1 md:col-span-2 lowercase opacity-70 group-hover:opacity-100">{row.email}</div>
                  <div className="hidden md:block uppercase text-[10px] font-black">{row.role_name || '--'}</div>
                  <div className="hidden md:block text-[10px] opacity-40 text-right font-light group-hover:opacity-100">{new Date(row.created_at).toLocaleTimeString()}</div>
                </>}
                {activeTab === 'roles' && <>
                  <div className="col-span-1 truncate opacity-60">#{row.id}</div>
                  <div className="col-span-2 font-bold uppercase">{row.name}</div>
                  <div className="col-span-2 opacity-80">{row.code}</div>
                  <div className="hidden md:block text-[10px] opacity-40 text-right">{new Date(row.created_at).toLocaleTimeString()}</div>
                </>}
                {activeTab === 'permissions' && <>
                  <div className="col-span-1 truncate opacity-60">#{row.id}</div>
                  <div className="col-span-2 font-bold uppercase">{row.name}</div>
                  <div className="col-span-2 opacity-80">{row.code}</div>
                  <div className="hidden md:block text-[10px] opacity-40 text-right">{new Date(row.created_at).toLocaleTimeString()}</div>
                </>}
                {activeTab === 'tokens' && <>
                  <div className="col-span-1 truncate opacity-60">#{row.id}</div>
                  <div className="col-span-1 md:col-span-2 uppercase text-[10px] font-black">{row.user_email || 'SYSTEM'}</div>
                  <div className="col-span-1 md:col-span-2 truncate opacity-70 font-mono tracking-tighter">{row.token || '--'}</div>
                  <div className="hidden md:block text-[10px] opacity-60 tracking-wider font-bold">{row.type?.toUpperCase() || '--'}</div>
                </>}
                {activeTab === 'config' && <>
                  <div className="col-span-2 font-bold uppercase border-l-2 border-[#141414] pl-2">{row.key}</div>
                  <div className="col-span-2 opacity-80">{row.value}</div>
                  <div className="hidden md:block col-span-2 text-[10px] opacity-50 text-right">{new Date(row.updated_at).toLocaleTimeString()}</div>
                </>}
                {activeTab === 'feature-switches' && <>
                  <div className="col-span-2 font-bold uppercase">{row.name}</div>
                  <div className="col-span-1">
                    <span className={`px-2 py-0.5 text-[9px] font-black ring-1 ring-inset ${row.is_enabled ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' : 'bg-rose-50 text-rose-700 ring-rose-600/20'}`}>
                      {row.is_enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <div className="col-span-2 hidden md:block text-[11px] opacity-60 line-clamp-1">{row.description}</div>
                  <div className="hidden md:block col-span-1 text-right text-[10px] opacity-40 font-mono tracking-tighter">{new Date(row.updated_at).toLocaleTimeString()}</div>
                </>}
                {activeTab === 'event-logs' && <>
                  <div className="col-span-1 flex items-center gap-2">
                     <Activity className={`w-3 h-3 ${row.event_type?.includes('ERR') ? 'text-rose-600' : 'text-emerald-600'}`} />
                     <span className="font-bold text-[11px]">{row.event_type || 'EVT'}</span>
                  </div>
                  <div className="col-span-3 md:col-span-3 truncate text-[11px] opacity-80">{row.message}</div>
                  <div className="hidden md:block col-span-2 text-right text-[10px] opacity-40 font-mono italic">{new Date(row.created_at).toLocaleTimeString()}</div>
                </>}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
