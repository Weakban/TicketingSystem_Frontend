import React from 'react';
import { useApp } from '@/context/AppContext';
import { Ticket, BarChart3, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { tickets, currentUser } = useApp();
  const navigate = useNavigate();

  const userTickets = currentUser?.role === 'empleado'
    ? tickets.filter(t => t.createdBy === currentUser.id)
    : tickets;

  const open = userTickets.filter(t => t.status === 'Abierto').length;
  const inProgress = userTickets.filter(t => t.status === 'En Proceso').length;
  const resolved = userTickets.filter(t => t.status === 'Resuelto').length;
  const highPriority = userTickets.filter(t => t.priority === 'Alta' && t.status !== 'Resuelto').length;

  const stats = [
    { label: 'Abiertos', value: open, icon: Ticket, color: 'text-primary' },
    { label: 'En Proceso', value: inProgress, icon: Clock, color: 'text-warning' },
    { label: 'Resueltos', value: resolved, icon: CheckCircle2, color: 'text-success' },
    { label: 'Alta Prioridad', value: highPriority, icon: AlertTriangle, color: 'text-destructive' },
  ];

  const recentTickets = [...userTickets].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Bienvenido, {currentUser?.name}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-lg p-4 shadow-corp">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase text-muted-foreground">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-semibold text-foreground mt-2">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-lg shadow-corp">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Tickets Recientes</h2>
        </div>
        {recentTickets.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No hay tickets pendientes en tu cola. Buen trabajo.
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                <th className="text-left px-4 py-2 text-xs font-bold uppercase text-muted-foreground">ID</th>
                <th className="text-left px-4 py-2 text-xs font-bold uppercase text-muted-foreground">Título</th>
                <th className="text-left px-4 py-2 text-xs font-bold uppercase text-muted-foreground">Prioridad</th>
                <th className="text-left px-4 py-2 text-xs font-bold uppercase text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.map(t => (
                <tr
                  key={t.id}
                  onClick={() => navigate(`/ticket/${t.id}`)}
                  className="border-b border-border hover:bg-secondary/30 cursor-pointer transition-colors h-10"
                >
                  <td className="px-4 py-2 font-mono text-xs text-muted-foreground">{t.id}</td>
                  <td className="px-4 py-2 text-foreground">{t.title}</td>
                  <td className="px-4 py-2">
                    <PriorityBadge priority={t.priority} />
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status={t.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const PriorityBadge: React.FC<{ priority: string }> = ({ priority }) => {
  const cls = priority === 'Alta' ? 'bg-destructive/10 text-destructive' : priority === 'Media' ? 'bg-warning/10 text-warning' : 'bg-secondary text-muted-foreground';
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{priority}</span>;
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const cls = status === 'Resuelto' ? 'bg-success/10 text-success' : status === 'En Proceso' ? 'bg-primary/10 text-primary' : 'bg-secondary text-muted-foreground';
  return <span className={`px-2 py-0.5 rounded text-xs font-medium ${cls}`}>{status}</span>;
};

export default Dashboard;