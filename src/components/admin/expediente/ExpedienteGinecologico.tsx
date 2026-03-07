import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import {
  CalendarDays, Pill, Baby, Heart, ClipboardList,
  Loader2, Save,
} from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';

interface Props { pacienteId: string; }

const computeFpp = (fur: string) => { try { return format(addDays(new Date(fur), 280), 'yyyy-MM-dd'); } catch { return ''; } };
const computeEG = (fur: string) => { try { const d = differenceInDays(new Date(), new Date(fur)); if (d < 0) return null; return { semanas: Math.floor(d / 7), dias: d % 7 }; } catch { return null; } };

const ExpedienteGinecologico = ({ pacienteId }: Props) => {
  const queryClient = useQueryClient();
  const { data: expediente, isLoading } = useQuery({
    queryKey: ['expediente_master', pacienteId],
    queryFn: async () => {
      const { data } = await supabase.from('expediente_master').select('*').eq('paciente_id', pacienteId).single();
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, any>>({});
  useEffect(() => { if (expediente) setForm(expediente); }, [expediente]);
  const update = (field: string, value: any) => setForm((p) => ({ ...p, [field]: value }));

  useEffect(() => { if (form.fur) update('fpp', computeFpp(form.fur)); }, [form.fur]);
  const eg = form.fur ? computeEG(form.fur) : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const p: Record<string, any> = {
        paciente_id: pacienteId,
        menarca: form.menarca ? Number(form.menarca) : null,
        fur: form.fur || null,
        fpp: form.fpp || null,
        duracion_ciclo: form.duracion_ciclo ? Number(form.duracion_ciclo) : null,
        ciclos_regulares: form.ciclos_regulares ?? null,
        descripcion_ciclos: !form.ciclos_regulares ? (form.descripcion_ciclos || null) : null,
        dismenorrea: form.dismenorrea ?? null,
        descripcion_dismenorrea: form.dismenorrea ? (form.descripcion_dismenorrea || null) : null,
        usa_anticonceptivo: form.usa_anticonceptivo ?? null,
        cual_anticonceptivo: form.usa_anticonceptivo ? (form.cual_anticonceptivo || null) : null,
        macp: form.macp || null,
        maca: form.maca || null,
        ha_estado_embarazada: form.ha_estado_embarazada ?? null,
        gestas: form.ha_estado_embarazada ? (Number(form.gestas) || 0) : null,
        partos_vaginales: form.ha_estado_embarazada ? (Number(form.partos_vaginales) || 0) : null,
        partos: form.ha_estado_embarazada ? (Number(form.partos) || 0) : null,
        cesareas: form.ha_estado_embarazada ? (Number(form.cesareas) || 0) : null,
        abortos: form.ha_estado_embarazada ? (Number(form.abortos) || 0) : null,
        ectopicos: form.ha_estado_embarazada ? (Number(form.ectopicos) || 0) : null,
        hijos_vivos: form.ha_estado_embarazada ? (Number(form.hijos_vivos) || 0) : null,
        otros_embarazos: form.ha_estado_embarazada ? (form.otros_embarazos || null) : null,
        pmf: form.pmf || null,
        desea_hijos: form.desea_hijos || null,
        partos_preterminos: form.partos_preterminos || null,
        complicaciones_embarazos: form.complicaciones_embarazos || null,
        vida_sexual_activa: form.vida_sexual_activa ?? null,
        prs_anios: form.prs_anios ? Number(form.prs_anios) : null,
        nps: form.nps ? Number(form.nps) : null,
        num_parejas_sexuales: form.nps ? Number(form.nps) : null,
        its_previas: form.its_previas || null,
        sugerencias: form.sugerencias || null,
        fecha_proximo_ultrasonido: form.fecha_proximo_ultrasonido || null,
      };
      if (expediente?.id) {
        const { error } = await supabase.from('expediente_master').update(p).eq('id', expediente.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('expediente_master').insert(p);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast({ title: 'Historial ginecológico guardado ✓' }); queryClient.invalidateQueries({ queryKey: ['expediente_master', pacienteId] }); },
    onError: (err: any) => { toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' }); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-3">

      {/* ── Row 1: Ciclo Menstrual (full width) ── */}
      <Sec title="Ciclo Menstrual" icon={<CalendarDays className="h-4 w-4" />}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <Label className="text-xs text-muted-foreground">Menarquia (edad)</Label>
            <Input type="number" value={form.menarca ?? ''} onChange={(e) => update('menarca', e.target.value)} placeholder="12" min={8} max={20} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">FUR (Fecha Última Regla)</Label>
            <Input type="date" value={form.fur || ''} onChange={(e) => update('fur', e.target.value)} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Duración ciclo (días)</Label>
            <Input type="number" value={form.duracion_ciclo ?? ''} onChange={(e) => update('duracion_ciclo', e.target.value)} placeholder="28" min={14} max={60} className="mt-1" />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">FPP / Edad Gestacional</Label>
            <div className="mt-1 space-y-1">
              {form.fpp
                ? <Badge variant="outline" className="text-xs px-2 py-1 bg-green-50 text-green-700 border-green-200 w-full justify-center">FPP: {form.fpp}</Badge>
                : <span className="text-xs text-muted-foreground">—</span>}
              {eg && <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/5 text-primary border-primary/20 w-full justify-center">{eg.semanas}s {eg.dias}d de gest.</Badge>}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
          <div className="space-y-1.5">
            <SW label="Ciclos regulares" checked={form.ciclos_regulares ?? false} onChange={(v) => update('ciclos_regulares', v)} />
            {form.ciclos_regulares === false && (
              <div className="pl-9 animate-in fade-in duration-150">
                <Textarea value={form.descripcion_ciclos || ''} onChange={(e) => update('descripcion_ciclos', e.target.value)} rows={1} placeholder="Describe la irregularidad..." className="resize-none" />
              </div>
            )}
          </div>
          <div className="space-y-1.5">
            <SW label="Dismenorrea" checked={form.dismenorrea ?? false} onChange={(v) => update('dismenorrea', v)} />
            {form.dismenorrea && (
              <div className="pl-9 animate-in fade-in duration-150">
                <Textarea value={form.descripcion_dismenorrea || ''} onChange={(e) => update('descripcion_dismenorrea', e.target.value)} rows={1} placeholder="Leve, moderada, severa..." className="resize-none" />
              </div>
            )}
          </div>
        </div>
      </Sec>

      {/* ── Row 2: Anticoncepción | Historial Obstétrico ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Sec title="Anticoncepción" icon={<Pill className="h-4 w-4" />}>
          <div className="space-y-2">
            <div>
              <SW label="¿Usa anticonceptivo?" checked={form.usa_anticonceptivo ?? false} onChange={(v) => update('usa_anticonceptivo', v)} />
              {form.usa_anticonceptivo && (
                <div className="pl-9 mt-1 animate-in fade-in duration-150">
                  <Input value={form.cual_anticonceptivo || ''} onChange={(e) => update('cual_anticonceptivo', e.target.value)} placeholder="¿Cuál? Ej: Pastillas, DIU" />
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">MACP (previo)</Label>
                <Input value={form.macp || ''} onChange={(e) => update('macp', e.target.value)} placeholder="Ej: Condón" className="mt-0.5" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">MACA (actual)</Label>
                <Input value={form.maca || ''} onChange={(e) => update('maca', e.target.value)} placeholder="Ej: T de cobre" className="mt-0.5" />
              </div>
            </div>
          </div>
        </Sec>

        <Sec title="Historial Obstétrico" icon={<Baby className="h-4 w-4" />}>
          <div className="space-y-2">
            <SW label="¿Ha estado embarazada alguna vez?" checked={form.ha_estado_embarazada ?? false} onChange={(v) => update('ha_estado_embarazada', v)} />
            {form.ha_estado_embarazada && (
              <div className="pl-9 animate-in fade-in duration-150 space-y-2">
                <div className="grid grid-cols-6 gap-1.5">
                  {[
                    { f: 'gestas', l: 'G' }, { f: 'partos_vaginales', l: 'PV' },
                    { f: 'cesareas', l: 'C' }, { f: 'abortos', l: 'A' },
                    { f: 'ectopicos', l: 'E' }, { f: 'hijos_vivos', l: 'HV' },
                  ].map(({ f, l }) => (
                    <div key={f} className="text-center">
                      <Label className="text-[10px] text-muted-foreground block">{l}</Label>
                      <Input type="number" min={0} value={form[f] ?? 0} onChange={(e) => update(f, e.target.value)} className="text-center px-1 mt-0.5" />
                    </div>
                  ))}
                </div>
                <Input value={form.otros_embarazos || ''} onChange={(e) => update('otros_embarazos', e.target.value)} placeholder="Otros (molar, ectópico…)" />
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">PMF (Peso Máx. Fetal)</Label>
                <Input value={form.pmf || ''} onChange={(e) => update('pmf', e.target.value)} placeholder="Ej: 3 kg" className="mt-0.5" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Desea hijos</Label>
                <Select value={form.desea_hijos || ''} onValueChange={(v) => update('desea_hijos', v)}>
                  <SelectTrigger className="mt-0.5"><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sí">Sí</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                    <SelectItem value="No está segura">No está segura</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Partos pretérmino</Label>
                <Textarea value={form.partos_preterminos || ''} onChange={(e) => update('partos_preterminos', e.target.value)} rows={1} className="mt-0.5 resize-none" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Complicaciones</Label>
                <Textarea value={form.complicaciones_embarazos || ''} onChange={(e) => update('complicaciones_embarazos', e.target.value)} rows={1} className="mt-0.5 resize-none" />
              </div>
            </div>
          </div>
        </Sec>
      </div>

      {/* ── Row 3: Vida Sexual | Historia Clínica ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Sec title="Vida Sexual" icon={<Heart className="h-4 w-4" />}>
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">PRS (edad 1ª relación)</Label>
                <Input type="number" value={form.prs_anios ?? ''} onChange={(e) => update('prs_anios', e.target.value)} placeholder="18" min={10} max={60} className="mt-0.5" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">NPS (nº parejas)</Label>
                <Input type="number" value={form.nps ?? form.num_parejas_sexuales ?? ''} onChange={(e) => { update('nps', e.target.value); update('num_parejas_sexuales', e.target.value); }} placeholder="2" min={0} className="mt-0.5" />
              </div>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">ITS previas</Label>
              <Input value={form.its_previas || ''} onChange={(e) => update('its_previas', e.target.value)} placeholder="Especifique si aplica" className="mt-0.5" />
            </div>
          </div>
        </Sec>

        <Sec title="Historia Clínica" icon={<ClipboardList className="h-4 w-4" />}>
          <div className="space-y-2">
            <div>
              <Label className="text-xs text-muted-foreground">Sugerencias</Label>
              <Textarea value={form.sugerencias || ''} onChange={(e) => update('sugerencias', e.target.value)} rows={2} placeholder="Ej: Control habitual, US sem 32" className="mt-0.5 resize-none" />
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Fecha próximo ultrasonido</Label>
              <Input type="date" value={form.fecha_proximo_ultrasonido || ''} onChange={(e) => update('fecha_proximo_ultrasonido', e.target.value)} className="mt-0.5" />
            </div>
          </div>
        </Sec>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" className="btn-gradient" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Guardar historial ginecológico
        </Button>
      </div>
    </form>
  );
};

// ─── Micro-components ──────────────────────────────────────────────────────

const Sec = ({
  title, icon, children,
}: {
  title: string; icon: React.ReactNode; children: React.ReactNode;
}) => (
  <Card className="border border-border/60 shadow-sm">
    <CardHeader className="pb-2 pt-3 px-4">
      <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
        <span className="text-primary">{icon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-4 pb-4">{children}</CardContent>
  </Card>
);

const SW = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-2">
    <Switch checked={checked} onCheckedChange={onChange} />
    <Label className="text-sm font-medium cursor-pointer" onClick={() => onChange(!checked)}>{label}</Label>
  </div>
);

export default ExpedienteGinecologico;
