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
import { Loader2, Save, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { differenceInMonths } from 'date-fns';

interface Props {
  pacienteId: string;
}

const ExpedienteCitologia = ({ pacienteId }: Props) => {
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

  // Check if pap is overdue (>12 months)
  const papOverdue = form.fecha_ultima_citologia
    ? differenceInMonths(new Date(), new Date(form.fecha_ultima_citologia)) > 12
    : false;

  const mutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, any> = {
        paciente_id: pacienteId,
        se_ha_hecho_citologia: form.se_ha_hecho_citologia ?? null,
        fecha_ultima_citologia: form.se_ha_hecho_citologia ? (form.fecha_ultima_citologia || null) : null,
        citologia_alterada: form.se_ha_hecho_citologia ? (form.citologia_alterada ?? null) : null,
        descripcion_citologia_alterada: form.citologia_alterada ? (form.descripcion_citologia_alterada || null) : null,
        tratada_con: form.citologia_alterada ? (form.tratada_con || null) : null,
        prueba_vph_realizada: form.prueba_vph_realizada ?? null,
        vph_positivo: form.prueba_vph_realizada ? (form.vph_positivo ?? null) : null,
        resultado_papanicolaou: form.resultado_papanicolaou || null,
        ultimo_papanicolaou: form.fecha_ultima_citologia || null,
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
      toast({ title: 'Citología y VPH guardados ✓' });
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
      {/* ── Alerta si PAP atrasado ── */}
      {papOverdue && (
        <div className="flex items-start gap-3 p-4 rounded-lg bg-amber-50 border border-amber-200 text-amber-800">
          <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-medium text-sm">Citología atrasada</p>
            <p className="text-xs mt-0.5">La última citología fue hace más de 12 meses. Se recomienda actualizar.</p>
          </div>
        </div>
      )}

      {/* ── Citología / Papanicolaou ── */}
      <SectionCard title="Citología (Papanicolaou)" icon="🔬">
        <div className="space-y-4">
          <div className="space-y-2">
            <SwitchField
              label="¿Se ha hecho citología (Papanicolaou) alguna vez?"
              checked={form.se_ha_hecho_citologia ?? false}
              onChange={(v) => update('se_ha_hecho_citologia', v)}
            />

            {form.se_ha_hecho_citologia && (
              <div className="pl-4 border-l-2 border-primary/20 pt-2 space-y-4 animate-in fade-in duration-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>¿Cuándo fue la última citología?</Label>
                    <Input
                      type="date"
                      value={form.fecha_ultima_citologia || ''}
                      onChange={(e) => update('fecha_ultima_citologia', e.target.value)}
                    />
                    {form.fecha_ultima_citologia && !papOverdue && (
                      <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Al día
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Resultado de citología normal</Label>
                    <Input
                      value={form.resultado_papanicolaou || ''}
                      onChange={(e) => update('resultado_papanicolaou', e.target.value)}
                      placeholder="Ej: Normal, ASCUS"
                    />
                  </div>
                </div>

                {/* Citología alterada */}
                <div className="space-y-2">
                  <SwitchField
                    label="¿Alguna citología salió alterada?"
                    checked={form.citologia_alterada ?? false}
                    onChange={(v) => update('citologia_alterada', v)}
                  />
                  {form.citologia_alterada && (
                    <div className="pl-4 border-l-2 border-amber-300 pt-2 space-y-3 animate-in fade-in duration-200">
                      <div>
                        <Label>Descripción de la citología alterada</Label>
                        <div className="flex gap-2 mt-1.5 flex-wrap">
                          {['Displasia Leve', 'Displasia Moderada', 'Displasia Severa', 'ASCUS', 'AGUS', 'Otro'].map(
                            (opt) => (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => update('descripcion_citologia_alterada', opt)}
                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                                  form.descripcion_citologia_alterada === opt
                                    ? 'bg-primary text-primary-foreground border-primary'
                                    : 'bg-background border-border hover:border-primary/50'
                                }`}
                              >
                                {opt}
                              </button>
                            )
                          )}
                        </div>
                        <Input
                          className="mt-2"
                          value={form.descripcion_citologia_alterada || ''}
                          onChange={(e) => update('descripcion_citologia_alterada', e.target.value)}
                          placeholder="O escriba libremente..."
                        />
                      </div>

                      <div>
                        <Label>Tratada con</Label>
                        <Textarea
                          value={form.tratada_con || ''}
                          onChange={(e) => update('tratada_con', e.target.value)}
                          rows={2}
                          placeholder="Ej: LEEP, Crioterapia, Observación..."
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* ── Prueba de VPH ── */}
      <SectionCard title="Prueba de VPH" icon="🧪">
        <div className="space-y-4">
          <SwitchField
            label="¿Se ha hecho la prueba de VPH?"
            checked={form.prueba_vph_realizada ?? false}
            onChange={(v) => update('prueba_vph_realizada', v)}
          />

          {form.prueba_vph_realizada && (
            <div className="pl-4 border-l-2 border-primary/20 pt-1 space-y-3 animate-in fade-in duration-200">
              <SwitchField
                label="Resultado VPH positivo"
                checked={form.vph_positivo ?? false}
                onChange={(v) => update('vph_positivo', v)}
              />
              {form.vph_positivo && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 animate-in fade-in duration-200">
                  <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p className="text-xs">Paciente con VPH positivo. Considerar seguimiento y posible colposcopia.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </SectionCard>

      {/* ── Resumen Visual ── */}
      <SectionCard title="Estado Preventivo" icon="✅">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatusChip
            label="Citología"
            status={
              form.se_ha_hecho_citologia === null ? 'unknown'
              : !form.se_ha_hecho_citologia ? 'no'
              : papOverdue ? 'warning'
              : 'ok'
            }
          />
          <StatusChip
            label="Citología alterada"
            status={
              form.citologia_alterada === null ? 'unknown'
              : form.citologia_alterada ? 'warning'
              : 'ok'
            }
          />
          <StatusChip
            label="Prueba VPH"
            status={
              form.prueba_vph_realizada === null ? 'unknown'
              : !form.prueba_vph_realizada ? 'no'
              : form.vph_positivo ? 'warning'
              : 'ok'
            }
          />
          <StatusChip
            label="VPH positivo"
            status={
              form.vph_positivo === null ? 'unknown'
              : form.vph_positivo ? 'warning'
              : 'ok'
            }
          />
        </div>
      </SectionCard>

      <div className="flex justify-end pt-2">
        <Button type="submit" className="btn-gradient" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Guardar citología y VPH
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

const StatusChip = ({
  label,
  status,
}: {
  label: string;
  status: 'ok' | 'warning' | 'no' | 'unknown';
}) => {
  const config = {
    ok: { bg: 'bg-green-50 border-green-200 text-green-700', dot: 'bg-green-500' },
    warning: { bg: 'bg-amber-50 border-amber-200 text-amber-700', dot: 'bg-amber-500' },
    no: { bg: 'bg-slate-50 border-slate-200 text-slate-500', dot: 'bg-slate-300' },
    unknown: { bg: 'bg-slate-50 border-slate-200 text-slate-400', dot: 'bg-slate-200' },
  }[status];

  return (
    <div className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium ${config.bg}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      {label}
    </div>
  );
};

export default ExpedienteCitologia;
