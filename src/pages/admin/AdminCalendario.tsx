import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  format, startOfDay, endOfDay, startOfWeek, endOfWeek,
  addDays, addWeeks, subDays, subWeeks, isSameDay, isToday,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';

const HOURS = Array.from({ length: 13 }, (_, i) => i + 7); // 7:00 - 19:00

const estadoConfig: Record<string, { color: string; label: string }> = {
  programada: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Programada' },
  confirmada: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Confirmada' },
  completada: { color: 'bg-muted text-muted-foreground border-border', label: 'Completada' },
  cancelada: { color: 'bg-destructive/10 text-destructive border-destructive/20', label: 'Cancelada' },
  no_asistio: { color: 'bg-orange-100 text-orange-800 border-orange-200', label: 'No asistió' },
};

const AdminCalendario = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<'dia' | 'semana'>('dia');
  const [currentDate, setCurrentDate] = useState(new Date());

  const rangeStart = view === 'dia'
    ? startOfDay(currentDate)
    : startOfWeek(currentDate, { weekStartsOn: 1 });
  const rangeEnd = view === 'dia'
    ? endOfDay(currentDate)
    : endOfWeek(currentDate, { weekStartsOn: 1 });

  const { data: citas, isLoading } = useQuery({
    queryKey: ['agenda_citas', rangeStart.toISOString(), rangeEnd.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('citas')
        .select('*, pacientes(id, primer_nombre, primer_apellido)')
        .gte('fecha_hora', rangeStart.toISOString())
        .lte('fecha_hora', rangeEnd.toISOString())
        .order('fecha_hora', { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const goToday = () => setCurrentDate(new Date());
  const goPrev = () => setCurrentDate(d => view === 'dia' ? subDays(d, 1) : subWeeks(d, 1));
  const goNext = () => setCurrentDate(d => view === 'dia' ? addDays(d, 1) : addWeeks(d, 1));

  const weekDays = view === 'semana'
    ? Array.from({ length: 6 }, (_, i) => addDays(startOfWeek(currentDate, { weekStartsOn: 1 }), i))
    : [currentDate];

  const getCitasForDayHour = (day: Date, hour: number) => {
    return citas?.filter(c => {
      const dt = new Date(c.fecha_hora);
      return isSameDay(dt, day) && dt.getHours() === hour;
    }) ?? [];
  };

  const citasForDay = (day: Date) =>
    citas?.filter(c => isSameDay(new Date(c.fecha_hora), day)) ?? [];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <h2 className="text-2xl font-display text-foreground">Agenda</h2>
        <div className="flex items-center gap-2">
          <Tabs value={view} onValueChange={v => setView(v as 'dia' | 'semana')}>
            <TabsList>
              <TabsTrigger value="dia">Día</TabsTrigger>
              <TabsTrigger value="semana">Semana</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={goNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToday}>Hoy</Button>
        </div>
        <h3 className="text-lg font-medium text-foreground">
          {view === 'dia'
            ? format(currentDate, "EEEE, dd 'de' MMMM yyyy", { locale: es })
            : `${format(rangeStart, "dd MMM", { locale: es })} — ${format(rangeEnd, "dd MMM yyyy", { locale: es })}`
          }
        </h3>
        <div className="text-sm text-muted-foreground">
          {citas?.length ?? 0} cita{(citas?.length ?? 0) !== 1 ? 's' : ''}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      ) : view === 'dia' ? (
        /* Day view - time slots */
        <Card>
          <CardContent className="p-0">
            {HOURS.map(hour => {
              const hourCitas = getCitasForDayHour(currentDate, hour);
              return (
                <div key={hour} className="flex border-b border-border last:border-0 min-h-[3.5rem]">
                  <div className="w-16 shrink-0 p-2 text-xs text-muted-foreground font-mono border-r border-border flex items-start justify-end">
                    {`${hour}:00`}
                  </div>
                  <div className="flex-1 p-1 space-y-1">
                    {hourCitas.map((cita: any) => {
                      const cfg = estadoConfig[cita.estado || 'programada'] || estadoConfig.programada;
                      return (
                        <div
                          key={cita.id}
                          className={`rounded-md border px-3 py-2 cursor-pointer hover:shadow-sm transition-shadow ${cfg.color}`}
                          onClick={() => cita.pacientes?.id && navigate(`/admin/pacientes/${cita.pacientes.id}`)}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <Clock className="h-3 w-3 shrink-0" />
                              <span className="text-xs font-mono">{format(new Date(cita.fecha_hora), 'HH:mm')}</span>
                              <span className="text-sm font-medium truncate">
                                {cita.pacientes
                                  ? `${cita.pacientes.primer_nombre} ${cita.pacientes.primer_apellido}`
                                  : 'Sin paciente'}
                              </span>
                            </div>
                            <span className="text-xs shrink-0">{cita.tipo_cita}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      ) : (
        /* Week view */
        <div className="grid grid-cols-6 gap-2">
          {weekDays.map(day => {
            const dayCitas = citasForDay(day);
            const today = isToday(day);
            return (
              <Card key={day.toISOString()} className={today ? 'ring-2 ring-primary/30' : ''}>
                <div className={`px-3 py-2 border-b border-border text-center ${today ? 'bg-primary/5' : ''}`}>
                  <p className="text-xs text-muted-foreground uppercase">{format(day, 'EEE', { locale: es })}</p>
                  <p className={`text-lg font-bold ${today ? 'text-primary' : 'text-foreground'}`}>{format(day, 'd')}</p>
                </div>
                <CardContent className="p-2 space-y-1.5 min-h-[8rem]">
                  {dayCitas.length === 0 && (
                    <p className="text-xs text-muted-foreground text-center pt-4">Sin citas</p>
                  )}
                  {dayCitas.map((cita: any) => {
                    const cfg = estadoConfig[cita.estado || 'programada'] || estadoConfig.programada;
                    return (
                      <div
                        key={cita.id}
                        className={`rounded border px-2 py-1.5 cursor-pointer hover:shadow-sm transition-shadow text-xs ${cfg.color}`}
                        onClick={() => cita.pacientes?.id && navigate(`/admin/pacientes/${cita.pacientes.id}`)}
                      >
                        <p className="font-mono font-medium">{format(new Date(cita.fecha_hora), 'HH:mm')}</p>
                        <p className="truncate font-medium">
                          {cita.pacientes
                            ? `${cita.pacientes.primer_nombre} ${cita.pacientes.primer_apellido}`
                            : 'Sin paciente'}
                        </p>
                        <p className="truncate text-[10px] opacity-80">{cita.tipo_cita}</p>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminCalendario;
