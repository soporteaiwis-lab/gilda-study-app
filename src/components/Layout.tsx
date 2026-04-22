import { Outlet, Link } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckSquare, Sparkles } from 'lucide-react';

export default function Layout() {
  return (
    <div className="flex h-screen bg-slate-900 text-white">
      <aside className="w-64 bg-slate-800 border-r border-slate-700">
        <div className="p-6">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Gilda Study v2</h1>
        </div>
        <nav className="mt-6">
          <Link to="/" className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <Link to="/knowledge" className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <BookOpen className="w-5 h-5 mr-3" />
            Knowledge Base
          </Link>
          <Link to="/tasks" className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <CheckSquare className="w-5 h-5 mr-3" />
            Tasks
          </Link>
          <Link to="/canvas" className="flex items-center px-6 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors">
            <Sparkles className="w-5 h-5 mr-3" />
            Canvas Gen
          </Link>
        </nav>
      </aside>
      <main className="flex-1 overflow-auto p-8">
        <Outlet />
      </main>
    </div>
  );
}
