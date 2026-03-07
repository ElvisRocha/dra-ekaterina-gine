import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, UserPlus, Activity, Clock, ArrowRight } from 'lucide-react';
import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const now = new Date();

  // Stats queries
  const { data: totalPacientes } = useQuery({
    queryKey: ['stats_total_pacientes'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
        .eq('activo', true);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: citasHoy } = useQuery({
    queryKey: ['stats_citas_hoy'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_hora', startOfDay(now).toISOString())
        .lte('fecha_hora', endOfDay(now).toISOString());
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: citasSemana } = useQuery({
    queryKey: ['stats_citas_semana'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('citas')
        .select('*', { count: 'exact', head: true })
        .gte('fecha_hora', startOfWeek(now, { weekStartsOn: 1 }).toISOString())
        .lte('fecha_hora', endOfWeek(now, { weekStartsOn: 1 }).toISOString());
      if (error) throw error;
      return count ?? 0;
    },
  });

  const { data: nuevasMes } = useQuery({
    queryKey: ['stats_nuevas_mes'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('pacientes')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', startOfMonth(now).toISOString());
      if (error) throw error;
      return count ?? 0;
    },
  });

  // Upcoming appointments
  const { data: proximasCitas } = useQuery({
    queryKey: ['dashboard_proximas_citas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citas')
        .select('*, pacientes(primer_nombre, primer_apellido)')
        .gte('fecha_hora', now.toISOString())
        .in('estado', ['programada', 'confirmada'])
        .order('fecha_hora', { ascending: true })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  // Recent patients
  const { data: pacientesRecientes } = useQuery({
    queryKey: ['dashboard_pacientes_recientes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pacientes')
        .select('id, primer_nombre, primer_apellido, telefono, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      if (error) throw error;
      return data;
    },
  });

  const stats = [
    { title: 'Total Pacientes', value: totalPacientes ?? '—', icon: Users, color: 'text-primary' },
    { title: 'Citas Hoy', value: citasHoy ?? '—', icon: Calendar, color: 'text-accent' },
    { title: 'Citas Semana', value: citasSemana ?? '—', icon: Activity, color: 'text-primary' },
    { title: 'Nuevas este Mes', value: nuevasMes ?? '—', icon: UserPlus, color: 'text-accent' },
  ];

  const estadoColors: Record<string, string> = {
    programada: 'bg-blue-100 text-blue-800',
    confirmada: 'bg-green-100 text-green-800',
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-foreground">Dashboard</h2>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {!proximasCitas?.length ? (
              <p className="text-sm text-muted-foreground">No hay citas próximas.</p>
            ) : (
              proximasCitas.map((cita: any) => (
                <div key={cita.id} className="flex items-center justify-between gap-3 py-2 border-b last:border-0 border-border">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {cita.pacientes
                        ? `${cita.pacientes.primer_nombre} ${cita.pacientes.primer_apellido}`
                        : 'Paciente no asignado'}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(cita.fecha_hora), "EEE dd MMM · HH:mm", { locale: es })}
                      <span>·</span>
                      <span>{cita.tipo_cita}</span>
                    </div>
                  </div>
                  <Badge className={`text-xs shrink-0 ${estadoColors[cita.estado || 'programada'] || ''}`}>
                    {cita.estado}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent patients */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Pacientes Recientes</CardTitle>
            <button
              onClick={() => navigate('/admin/pacientes')}
              className="text-xs text-primary hover:underline flex items-center gap-1"
            >
              Ver todos <ArrowRight className="h-3 w-3" />
            </button>
          </CardHeader>
          <CardContent className="space-y-3">
            {!pacientesRecientes?.length ? (
              <p className="text-sm text-muted-foreground">No hay pacientes registrados.</p>
            ) : (
              pacientesRecientes.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2 border-b last:border-0 border-border cursor-pointer hover:bg-muted/50 -mx-2 px-2 rounded"
                  onClick={() => navigate(`/admin/pacientes/${p.id}`)}
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {p.primer_nombre} {p.primer_apellido}
                    </p>
                    {p.telefono && (
                      <p className="text-xs text-muted-foreground">{p.telefono}</p>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {p.created_at ? format(new Date(p.created_at), 'dd/MM/yy') : ''}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
