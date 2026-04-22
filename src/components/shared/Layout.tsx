import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  MessageSquare,
  BookOpen,
  CheckSquare,
  Settings,
  Menu,
  Database,
  Brain,
  Shield,
  User
} from 'lucide-react';

export const Layout = () => {
  const { user, switchToAdmin, switchToGilda, isAdmin } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/' },
    { icon: MessageSquare, label: 'Chat IA', path: '/chat' },
    { icon: Brain, label: 'Conocimiento', path: '/notebook' },
    { icon: BookOpen, label: 'Currículo', path: '/curriculum' },
    { icon: CheckSquare, label: 'Tareas', path: '/tasks' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  if (isAdmin) {
    navItems.push({ icon: Database, label: 'Base de Datos', path: '/admin/database' });
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-52 z-50 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        style={{ background: 'rgba(15, 23, 42, 0.95)', borderRight: '1px solid rgba(148, 163, 184, 0.1)' }}>

        {/* Logo */}
        <div className="p-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-sm">Estud-IA</h1>
            <p className="text-slate-500 text-[10px]">v1.0</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5">
          {navItems.map(item => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${active ? 'text-white font-medium' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'}`}
                style={active ? { background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))', boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.3)' } : {}}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${isAdmin ? 'bg-purple-600' : 'bg-blue-600'}`}>
              {user.displayName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user.displayName}</p>
              <p className="text-slate-500 text-[10px] truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full text-xs text-slate-400 hover:text-white justify-start h-7"
            onClick={isAdmin ? switchToGilda : switchToAdmin}>
            {isAdmin ? <><User className="w-3 h-3 mr-1" /> Cambiar a Gilda</> : <><Shield className="w-3 h-3 mr-1" /> Modo Admin</>}
          </Button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile header */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between p-3" style={{ background: 'rgba(15, 23, 42, 0.95)', borderBottom: '1px solid rgba(148, 163, 184, 0.1)' }}>
          <button onClick={() => setSidebarOpen(true)} className="text-white"><Menu className="w-5 h-5" /></button>
          <span className="text-white font-semibold text-sm">Estud-IA</span>
          <div className="w-5" />
        </header>

        {/* Content */}
        <div className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="text-center py-2 text-[10px] text-slate-600 border-t border-slate-800/30">
          App Estud-IA v1.0 | Desarrollado por Armin Salazar - AIWIS IA & TI | Para Gilda Cuvertino
        </footer>
      </main>
    </div>
  );
};
