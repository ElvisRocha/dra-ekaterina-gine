import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Loader2, Save } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Consulta = Tables<'consultas'>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteId: string;
  consulta?: Consulta | null;
  onSuccess: () => void;
}

interface ExamenFisico {
  pa?: string;
  fc?: string;
  peso?: string;
  talla?: string;
  imc?: string;
  exceso_peso?: string;
  palidez?: boolean;
  abdomen?: string;
  mamas?: string;
  ginecologico?: string;
  leucorrea?: boolean;
  shiller?: 'Negativo' | 'Positivo';
  shiller_comentarios?: string;
  se_hace_vph?: boolean;
  al_us?: string;
}

const calcIMC = (peso: string, talla: string): string => {
  const p = parseFloat(peso);
  const t = parseFloat(talla);
  if (!p || !t || t === 0) return '';
  const imc = p / (t * t);
  return imc.toFixed(1);
};

const imcCategory = (imc: string): { label: string; color: string } => {
  const val = parseFloat(imc);
  if (!val) return { label: '', color: '' };
  if (val < 18.5) return { label: 'Bajo peso', color: 'text-blue-600 bg-blue-50 border-blue-200' };
  if (val < 25) return { label: 'Normal', color: 'text-green-600 bg-green-50 border-green-200' };
  if (val < 30) return { label: 'Sobrepeso', color: 'text-amber-600 bg-amber-50 border-amber-200' };
  return { label: 'Obesidad', color: 'text-red-600 bg-red-50 border-red-200' };
};

const emptyExamen: ExamenFisico = {
  pa: '',
  fc: '',
  peso: '',
  talla: '',
  imc: '',
  exceso_peso: '',
  palidez: false,
  abdomen: '',
  mamas: '',
  ginecologico: '',
  leucorrea: false,
  shiller: undefined,
  shiller_comentarios: '',
  se_hace_vph: false,
  al_us: '',
};

const emptyForm = {
  motivo_consulta: '',
  enfermedad_actual: '',
  diagnostico: '',
  plan_tratamiento: '',
  notas: '',
};

