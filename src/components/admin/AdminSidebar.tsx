import { LayoutDashboard, Users, Calendar, Settings, LogOut } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import logoImg from '@/assets/Isotipo.png';

const navItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard, roles: ['admin', 'doctora'] },
  { title: 'Pacientes', url: '/admin/pacientes', icon: Users, roles: ['admin', 'doctora', 'secretaria'] },
  { title: 'Calendario', url: '/admin/calendario', icon: Calendar, roles: ['admin', 'doctora', 'secretaria'] },
  { title: 'Configuración', url: '/admin/configuracion', icon: Settings, roles: ['admin', 'doctora'] },
];

const roleLabels: Record<string, string> = {
  admin: 'Admin',
  doctora: 'Doctora',
  secretaria: 'Secretaria',
};

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { profile, role, logout } = useAuth();
  const location = useLocation();

  const filteredItems = navItems.filter(item => role && item.roles.includes(role));

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center gap-2">
            <img src={logoImg} alt="Logo" className="w-6 h-6" />
            {!collapsed && <span className="font-display text-sm">Dra. Ekaterina</span>}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === '/admin/dashboard'}
                      className="hover:bg-muted/50"
                      activeClassName="bg-primary/10 text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t border-border">
        {!collapsed && profile && (
          <div className="mb-2">
            <p className="text-sm font-medium text-foreground truncate">
              {profile.nombre} {profile.apellido}
            </p>
            {role && (
              <Badge variant="secondary" className="text-xs mt-1">
                {roleLabels[role] || role}
              </Badge>
            )}
          </div>
        )}
        <Button
          variant="ghost"
          size={collapsed ? 'icon' : 'sm'}
          onClick={logout}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          {!collapsed && <span className="ml-2">Cerrar sesión</span>}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AdminSidebar;
