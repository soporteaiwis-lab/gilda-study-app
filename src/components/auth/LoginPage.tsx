import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Eye, EyeOff, LogIn, User, Lock, AlertCircle } from 'lucide-react';

export const LoginPage = () => {
  const { signInWithGoogle, signInLocal } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [googleLoading, setGoogleLoading] = useState(false);

  // Local login state
  const [localUser, setLocalUser] = useState('');
  const [localPass, setLocalPass] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localLoading, setLocalLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate('/');
    } catch (err: any) {
      console.error('Google login error:', err);
      setError('Error al conectar con Google. Usa un usuario predeterminado por ahora.');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleLocalLogin = async (username?: string) => {
    setError('');
    setLocalLoading(true);
    const user = username || localUser;
    const pass = username ? '123123' : localPass;
    
    try {
      const result = await signInLocal(user, pass);
      if (result.success) {
        navigate('/');
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch {
      setError('Error inesperado');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      }}
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', animation: 'pulse 4s ease-in-out infinite' }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #8b5cf6, transparent)', animation: 'pulse 5s ease-in-out infinite 1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', animation: 'pulse 6s ease-in-out infinite 2s' }} />
      </div>

      <Card className="w-full max-w-md relative overflow-hidden border-0"
        style={{
          background: 'rgba(30, 41, 59, 0.8)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(148, 163, 184, 0.1)',
        }}
      >
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                }}>
                <BookOpen className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">App Estud-IA</h1>
            <p className="text-slate-400 text-sm">Sistema de Estudio Inteligente</p>
            <p className="text-slate-500 text-xs">Administración de Empresas</p>
          </div>

          {/* Error message */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Google Login */}
          <Button 
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="w-full h-12 text-base font-medium border-0"
            style={{
              background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
              color: 'white',
            }}
          >
            {googleLoading ? (
              <span className="animate-spin mr-2">⏳</span>
            ) : (
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continuar con Google
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-600/50"></div>
            <span className="text-xs text-slate-500 uppercase tracking-wider">o ingresa con usuario</span>
            <div className="flex-1 h-px bg-slate-600/50"></div>
          </div>

          {/* Local Login Form */}
          <div className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                placeholder="Usuario"
                value={localUser}
                onChange={(e) => setLocalUser(e.target.value)}
                className="pl-10 h-11 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleLocalLogin()}
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Contraseña"
                value={localPass}
                onChange={(e) => setLocalPass(e.target.value)}
                className="pl-10 pr-10 h-11 bg-slate-700/50 border-slate-600/50 text-white placeholder:text-slate-500 focus:border-blue-500"
                onKeyDown={(e) => e.key === 'Enter' && handleLocalLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <Button
              onClick={() => handleLocalLogin()}
              disabled={localLoading || !localUser || !localPass}
              className="w-full h-11"
              variant="outline"
              style={{
                borderColor: 'rgba(148, 163, 184, 0.2)',
                color: '#e2e8f0',
                background: 'rgba(51, 65, 85, 0.5)',
              }}
            >
              <LogIn className="w-4 h-4 mr-2" />
              Iniciar Sesión
            </Button>
          </div>

          {/* Quick Access Buttons */}
          <div className="space-y-2">
            <p className="text-xs text-slate-500 text-center">Acceso rápido predeterminado:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalLogin('gilda')}
                className="text-xs h-9 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 border border-blue-500/20"
              >
                <User className="w-3 h-3 mr-1" />
                Gilda (Estudiante)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleLocalLogin('aiwis')}
                className="text-xs h-9 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 border border-purple-500/20"
              >
                <Lock className="w-3 h-3 mr-1" />
                AIWIS (Admin)
              </Button>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-700/50 text-center text-xs text-slate-500 space-y-1">
            <p>v1.0</p>
            <p>Desarrollado por Armin Salazar - AIWIS IA & TI</p>
            <p>Para Gilda Cuvertino</p>
          </div>
        </div>
      </Card>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.15; }
          50% { transform: scale(1.1); opacity: 0.25; }
        }
      `}</style>
    </div>
  );
};
