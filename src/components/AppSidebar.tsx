import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard,
  PlusCircle,
  ListTodo,
  Headset,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
} from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'tecnico', 'empleado'] },
  { to: '/nuevo-ticket', label: 'Nuevo Ticket', icon: PlusCircle, roles: ['admin', 'tecnico', 'empleado'] },
  { to: '/mis-tickets', label: 'Mis Tickets', icon: ListTodo, roles: ['admin', 'tecnico', 'empleado'] },
  { to: '/consola', label: 'Consola de Soporte', icon: Headset, roles: ['admin', 'tecnico'] },
  { to: '/metricas', label: 'Métricas', icon: BarChart3, roles: ['admin', 'tecnico'] },
  { to: '/configuracion', label: 'Configuración SMTP', icon: Settings, roles: ['admin'] },
];

const AppSidebar: React.FC = () => {
  const { currentUser, logout } = useApp();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNav = navItems.filter(n => currentUser && n.roles.includes(currentUser.role));

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} min-h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-all duration-200 border-r border-sidebar-border`}>
      <div className={`p-4 border-b border-sidebar-border flex items-center ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <div className="min-w-0">
            <h2 className="text-sm font-semibold truncate">Soporte Técnico</h2>
            <p className="text-xs text-sidebar-muted truncate">Televisa Intranet</p>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded hover:bg-sidebar-accent transition-colors">
          <ChevronLeft className={`w-4 h-4 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {filteredNav.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium' : 'text-sidebar-foreground hover:bg-sidebar-accent'
              } ${collapsed ? 'justify-center' : ''}`
            }
            title={item.label}
          >
            <item.icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-sidebar-border">
        {!collapsed && currentUser && (
          <div className="mb-2 px-2">
            <p className="text-xs font-medium truncate">{currentUser.name}</p>
            <p className="text-xs text-sidebar-muted truncate">{currentUser.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-sidebar-foreground hover:bg-sidebar-accent transition-colors ${collapsed ? 'justify-center' : ''}`}
          title="Cerrar Sesión"
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Cerrar Sesión</span>}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
