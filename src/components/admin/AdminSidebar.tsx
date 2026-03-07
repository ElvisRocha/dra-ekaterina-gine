import { LayoutDashboard, Users, Calendar, ChevronRight } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  useSidebar,
} from '@/components/ui/sidebar';
import logoImg from '@/assets/Isotipo.png';

const navItems = [
  { title: 'Dashboard', url: '/admin/dashboard', icon: LayoutDashboard, roles: ['admin', 'doctora'] },
  { title: 'Pacientes', url: '/admin/pacientes', icon: Users, roles: ['admin', 'doctora', 'secretaria'] },
  { title: 'Calendario', url: '/admin/calendario', icon: Calendar, roles: ['admin', 'doctora', 'secretaria'] },
];

const AdminSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { role } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const filteredItems = navItems.filter((item) => role && item.roles.includes(role));

  const isActive = (url: string) => {
    if (url === '/admin/dashboard') return location.pathname === url;
    return location.pathname.startsWith(url);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      {/* ── Header — h-14 to match main header height ── */}
      <SidebarHeader
        className={`h-14 flex items-center border-b border-border/60 ${collapsed ? 'px-3' : 'px-4'}`}
      >
        <div
          className="flex items-center gap-3 cursor-pointer min-w-0"
          onClick={() => navigate('/admin/dashboard')}
        >
          <img
            src={logoImg}
            alt="Logo Dra. Ekaterina"
            className={`flex-shrink-0 transition-all duration-200 ${collapsed ? 'w-7 h-7' : 'w-8 h-8'}`}
          />
          {!collapsed && (
            <div className="min-w-0">
              <p className="font-display text-sm font-semibold text-foreground leading-tight truncate">
                Dra. Ekaterina
              </p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5 truncate">
                Ginecología & Obstetricia
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-3">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {filteredItems.map((item) => {
                const active = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`w-full rounded-lg transition-all duration-150 ${
                        active
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                      }`}
                    >
                      <button
                        onClick={() => navigate(item.url)}
                        className={`flex items-center w-full ${collapsed ? 'justify-center px-0' : 'gap-3 px-3'} py-2.5 rounded-lg`}
                        title={collapsed ? item.title : undefined}
                      >
                        <item.icon className={`h-4 w-4 flex-shrink-0 ${active ? 'text-primary' : ''}`} />
                        {!collapsed && (
                          <>
                            <span className="flex-1 text-sm">{item.title}</span>
                            {active && <ChevronRight className="h-3 w-3 text-primary/60" />}
                          </>
                        )}
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
