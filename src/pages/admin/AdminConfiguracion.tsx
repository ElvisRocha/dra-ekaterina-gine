import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { User, Lock, Shield, Loader2 } from 'lucide-react';

const roleLabels: Record<string, string> = {
  admin: 'Administrador',
  doctora: 'Doctora',
  secretaria: 'Secretaria',
};

const AdminConfiguracion = () => {
  const { profile, role, user } = useAuth();

  // Profile form
  const [profileForm, setProfileForm] = useState({ nombre: '', apellido: '', email: '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Password form
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        nombre: profile.nombre || '',
        apellido: profile.apellido || '',
        email: profile.email || user?.email || '',
      });
    }
  }, [profile, user]);

  const handleSaveProfile = async () => {
    if (!profileForm.nombre.trim() || !profileForm.apellido.trim()) {
      toast.error('Nombre y apellido son obligatorios');
      return;
    }
    setSavingProfile(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          nombre: profileForm.nombre.trim(),
          apellido: profileForm.apellido.trim(),
          email: profileForm.email.trim() || null,
        })
        .eq('id', user!.id);
      if (error) throw error;
      toast.success('Perfil actualizado');
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!passwordForm.newPass || passwordForm.newPass.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    if (passwordForm.newPass !== passwordForm.confirm) {
      toast.error('Las contraseñas no coinciden');
      return;
    }
    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPass,
      });
      if (error) throw error;
      toast.success('Contraseña actualizada');
      setPasswordForm({ current: '', newPass: '', confirm: '' });
    } catch (err: any) {
      toast.error(err.message || 'Error al cambiar contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h2 className="text-2xl font-display text-foreground">Configuración</h2>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Perfil
          </CardTitle>
          <CardDescription>Información de tu cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Nombre</Label>
              <Input
                value={profileForm.nombre}
                onChange={e => setProfileForm(f => ({ ...f, nombre: e.target.value }))}
              />
            </div>
            <div>
              <Label>Apellido</Label>
              <Input
                value={profileForm.apellido}
                onChange={e => setProfileForm(f => ({ ...f, apellido: e.target.value }))}
              />
            </div>
          </div>
          <div>
            <Label>Correo electrónico</Label>
            <Input
              type="email"
              value={profileForm.email}
              onChange={e => setProfileForm(f => ({ ...f, email: e.target.value }))}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleSaveProfile} disabled={savingProfile} className="btn-gradient">
              {savingProfile && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Guardar perfil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" /> Cambiar contraseña
          </CardTitle>
          <CardDescription>Actualiza tu contraseña de acceso</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Nueva contraseña</Label>
            <Input
              type="password"
              value={passwordForm.newPass}
              onChange={e => setPasswordForm(f => ({ ...f, newPass: e.target.value }))}
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div>
            <Label>Confirmar contraseña</Label>
            <Input
              type="password"
              value={passwordForm.confirm}
              onChange={e => setPasswordForm(f => ({ ...f, confirm: e.target.value }))}
              placeholder="Repetir contraseña"
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleChangePassword} disabled={savingPassword} variant="outline">
              {savingPassword && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Cambiar contraseña
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Role info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" /> Rol y permisos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground">Tu rol actual:</span>
            <Badge variant="secondary" className="text-sm">
              {role ? roleLabels[role] || role : 'Sin rol'}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Los roles son administrados por el administrador del sistema. Contacta al admin si necesitas cambios en tus permisos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConfiguracion;
