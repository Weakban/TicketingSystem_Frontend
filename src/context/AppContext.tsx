import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Ticket, User, SMTPConfig, Status, Comment } from '@/types/ticket';

const TECHNICIANS: User[] = [
  { id: 'tech-1', name: 'Carlos Martínez', email: 'carlos.martinez@televisa.com.mx', role: 'tecnico' },
  { id: 'tech-2', name: 'Ana López', email: 'ana.lopez@televisa.com.mx', role: 'tecnico' },
  { id: 'tech-3', name: 'Roberto Díaz', email: 'roberto.diaz@televisa.com.mx', role: 'tecnico' },
];

const DEMO_USERS: User[] = [
  { id: 'admin-1', name: 'Administrador', email: 'admin@televisa.com.mx', role: 'admin' },
  { id: 'emp-1', name: 'Juan Pérez', email: 'juan.perez@televisa.com.mx', role: 'empleado' },
  ...TECHNICIANS,
];

const SEED_TICKETS: Ticket[] = [
  {
    id: 'TK-001', title: 'Monitor no enciende', category: 'Hardware', priority: 'Alta', status: 'Abierto',
    description: 'El monitor del escritorio 4B no enciende después de un corte de luz.', createdAt: '2026-03-15T09:30:00',
    createdBy: 'emp-1', assignedTo: 'tech-1',
    comments: [{ id: 'c1', author: 'Carlos Martínez', text: 'Revisaré el cable de poder y la fuente.', createdAt: '2026-03-15T10:00:00' }],
  },
  {
    id: 'TK-002', title: 'Outlook no sincroniza', category: 'Software', priority: 'Media', status: 'En Proceso',
    description: 'Outlook se queda cargando y no descarga correos nuevos desde ayer.', createdAt: '2026-03-14T14:00:00',
    createdBy: 'emp-1', assignedTo: 'tech-2',
    comments: [],
  },
  {
    id: 'TK-003', title: 'Sin acceso a carpeta compartida', category: 'Redes', priority: 'Media', status: 'Abierto',
    description: 'No puedo acceder a \\\\server\\compartido desde mi equipo.', createdAt: '2026-03-16T08:15:00',
    createdBy: 'emp-1',
    comments: [],
  },
  {
    id: 'TK-004', title: 'Impresora atasca papel', category: 'Hardware', priority: 'Baja', status: 'Resuelto',
    description: 'La impresora HP del piso 3 atasca papel constantemente.', createdAt: '2026-03-10T11:00:00',
    createdBy: 'emp-1', assignedTo: 'tech-3',
    comments: [{ id: 'c2', author: 'Roberto Díaz', text: 'Se reemplazó el rodillo de alimentación. Problema resuelto.', createdAt: '2026-03-12T16:00:00' }],
  },
  {
    id: 'TK-005', title: 'VPN no conecta', category: 'Redes', priority: 'Alta', status: 'En Proceso',
    description: 'El cliente VPN muestra error de timeout al intentar conectar desde casa.', createdAt: '2026-03-16T07:00:00',
    createdBy: 'emp-1', assignedTo: 'tech-1',
    comments: [],
  },
];

interface AppContextType {
  currentUser: User | null;
  tickets: Ticket[];
  technicians: User[];
  smtpConfig: SMTPConfig;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  createTicket: (ticket: Omit<Ticket, 'id' | 'createdAt' | 'createdBy' | 'comments'>) => void;
  updateTicketStatus: (id: string, status: Status) => void;
  assignTicket: (id: string, techId: string) => void;
  addComment: (ticketId: string, text: string) => void;
  updateSMTP: (config: SMTPConfig) => void;
}

const AppContext = createContext<AppContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => loadFromStorage('sgt_user', null));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadFromStorage('sgt_tickets', SEED_TICKETS));
  const [smtpConfig, setSMTP] = useState<SMTPConfig>(() => loadFromStorage('sgt_smtp', {
    host: 'smtp.televisa.com.mx', port: '587', user: '', pass: '', secure: true,
  }));

  useEffect(() => { localStorage.setItem('sgt_tickets', JSON.stringify(tickets)); }, [tickets]);
  useEffect(() => { localStorage.setItem('sgt_smtp', JSON.stringify(smtpConfig)); }, [smtpConfig]);
  useEffect(() => {
    if (currentUser) localStorage.setItem('sgt_user', JSON.stringify(currentUser));
    else localStorage.removeItem('sgt_user');
  }, [currentUser]);

  const login = useCallback((email: string, _password: string) => {
    const user = DEMO_USERS.find(u => u.email === email);
    if (user) { setCurrentUser(user); return true; }
    return false;
  }, []);

  const logout = useCallback(() => setCurrentUser(null), []);

  const createTicket = useCallback((data: Omit<Ticket, 'id' | 'createdAt' | 'createdBy' | 'comments'>) => {
    setTickets(prev => {
      const id = `TK-${String(prev.length + 1).padStart(3, '0')}`;
      return [...prev, { ...data, id, createdAt: new Date().toISOString(), createdBy: currentUser?.id || '', comments: [] }];
    });
  }, [currentUser]);

  const updateTicketStatus = useCallback((id: string, status: Status) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status } : t));
  }, []);

  const assignTicket = useCallback((id: string, techId: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, assignedTo: techId, status: 'En Proceso' as Status } : t));
  }, []);

  const addComment = useCallback((ticketId: string, text: string) => {
    const comment: Comment = { id: crypto.randomUUID(), author: currentUser?.name || 'Sistema', text, createdAt: new Date().toISOString() };
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, comments: [...t.comments, comment] } : t));
  }, [currentUser]);

  const updateSMTP = useCallback((config: SMTPConfig) => setSMTP(config), []);

  return (
    <AppContext.Provider value={{ currentUser, tickets, technicians: TECHNICIANS, smtpConfig, login, logout, createTicket, updateTicketStatus, assignTicket, addComment, updateSMTP }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};
