import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, User } from 'lucide-react';

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  pacientes: 'Pacientes',
  calendario: 'Calendario',
  configuracion: 'Configuración',
};

const AdminLayout = () => {
  const location = useLocation();
  const { profile, role } = useAuth();

  // Build breadcrumb from path segments
  const segments = location.pathname.replace('/admin/', '').split('/').filter(Boolean);
  const crumbs = segments.map((seg) => breadcrumbLabels[seg] ?? (seg.length === 36 ? 'Expediente' : seg));

  const roleColors: Record<string, string> = {
    admin: 'bg-purple-100 text-purple-700 border-purple-200',
    doctora: 'bg-primary/10 text-primary border-primary/20',
    secretaria: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          {/* ── Header ── */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="flex-shrink-0 hover:bg-muted rounded-md" />
              {/* Breadcrumbs */}
              <nav className="flex items-center gap-1.5 text-sm min-w-0">
                <span className="text-muted-foreground hidden sm:inline">Admin</span>
                {crumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    <span className="text-muted-foreground hidden sm:inline">/</span>
                    <span
                      className={
                        i === crumbs.length - 1
                          ? 'font-medium text-foreground truncate max-w-[160px]'
                          : 'text-muted-foreground hidden sm:inline'
                      }
                    >
                      {crumb}
                    </span>
                  </span>
                ))}
              </nav>
            </div>

            {/* Right side — user info */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {profile && (
                <div className="hidden md:flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground leading-none">
                      {profile.nombre} {profile.apellido}
                    </p>
                    {role && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full border font-medium mt-0.5 inline-block ${roleColors[role] ?? 'bg-muted'}`}>
                        {role}
                      </span>
                    )}
                  </div>
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                </div>
              )}
            </div>
          </header>

          {/* ── Main content ── */}
          <main className="flex-1 p-5 md:p-6 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
