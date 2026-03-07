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
import { Loader2, Save } from 'lucide-react';
import { addDays, differenceInDays, format } from 'date-fns';

interface Props {
  pacienteId: string;
}

const computeFpp = (fur: string): string => {
  try {
    return format(addDays(new Date(fur), 280), 'yyyy-MM-dd');
  } catch {
    return '';
  }
};

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

const ExpedienteGinecologico = ({ pacienteId }: Props) => {
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

  // Auto-calculate FPP when FUR changes
  useEffect(() => {
    if (form.fur) {
      update('fpp', computeFpp(form.fur));
    }
  }, [form.fur]);

  const eg = form.fur ? computeEG(form.fur) : null;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = {
        paciente_id: pacienteId,
        // Ciclo menstrual
        menarca: form.menarca ? Number(form.menarca) : null,
        fur: form.fur || null,
        fpp: form.fpp || null,
        ciclos_regulares: form.ciclos_regulares ?? null,
        descripcion_ciclos: !form.ciclos_regulares ? (form.descripcion_ciclos || null) : null,
        dismenorrea: form.dismenorrea ?? null,
        descripcion_dismenorrea: form.dismenorrea ? (form.descripcion_dismenorrea || null) : null,
        duracion_ciclo: form.duracion_ciclo ? Number(form.duracion_ciclo) : null,
        // Anticoncepción
        usa_anticonceptivo: form.usa_anticonceptivo ?? null,
        cual_anticonceptivo: form.usa_anticonceptivo ? (form.cual_anticonceptivo || null) : null,
        macp: form.macp || null,
        maca: form.maca || null,
        // Historial obstétrico
        ha_estado_embarazada: form.ha_estado_embarazada ?? null,
        gestas: form.ha_estado_embarazada ? (form.gestas ? Number(form.gestas) : 0) : null,
        partos_vaginales: form.ha_estado_embarazada ? (form.partos_vaginales ? Number(form.partos_vaginales) : 0) : null,
        partos: form.ha_estado_embarazada ? (form.partos ? Number(form.partos) : 0) : null,
        cesareas: form.ha_estado_embarazada ? (form.cesareas ? Number(form.cesareas) : 0) : null,
        abortos: form.ha_estado_embarazada ? (form.abortos ? Number(form.abortos) : 0) : null,
        ectopicos: form.ha_estado_embarazada ? (form.ectopicos ? Number(form.ectopicos) : 0) : null,
        otros_embarazos: form.ha_estado_embarazada ? (form.otros_embarazos || null) : null,
        hijos_vivos: form.ha_estado_embarazada ? (form.hijos_vivos ? Number(form.hijos_vivos) : 0) : null,
        pmf: form.pmf || null,
        partos_preterminos: form.partos_preterminos || null,
        complicaciones_embarazos: form.complicaciones_embarazos || null,
        desea_hijos: form.desea_hijos || null,
        // Vida sexual
        vida_sexual_activa: form.vida_sexual_activa ?? null,
        prs_anios: form.prs_anios ? Number(form.prs_anios) : null,
        nps: form.nps ? Number(form.nps) : null,
        num_parejas_sexuales: form.num_parejas_sexuales ? Number(form.num_parejas_sexuales) : null,
        its_previas: form.its_previas || null,
        // Historia clínica
        sugerencias: form.sugerencias || null,
        fecha_proximo_ultrasonido: form.fecha_proximo_ultrasonido || null,
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
      toast({ title: 'Historial ginecológico guardado ✓' });
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
      {/* ── Ciclo Menstrual ── */}
      <SectionCard title="Ciclo Menstrual" icon="📅">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Menarquia (edad)</Label>
            <Input
              type="number"
              value={form.menarca ?? ''}
              onChange={(e) => update('menarca', e.target.value)}
              placeholder="Ej: 12"
              min={8}
              max={20}
            />
          </div>
          <div>
            <Label>FUR (Fecha Última Regla)</Label>
            <Input
              type="date"
              value={form.fur || ''}
              onChange={(e) => update('fur', e.target.value)}
            />
          </div>
          <div>
            <Label>Duración ciclo (días)</Label>
            <Input
              type="number"
              value={form.duracion_ciclo ?? ''}
              onChange={(e) => update('duracion_ciclo', e.target.value)}
              placeholder="Ej: 28"
              min={14}
              max={60}
            />
          </div>
          {eg && (
            <div className="sm:col-span-2 lg:col-span-3">
              <Label>Edad Gestacional (calculada desde FUR)</Label>
              <div className="flex items-center gap-3 mt-1.5">
                <Badge variant="outline" className="text-sm px-3 py-1.5 bg-primary/5 text-primary border-primary/20">
                  🤰 {eg.semanas} semanas y {eg.dias} días
                </Badge>
                {form.fpp && (
                  <Badge variant="outline" className="text-sm px-3 py-1.5 bg-green-50 text-green-700 border-green-200">
                    FPP: {form.fpp}
                  </Badge>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-4 space-y-3">
          {/* Ciclos regulares */}
          <div className="space-y-2">
            <SwitchField
              label="Ciclos regulares"
              checked={form.ciclos_regulares ?? false}
              onChange={(v) => update('ciclos_regulares', v)}
            />
            {form.ciclos_regulares === false && (
              <div className="pl-4 border-l-2 border-primary/20 animate-in fade-in duration-200">
                <Label>Descripción de los ciclos</Label>
                <Textarea
                  value={form.descripcion_ciclos || ''}
                  onChange={(e) => update('descripcion_ciclos', e.target.value)}
                  rows={2}
                  placeholder="Describe la irregularidad del ciclo..."
                />
              </div>
            )}
          </div>

          {/* Dismenorrea */}
          <div className="space-y-2">
            <SwitchField
              label="Dismenorrea"
              checked={form.dismenorrea ?? false}
              onChange={(v) => update('dismenorrea', v)}
            />
            {form.dismenorrea && (
              <div className="pl-4 border-l-2 border-primary/20 animate-in fade-in duration-200">
                <Label>Descripción de la dismenorrea</Label>
                <Textarea
                  value={form.descripcion_dismenorrea || ''}
                  onChange={(e) => update('descripcion_dismenorrea', e.target.value)}
                  rows={2}
                  placeholder="Leve, moderada, severa..."
                />
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Anticoncepción ── */}
      <SectionCard title="Anticoncepción" icon="💊">
        <div className="space-y-4">
          <div className="space-y-2">
            <SwitchField
              label="¿Usa anticonceptivo?"
              checked={form.usa_anticonceptivo ?? false}
              onChange={(v) => update('usa_anticonceptivo', v)}
            />
            {form.usa_anticonceptivo && (
              <div className="pl-4 border-l-2 border-primary/20 animate-in fade-in duration-200">
                <Label>¿Cuál?</Label>
                <Input
                  value={form.cual_anticonceptivo || ''}
                  onChange={(e) => update('cual_anticonceptivo', e.target.value)}
                  placeholder="Ej: Pastillas, DIU, Implante"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>MACP (Método Anticonceptivo Previo)</Label>
              <Input
                value={form.macp || ''}
                onChange={(e) => update('macp', e.target.value)}
                placeholder="Ej: Condón"
              />
            </div>
            <div>
              <Label>MACA (Método Anticonceptivo Actual)</Label>
              <Input
                value={form.maca || ''}
                onChange={(e) => update('maca', e.target.value)}
                placeholder="Ej: T de cobre"
              />
            </div>
          </div>
        </div>
      </SectionCard>

      {/* ── Historial Obstétrico ── */}
      <SectionCard title="Historial Obstétrico" icon="🤰">
        <div className="space-y-4">
          <div className="space-y-2">
            <SwitchField
              label="¿Ha estado embarazada alguna vez?"
              checked={form.ha_estado_embarazada ?? false}
              onChange={(v) => update('ha_estado_embarazada', v)}
            />
            {form.ha_estado_embarazada && (
              <div className="pl-4 border-l-2 border-primary/20 pt-2 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                  {[
                    { field: 'gestas', label: 'Gestas' },
                    { field: 'partos_vaginales', label: 'Partos vag.' },
                    { field: 'cesareas', label: 'Cesáreas' },
                    { field: 'abortos', label: 'Abortos' },
                    { field: 'ectopicos', label: 'Ectópicos' },
                    { field: 'hijos_vivos', label: 'Hijos vivos' },
                  ].map(({ field, label }) => (
                    <div key={field}>
                      <Label className="text-xs">{label}</Label>
                      <Input
                        type="number"
                        min={0}
                        value={form[field] ?? 0}
                        onChange={(e) => update(field, e.target.value)}
                        className="text-center"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <Label>Otros embarazos (especifique)</Label>
                  <Input
                    value={form.otros_embarazos || ''}
                    onChange={(e) => update('otros_embarazos', e.target.value)}
                    placeholder="Ej: Embarazo ectópico, molar"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>PMF (Peso Máximo Fetal)</Label>
              <Input
                value={form.pmf || ''}
                onChange={(e) => update('pmf', e.target.value)}
                placeholder="Ej: 3 kg"
              />
            </div>
            <div>
              <Label>Desea hijos</Label>
              <Select
                value={form.desea_hijos || ''}
                onValueChange={(v) => update('desea_hijos', v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sí">Sí</SelectItem>
                  <SelectItem value="No">No</SelectItem>
                  <SelectItem value="No está segura">No está segura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Partos pretérmino</Label>
            <Textarea
              value={form.partos_preterminos || ''}
              onChange={(e) => update('partos_preterminos', e.target.value)}
              rows={2}
            />
          </div>

          <div>
            <Label>Complicaciones en embarazos</Label>
            <Textarea
              value={form.complicaciones_embarazos || ''}
              onChange={(e) => update('complicaciones_embarazos', e.target.value)}
              rows={2}
            />
          </div>
        </div>
      </SectionCard>

      {/* ── Vida Sexual ── */}
      <SectionCard title="Vida Sexual" icon="❤️">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <Label>PRS (Edad primera relación sexual)</Label>
            <Input
              type="number"
              value={form.prs_anios ?? ''}
              onChange={(e) => update('prs_anios', e.target.value)}
              placeholder="Ej: 18"
              min={10}
              max={60}
            />
          </div>
          <div>
            <Label>NPS (Nº parejas sexuales)</Label>
            <Input
              type="number"
              value={form.nps ?? form.num_parejas_sexuales ?? ''}
              onChange={(e) => {
                update('nps', e.target.value);
                update('num_parejas_sexuales', e.target.value);
              }}
              placeholder="Ej: 2"
              min={0}
            />
          </div>
        </div>
        <div className="mt-3">
          <Label>ITS previas</Label>
          <Input
            value={form.its_previas || ''}
            onChange={(e) => update('its_previas', e.target.value)}
            placeholder="Especifique si aplica"
          />
        </div>
      </SectionCard>

      {/* ── Historia Clínica ── */}
      <SectionCard title="Historia Clínica" icon="📋">
        <div className="space-y-4">
          <div>
            <Label>Sugerencias</Label>
            <Textarea
              value={form.sugerencias || ''}
              onChange={(e) => update('sugerencias', e.target.value)}
              rows={2}
              placeholder="Ej: Control habitual, US sem 32"
            />
          </div>
          <div>
            <Label>Fecha próximo ultrasonido</Label>
            <Input
              type="date"
              value={form.fecha_proximo_ultrasonido || ''}
              onChange={(e) => update('fecha_proximo_ultrasonido', e.target.value)}
            />
          </div>
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="btn-gradient" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Guardar historial ginecológico
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

export default ExpedienteGinecologico;
