import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Search, UserPlus, ChevronLeft, ChevronRight, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NuevoPacienteModal from '@/components/admin/NuevoPacienteModal';

const PAGE_SIZE = 15;

const PacientesList = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [showNuevo, setShowNuevo] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['pacientes', search, page],
    queryFn: async () => {
      let query = supabase
        .from('pacientes')
        .select('*', { count: 'exact' })
        .eq('activo', true)
        .order('created_at', { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (search.trim()) {
        query = query.or(
          `primer_nombre.ilike.%${search}%,primer_apellido.ilike.%${search}%,numero_identificacion.ilike.%${search}%,telefono.ilike.%${search}%`
        );
      }

      const { data, count, error } = await query;
      if (error) throw error;
      return { pacientes: data || [], total: count || 0 };
    },
  });

  const totalPages = Math.ceil((data?.total || 0) / PAGE_SIZE);

  const calcAge = (fechaNac: string | null) => {
    if (!fechaNac) return '—';
    const birth = new Date(fechaNac);
    const diff = Date.now() - birth.getTime();
    return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-display text-foreground">Pacientes</h2>
        <Button onClick={() => setShowNuevo(true)} className="btn-gradient">
          <UserPlus className="h-4 w-4 mr-2" />
          Nueva paciente
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, cédula o teléfono..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : !data?.pacientes.length ? (
            <div className="text-center py-12 text-muted-foreground">
              {search ? 'No se encontraron pacientes.' : 'Aún no hay pacientes registradas.'}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nombre</TableHead>
                      <TableHead className="hidden md:table-cell">Identificación</TableHead>
                      <TableHead className="hidden lg:table-cell">Edad</TableHead>
                      <TableHead className="hidden sm:table-cell">Contacto</TableHead>
                      <TableHead className="hidden lg:table-cell">Registro</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.pacientes.map((p) => (
                      <TableRow key={p.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell>
                          <div>
                            <p className="font-medium text-foreground">
                              {p.primer_nombre} {p.segundo_nombre ? p.segundo_nombre + ' ' : ''}
                              {p.primer_apellido} {p.segundo_apellido || ''}
                            </p>
                            <p className="text-xs text-muted-foreground md:hidden">
                              {p.numero_identificacion}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <Badge variant="outline" className="font-mono text-xs">
                            {p.tipo_identificacion === 'cedula' ? 'Céd.' : p.tipo_identificacion}{' '}
                            {p.numero_identificacion}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">
                          {calcAge(p.fecha_nacimiento)} años
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                            {p.telefono && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" /> {p.telefono}
                              </span>
                            )}
                            {p.email && (
                              <span className="flex items-center gap-1">
                                <Mail className="h-3 w-3" /> {p.email}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell text-xs text-muted-foreground">
                          {p.created_at
                            ? format(new Date(p.created_at), 'dd MMM yyyy', { locale: es })
                            : '—'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {data.total} paciente{data.total !== 1 ? 's' : ''}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page === 0}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {page + 1} / {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={page >= totalPages - 1}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <NuevoPacienteModal
        open={showNuevo}
        onOpenChange={setShowNuevo}
        onSuccess={() => {
          setShowNuevo(false);
          refetch();
        }}
      />
    </div>
  );
};

export default PacientesList;
