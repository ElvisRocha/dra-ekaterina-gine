import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { Loader2, Lock, Mail } from 'lucide-react';
import logoImg from '@/assets/logo.png';
import { useEffect } from 'react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login, user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) {
      if (role === 'secretaria') {
        navigate('/admin/calendario', { replace: true });
      } else {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [user, role, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    try {
      await login(email, password);
      toast({ title: 'Bienvenida, Doctora 🌷' });
    } catch (err: any) {
      toast({
        title: 'Error de autenticación',
        description: err.message || 'Credenciales incorrectas',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[hsl(var(--coral)/0.15)] via-background to-[hsl(var(--magenta)/0.1)] p-4">
      <Card className="w-full max-w-md border-border/50 shadow-xl">
        <CardHeader className="items-center pb-2">
          <img src={logoImg} alt="Clínica Dra. Ekaterina" className="h-20 w-auto mb-2" />
          <p className="text-sm text-muted-foreground">Panel Administrativo</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="flex items-center gap-2 mb-2">
                <Mail className="w-4 h-4 text-muted-foreground" />
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="doctora@clinica.com"
                className="h-12"
                autoComplete="email"
              />
            </div>
            <div>
              <Label htmlFor="password" className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-muted-foreground" />
                Contraseña
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12"
                autoComplete="current-password"
              />
            </div>
            <Button type="submit" className="w-full h-12 btn-gradient" disabled={submitting}>
              {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
