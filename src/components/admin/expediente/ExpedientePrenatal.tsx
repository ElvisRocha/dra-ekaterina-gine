import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format, differenceInWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { Baby, Plus, Pencil, CalendarDays, ArrowLeft } from 'lucide-react';
import ControlPrenatalFormModal from './ControlPrenatalFormModal';
import type { Tables } from '@/integrations/supabase/types';

type Control = Tables<'control_prenatal'>;

interface Props {
  pacienteId: string;
}

const ExpedientePrenatal = ({ pacienteId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editControl, setEditControl] = useState<Control | null>(null);
  const [viewControl, setViewControl] = useState<Control | null>(null);

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

  const handleSuccess = () => {
    setShowForm(false);
    setEditControl(null);
    queryClient.invalidateQueries({ queryKey: ['control_prenatal', pacienteId] });
  };

  // Derive the current pregnancy number
  const activeControls = controles?.filter(c => c.activo) ?? [];
  const maxEmbarazo = controles?.length
    ? Math.max(...controles.map(c => c.embarazo_numero ?? 1))
    : 1;

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;

  // Detail view for a single control
  if (viewControl) {
    const weeksFromFur = viewControl.fur
      ? differenceInWeeks(new Date(viewControl.fecha_control ?? new Date()), new Date(viewControl.fur))
      : null;

    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setViewControl(null)}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Volver a la lista
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                {viewControl.fecha_control
                  ? format(new Date(viewControl.fecha_control), "dd MMM yyyy · HH:mm", { locale: es })
                  : 'Sin fecha'}
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => { setEditControl(viewControl); setViewControl(null); }}>
                <Pencil className="h-3.5 w-3.5 mr-1" /> Editar
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Embarazo info */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">Embarazo #{viewControl.embarazo_numero}</Badge>
              {viewControl.semanas_gestacion && <Badge variant="secondary">{viewControl.semanas_gestacion} sem</Badge>}
              {weeksFromFur !== null && <Badge variant="secondary">~{weeksFromFur} sem (FUR)</Badge>}
              {viewControl.activo ? (
                <Badge className="bg-accent text-accent-foreground">Activo</Badge>
              ) : (
                <Badge variant="outline" className="text-muted-foreground">Finalizado</Badge>
              )}
            </div>

            {/* Dates */}
            {(viewControl.fur || viewControl.fpp) && (
              <div className="grid grid-cols-2 gap-3">
                {viewControl.fur && <Stat label="FUR" value={format(new Date(viewControl.fur), 'dd/MM/yyyy')} />}
                {viewControl.fpp && <Stat label="FPP" value={format(new Date(viewControl.fpp), 'dd/MM/yyyy')} />}
              </div>
            )}

            {/* Vitals grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Stat label="Peso" value={viewControl.peso ? `${viewControl.peso} kg` : '—'} />
              <Stat label="PA" value={viewControl.presion_arterial || '—'} />
              <Stat label="AU" value={viewControl.altura_uterina ? `${viewControl.altura_uterina} cm` : '—'} />
              <Stat label="FCF" value={viewControl.fcf ? `${viewControl.fcf} lpm` : '—'} />
              <Stat label="Presentación" value={viewControl.presentacion || '—'} />
              <Stat label="Mov. fetales" value={viewControl.movimientos_fetales ? 'Sí' : 'No'} />
              <Stat label="Edema" value={viewControl.edema || 'Ninguno'} />
            </div>

            {viewControl.observaciones && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1 font-medium">Observaciones</p>
                <p className="text-sm text-foreground whitespace-pre-wrap">{viewControl.observaciones}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with summary */}
      {activeControls.length > 0 && (
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Baby className="h-5 w-5 text-accent" />
              <span className="text-sm font-medium text-foreground">
                Embarazo activo #{activeControls[0].embarazo_numero}
              </span>
              {activeControls[0].semanas_gestacion && (
                <Badge variant="secondary">{activeControls[0].semanas_gestacion} sem</Badge>
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {activeControls.length} control{activeControls.length !== 1 ? 'es' : ''} registrado{activeControls.length !== 1 ? 's' : ''}
            </span>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo control
        </Button>
      </div>

      {!controles?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Baby className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay controles prenatales registrados.</p>
            <p className="text-xs mt-1">Haz clic en "Nuevo control" para agregar el primero.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {controles.map((c) => (
            <Card
              key={c.id}
              className="cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => setViewControl(c)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">
                    {c.fecha_control
                      ? format(new Date(c.fecha_control), 'dd MMM yyyy', { locale: es })
                      : 'Sin fecha'}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    {c.semanas_gestacion && <Badge variant="outline">{c.semanas_gestacion} sem</Badge>}
                    {c.activo ? (
                      <Badge className="bg-accent text-accent-foreground text-xs">Activo</Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-muted-foreground">Finalizado</Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditControl(c);
                      }}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <Stat label="Peso" value={c.peso ? `${c.peso} kg` : '—'} />
                <Stat label="PA" value={c.presion_arterial || '—'} />
                <Stat label="AU" value={c.altura_uterina ? `${c.altura_uterina} cm` : '—'} />
                <Stat label="FCF" value={c.fcf ? `${c.fcf} lpm` : '—'} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create modal */}
      <ControlPrenatalFormModal
        open={showForm}
        onOpenChange={setShowForm}
        pacienteId={pacienteId}
        embarazoNumero={maxEmbarazo}
        onSuccess={handleSuccess}
      />

      {/* Edit modal */}
      {editControl && (
        <ControlPrenatalFormModal
          open={!!editControl}
          onOpenChange={(open) => !open && setEditControl(null)}
          pacienteId={pacienteId}
          control={editControl}
          onSuccess={handleSuccess}
        />
      )}
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
