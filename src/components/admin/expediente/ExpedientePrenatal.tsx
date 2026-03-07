import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Baby } from 'lucide-react';

interface Props {
  pacienteId: string;
}

const ExpedientePrenatal = ({ pacienteId }: Props) => {
  const { data: controles, isLoading } = useQuery({
    queryKey: ['control_prenatal', pacienteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('control_prenatal')
        .select('*')
        .eq('paciente_id', pacienteId)
        .order('fecha_control', { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;

  if (!controles?.length) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <Baby className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No hay controles prenatales registrados.</p>
          <p className="text-xs mt-1">Se habilitará en una próxima iteración.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {controles.map((c) => (
        <Card key={c.id}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">
                {c.fecha_control ? format(new Date(c.fecha_control), 'dd MMM yyyy', { locale: es }) : 'Sin fecha'}
              </CardTitle>
              <div className="flex gap-2">
                {c.semanas_gestacion && <Badge variant="outline">{c.semanas_gestacion} sem</Badge>}
                {c.activo && <Badge className="bg-accent text-accent-foreground text-xs">Activo</Badge>}
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <Stat label="Peso" value={c.peso ? `${c.peso} kg` : '—'} />
            <Stat label="PA" value={c.presion_arterial || '—'} />
            <Stat label="AU" value={c.altura_uterina ? `${c.altura_uterina} cm` : '—'} />
            <Stat label="FCF" value={c.fcf ? `${c.fcf} lpm` : '—'} />
            {c.presentacion && <Stat label="Presentación" value={c.presentacion} />}
            {c.observaciones && (
              <div className="col-span-full text-muted-foreground">
                <strong className="text-foreground">Obs:</strong> {c.observaciones}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-xs text-muted-foreground">{label}</p>
    <p className="font-medium text-foreground">{value}</p>
  </div>
);

export default ExpedientePrenatal;
