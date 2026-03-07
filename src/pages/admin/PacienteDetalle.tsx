import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ExpedienteResumen from '@/components/admin/expediente/ExpedienteResumen';
import ExpedienteAntecedentes from '@/components/admin/expediente/ExpedienteAntecedentes';
import ExpedienteConsultas from '@/components/admin/expediente/ExpedienteConsultas';
import ExpedientePrenatal from '@/components/admin/expediente/ExpedientePrenatal';
import ExpedienteCitas from '@/components/admin/expediente/ExpedienteCitas';

const PacienteDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: paciente, isLoading } = useQuery({
    queryKey: ['paciente', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('pacientes')
        .select('*')
        .eq('id', id!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Paciente no encontrada.</p>
        <Button variant="link" onClick={() => navigate('/admin/pacientes')}>
          Volver a la lista
        </Button>
      </div>
    );
  }

  const fullName = `${paciente.primer_nombre} ${paciente.segundo_nombre ? paciente.segundo_nombre + ' ' : ''}${paciente.primer_apellido} ${paciente.segundo_apellido || ''}`.trim();

  const calcAge = (fechaNac: string | null) => {
    if (!fechaNac) return null;
    const birth = new Date(fechaNac);
    return Math.floor((Date.now() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));
  };

  const age = calcAge(paciente.fecha_nacimiento);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/admin/pacientes')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-2xl font-display text-foreground">{fullName}</h2>
            {age !== null && (
              <Badge variant="secondary">{age} años</Badge>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground flex-wrap">
            <span className="font-mono">
              {paciente.tipo_identificacion === 'cedula' ? 'Céd.' : paciente.tipo_identificacion}{' '}
              {paciente.numero_identificacion}
            </span>
            {paciente.telefono && (
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> {paciente.telefono}
              </span>
            )}
            {paciente.email && (
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" /> {paciente.email}
              </span>
            )}
            {paciente.direccion && (
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" /> {paciente.direccion}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="resumen" className="w-full">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="antecedentes">Antecedentes</TabsTrigger>
          <TabsTrigger value="consultas">Consultas</TabsTrigger>
          <TabsTrigger value="prenatal">Control Prenatal</TabsTrigger>
          <TabsTrigger value="citas">Citas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="mt-4">
          <ExpedienteResumen paciente={paciente} />
        </TabsContent>
        <TabsContent value="antecedentes" className="mt-4">
          <ExpedienteAntecedentes pacienteId={paciente.id} />
        </TabsContent>
        <TabsContent value="consultas" className="mt-4">
          <ExpedienteConsultas pacienteId={paciente.id} />
        </TabsContent>
        <TabsContent value="prenatal" className="mt-4">
          <ExpedientePrenatal pacienteId={paciente.id} />
        </TabsContent>
        <TabsContent value="citas" className="mt-4">
          <ExpedienteCitas pacienteId={paciente.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PacienteDetalle;
