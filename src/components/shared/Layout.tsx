import { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
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
  X
} from 'lucide-react';

export const Layout = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Inicio', path: '/' },
    { icon: MessageSquare, label: 'Chat', path: '/chat' },
    { icon: FolderOpen, label: 'Materiales', path: '/materials' },
    { icon: BookOpen, label: 'Currículo', path: '/curriculum' },
    { icon: CheckSquare, label: 'Tareas', path: '/tasks' },
    { icon: Settings, label: 'Configuración', path: '/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile */}
      <header className="lg:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Gilda Study</h1>
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? <X /> : <Menu />}
        </Button>
      </header>

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-40 transform transition-transform
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold">Gilda Study</h2>
          <p className="text-xs text-gray-500">v1.0</p>
        </div>

        <nav className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100"
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t bg-white">
          <div className="flex items-center gap-3 mb-3">
            <img 
              src={user?.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gilda'} 
              alt={user?.displayName || 'Usuario'} 
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.displayName || 'Gilda Cuvertino'}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || 'gilda@ejemplo.com'}</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen flex flex-col">
        <div className="flex-1 p-4 lg:p-8">
          <Outlet />
        </div>

        {/* Footer */}
        <footer className="border-t bg-white p-4 text-center text-xs text-gray-500 mt-auto">
          <p>Gilda Study App v1.0</p>
          <p>Desarrollado por Armin Salazar - AIWIS IA & TI | Para Gilda Cuvertino</p>
        </footer>
      </main>
    </div>
  );
};
