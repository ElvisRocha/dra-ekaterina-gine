import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Plus, Pencil, MoreVertical, CheckCircle, XCircle, Ban, Clock } from 'lucide-react';
import { toast } from 'sonner';
import CitaFormModal from './CitaFormModal';
import type { Tables } from '@/integrations/supabase/types';

type Cita = Tables<'citas'>;

interface Props {
  pacienteId: string;
}

const estadoConfig: Record<string, { color: string; label: string }> = {
  programada: { color: 'bg-blue-100 text-blue-800', label: 'Programada' },
  confirmada: { color: 'bg-green-100 text-green-800', label: 'Confirmada' },
  completada: { color: 'bg-muted text-muted-foreground', label: 'Completada' },
  cancelada: { color: 'bg-destructive/10 text-destructive', label: 'Cancelada' },
  no_asistio: { color: 'bg-orange-100 text-orange-800', label: 'No asistió' },
};

const ExpedienteCitas = ({ pacienteId }: Props) => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editCita, setEditCita] = useState<Cita | null>(null);

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

  const handleSuccess = () => {
    setShowForm(false);
    setEditCita(null);
    queryClient.invalidateQueries({ queryKey: ['citas_paciente', pacienteId] });
    queryClient.invalidateQueries({ queryKey: ['paciente_stats', pacienteId] });
    queryClient.invalidateQueries({ queryKey: ['dashboard_proximas_citas'] });
    queryClient.invalidateQueries({ queryKey: ['stats_citas_hoy'] });
    queryClient.invalidateQueries({ queryKey: ['stats_citas_semana'] });
  };

  const updateEstado = async (citaId: string, estado: string) => {
    const { error } = await supabase.from('citas').update({ estado }).eq('id', citaId);
    if (error) {
      toast.error('Error al actualizar estado');
    } else {
      toast.success(`Estado cambiado a "${estadoConfig[estado]?.label || estado}"`);
      handleSuccess();
    }
  };

  if (isLoading) return <div className="text-center py-8 text-muted-foreground">Cargando...</div>;

  // Split into upcoming and past
  const now = new Date();
  const upcoming = citas?.filter(c => new Date(c.fecha_hora) >= now && !['cancelada', 'completada', 'no_asistio'].includes(c.estado || '')) ?? [];
  const past = citas?.filter(c => !upcoming.includes(c)) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => setShowForm(true)} className="btn-gradient">
          <Plus className="h-4 w-4 mr-2" />
          Nueva cita
        </Button>
      </div>

      {!citas?.length ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No hay citas registradas.</p>
            <p className="text-xs mt-1">Haz clic en "Nueva cita" para agregar la primera.</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-primary" /> Próximas
              </h3>
              {upcoming.map(c => (
                <CitaCard key={c.id} cita={c} onEdit={() => setEditCita(c)} onStatusChange={updateEstado} />
              ))}
            </div>
          )}

          {past.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-muted-foreground mt-4">Historial</h3>
              {past.map(c => (
                <CitaCard key={c.id} cita={c} onEdit={() => setEditCita(c)} onStatusChange={updateEstado} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create modal */}
      <CitaFormModal
        open={showForm}
        onOpenChange={setShowForm}
        pacienteId={pacienteId}
        onSuccess={handleSuccess}
      />

      {/* Edit modal */}
      {editCita && (
        <CitaFormModal
          open={!!editCita}
          onOpenChange={(open) => !open && setEditCita(null)}
          pacienteId={pacienteId}
          cita={editCita}
          onSuccess={handleSuccess}
        />
      )}
    </div>
  );
};

interface CitaCardProps {
  cita: Cita;
  onEdit: () => void;
  onStatusChange: (id: string, estado: string) => void;
}

const CitaCard = ({ cita, onEdit, onStatusChange }: CitaCardProps) => {
  const cfg = estadoConfig[cita.estado || 'programada'] || estadoConfig.programada;

  return (
    <Card className="hover:shadow-sm transition-shadow group">
      <CardContent className="py-3 flex items-center justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground text-sm">
            {format(new Date(cita.fecha_hora), "EEEE dd MMM yyyy · HH:mm", { locale: es })}
          </p>
          <p className="text-xs text-muted-foreground">
            {cita.tipo_cita}{cita.duracion_minutos ? ` · ${cita.duracion_minutos} min` : ''}
          </p>
          {cita.notas && <p className="text-xs text-muted-foreground mt-1 truncate">{cita.notas}</p>}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge className={`text-xs ${cfg.color}`}>{cfg.label}</Badge>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7">
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit}>
                <Pencil className="h-3.5 w-3.5 mr-2" /> Editar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(cita.id, 'confirmada')}>
                <CheckCircle className="h-3.5 w-3.5 mr-2" /> Confirmar
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(cita.id, 'completada')}>
                <CheckCircle className="h-3.5 w-3.5 mr-2" /> Completada
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(cita.id, 'no_asistio')}>
                <XCircle className="h-3.5 w-3.5 mr-2" /> No asistió
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onStatusChange(cita.id, 'cancelada')} className="text-destructive">
                <Ban className="h-3.5 w-3.5 mr-2" /> Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpedienteCitas;
