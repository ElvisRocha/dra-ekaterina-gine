import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import type { Tables } from '@/integrations/supabase/types';

type Cita = Tables<'citas'>;

const TIPOS_CITA = [
  'Consulta Sola',
  'Consulta Completa (PAP y US)',
  'Control Prenatal',
  'Ultrasonido',
  'Colposcopía',
  'Inserción DIU',
  'Retiro DIU',
  'Inserción Implanón',
  'Retiro Implanón',
  'Otro',
];

const ESTADOS = [
  { value: 'programada', label: 'Programada' },
  { value: 'confirmada', label: 'Confirmada' },
  { value: 'completada', label: 'Completada' },
  { value: 'cancelada', label: 'Cancelada' },
  { value: 'no_asistio', label: 'No asistió' },
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteId: string;
  cita?: Cita | null;
  onSuccess: () => void;
}

const CitaFormModal = ({ open, onOpenChange, pacienteId, cita, onSuccess }: Props) => {
  const isEdit = !!cita;
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    tipo_cita: '',
    fecha: '',
    hora: '',
    duracion_minutos: '30',
    estado: 'programada',
    notas: '',
  });

  useEffect(() => {
    if (cita) {
      const dt = new Date(cita.fecha_hora);
      setForm({
        tipo_cita: cita.tipo_cita,
        fecha: dt.toISOString().slice(0, 10),
        hora: dt.toTimeString().slice(0, 5),
        duracion_minutos: (cita.duracion_minutos ?? 30).toString(),
        estado: cita.estado ?? 'programada',
        notas: cita.notas ?? '',
      });
    } else {
      setForm({
        tipo_cita: '',
        fecha: '',
        hora: '',
        duracion_minutos: '30',
        estado: 'programada',
        notas: '',
      });
    }
  }, [cita, open]);

  const update = (key: string, value: string) => setForm(f => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!form.tipo_cita || !form.fecha || !form.hora) {
      toast.error('Completa tipo, fecha y hora');
      return;
    }

    setSaving(true);
    try {
      const fecha_hora = new Date(`${form.fecha}T${form.hora}:00`).toISOString();

      const payload = {
        paciente_id: pacienteId,
        tipo_cita: form.tipo_cita,
        fecha_hora,
        duracion_minutos: parseInt(form.duracion_minutos) || 30,
        estado: form.estado,
        notas: form.notas || null,
      };

      if (isEdit) {
        const { error } = await supabase.from('citas').update(payload).eq('id', cita.id);
        if (error) throw error;
        toast.success('Cita actualizada');
      } else {
        const { error } = await supabase.from('citas').insert(payload);
        if (error) throw error;
        toast.success('Cita creada');
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Editar cita' : 'Nueva cita'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Tipo de cita</Label>
            <Select value={form.tipo_cita} onValueChange={v => update('tipo_cita', v)}>
              <SelectTrigger><SelectValue placeholder="Seleccionar tipo" /></SelectTrigger>
              <SelectContent>
                {TIPOS_CITA.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Fecha</Label>
              <Input type="date" value={form.fecha} onChange={e => update('fecha', e.target.value)} />
            </div>
            <div>
              <Label>Hora</Label>
              <Input type="time" value={form.hora} onChange={e => update('hora', e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Duración (min)</Label>
              <Input type="number" min={10} step={5} value={form.duracion_minutos} onChange={e => update('duracion_minutos', e.target.value)} />
            </div>
            <div>
              <Label>Estado</Label>
              <Select value={form.estado} onValueChange={v => update('estado', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {ESTADOS.map(e => (
                    <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>Notas</Label>
            <Textarea rows={2} value={form.notas} onChange={e => update('notas', e.target.value)} placeholder="Notas adicionales..." />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="btn-gradient">
            {saving ? 'Guardando…' : isEdit ? 'Actualizar' : 'Crear cita'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CitaFormModal;
