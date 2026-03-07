import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar } from 'lucide-react';

interface Props {
  pacienteId: string;
}

const estadoColors: Record<string, string> = {
  programada: 'bg-blue-100 text-blue-800',
  confirmada: 'bg-green-100 text-green-800',
  completada: 'bg-muted text-muted-foreground',
  cancelada: 'bg-destructive/10 text-destructive',
  no_asistio: 'bg-orange-100 text-orange-800',
};

const ExpedienteCitas = ({ pacienteId }: Props) => {
  const { data: citas, isLoading } = useQuery({
    queryKey: ['citas_paciente', pacienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citas')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_hora', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;

  if (!citas?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No hay citas registradas para esta paciente.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {citas.map((c) => (
        <Card key={c.id} className="hover:shadow-sm transition-shadow">
          <CardContent className="py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground text-sm">
                {format(new Date(c.fecha_hora), "EEEE dd MMM yyyy · HH:mm", { locale: es })}
              </p>
              <p className="text-xs text-muted-foreground">{c.tipo_cita}{c.duracion_minutos ? ` · ${c.duracion_minutos} min` : ''}</p>
              {c.notas && <p className="text-xs text-muted-foreground mt-1 truncate">{c.notas}</p>}
            </div>
            <Badge className={`text-xs ${estadoColors[c.estado || 'programada'] || ''}`}>
              {c.estado || 'programada'}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpedienteCitas;
