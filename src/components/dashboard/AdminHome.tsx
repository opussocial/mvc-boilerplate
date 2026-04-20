import { motion } from 'motion/react';
import { Shield, Users, Activity, Lock, Database } from 'lucide-react';

export default function AdminHome() {
  const stats = [
    { label: 'Security_Level', value: 'Level_4', icon: Shield, color: 'text-emerald-500' },
    { label: 'System_Users', value: '1_ACTIVE', icon: Users, color: 'text-blue-500' },
    { label: 'Core_Uptime', value: '99.98%', icon: Activity, color: 'text-rose-500' },
    { label: 'DB_Encryption', value: 'AES-256', icon: Lock, color: 'text-amber-500' },
  ];

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="space-y-12">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#141414] text-[#E4E3E0] p-12 relative overflow-hidden group shadow-2xl"
      >
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700">
           <Database className="w-64 h-64" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4 opacity-50">
            <span className="w-8 h-[1px] bg-white" />
            <span className="text-[10px] font-mono font-black tracking-[0.4em] uppercase">Control_Plane_Access</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-mono font-black uppercase tracking-tighter mb-4">
            Welcome, <span className="text-emerald-500 italic">{user.name?.split(' ')[1] || 'ADMIN'}</span>
          </h2>
          
          <p className="text-xl md:text-2xl font-serif italic max-w-2xl opacity-70 leading-relaxed">
            Relational core is synchronized. Your administrative privileges are active across all mapped sectors including identity management, security protocols, and system logs.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="border border-[#141414] p-6 bg-white/40 backdrop-blur-sm group hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors pointer-events-none"
          >
            <stat.icon className={`w-8 h-8 mb-6 ${stat.color} group-hover:text-white transition-colors`} />
            <div className="text-[10px] font-mono font-black uppercase tracking-widest opacity-40 group-hover:opacity-60 mb-1">
              {stat.label}
            </div>
            <div className="text-2xl font-mono font-bold tracking-tighter uppercase whitespace-nowrap">
              {stat.value}
            </div>
          </motion.div>
        ))}
      </div>

      {/* System Status Log */}
      <div className="p-8 border-2 border-[#141414]/10 border-dashed">
         <div className="flex items-center justify-between mb-8 pb-4 border-b border-[#141414]/10">
            <h3 className="font-mono font-bold uppercase tracking-widest text-sm">System_Health_Diagnostics</h3>
            <span className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 font-bold">
               <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
               ALL_SERVICES_OPERATIONAL
            </span>
         </div>
         
         <div className="space-y-4 font-mono text-xs opacity-60">
            <div className="flex gap-4">
               <span className="text-rose-500 font-black">12:00:01</span>
               <span>INITIATING RELATIONAL CORE_INDEX... DONE</span>
            </div>
            <div className="flex gap-4">
               <span className="text-rose-500 font-black">12:00:05</span>
               <span>MAPPING PERMISSION_TREE_VOL_1... DONE</span>
            </div>
            <div className="flex gap-4">
               <span className="text-rose-500 font-black">12:00:09</span>
               <span>VERIFYING ADMIN_IDENTITY (UID: 0x1)... SESSION_GRANTED</span>
            </div>
         </div>
      </div>
    </div>
  );
}
