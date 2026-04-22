import { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  MessageSquare, 
  FolderOpen, 
  BookOpen,
  CheckSquare,
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  Notebook,
  Shield
} from 'lucide-react';

export const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/' },
    { icon: MessageSquare, label: 'Chat IA', path: '/chat' },
    { icon: FolderOpen, label: 'Google Drive', path: '/materials' },
    { icon: Notebook, label: 'NotebookLM', path: '/notebook' },
    { icon: BookOpen, label: 'Currículo', path: '/curriculum' },
    { icon: CheckSquare, label: 'Tareas', path: '/tasks' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  // Add admin-only items
  if (user?.role === 'admin') {
    navItems.push({ icon: Database, label: 'Base de Datos', path: '/admin/database' });
  }

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header Mobile */}
      <header className="lg:hidden bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <BookOpen className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-lg font-bold text-white">Estud-IA</h1>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)} className="text-slate-300 hover:text-white">
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}
        style={{
          background: 'rgba(15, 23, 42, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(148, 163, 184, 0.1)',
        }}
      >
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Estud-IA</h2>
              <p className="text-xs text-slate-500">v1.0</p>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 180px)' }}>
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-medium ${
                isActive(item.path) 
                  ? 'text-white' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
              style={isActive(item.path) ? {
                background: 'linear-gradient(135deg, rgba(59,130,246,0.2), rgba(139,92,246,0.2))',
                boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.3)',
              } : {}}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
              {item.path === '/admin/database' && (
                <Shield className="w-3 h-3 ml-auto text-purple-400" />
              )}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-slate-800/80" style={{ background: 'rgba(15, 23, 42, 0.95)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
              style={{ background: user?.role === 'admin' 
                ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)' 
                : 'linear-gradient(135deg, #3b82f6, #2563eb)' 
              }}>
              {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.displayName || 'Usuario'}</p>
              <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              {user?.role === 'admin' && (
                <span className="text-[10px] text-purple-400 font-medium">ADMINISTRADOR</span>
              )}
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800" 
            onClick={handleSignOut}
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-4 lg:p-6">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-800 p-4 text-center text-xs text-slate-600 mt-auto">
          <p>App Estud-IA v1.0 | Desarrollado por Armin Salazar - AIWIS IA & TI | Para Gilda Cuvertino</p>
        </footer>
      </main>
    </div>
  );
};
