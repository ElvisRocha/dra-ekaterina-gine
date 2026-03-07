import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Paciente = Tables<'pacientes'>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente;
  onSuccess: () => void;
}

const EditarPacienteModal = ({ open, onOpenChange, paciente, onSuccess }: Props) => {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    tipo_identificacion: '',
    numero_identificacion: '',
    primer_nombre: '',
    segundo_nombre: '',
    primer_apellido: '',
    segundo_apellido: '',
    fecha_nacimiento: '',
    sexo: 'F',
    estado_civil: '',
    nacionalidad: '',
    telefono: '',
    email: '',
    direccion: '',
    ocupacion: '',
    contacto_emergencia_nombre: '',
    contacto_emergencia_telefono: '',
    contacto_emergencia_parentesco: '',
    notas: '',
  });

  useEffect(() => {
    if (paciente) {
      setForm({
        tipo_identificacion: paciente.tipo_identificacion || 'cedula',
        numero_identificacion: paciente.numero_identificacion,
        primer_nombre: paciente.primer_nombre,
        segundo_nombre: paciente.segundo_nombre ?? '',
        primer_apellido: paciente.primer_apellido,
        segundo_apellido: paciente.segundo_apellido ?? '',
        fecha_nacimiento: paciente.fecha_nacimiento ?? '',
        sexo: paciente.sexo ?? 'F',
        estado_civil: paciente.estado_civil ?? '',
        nacionalidad: paciente.nacionalidad ?? '',
        telefono: paciente.telefono ?? '',
        email: paciente.email ?? '',
        direccion: paciente.direccion ?? '',
        ocupacion: paciente.ocupacion ?? '',
        contacto_emergencia_nombre: paciente.contacto_emergencia_nombre ?? '',
        contacto_emergencia_telefono: paciente.contacto_emergencia_telefono ?? '',
        contacto_emergencia_parentesco: paciente.contacto_emergencia_parentesco ?? '',
        notas: paciente.notas ?? '',
      });
    }
  }, [paciente]);

  const update = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.primer_nombre.trim() || !form.primer_apellido.trim() || !form.numero_identificacion.trim()) {
      toast.error('Nombre, apellido e identificación son obligatorios.');
      return;
    }

    setSaving(true);
    try {
      const { error } = await supabase
        .from('pacientes')
        .update({
          tipo_identificacion: form.tipo_identificacion,
          numero_identificacion: form.numero_identificacion.trim(),
          primer_nombre: form.primer_nombre.trim(),
          segundo_nombre: form.segundo_nombre.trim() || null,
          primer_apellido: form.primer_apellido.trim(),
          segundo_apellido: form.segundo_apellido.trim() || null,
          fecha_nacimiento: form.fecha_nacimiento || null,
          sexo: form.sexo,
          estado_civil: form.estado_civil || null,
          nacionalidad: form.nacionalidad || null,
          telefono: form.telefono.trim() || null,
          email: form.email.trim() || null,
          direccion: form.direccion.trim() || null,
          ocupacion: form.ocupacion.trim() || null,
          contacto_emergencia_nombre: form.contacto_emergencia_nombre.trim() || null,
          contacto_emergencia_telefono: form.contacto_emergencia_telefono.trim() || null,
          contacto_emergencia_parentesco: form.contacto_emergencia_parentesco.trim() || null,
          notas: form.notas.trim() || null,
        })
        .eq('id', paciente.id);

      if (error) throw error;
      toast.success('Datos actualizados ✓');
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
          <DialogTitle className="font-display text-xl">Editar Paciente</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Identificación */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">Identificación</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Tipo</Label>
                <Select value={form.tipo_identificacion} onValueChange={v => update('tipo_identificacion', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cedula">Cédula</SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="dimex">DIMEX</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Número *</Label>
                <Input value={form.numero_identificacion} onChange={e => update('numero_identificacion', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Datos personales */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">Datos Personales</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Primer nombre *</Label>
                <Input value={form.primer_nombre} onChange={e => update('primer_nombre', e.target.value)} />
              </div>
              <div>
                <Label>Segundo nombre</Label>
                <Input value={form.segundo_nombre} onChange={e => update('segundo_nombre', e.target.value)} />
              </div>
              <div>
                <Label>Primer apellido *</Label>
                <Input value={form.primer_apellido} onChange={e => update('primer_apellido', e.target.value)} />
              </div>
              <div>
                <Label>Segundo apellido</Label>
                <Input value={form.segundo_apellido} onChange={e => update('segundo_apellido', e.target.value)} />
              </div>
              <div>
                <Label>Fecha de nacimiento</Label>
                <Input type="date" value={form.fecha_nacimiento} onChange={e => update('fecha_nacimiento', e.target.value)} />
              </div>
              <div>
                <Label>Sexo</Label>
                <Select value={form.sexo} onValueChange={v => update('sexo', v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="F">Femenino</SelectItem>
                    <SelectItem value="M">Masculino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Estado civil</Label>
                <Select value={form.estado_civil} onValueChange={v => update('estado_civil', v)}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="soltera">Soltera</SelectItem>
                    <SelectItem value="casada">Casada</SelectItem>
                    <SelectItem value="union_libre">Unión libre</SelectItem>
                    <SelectItem value="divorciada">Divorciada</SelectItem>
                    <SelectItem value="viuda">Viuda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Nacionalidad</Label>
                <Input value={form.nacionalidad} onChange={e => update('nacionalidad', e.target.value)} />
              </div>
              <div>
                <Label>Ocupación</Label>
                <Input value={form.ocupacion} onChange={e => update('ocupacion', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Contacto */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">Contacto</legend>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label>Teléfono</Label>
                <Input value={form.telefono} onChange={e => update('telefono', e.target.value)} placeholder="+506 0000-0000" />
              </div>
              <div>
                <Label>Correo electrónico</Label>
                <Input type="email" value={form.email} onChange={e => update('email', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <Label>Dirección</Label>
                <Input value={form.direccion} onChange={e => update('direccion', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Contacto de emergencia */}
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold text-foreground border-b border-border pb-1 mb-2">Contacto de Emergencia</legend>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <Label>Nombre</Label>
                <Input value={form.contacto_emergencia_nombre} onChange={e => update('contacto_emergencia_nombre', e.target.value)} />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input value={form.contacto_emergencia_telefono} onChange={e => update('contacto_emergencia_telefono', e.target.value)} />
              </div>
              <div>
                <Label>Parentesco</Label>
                <Input value={form.contacto_emergencia_parentesco} onChange={e => update('contacto_emergencia_parentesco', e.target.value)} />
              </div>
            </div>
          </fieldset>

          {/* Notas */}
          <div>
            <Label>Notas</Label>
            <Textarea value={form.notas} onChange={e => update('notas', e.target.value)} placeholder="Observaciones adicionales..." rows={3} />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
            <Button type="submit" className="btn-gradient" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Guardar cambios
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarPacienteModal;
