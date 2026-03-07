import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FileText } from 'lucide-react';

interface Props {
  pacienteId: string;
}

const ExpedienteConsultas = ({ pacienteId }: Props) => {
  const { data: consultas, isLoading } = useQuery({
    queryKey: ['consultas', pacienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('consultas')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;

  if (!consultas?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No hay consultas registradas.</p>
          <p className="text-xs mt-1">Las consultas se crearán en una próxima iteración.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {consultas.map((c) => (
        <Card key={c.id} className="cursor-pointer hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {c.fecha ? format(new Date(c.fecha), "dd MMM yyyy · HH:mm", { locale: es }) : 'Sin fecha'}
              </CardTitle>
              {c.diagnostico && <Badge variant="secondary" className="text-xs">{c.diagnostico}</Badge>}
            </div>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-1">
            {c.motivo_consulta && <p><strong className="text-foreground">Motivo:</strong> {c.motivo_consulta}</p>}
            {c.enfermedad_actual && <p><strong className="text-foreground">Enfermedad actual:</strong> {c.enfermedad_actual}</p>}
            {c.plan_tratamiento && <p><strong className="text-foreground">Plan:</strong> {c.plan_tratamiento}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ExpedienteConsultas;
