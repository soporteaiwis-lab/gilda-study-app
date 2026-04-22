import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { Layout } from '@/components/shared/Layout';
import { Dashboard } from '@/pages/Dashboard';
import { NotebookPage } from '@/pages/NotebookLM';
import { Curriculum } from '@/pages/Curriculum';
import { Tasks } from '@/pages/Tasks';
import { Settings } from '@/pages/Settings';
import { AdminDatabase } from '@/pages/AdminDatabase';
import { Toaster } from '@/components/ui/sonner';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/notebook" element={<NotebookPage />} />
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/admin/database" element={<AdminDatabase />} />
          </Route>
          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-right" richColors />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
