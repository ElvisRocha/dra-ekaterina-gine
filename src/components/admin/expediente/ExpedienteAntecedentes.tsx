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
import { Loader2, Save, AlertCircle } from 'lucide-react';
import { addDays, differenceInWeeks, differenceInDays, format } from 'date-fns';

interface Props {
  pacienteId: string;
}

// Helper to compute FPP (FUR + 280 days)
const computeFpp = (fur: string): string => {
  try {
    return format(addDays(new Date(fur), 280), 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

// Helper to compute gestational age
const computeEG = (fur: string): { semanas: number; dias: number } | null => {
  try {
    const furDate = new Date(fur);
    const today = new Date();
    const totalDays = differenceInDays(today, furDate);
    if (totalDays < 0) return null;
    return { semanas: Math.floor(totalDays / 7), dias: totalDays % 7 };
  } catch {
    return null;
  }
};

const ExpedienteAntecedentes = ({ pacienteId }: Props) => {
  const queryClient = useQueryClient();

  const { data: expediente, isLoading } = useQuery({
    queryKey: ['expediente_master', pacienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from('expediente_master')
        .select('*')
        .eq('paciente_id', pacienteId)
        .single();
      return data;
    },
  });

  const [form, setForm] = useState<Record<string, any>>({});

  useEffect(() => {
    if (expediente) setForm(expediente);
  }, [expediente]);

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // Auto-calculate FPP when FUR changes and ultrasonido_acorde is false (or no ultrasound)
  useEffect(() => {
    if (form.fur && !form.ultrasonido_acorde) {
      update('fpp', computeFpp(form.fur));
    }
  }, [form.fur, form.ultrasonido_acorde]);

  const eg = form.fur ? computeEG(form.fur) : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = {
        paciente_id: pacienteId,
        // Patológicos
        padece_enfermedad: form.padece_enfermedad ?? null,
        cual_enfermedad: form.padece_enfermedad ? (form.cual_enfermedad || null) : null,
        toma_medicamentos: form.toma_medicamentos ?? null,
        cual_medicamento: form.toma_medicamentos ? (form.cual_medicamento || null) : null,
        enfermedad_actual: form.enfermedad_actual || null,
        ha_sido_operada: form.ha_sido_operada ?? null,
        de_que_operacion: form.ha_sido_operada ? (form.de_que_operacion || null) : null,
        // Ultrasonido
        tiene_ultrasonido: form.tiene_ultrasonido ?? null,
        ultrasonido_acorde: form.tiene_ultrasonido ? (form.ultrasonido_acorde ?? null) : null,
        fpp: form.fpp || null,
        // Hábitos
        hace_ejercicio: form.hace_ejercicio ?? null,
        fuma: form.fuma ?? null,
        alcohol: form.alcohol ?? null,
        drogas: form.drogas ?? null,
        // Preventivos
        gardasil: form.gardasil ?? null,
        mamografia: form.mamografia ?? null,
        // Síntomas
        sinusorragia: form.sinusorragia ?? null,
        flujo_anormal: form.sinusorragia ? (form.flujo_anormal ?? null) : null,
        dispareunia: form.dispareunia ?? null,
        // Pareja y anticoncepción
        tiene_pareja: form.tiene_pareja ?? null,
        tiempo_con_pareja: form.tiene_pareja ? (form.tiempo_con_pareja || null) : null,
        macp: form.macp || null,
        maca: form.maca || null,
        problemas_anticonceptivos: form.problemas_anticonceptivos || null,
        riesgo: form.riesgo || null,
        // Antecedentes familiares
        antecedentes_familiares: form.antecedentes_familiares || null,
        // Menopausia y condiciones
        menopausia: form.menopausia ?? null,
        tvp: form.tvp ?? null,
        ca_mama: form.ca_mama ?? null,
        endom: form.endom ?? null,
        hepatopatia: form.hepatopatia ?? null,
        // Keep existing fields
        alergias: form.alergias || null,
        enfermedades_cronicas: form.enfermedades_cronicas || null,
        cirugias_previas: form.cirugias_previas || null,
        medicamentos_actuales: form.medicamentos_actuales || null,
        tabaco: form.tabaco ?? null,
        ejercicio: form.ejercicio || null,
        fur: form.fur || null,
      };

      if (expediente?.id) {
        const { error } = await supabase.from('expediente_master').update(payload).eq('id', expediente.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('expediente_master').insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      toast({ title: 'Antecedentes guardados ✓' });
      queryClient.invalidateQueries({ queryKey: ['expediente_master', pacienteId] });
    },
    onError: (err: any) => {
      toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-5"
    >
      {/* ── Antecedentes Patológicos ── */}
      <SectionCard title="Antecedentes Patológicos" icon="🏥">
        <div className="space-y-4">
          {/* Padece enfermedad */}
          <ConditionalToggle
            label="¿Padece alguna enfermedad?"
            checked={form.padece_enfermedad ?? false}
            onChange={(v) => update('padece_enfermedad', v)}
          >
            <FieldRow>
              <div className="flex-1">
                <Label>¿Cuál/es?</Label>
                <Input
                  value={form.cual_enfermedad || ''}
                  onChange={(e) => update('cual_enfermedad', e.target.value)}
                  placeholder="Ej: Diabetes, Hipertensión"
                />
              </div>
            </FieldRow>
          </ConditionalToggle>

          {/* Toma medicamentos */}
          <ConditionalToggle
            label="¿Toma algún medicamento actualmente?"
            checked={form.toma_medicamentos ?? false}
            onChange={(v) => update('toma_medicamentos', v)}
          >
            <FieldRow>
              <div className="flex-1">
                <Label>¿Cuál/es?</Label>
                <Input
                  value={form.cual_medicamento || ''}
                  onChange={(e) => update('cual_medicamento', e.target.value)}
                  placeholder="Ej: Metformina, Losartán"
                />
              </div>
            </FieldRow>
          </ConditionalToggle>

          {/* Ha sido operada */}
          <ConditionalToggle
            label="¿La han operado de algo?"
            checked={form.ha_sido_operada ?? false}
            onChange={(v) => update('ha_sido_operada', v)}
          >
            <FieldRow>
              <div className="flex-1">
                <Label>¿De qué?</Label>
                <Input
                  value={form.de_que_operacion || ''}
                  onChange={(e) => update('de_que_operacion', e.target.value)}
                  placeholder="Ej: Apendicitis, Cesárea"
                />
              </div>
            </FieldRow>
          </ConditionalToggle>

          {/* Enfermedad actual */}
          <div>
            <Label>Enfermedad actual</Label>
            <Input
              value={form.enfermedad_actual || ''}
              onChange={(e) => update('enfermedad_actual', e.target.value)}
              placeholder="Ej: Dolor Abdominal"
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Ultrasonido ── */}
      <SectionCard title="Ultrasonido" icon="🔊">
        <div className="space-y-4">
          <ConditionalToggle
            label="¿Tiene ultrasonido?"
            checked={form.tiene_ultrasonido ?? false}
            onChange={(v) => update('tiene_ultrasonido', v)}
          >
            <ConditionalToggle
              label="¿Está acorde?"
              checked={form.ultrasonido_acorde ?? false}
              onChange={(v) => update('ultrasonido_acorde', v)}
            >
              {/* acorde = true — no need to show FPP correction */}
              <p className="text-sm text-muted-foreground italic">Ultrasonido acorde con FUR.</p>
            </ConditionalToggle>

            {/* If NOT acorde or not set, show FPP editable */}
            {form.tiene_ultrasonido && !form.ultrasonido_acorde && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>FUR (Fecha Última Regla)</Label>
                  <Input
                    type="date"
                    value={form.fur || ''}
                    onChange={(e) => update('fur', e.target.value)}
                  />
                </div>
                <div>
                  <Label>FPP (Fecha Probable de Parto)</Label>
                  <Input
                    type="date"
                    value={form.fpp || ''}
                    onChange={(e) => update('fpp', e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-calculada: FUR + 280 días</p>
                </div>
                {eg && (
                  <div className="sm:col-span-2">
                    <Label>Edad Gestacional</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-sm px-3 py-1 bg-primary/5 text-primary border-primary/20">
                        {eg.semanas} semanas y {eg.dias} días
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ConditionalToggle>
        </div>
      </SectionCard>

      {/* ── Hábitos ── */}
      <SectionCard title="Hábitos" icon="💪">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <SwitchField label="Ejercicio" checked={form.hace_ejercicio ?? false} onChange={(v) => update('hace_ejercicio', v)} />
          <SwitchField label="Fuma" checked={form.fuma ?? false} onChange={(v) => update('fuma', v)} />
          <SwitchField label="OH (Alcohol)" checked={form.alcohol ?? false} onChange={(v) => update('alcohol', v)} />
          <SwitchField label="Drogas" checked={form.drogas ?? false} onChange={(v) => update('drogas', v)} />
        </div>
      </SectionCard>

      {/* ── Preventivos ── */}
      <SectionCard title="Preventivos" icon="💉">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <SwitchField label="Gardasil (Vacuna VPH)" checked={form.gardasil ?? false} onChange={(v) => update('gardasil', v)} />
          <SwitchField label="MMG (Mamografía)" checked={form.mamografia ?? false} onChange={(v) => update('mamografia', v)} />
        </div>
      </SectionCard>

      {/* ── Síntomas Ginecológicos ── */}
      <SectionCard title="Síntomas Ginecológicos" icon="🔍">
        <div className="space-y-4">
          <ConditionalToggle
            label="Sinusorragia"
            checked={form.sinusorragia ?? false}
            onChange={(v) => update('sinusorragia', v)}
          >
            <SwitchField label="Flujo Anormal" checked={form.flujo_anormal ?? false} onChange={(v) => update('flujo_anormal', v)} />
          </ConditionalToggle>
          <SwitchField label="Dispareunia (Dolor con el coito)" checked={form.dispareunia ?? false} onChange={(v) => update('dispareunia', v)} />
        </div>
      </SectionCard>

      {/* ── Pareja y Anticoncepción ── */}
      <SectionCard title="Pareja y Anticoncepción" icon="💊">
        <div className="space-y-4">
          <ConditionalToggle
            label="Tiene pareja actual"
            checked={form.tiene_pareja ?? false}
            onChange={(v) => update('tiene_pareja', v)}
          >
            <FieldRow>
              <div className="flex-1">
                <Label>Tiempo con la pareja</Label>
                <Input
                  value={form.tiempo_con_pareja || ''}
                  onChange={(e) => update('tiempo_con_pareja', e.target.value)}
                  placeholder="Ej: 6 meses, 2 años"
                />
              </div>
            </FieldRow>
          </ConditionalToggle>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>MACP (Método Anticonceptivo Previo)</Label>
              <Input
                value={form.macp || ''}
                onChange={(e) => update('macp', e.target.value)}
                placeholder="Ej: Condón, Pastillas"
              />
            </div>
            <div>
              <Label>MACA (Método Anticonceptivo Actual)</Label>
              <Input
                value={form.maca || ''}
                onChange={(e) => update('maca', e.target.value)}
                placeholder="Ej: T de cobre, Implante"
              />
            </div>
          </div>

          <div>
            <Label>Problemas con anticonceptivos</Label>
            <Textarea
              value={form.problemas_anticonceptivos || ''}
              onChange={(e) => update('problemas_anticonceptivos', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>Riesgo</Label>
            <Textarea
              value={form.riesgo || ''}
              onChange={(e) => update('riesgo', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Antecedentes Familiares ── */}
      <SectionCard title="Antecedentes Familiares" icon="👨‍👩‍👧">
        <div>
          <Label>Enfermedades importantes en la familia</Label>
          <Textarea
            value={form.antecedentes_familiares || ''}
            onChange={(e) => update('antecedentes_familiares', e.target.value)}
            rows={3}
            placeholder="Ej: Cáncer de mama, Diabetes, Hipertensión"
          />
        </div>
      </SectionCard>

      {/* ── Menopausia y Condiciones de Riesgo ── */}
      <SectionCard title="Menopausia y Condiciones" icon="⚕️">
        <div className="space-y-4">
          <SwitchField label="Menopausia" checked={form.menopausia ?? false} onChange={(v) => update('menopausia', v)} />
          {form.menopausia && (
            <div className="pl-4 border-l-2 border-primary/20 space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Condiciones asociadas a menopausia</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <SwitchField label="TVP" checked={form.tvp ?? false} onChange={(v) => update('tvp', v)} />
                <SwitchField label="Ca mama" checked={form.ca_mama ?? false} onChange={(v) => update('ca_mama', v)} />
                <SwitchField label="Endom" checked={form.endom ?? false} onChange={(v) => update('endom', v)} />
                <SwitchField label="Hepatopatía" checked={form.hepatopatia ?? false} onChange={(v) => update('hepatopatia', v)} />
              </div>
            </div>
          )}
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="btn-gradient" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Guardar antecedentes
        </Button>
      </div>
    </form>
  );
};

// ─── Reusable sub-components ────────────────────────────────────────────────

const SectionCard = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon: string;
  children: React.ReactNode;
}) => (
  <Card className="border border-border/60 shadow-sm">
    <CardHeader className="pb-3 pt-4 px-5">
      <CardTitle className="text-sm font-semibold flex items-center gap-2 text-foreground">
        <span className="text-base">{icon}</span>
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="px-5 pb-5">{children}</CardContent>
  </Card>
);

const FieldRow = ({ children }: { children: React.ReactNode }) => (
  <div className="flex gap-3 mt-2 pl-4 border-l-2 border-primary/20">{children}</div>
);

const ConditionalToggle = ({
  label,
  checked,
  onChange,
  children,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    <SwitchField label={label} checked={checked} onChange={onChange} />
    {checked && (
      <div className="pl-4 border-l-2 border-primary/20 pt-1 space-y-2 animate-in fade-in duration-200">
        {children}
      </div>
    )}
  </div>
);

const SwitchField = ({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) => (
  <div className="flex items-center gap-2.5">
    <Switch checked={checked} onCheckedChange={onChange} />
    <Label
      className="cursor-pointer text-sm font-medium"
      onClick={() => onChange(!checked)}
    >
      {label}
    </Label>
    {checked && (
      <Badge variant="secondary" className="text-xs py-0 px-1.5 bg-green-100 text-green-700 border-green-200">
        Sí
      </Badge>
    )}
  </div>
);

export default ExpedienteAntecedentes;
