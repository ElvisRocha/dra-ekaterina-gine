import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Loader2, Save } from 'lucide-react';

interface Props {
  pacienteId: string;
}

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
    if (expediente) {
      setForm(expediente);
    }
  }, [expediente]);

  const update = (field: string, value: any) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        paciente_id: pacienteId,
        alergias: form.alergias || null,
        enfermedades_cronicas: form.enfermedades_cronicas || null,
        cirugias_previas: form.cirugias_previas || null,
        medicamentos_actuales: form.medicamentos_actuales || null,
        tabaco: form.tabaco ?? false,
        alcohol: form.alcohol ?? false,
        drogas: form.drogas ?? false,
        ejercicio: form.ejercicio || null,
        antecedentes_familiares: form.antecedentes_familiares || null,
        menarca: form.menarca ? Number(form.menarca) : null,
        ciclo_regular: form.ciclo_regular ?? null,
        duracion_ciclo: form.duracion_ciclo ? Number(form.duracion_ciclo) : null,
        fur: form.fur || null,
        metodo_anticonceptivo: form.metodo_anticonceptivo || null,
        vida_sexual_activa: form.vida_sexual_activa ?? null,
        num_parejas_sexuales: form.num_parejas_sexuales ? Number(form.num_parejas_sexuales) : null,
        its_previas: form.its_previas || null,
        gestas: form.gestas ? Number(form.gestas) : 0,
        partos: form.partos ? Number(form.partos) : 0,
        cesareas: form.cesareas ? Number(form.cesareas) : 0,
        abortos: form.abortos ? Number(form.abortos) : 0,
        ectopicos: form.ectopicos ? Number(form.ectopicos) : 0,
        hijos_vivos: form.hijos_vivos ? Number(form.hijos_vivos) : 0,
        ultimo_papanicolaou: form.ultimo_papanicolaou || null,
        resultado_papanicolaou: form.resultado_papanicolaou || null,
        vph_positivo: form.vph_positivo ?? false,
        menopausia: form.menopausia ?? false,
        edad_menopausia: form.edad_menopausia ? Number(form.edad_menopausia) : null,
        terapia_hormonal: form.terapia_hormonal ?? false,
        embarazada: form.embarazada ?? false,
        control_prenatal_activo: form.control_prenatal_activo ?? false,
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
      toast({ title: 'Expediente guardado ✓' });
      queryClient.invalidateQueries({ queryKey: ['expediente_master', pacienteId] });
    },
    onError: (err: any) => {
      toast({ title: 'Error al guardar', description: err.message, variant: 'destructive' });
    },
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutation.mutate();
      }}
      className="space-y-6"
    >
      {/* Antecedentes patológicos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Antecedentes Patológicos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Alergias</Label>
            <Textarea value={form.alergias || ''} onChange={(e) => update('alergias', e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Enfermedades crónicas</Label>
            <Textarea value={form.enfermedades_cronicas || ''} onChange={(e) => update('enfermedades_cronicas', e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Cirugías previas</Label>
            <Textarea value={form.cirugias_previas || ''} onChange={(e) => update('cirugias_previas', e.target.value)} rows={2} />
          </div>
          <div>
            <Label>Medicamentos actuales</Label>
            <Textarea value={form.medicamentos_actuales || ''} onChange={(e) => update('medicamentos_actuales', e.target.value)} rows={2} />
          </div>
        </CardContent>
      </Card>

      {/* Hábitos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Hábitos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <SwitchField label="Tabaco" checked={form.tabaco ?? false} onChange={(v) => update('tabaco', v)} />
            <SwitchField label="Alcohol" checked={form.alcohol ?? false} onChange={(v) => update('alcohol', v)} />
            <SwitchField label="Drogas" checked={form.drogas ?? false} onChange={(v) => update('drogas', v)} />
          </div>
          <div className="max-w-sm">
            <Label>Ejercicio</Label>
            <Input value={form.ejercicio || ''} onChange={(e) => update('ejercicio', e.target.value)} placeholder="Tipo y frecuencia" />
          </div>
        </CardContent>
      </Card>

      {/* Antecedentes familiares */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Antecedentes Familiares</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea value={form.antecedentes_familiares || ''} onChange={(e) => update('antecedentes_familiares', e.target.value)} rows={3} placeholder="Diabetes, HTA, cáncer de mama, etc." />
        </CardContent>
      </Card>

      {/* Ginecológico */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Antecedentes Ginecológicos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Menarca (edad)</Label>
            <Input type="number" value={form.menarca ?? ''} onChange={(e) => update('menarca', e.target.value)} />
          </div>
          <div>
            <Label>Ciclo regular</Label>
            <Select value={form.ciclo_regular === null || form.ciclo_regular === undefined ? 'null' : String(form.ciclo_regular)} onValueChange={(v) => update('ciclo_regular', v === 'null' ? null : v === 'true')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="null">Sin dato</SelectItem>
                <SelectItem value="true">Sí</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Duración ciclo (días)</Label>
            <Input type="number" value={form.duracion_ciclo ?? ''} onChange={(e) => update('duracion_ciclo', e.target.value)} />
          </div>
          <div>
            <Label>FUR</Label>
            <Input type="date" value={form.fur || ''} onChange={(e) => update('fur', e.target.value)} />
          </div>
          <div>
            <Label>Método anticonceptivo</Label>
            <Input value={form.metodo_anticonceptivo || ''} onChange={(e) => update('metodo_anticonceptivo', e.target.value)} />
          </div>
          <SwitchField label="Vida sexual activa" checked={form.vida_sexual_activa ?? false} onChange={(v) => update('vida_sexual_activa', v)} />
          <div>
            <Label>Nº parejas sexuales</Label>
            <Input type="number" value={form.num_parejas_sexuales ?? ''} onChange={(e) => update('num_parejas_sexuales', e.target.value)} />
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <Label>ITS previas</Label>
            <Input value={form.its_previas || ''} onChange={(e) => update('its_previas', e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Obstétrico */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Antecedentes Obstétricos</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {(['gestas', 'partos', 'cesareas', 'abortos', 'ectopicos', 'hijos_vivos'] as const).map((field) => (
            <div key={field}>
              <Label className="capitalize">{field === 'hijos_vivos' ? 'Hijos vivos' : field.charAt(0).toUpperCase() + field.slice(1)}</Label>
              <Input type="number" min={0} value={form[field] ?? 0} onChange={(e) => update(field, e.target.value)} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Citología */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Citología / Papanicolaou</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div>
            <Label>Último Papanicolaou</Label>
            <Input type="date" value={form.ultimo_papanicolaou || ''} onChange={(e) => update('ultimo_papanicolaou', e.target.value)} />
          </div>
          <div>
            <Label>Resultado</Label>
            <Input value={form.resultado_papanicolaou || ''} onChange={(e) => update('resultado_papanicolaou', e.target.value)} />
          </div>
          <SwitchField label="VPH positivo" checked={form.vph_positivo ?? false} onChange={(v) => update('vph_positivo', v)} />
        </CardContent>
      </Card>

      {/* Menopausia */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Menopausia</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <SwitchField label="Menopausia" checked={form.menopausia ?? false} onChange={(v) => update('menopausia', v)} />
          {form.menopausia && (
            <>
              <div>
                <Label>Edad menopausia</Label>
                <Input type="number" value={form.edad_menopausia ?? ''} onChange={(e) => update('edad_menopausia', e.target.value)} />
              </div>
              <SwitchField label="Terapia hormonal" checked={form.terapia_hormonal ?? false} onChange={(v) => update('terapia_hormonal', v)} />
            </>
          )}
        </CardContent>
      </Card>

      {/* Estado actual */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Estado Actual</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <SwitchField label="Embarazada" checked={form.embarazada ?? false} onChange={(v) => update('embarazada', v)} />
          {form.embarazada && (
            <SwitchField label="Control prenatal activo" checked={form.control_prenatal_activo ?? false} onChange={(v) => update('control_prenatal_activo', v)} />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" className="btn-gradient" disabled={mutation.isPending}>
          {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
          <Save className="h-4 w-4 mr-2" />
          Guardar expediente
        </Button>
      </div>
    </form>
  );
};

const SwitchField = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) => (
  <div className="flex items-center gap-2">
    <Switch checked={checked} onCheckedChange={onChange} />
    <Label className="cursor-pointer">{label}</Label>
  </div>
);

export default ExpedienteAntecedentes;
