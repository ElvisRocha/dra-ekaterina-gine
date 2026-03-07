import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Loader2,
  Pencil,
  User,
  Calendar,
  FileText,
  Activity,
  TestTube2,
  Baby,
  ClipboardList,
} from 'lucide-react';
import ExpedienteResumen from '@/components/admin/expediente/ExpedienteResumen';
import ExpedienteAntecedentes from '@/components/admin/expediente/ExpedienteAntecedentes';
import ExpedienteGinecologico from '@/components/admin/expediente/ExpedienteGinecologico';
import ExpedienteCitologia from '@/components/admin/expediente/ExpedienteCitologia';
import ExpedienteConsultas from '@/components/admin/expediente/ExpedienteConsultas';
import ExpedientePrenatal from '@/components/admin/expediente/ExpedientePrenatal';
import ExpedienteCitas from '@/components/admin/expediente/ExpedienteCitas';
import EditarPacienteModal from '@/components/admin/EditarPacienteModal';

const PacienteDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showEdit, setShowEdit] = useState(false);

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

  const handleEditSuccess = () => {
    setShowEdit(false);
    queryClient.invalidateQueries({ queryKey: ['paciente', id] });
    queryClient.invalidateQueries({ queryKey: ['pacientes'] });
  };

  const initials = `${paciente.primer_nombre?.[0] ?? ''}${paciente.primer_apellido?.[0] ?? ''}`.toUpperCase();

  const idLabel =
    paciente.tipo_identificacion === 'cedula'
      ? 'Cédula'
      : paciente.tipo_identificacion === 'dimex'
      ? 'DIMEX'
      : 'Pasaporte';

  return (
    <div className="space-y-5">
      {/* ── Back Button ── */}
      <button
        onClick={() => navigate('/admin/pacientes')}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
      >
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
        Volver a pacientes
      </button>

      {/* ── Patient Header Card ── */}
      <div className="bg-card border border-border/60 rounded-xl p-5 shadow-sm">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-display font-semibold text-primary">{initials}</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-display text-foreground leading-tight">{fullName}</h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  {age !== null && (
                    <Badge variant="secondary" className="text-xs">
                      {age} años
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground font-mono">
                    {idLabel}: {paciente.numero_identificacion}
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEdit(true)}
                className="flex-shrink-0"
              >
                <Pencil className="h-4 w-4 mr-1.5" />
                Editar
              </Button>
            </div>

            {/* Contact row */}
            <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground flex-wrap">
              {paciente.telefono && (
                <a
                  href={`tel:${paciente.telefono}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4" />
                  {paciente.telefono}
                </a>
              )}
              {paciente.email && (
                <a
                  href={`mailto:${paciente.email}`}
                  className="flex items-center gap-1.5 hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4" />
                  {paciente.email}
                </a>
              )}
              {paciente.direccion && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  {paciente.direccion}
                </span>
              )}
              {paciente.ocupacion && (
                <span className="flex items-center gap-1.5">
                  <User className="h-4 w-4" />
                  {paciente.ocupacion}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <Tabs defaultValue="resumen" className="w-full">
        <div className="overflow-x-auto -mx-1 px-1 pb-0.5">
          <TabsList className="inline-flex w-auto min-w-full sm:w-full h-auto gap-1 p-1 bg-muted/50 rounded-xl">
            <TabTrigger value="resumen" icon={<ClipboardList className="h-4 w-4" />} label="Resumen" />
            <TabTrigger value="antecedentes" icon={<FileText className="h-4 w-4" />} label="Antecedentes" />
            <TabTrigger value="ginecologico" icon={<Activity className="h-4 w-4" />} label="Ginecológico" />
            <TabTrigger value="citologia" icon={<TestTube2 className="h-4 w-4" />} label="Citología / VPH" />
            <TabTrigger value="consultas" icon={<FileText className="h-4 w-4" />} label="Consultas" />
            <TabTrigger value="prenatal" icon={<Baby className="h-4 w-4" />} label="Prenatal" />
            <TabTrigger value="citas" icon={<Calendar className="h-4 w-4" />} label="Citas" />
          </TabsList>
        </div>

        <TabsContent value="resumen" className="mt-4">
          <ExpedienteResumen paciente={paciente} />
        </TabsContent>
        <TabsContent value="antecedentes" className="mt-4">
          <ExpedienteAntecedentes pacienteId={paciente.id} />
        </TabsContent>
        <TabsContent value="ginecologico" className="mt-4">
          <ExpedienteGinecologico pacienteId={paciente.id} />
        </TabsContent>
        <TabsContent value="citologia" className="mt-4">
          <ExpedienteCitologia pacienteId={paciente.id} />
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

      <EditarPacienteModal
        open={showEdit}
        onOpenChange={setShowEdit}
        paciente={paciente}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};

// Custom tab trigger with icon
const TabTrigger = ({
  value,
  icon,
  label,
}: {
  value: string;
  icon: React.ReactNode;
  label: string;
}) => (
  <TabsTrigger
    value={value}
    className="flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm data-[state=active]:text-primary whitespace-nowrap"
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
    <span className="sm:hidden">{label.split(' ')[0]}</span>
  </TabsTrigger>
);

export default PacienteDetalle;
