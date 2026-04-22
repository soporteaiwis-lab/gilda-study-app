import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LoginPage } from '@/components/auth/LoginPage';
import { Layout } from '@/components/shared/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { Chat } from '@/pages/Chat';
import { Materials } from '@/pages/Materials';
import { NotebookPage } from '@/pages/NotebookLM';
import { Curriculum } from '@/pages/Curriculum';
import { Tasks } from '@/pages/Tasks';
import { Settings } from '@/pages/Settings';
import { AdminDatabase } from '@/pages/AdminDatabase';
import { Toaster } from '@/components/ui/sonner';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto animate-pulse"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <p className="text-slate-400 text-sm">Cargando App Estud-IA...</p>
        </div>
      </div>
    );
  }
  
  if (!user) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

const LoginRoute = () => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (user) return <Navigate to="/" />;
  return <LoginPage />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginRoute />} />
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route index element={<Dashboard />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/notebook" element={<NotebookPage />} />
              <Route path="/curriculum" element={<Curriculum />} />
              <Route path="/tasks" element={<Tasks />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/admin/database" element={<AdminDatabase />} />
            </Route>
          </Routes>
          <Toaster />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
