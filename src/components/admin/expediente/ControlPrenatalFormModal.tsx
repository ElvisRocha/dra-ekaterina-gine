import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Control = Tables<'control_prenatal'>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteId: string;
  control?: Control | null;
  embarazoNumero?: number;
  onSuccess: () => void;
}

const ControlPrenatalFormModal = ({ open, onOpenChange, pacienteId, control, embarazoNumero = 1, onSuccess }: Props) => {
  const isEdit = !!control;

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    embarazo_numero: embarazoNumero,
    fur: '',
    fpp: '',
    semanas_gestacion: '',
    peso: '',
    presion_arterial: '',
    altura_uterina: '',
    fcf: '',
    presentacion: '',
    movimientos_fetales: false,
    edema: 'ninguno',
    observaciones: '',
    activo: true,
  });

  useEffect(() => {
    if (control) {
      setForm({
        embarazo_numero: control.embarazo_numero ?? 1,
        fur: control.fur ?? '',
        fpp: control.fpp ?? '',
        semanas_gestacion: control.semanas_gestacion?.toString() ?? '',
        peso: control.peso?.toString() ?? '',
        presion_arterial: control.presion_arterial ?? '',
        altura_uterina: control.altura_uterina?.toString() ?? '',
        fcf: control.fcf?.toString() ?? '',
        presentacion: control.presentacion ?? '',
        movimientos_fetales: control.movimientos_fetales ?? false,
        edema: control.edema ?? 'ninguno',
        observaciones: control.observaciones ?? '',
        activo: control.activo ?? true,
      });
    } else {
      setForm(f => ({ ...f, embarazo_numero: embarazoNumero }));
    }
  }, [control, embarazoNumero]);

  const update = (key: string, value: any) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        paciente_id: pacienteId,
        embarazo_numero: form.embarazo_numero,
        fur: form.fur || null,
        fpp: form.fpp || null,
        semanas_gestacion: form.semanas_gestacion ? parseFloat(form.semanas_gestacion) : null,
        peso: form.peso ? parseFloat(form.peso) : null,
        presion_arterial: form.presion_arterial || null,
        altura_uterina: form.altura_uterina ? parseFloat(form.altura_uterina) : null,
        fcf: form.fcf ? parseInt(form.fcf) : null,
        presentacion: form.presentacion || null,
        movimientos_fetales: form.movimientos_fetales,
        edema: form.edema,
        observaciones: form.observaciones || null,
        activo: form.activo,
      };

      if (isEdit) {
        const { error } = await supabase.from('control_prenatal').update(payload).eq('id', control.id);
        if (error) throw error;
        toast.success('Control actualizado');
      } else {
        const { error } = await supabase.from('control_prenatal').insert(payload);
        if (error) throw error;
        toast.success('Control registrado');
      }
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar control prenatal' : 'Nuevo control prenatal'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Datos del embarazo */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Datos del embarazo</h3>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label>Embarazo #</Label>
                <Input type="number" min={1} value={form.embarazo_numero} onChange={e => update('embarazo_numero', parseInt(e.target.value) || 1)} />
              </div>
              <div>
                <Label>FUR</Label>
                <Input type="date" value={form.fur} onChange={e => update('fur', e.target.value)} />
              </div>
              <div>
                <Label>FPP</Label>
                <Input type="date" value={form.fpp} onChange={e => update('fpp', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Mediciones */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Mediciones</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label>Semanas</Label>
                <Input type="number" step="0.1" placeholder="Ej: 28.5" value={form.semanas_gestacion} onChange={e => update('semanas_gestacion', e.target.value)} />
              </div>
              <div>
                <Label>Peso (kg)</Label>
                <Input type="number" step="0.1" value={form.peso} onChange={e => update('peso', e.target.value)} />
              </div>
              <div>
                <Label>PA (mmHg)</Label>
                <Input placeholder="120/80" value={form.presion_arterial} onChange={e => update('presion_arterial', e.target.value)} />
              </div>
              <div>
                <Label>AU (cm)</Label>
                <Input type="number" step="0.1" value={form.altura_uterina} onChange={e => update('altura_uterina', e.target.value)} />
              </div>
            </div>
          </section>

          {/* Evaluación fetal */}
          <section className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Evaluación fetal</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <Label>FCF (lpm)</Label>
                <Input type="number" value={form.fcf} onChange={e => update('fcf', e.target.value)} />
              </div>
              <div>
                <Label>Presentación</Label>
                <Select value={form.presentacion} onValueChange={v => update('presentacion', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cefálica">Cefálica</SelectItem>
                    <SelectItem value="podálica">Podálica</SelectItem>
                    <SelectItem value="transversa">Transversa</SelectItem>
                    <SelectItem value="indiferente">Indiferente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-5">
                <Switch checked={form.movimientos_fetales} onCheckedChange={v => update('movimientos_fetales', v)} />
                <Label>Mov. fetales</Label>
              </div>
              <div>
                <Label>Edema</Label>
                <Select value={form.edema} onValueChange={v => update('edema', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ninguno">Ninguno</SelectItem>
                    <SelectItem value="leve">Leve (+)</SelectItem>
                    <SelectItem value="moderado">Moderado (++)</SelectItem>
                    <SelectItem value="severo">Severo (+++)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          {/* Observaciones */}
          <div>
            <Label>Observaciones</Label>
            <Textarea rows={3} value={form.observaciones} onChange={e => update('observaciones', e.target.value)} />
          </div>

          {/* Estado */}
          <div className="flex items-center gap-2">
            <Switch checked={form.activo} onCheckedChange={v => update('activo', v)} />
            <Label>Embarazo activo</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="btn-gradient">
            {saving ? 'Guardando…' : isEdit ? 'Actualizar' : 'Registrar control'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ControlPrenatalFormModal;
