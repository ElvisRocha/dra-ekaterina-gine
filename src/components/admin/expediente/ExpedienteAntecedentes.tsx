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
import { toast } from '@/hooks/use-toast';
import {
  Stethoscope, ScanLine, Dumbbell, ShieldCheck,
  Search, Pill, Users, HeartPulse, Save, Loader2,
} from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';

interface Props { pacienteId: string; }

const computeFpp = (fur: string) => { try { return format(addDays(new Date(fur), 280), 'yyyy-MM-dd'); } catch { return ''; } };
const computeEG = (fur: string) => { try { const d = differenceInDays(new Date(), new Date(fur)); if (d < 0) return null; return { semanas: Math.floor(d / 7), dias: d % 7 }; } catch { return null; } };

const ExpedienteAntecedentes = ({ pacienteId }: Props) => {
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

  useEffect(() => { if (form.fur && !form.ultrasonido_acorde) update('fpp', computeFpp(form.fur)); }, [form.fur, form.ultrasonido_acorde]);
  const eg = form.fur ? computeEG(form.fur) : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const p: Record<string, any> = {
        paciente_id: pacienteId,
        padece_enfermedad: form.padece_enfermedad ?? null,
        cual_enfermedad: form.padece_enfermedad ? (form.cual_enfermedad || null) : null,
        toma_medicamentos: form.toma_medicamentos ?? null,
        cual_medicamento: form.toma_medicamentos ? (form.cual_medicamento || null) : null,
        enfermedad_actual: form.enfermedad_actual || null,
        ha_sido_operada: form.ha_sido_operada ?? null,
        de_que_operacion: form.ha_sido_operada ? (form.de_que_operacion || null) : null,
        tiene_ultrasonido: form.tiene_ultrasonido ?? null,
        ultrasonido_acorde: form.tiene_ultrasonido ? (form.ultrasonido_acorde ?? null) : null,
        fpp: form.fpp || null,
        fur: form.fur || null,
        hace_ejercicio: form.hace_ejercicio ?? null,
        fuma: form.fuma ?? null,
        alcohol: form.alcohol ?? null,
        drogas: form.drogas ?? null,
        gardasil: form.gardasil ?? null,
        mamografia: form.mamografia ?? null,
        sinusorragia: form.sinusorragia ?? null,
        flujo_anormal: form.sinusorragia ? (form.flujo_anormal ?? null) : null,
        dispareunia: form.dispareunia ?? null,
        tiene_pareja: form.tiene_pareja ?? null,
        tiempo_con_pareja: form.tiene_pareja ? (form.tiempo_con_pareja || null) : null,
        macp: form.macp || null,
        maca: form.maca || null,
        problemas_anticonceptivos: form.problemas_anticonceptivos || null,
        riesgo: form.riesgo || null,
        antecedentes_familiares: form.antecedentes_familiares || null,
        menopausia: form.menopausia ?? null,
        tvp: form.tvp ?? null,
        ca_mama: form.ca_mama ?? null,
        endom: form.endom ?? null,
        hepatopatia: form.hepatopatia ?? null,
        alergias: form.alergias || null,
        tabaco: form.tabaco ?? null,
      };
      if (expediente?.id) {
        const { error } = await supabase.from('expediente_master').update(p).eq('id', expediente.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('expediente_master').insert(p);
        if (error) throw error;
      }
    },
    onSuccess: () => { toast({ title: 'Antecedentes guardados ✓' }); queryClient.invalidateQueries({ queryKey: ['expediente_master', pacienteId] }); },
    onError: (err: any) => { toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' }); },
  });

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }} className="space-y-3">

      {/* ── Row 1: Antecedentes Patológicos (full width) ── */}
      <Sec title="Antecedentes Patológicos" icon={<Stethoscope className="h-4 w-4" />}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <ToggleCell label="¿Padece alguna enfermedad?" checked={form.padece_enfermedad ?? false} onChange={(v) => update('padece_enfermedad', v)}>
            <Input value={form.cual_enfermedad || ''} onChange={(e) => update('cual_enfermedad', e.target.value)} placeholder="¿Cuál?" className="mt-1.5" />
          </ToggleCell>
          <ToggleCell label="¿Toma algún medicamento?" checked={form.toma_medicamentos ?? false} onChange={(v) => update('toma_medicamentos', v)}>
            <Input value={form.cual_medicamento || ''} onChange={(e) => update('cual_medicamento', e.target.value)} placeholder="¿Cuál?" className="mt-1.5" />
          </ToggleCell>
          <ToggleCell label="¿La han operado?" checked={form.ha_sido_operada ?? false} onChange={(v) => update('ha_sido_operada', v)}>
            <Input value={form.de_que_operacion || ''} onChange={(e) => update('de_que_operacion', e.target.value)} placeholder="¿De qué?" className="mt-1.5" />
          </ToggleCell>
        </div>
        <div className="mt-3">
          <Label className="text-xs text-muted-foreground">Enfermedad actual</Label>
          <Input value={form.enfermedad_actual || ''} onChange={(e) => update('enfermedad_actual', e.target.value)} placeholder="Ej: Dolor Abdominal" className="mt-1" />
        </div>
      </Sec>

      {/* ── Row 2: Ultrasonido | Hábitos | Preventivos ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Sec title="Ultrasonido" icon={<ScanLine className="h-4 w-4" />}>
          <ToggleCell label="¿Tiene ultrasonido?" checked={form.tiene_ultrasonido ?? false} onChange={(v) => update('tiene_ultrasonido', v)}>
            <ToggleCell label="¿Acorde?" checked={form.ultrasonido_acorde ?? false} onChange={(v) => update('ultrasonido_acorde', v)}>
              <span className="text-xs text-muted-foreground italic">Acorde con FUR</span>
            </ToggleCell>
            {!form.ultrasonido_acorde && (
              <div className="space-y-1.5 mt-2">
                <div>
                  <Label className="text-xs text-muted-foreground">FUR</Label>
                  <Input type="date" value={form.fur || ''} onChange={(e) => update('fur', e.target.value)} className="mt-0.5" />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">FPP (auto)</Label>
                  <Input type="date" value={form.fpp || ''} onChange={(e) => update('fpp', e.target.value)} className="mt-0.5" />
                </div>
                {eg && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-primary/5 text-primary border-primary/20 w-full justify-center">
                    {eg.semanas}s {eg.dias}d de gestación
                  </Badge>
                )}
              </div>
            )}
          </ToggleCell>
        </Sec>

        <Sec title="Hábitos" icon={<Dumbbell className="h-4 w-4" />}>
          <div className="grid grid-cols-2 gap-y-3 gap-x-2">
            <SW label="Ejercicio" checked={form.hace_ejercicio ?? false} onChange={(v) => update('hace_ejercicio', v)} />
            <SW label="Fuma" checked={form.fuma ?? false} onChange={(v) => update('fuma', v)} />
            <SW label="OH (Alcohol)" checked={form.alcohol ?? false} onChange={(v) => update('alcohol', v)} />
            <SW label="Drogas" checked={form.drogas ?? false} onChange={(v) => update('drogas', v)} />
          </div>
        </Sec>

        <Sec title="Preventivos" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="space-y-3">
            <SW label="Gardasil (Vacuna VPH)" checked={form.gardasil ?? false} onChange={(v) => update('gardasil', v)} />
            <SW label="MMG (Mamografía)" checked={form.mamografia ?? false} onChange={(v) => update('mamografia', v)} />
          </div>
        </Sec>
      </div>

      {/* ── Row 3: Síntomas | Pareja y Anticoncepción ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Sec title="Síntomas Ginecológicos" icon={<Search className="h-4 w-4" />}>
          <div className="space-y-2">
            <ToggleCell label="Sinusorragia" checked={form.sinusorragia ?? false} onChange={(v) => update('sinusorragia', v)}>
              <SW label="Flujo Anormal" checked={form.flujo_anormal ?? false} onChange={(v) => update('flujo_anormal', v)} />
            </ToggleCell>
            <SW label="Dispareunia (Dolor con el coito)" checked={form.dispareunia ?? false} onChange={(v) => update('dispareunia', v)} />
          </div>
        </Sec>

        <Sec title="Pareja y Anticoncepción" icon={<Pill className="h-4 w-4" />}>
          <div className="space-y-2">
            <ToggleCell label="Tiene pareja actual" checked={form.tiene_pareja ?? false} onChange={(v) => update('tiene_pareja', v)}>
              <Input value={form.tiempo_con_pareja || ''} onChange={(e) => update('tiempo_con_pareja', e.target.value)} placeholder="Tiempo con la pareja (Ej: 2 años)" className="mt-1.5" />
            </ToggleCell>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div>
                <Label className="text-xs text-muted-foreground">MACP (previo)</Label>
                <Input value={form.macp || ''} onChange={(e) => update('macp', e.target.value)} placeholder="Ej: Condón" className="mt-0.5" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">MACA (actual)</Label>
                <Input value={form.maca || ''} onChange={(e) => update('maca', e.target.value)} placeholder="Ej: T de cobre" className="mt-0.5" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Problemas con anticonceptivos</Label>
                <Textarea value={form.problemas_anticonceptivos || ''} onChange={(e) => update('problemas_anticonceptivos', e.target.value)} rows={1} className="mt-0.5 resize-none" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Riesgo</Label>
                <Textarea value={form.riesgo || ''} onChange={(e) => update('riesgo', e.target.value)} rows={1} className="mt-0.5 resize-none" />
              </div>
            </div>
          </div>
        </Sec>
      </div>

      {/* ── Row 4: Antecedentes Familiares | Menopausia ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Sec title="Antecedentes Familiares" icon={<Users className="h-4 w-4" />}>
          <Label className="text-xs text-muted-foreground">Enfermedades importantes en la familia</Label>
          <Textarea value={form.antecedentes_familiares || ''} onChange={(e) => update('antecedentes_familiares', e.target.value)} rows={3} placeholder="Ej: Cáncer de mama, Diabetes, Hipertensión" className="mt-1" />
        </Sec>

        <Sec title="Menopausia y Condiciones" icon={<HeartPulse className="h-4 w-4" />}>
          <div className="space-y-2">
            <SW label="Menopausia" checked={form.menopausia ?? false} onChange={(v) => update('menopausia', v)} />
            {form.menopausia && (
              <div className="pt-1 pl-3 border-l-2 border-primary/20 space-y-1 animate-in fade-in duration-200">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/60 mb-1.5">Condiciones asociadas</p>
                <div className="grid grid-cols-2 gap-y-2">
                  <SW label="TVP" checked={form.tvp ?? false} onChange={(v) => update('tvp', v)} />
                  <SW label="Ca mama" checked={form.ca_mama ?? false} onChange={(v) => update('ca_mama', v)} />
                  <SW label="Endom" checked={form.endom ?? false} onChange={(v) => update('endom', v)} />
                  <SW label="Hepatopatía" checked={form.hepatopatia ?? false} onChange={(v) => update('hepatopatia', v)} />
                </div>
              </div>
            )}
          </div>
        </Sec>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" className="btn-gradient" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Guardar antecedentes
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

const ToggleCell = ({
  label, checked, onChange, children,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void; children: React.ReactNode;
}) => (
  <div>
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm font-medium cursor-pointer select-none" onClick={() => onChange(!checked)}>{label}</span>
      {checked && <Badge className="text-[10px] py-0 px-1 bg-green-100 text-green-700 border-green-200 h-4">Sí</Badge>}
    </div>
    {checked && <div className="mt-1 pl-9 animate-in fade-in duration-150">{children}</div>}
  </div>
);

const SW = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-2">
    <Switch checked={checked} onCheckedChange={onChange} />
    <Label className="text-sm font-medium cursor-pointer" onClick={() => onChange(!checked)}>{label}</Label>
  </div>
);

export default ExpedienteAntecedentes;
