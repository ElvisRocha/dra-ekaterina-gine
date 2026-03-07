import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, FileText, Baby, User } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

interface Props {
  paciente: Tables<'pacientes'>;
}

const ExpedienteResumen = ({ paciente }: Props) => {
  const { data: expediente } = useQuery({
    queryKey: ['expediente_master', paciente.id],
    queryFn: async () => {
      const { data } = await supabase
        .from('expediente_master')
        .select('*')
        .eq('paciente_id', paciente.id)
        .single();
      return data;
    },
  });

  const { data: stats } = useQuery({
    queryKey: ['paciente_stats', paciente.id],
    queryFn: async () => {
      const [consultasRes, citasRes, prenatalRes] = await Promise.all([
        supabase.from('consultas').select('id', { count: 'exact', head: true }).eq('paciente_id', paciente.id),
        supabase.from('citas').select('id', { count: 'exact', head: true }).eq('paciente_id', paciente.id),
        supabase.from('control_prenatal').select('id', { count: 'exact', head: true }).eq('paciente_id', paciente.id).eq('activo', true),
      ]);
      return {
        consultas: consultasRes.count || 0,
        citas: citasRes.count || 0,
        prenatal: prenatalRes.count || 0,
      };
    },
  });

  const estadoCivil: Record<string, string> = {
    soltera: 'Soltera', casada: 'Casada', union_libre: 'Unión libre',
    divorciada: 'Divorciada', viuda: 'Viuda',
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {/* Datos personales */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="h-4 w-4 text-primary" /> Datos Personales
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <Row label="Sexo" value={paciente.sexo === 'F' ? 'Femenino' : 'Masculino'} />
          <Row label="Nacimiento" value={paciente.fecha_nacimiento ? format(new Date(paciente.fecha_nacimiento), 'dd MMM yyyy', { locale: es }) : '—'} />
          <Row label="Estado civil" value={paciente.estado_civil ? estadoCivil[paciente.estado_civil] || paciente.estado_civil : '—'} />
          <Row label="Nacionalidad" value={paciente.nacionalidad || '—'} />
          <Row label="Ocupación" value={paciente.ocupacion || '—'} />
          {paciente.contacto_emergencia_nombre && (
            <>
              <div className="border-t border-border pt-2 mt-2" />
              <p className="text-xs text-muted-foreground font-medium">Contacto emergencia</p>
              <Row label="Nombre" value={paciente.contacto_emergencia_nombre} />
              <Row label="Teléfono" value={paciente.contacto_emergencia_telefono || '—'} />
              <Row label="Parentesco" value={paciente.contacto_emergencia_parentesco || '—'} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" /> Actividad
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <StatRow icon={<FileText className="h-4 w-4 text-muted-foreground" />} label="Consultas" value={stats?.consultas ?? '—'} />
          <StatRow icon={<Calendar className="h-4 w-4 text-muted-foreground" />} label="Citas" value={stats?.citas ?? '—'} />
          <StatRow icon={<Baby className="h-4 w-4 text-muted-foreground" />} label="Controles prenatales activos" value={stats?.prenatal ?? '—'} />
          <div className="border-t border-border pt-2 mt-2" />
          <Row label="Registrada" value={paciente.created_at ? format(new Date(paciente.created_at), 'dd MMM yyyy', { locale: es }) : '—'} />
        </CardContent>
      </Card>

      {/* Resumen ginecológico */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Baby className="h-4 w-4 text-accent" /> Resumen Gineco-Obstétrico
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {expediente ? (
            <>
              <Row label="Menarca" value={expediente.menarca ? `${expediente.menarca} años` : '—'} />
              <Row label="FUR" value={expediente.fur ? format(new Date(expediente.fur), 'dd MMM yyyy', { locale: es }) : '—'} />
              <Row label="Ciclo regular" value={expediente.ciclo_regular === null ? '—' : expediente.ciclo_regular ? 'Sí' : 'No'} />
              <Row label="Anticonceptivo" value={expediente.metodo_anticonceptivo || '—'} />
              <div className="border-t border-border pt-2 mt-2" />
              <div className="flex gap-2 flex-wrap">
                <Badge variant="outline">G{expediente.gestas}</Badge>
                <Badge variant="outline">P{expediente.partos}</Badge>
                <Badge variant="outline">C{expediente.cesareas}</Badge>
                <Badge variant="outline">A{expediente.abortos}</Badge>
                <Badge variant="outline">E{expediente.ectopicos}</Badge>
                <Badge variant="outline">HV{expediente.hijos_vivos}</Badge>
              </div>
              {expediente.embarazada && (
                <Badge className="mt-2 bg-accent text-accent-foreground">Embarazada</Badge>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-xs">Sin expediente médico. Complétalo en la pestaña "Antecedentes".</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

const Row = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex justify-between">
    <span className="text-muted-foreground">{label}</span>
    <span className="text-foreground font-medium text-right">{value}</span>
  </div>
);

const StatRow = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) => (
  <div className="flex items-center justify-between">
    <span className="flex items-center gap-2 text-sm text-muted-foreground">{icon} {label}</span>
    <span className="text-lg font-bold text-foreground">{value}</span>
  </div>
);

export default ExpedienteResumen;