const ConsultaFormModal = ({ open, onOpenChange, pacienteId, consulta, onSuccess }: Props) => {
  const { user } = useAuth();
  const isEdit = !!consulta;

  const [form, setForm] = useState(() =>
    consulta
      ? {
          motivo_consulta: consulta.motivo_consulta || '',
          enfermedad_actual: consulta.enfermedad_actual || '',
          diagnostico: consulta.diagnostico || '',
          plan_tratamiento: consulta.plan_tratamiento || '',
          notas: consulta.notas || '',
        }
      : { ...emptyForm }
  );

  const [examen, setExamen] = useState<ExamenFisico>(() => {
    if (consulta?.examen_fisico && typeof consulta.examen_fisico === 'object') {
      return { ...emptyExamen, ...(consulta.examen_fisico as ExamenFisico) };
    }
    return { ...emptyExamen };
  });

  const [saving, setSaving] = useState(false);

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const updateExamen = (field: keyof ExamenFisico, value: any) =>
    setExamen((prev) => ({ ...prev, [field]: value }));

  // Auto-calculate IMC and excess weight when peso/talla change
  useEffect(() => {
    if (examen.peso && examen.talla) {
      const imc = calcIMC(examen.peso, examen.talla);
      setExamen((prev) => ({ ...prev, imc }));
    }
  }, [examen.peso, examen.talla]);

  const imcCat = imcCategory(examen.imc || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.motivo_consulta.trim()) {
      toast({ title: 'El motivo de consulta es obligatorio', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        paciente_id: pacienteId,
        motivo_consulta: form.motivo_consulta.trim() || null,
        enfermedad_actual: form.enfermedad_actual.trim() || null,
        diagnostico: form.diagnostico.trim() || null,
        plan_tratamiento: form.plan_tratamiento.trim() || null,
        notas: form.notas.trim() || null,
        // Keep backward compat: signos_vitales stores PA/FC for legacy
        signos_vitales: {
          presion_arterial: examen.pa || undefined,
          frecuencia_cardiaca: examen.fc || undefined,
          peso: examen.peso || undefined,
          talla: examen.talla || undefined,
          imc: examen.imc || undefined,
        },
        examen_fisico: {
          pa: examen.pa || null,
          fc: examen.fc || null,
          peso: examen.peso || null,
          talla: examen.talla || null,
          imc: examen.imc || null,
          exceso_peso: examen.exceso_peso || null,
          palidez: examen.palidez ?? false,
          abdomen: examen.abdomen || null,
          mamas: examen.mamas || null,
          ginecologico: examen.ginecologico || null,
          leucorrea: examen.leucorrea ?? false,
          shiller: examen.shiller || null,
          shiller_comentarios: examen.shiller === 'Positivo' ? (examen.shiller_comentarios || null) : null,
          se_hace_vph: examen.se_hace_vph ?? false,
          al_us: examen.al_us || null,
        },
        created_by: user?.id || null,
      };

      if (isEdit && consulta) {
        const { error } = await supabase.from('consultas').update(payload).eq('id', consulta.id);
        if (error) throw error;
        toast({ title: 'Consulta actualizada ✓' });
      } else {
        const { error } = await supabase.from('consultas').insert(payload);
        if (error) throw error;
        toast({ title: 'Consulta registrada ✓' });
      }

      onSuccess();
    } catch (err: any) {
      toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen && !isEdit) {
      setForm({ ...emptyForm });
      setExamen({ ...emptyExamen });
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            {isEdit ? 'Editar Consulta' : 'Nueva Consulta'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Motivo de Consulta ── */}
          <Fieldset title="Motivo de Consulta">
            <div className="space-y-3">
              <div>
                <Label>Motivo de consulta *</Label>
                <Textarea
                  value={form.motivo_consulta}
                  onChange={(e) => updateForm('motivo_consulta', e.target.value)}
                  rows={2}
                  placeholder="¿Por qué acude la paciente?"
                />
              </div>
              <div>
                <Label>Enfermedad actual</Label>
                <Textarea
                  value={form.enfermedad_actual}
                  onChange={(e) => updateForm('enfermedad_actual', e.target.value)}
                  rows={3}
                  placeholder="Descripción detallada de la enfermedad actual..."
                />
              </div>
            </div>
          </Fieldset>

          {/* ── Examen Físico ── */}
          <Fieldset title="Examen Físico">
            <div className="space-y-5">
              {/* Vitales Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <div>
                  <Label className="text-xs">PA (Presión Arterial)</Label>
                  <Input
                    value={examen.pa || ''}
                    onChange={(e) => updateExamen('pa', e.target.value)}
                    placeholder="120/80 mmHg"
                  />
                </div>
                <div>
                  <Label className="text-xs">FC (Frec. Cardíaca)</Label>
                  <Input
                    value={examen.fc || ''}
                    onChange={(e) => updateExamen('fc', e.target.value)}
                    placeholder="80 lpm"
                  />
                </div>
                <div>
                  <Label className="text-xs">Peso (kg)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={examen.peso || ''}
                    onChange={(e) => updateExamen('peso', e.target.value)}
                    placeholder="65"
                  />
                </div>
                <div>
                  <Label className="text-xs">Talla (m)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={examen.talla || ''}
                    onChange={(e) => updateExamen('talla', e.target.value)}
                    placeholder="1.65"
                  />
                </div>
                <div>
                  <Label className="text-xs">IMC (auto)</Label>
                  <div className="relative">
                    <Input
                      value={examen.imc || ''}
                      readOnly
                      placeholder="—"
                      className="bg-muted/40 cursor-default"
                    />
                    {imcCat.label && (
                      <div className="mt-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${imcCat.color}`}>
                          {imcCat.label}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Palidez */}
              <SwitchField
                label="Palidez"
                checked={examen.palidez ?? false}
                onChange={(v) => updateExamen('palidez', v)}
              />

              {/* Abdomen + Mamas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label>Abdomen</Label>
                  <Textarea
                    value={examen.abdomen || ''}
                    onChange={(e) => updateExamen('abdomen', e.target.value)}
                    rows={3}
                    placeholder="Hallazgos del examen abdominal..."
                  />
                </div>
                <div>
                  <Label>Mamas</Label>
                  <Textarea
                    value={examen.mamas || ''}
                    onChange={(e) => updateExamen('mamas', e.target.value)}
                    rows={3}
                    placeholder="Mamas sin nódulos / hallazgos..."
                  />
                </div>
              </div>

              {/* Ginecológico */}
              <div>
                <Label>Ginecológico</Label>
                <Textarea
                  value={examen.ginecologico || ''}
                  onChange={(e) => updateExamen('ginecologico', e.target.value)}
                  rows={3}
                  placeholder="Hallazgos ginecológicos..."
                />
                <div className="mt-2">
                  <SwitchField
                    label="Leucorrea"
                    checked={examen.leucorrea ?? false}
                    onChange={(v) => updateExamen('leucorrea', v)}
                  />
                </div>
              </div>

              {/* SHILLER */}
              <div>
                <Label className="mb-2 block">SHILLER</Label>
                <div className="flex gap-3">
                  {(['Negativo', 'Positivo'] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => updateExamen('shiller', opt)}
                      className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                        examen.shiller === opt
                          ? opt === 'Negativo'
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-amber-500 text-white border-amber-500'
                          : 'bg-background border-border hover:border-primary/50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                  {examen.shiller && (
                    <button
                      type="button"
                      onClick={() => updateExamen('shiller', undefined)}
                      className="px-3 py-2 rounded-lg border border-border text-xs text-muted-foreground hover:bg-muted"
                    >
                      Limpiar
                    </button>
                  )}
                </div>
                {examen.shiller === 'Positivo' && (
                  <div className="mt-3 pl-4 border-l-2 border-amber-300 animate-in fade-in duration-200">
                    <Label>Comentarios SHILLER</Label>
                    <Textarea
                      value={examen.shiller_comentarios || ''}
                      onChange={(e) => updateExamen('shiller_comentarios', e.target.value)}
                      rows={2}
                      placeholder="Descripción del área positiva..."
                    />
                  </div>
                )}
              </div>

              {/* Se hace VPH */}
              <SwitchField
                label="Se hace VPH en esta consulta"
                checked={examen.se_hace_vph ?? false}
                onChange={(v) => updateExamen('se_hace_vph', v)}
              />

              {/* Al US */}
              <div>
                <Label>Al US (Ultrasonido)</Label>
                <Textarea
                  value={examen.al_us || ''}
                  onChange={(e) => updateExamen('al_us', e.target.value)}
                  rows={3}
                  placeholder="Hallazgos al ultrasonido: útero, ovarios..."
                />
              </div>
            </div>
          </Fieldset>

          {/* ── Diagnóstico y Plan ── */}
          <Fieldset title="Diagnóstico y Plan de Tratamiento">
            <div className="space-y-3">
              <div>
                <Label>Diagnósticos</Label>
                <Textarea
                  value={form.diagnostico}
                  onChange={(e) => updateForm('diagnostico', e.target.value)}
                  rows={3}
                  placeholder="1. Diagnóstico principal&#10;2. Diagnóstico secundario..."
                />
              </div>
              <div>
                <Label>Plan / Tratamiento</Label>
                <Textarea
                  value={form.plan_tratamiento}
                  onChange={(e) => updateForm('plan_tratamiento', e.target.value)}
                  rows={3}
                  placeholder="Indicaciones, medicamentos, estudios solicitados..."
                />
              </div>
              <div>
                <Label>Notas / Sugerencias adicionales</Label>
                <Textarea
                  value={form.notas}
                  onChange={(e) => updateForm('notas', e.target.value)}
                  rows={2}
                  placeholder="Control habitual, próxima cita, observaciones..."
                />
              </div>
            </div>
          </Fieldset>

          <div className="flex justify-end gap-3 pt-2 border-t border-border">
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="btn-gradient" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? 'Actualizar consulta' : 'Guardar consulta'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ─── Reusable sub-components ────────────────────────────────────────────────

const Fieldset = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <fieldset className="space-y-3">
    <legend className="text-sm font-semibold text-foreground border-b border-border pb-1.5 mb-3 w-full">
      {title}
    </legend>
    {children}
  </fieldset>
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

export default ConsultaFormModal;
