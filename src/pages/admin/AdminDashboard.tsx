import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, UserPlus, Activity } from 'lucide-react';

const stats = [
  { title: 'Total Pacientes', value: '—', icon: Users, color: 'text-primary' },
  { title: 'Citas Hoy', value: '—', icon: Calendar, color: 'text-accent' },
  { title: 'Citas Semana', value: '—', icon: Activity, color: 'text-primary' },
  { title: 'Nuevas este Mes', value: '—', icon: UserPlus, color: 'text-accent' },
];

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display text-foreground">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximas Citas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Se mostrará en la Iteración 6.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pacientes Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">Se mostrará en la Iteración 2.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
