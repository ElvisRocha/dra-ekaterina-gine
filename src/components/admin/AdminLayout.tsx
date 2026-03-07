import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '@/hooks/useAuth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Settings, LogOut, User, ChevronDown } from 'lucide-react';

const breadcrumbLabels: Record<string, string> = {
  dashboard: 'Dashboard',
  pacientes: 'Pacientes',
  calendario: 'Calendario',
  configuracion: 'Configuración',
};

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  doctora: 'bg-primary/10 text-primary',
  secretaria: 'bg-blue-100 text-blue-700',
};

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, role, logout } = useAuth();

  const segments = location.pathname.replace('/admin/', '').split('/').filter(Boolean);
  const crumbs = segments.map((seg) => breadcrumbLabels[seg] ?? (seg.length === 36 ? 'Expediente' : seg));

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">

          {/* ── Header — h-14 matches sidebar header ── */}
          <header className="h-14 flex items-center justify-between border-b border-border px-4 bg-card/80 backdrop-blur-sm sticky top-0 z-10">

            {/* Left: trigger + breadcrumbs */}
            <div className="flex items-center gap-3 min-w-0">
              <SidebarTrigger className="flex-shrink-0 hover:bg-muted rounded-md" />
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

            {/* Right: user dropdown */}
            {profile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-muted transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    {/* Avatar */}
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    {/* Name + role — hidden on mobile */}
                    <div className="hidden md:block text-left">
                      <p className="text-xs font-medium text-foreground leading-none">
                        {profile.nombre} {profile.apellido}
                      </p>
                      {role && (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-0.5 inline-block ${roleColors[role] ?? 'bg-muted'}`}>
                          {role}
                        </span>
                      )}
                    </div>
                    <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden md:block" />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-52">
                  {/* User info header */}
                  <DropdownMenuLabel className="font-normal pb-2">
                    <p className="font-semibold text-sm text-foreground">
                      {profile.nombre} {profile.apellido}
                    </p>
                    {profile.email && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{profile.email}</p>
                    )}
                    {role && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium mt-1 inline-block ${roleColors[role] ?? 'bg-muted'}`}>
                        {role}
                      </span>
                    )}
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  {/* Configuración — solo admin/doctora */}
                  {role && ['admin', 'doctora'].includes(role) && (
                    <DropdownMenuItem onClick={() => navigate('/admin/configuracion')}>
                      <Settings className="h-4 w-4 mr-2" />
                      Configuración
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={logout}
                    className="text-destructive focus:text-destructive focus:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
