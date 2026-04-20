import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import Header from './components/layout/Header.tsx';
import Sidebar from './components/layout/Sidebar.tsx';
import DataGrid from './components/dashboard/DataGrid.tsx';
import DebugConsole from './components/dashboard/DebugConsole.tsx';
import Install from './components/Install.tsx';
import Login from './components/Login.tsx';
import Register from './components/Register.tsx';
import AdminHome from './components/dashboard/AdminHome.tsx';
import { useDashboardData, EntityType } from './hooks/useDashboardData.ts';

function DashboardLayout() {
  const { entity } = useParams<{ entity?: string }>();
  const activeTab = (entity as EntityType) || 'users';
  const isAdminHome = !entity || entity === 'admin_home';
  
  const token = localStorage.getItem('auth_token');
  const { data, loading, refresh, addDemoRow } = useDashboardData(isAdminHome ? 'users' : activeTab);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0] flex flex-col">
      <Header 
        loading={loading} 
        onRefresh={refresh} 
        onAddRow={addDemoRow} 
      />

      <div className="flex flex-1 relative h-[calc(100vh-65px)] overflow-hidden">
        <Sidebar 
          activeTab={isAdminHome ? 'users' : activeTab}
          onTabChange={() => {}} 
          customNav={(
             <div className="border-b border-[#141414]/10 mb-4 px-4 py-2 opacity-50 font-mono text-[9px] uppercase font-bold tracking-[0.2em]">
               System_Entities
             </div>
          )}
        />

        <main className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-10">
          <div className="max-w-6xl mx-auto space-y-12">
            
            {isAdminHome ? (
              <AdminHome />
            ) : (
              <>
                <div className="flex items-end gap-6 border-b-2 border-[#141414]/10 pb-6">
                  <h2 className="text-5xl md:text-7xl font-mono font-black uppercase tracking-tighter leading-none text-[#141414]">
                    {activeTab.replace('-', '_')}
                  </h2>
                  <div className="flex flex-col mb-1 capitalize text-[#141414]/40 font-serif italic text-lg leading-none">
                    <span>Core Entity</span>
                    <span className="text-xs font-mono font-bold uppercase not-italic tracking-[0.2em]">{data.length} records</span>
                  </div>
                </div>

                <DataGrid activeTab={activeTab} data={data} />
              </>
            )}

            {!isAdminHome && <DebugConsole activeTab={activeTab} recentData={data} />}
            
            <footer className="pt-12 pb-8 border-t border-[#141414]/10 flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-8 font-mono text-[10px] uppercase font-black opacity-30">
                <div className="flex items-center gap-2 underline decoration-1 text-[#141414]">01_DATA_MODEL</div>
                <div className="flex items-center gap-2">02_CONTROLLER_SYNC</div>
                <div className="flex items-center gap-2">03_VIEW_STATE</div>
              </div>
              <div className="font-mono text-[9px] uppercase tracking-widest opacity-20">
                SQLite_MVC_Project // Build_4.19.26
              </div>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [installed, setInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    fetch('/api/system/status')
      .then(res => res.json())
      .then(data => setInstalled(!!data.installed))
      .catch(() => setInstalled(false));
  }, []);

  if (installed === null) return null;

  return (
    <>
      <Routes>
        <Route 
          path="/install" 
          element={installed ? <Navigate to="/login" replace /> : <Install />} 
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
           <Route index element={<Navigate to="admin_home" replace />} />
           <Route path="admin_home" element={<AdminHome />} />
           <Route path=":entity" element={<DashboardLayout />} />
        </Route>
        <Route 
          path="/" 
          element={<Navigate to={installed ? "/login" : "/install"} replace />} 
        />
      </Routes>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #14141422;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #14141444;
        }
      `}</style>
    </>
  );
}
