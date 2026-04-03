import React, { createContext, useContext, useState, useCallback } from "react";

export type TicketCategory = "Software" | "Hardware" | "Redes";
export type TicketPriority = "Baja" | "Media" | "Alta";
export type TicketStatus = "Abierto" | "En Proceso" | "Resuelto";

export interface Comment {
  id: string;
  ticketId: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  category: TicketCategory;
  priority: TicketPriority;
  status: TicketStatus;
  createdBy: string;
  createdByName: string;
  assignedTo?: string;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  comments: Comment[];
}

interface TicketContextType {
  tickets: Ticket[];
  createTicket: (data: Omit<Ticket, "id" | "status" | "createdAt" | "updatedAt" | "comments">) => Ticket;
  updateTicketStatus: (id: string, status: TicketStatus) => void;
  assignTicket: (id: string, techId: string, techName: string) => void;
  addComment: (ticketId: string, authorId: string, authorName: string, content: string) => void;
  getTicketById: (id: string) => Ticket | undefined;
  getTicketsByUser: (userId: string) => Ticket[];
}

const now = () => new Date().toISOString();
let counter = 5;

const INITIAL_TICKETS: Ticket[] = [
  {
    id: "TK-001",
    title: "No puedo acceder al correo corporativo",
    description: "Desde esta mañana no puedo iniciar sesión en Outlook. Muestra error de autenticación.",
    category: "Software",
    priority: "Alta",
    status: "Abierto",
    createdBy: "usr-001",
    createdByName: "Carlos Hernández",
    createdAt: "2025-06-28T09:00:00Z",
    updatedAt: "2025-06-28T09:00:00Z",
    comments: [
      { id: "c1", ticketId: "TK-001", authorId: "usr-002", authorName: "Ana García", content: "Estoy revisando la configuración del servidor de correo.", createdAt: "2025-06-28T10:30:00Z" },
    ],
  },
  {
    id: "TK-002",
    title: "Impresora del piso 3 no imprime",
    description: "La impresora HP LaserJet del piso 3 no responde a los trabajos de impresión desde ninguna computadora.",
    category: "Hardware",
    priority: "Media",
    status: "En Proceso",
    createdBy: "usr-001",
    createdByName: "Carlos Hernández",
    assignedTo: "usr-002",
    assignedToName: "Ana García",
    createdAt: "2025-06-27T14:00:00Z",
    updatedAt: "2025-06-28T08:00:00Z",
    comments: [
      { id: "c2", ticketId: "TK-002", authorId: "usr-002", authorName: "Ana García", content: "Se reemplazó el tóner y se reinició la cola de impresión.", createdAt: "2025-06-28T08:00:00Z" },
    ],
  },
  {
    id: "TK-003",
    title: "Conexión lenta en sala de juntas",
    description: "La red WiFi en la sala de juntas principal tiene velocidades muy bajas, afectando las videollamadas.",
    category: "Redes",
    priority: "Alta",
    status: "Abierto",
    createdBy: "usr-001",
    createdByName: "Carlos Hernández",
    createdAt: "2025-06-29T11:00:00Z",
    updatedAt: "2025-06-29T11:00:00Z",
    comments: [],
  },
  {
    id: "TK-004",
    title: "Actualización de antivirus fallida",
    description: "El antivirus corporativo no se actualiza desde hace 2 semanas en mi equipo.",
    category: "Software",
    priority: "Baja",
    status: "Resuelto",
    createdBy: "usr-001",
    createdByName: "Carlos Hernández",
    assignedTo: "usr-002",
    assignedToName: "Ana García",
    createdAt: "2025-06-25T10:00:00Z",
    updatedAt: "2025-06-26T16:00:00Z",
    comments: [
      { id: "c3", ticketId: "TK-004", authorId: "usr-002", authorName: "Ana García", content: "Se reinstalaron las definiciones y se forzó la actualización. Problema resuelto.", createdAt: "2025-06-26T16:00:00Z" },
    ],
  },
];

const TicketContext = createContext<TicketContextType | undefined>(undefined);

export const TicketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tickets, setTickets] = useState<Ticket[]>(INITIAL_TICKETS);

  const createTicket = useCallback((data: Omit<Ticket, "id" | "status" | "createdAt" | "updatedAt" | "comments">) => {
    counter++;
    const ticket: Ticket = {
      ...data,
      id: `TK-${String(counter).padStart(3, "0")}`,
      status: "Abierto",
      createdAt: now(),
      updatedAt: now(),
      comments: [],
    };
    setTickets((prev) => [ticket, ...prev]);
    return ticket;
  }, []);

  const updateTicketStatus = useCallback((id: string, status: TicketStatus) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status, updatedAt: now() } : t))
    );
  }, []);

  const assignTicket = useCallback((id: string, techId: string, techName: string) => {
    setTickets((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, assignedTo: techId, assignedToName: techName, status: "En Proceso", updatedAt: now() } : t
      )
    );
  }, []);

  const addComment = useCallback((ticketId: string, authorId: string, authorName: string, content: string) => {
    const comment: Comment = {
      id: `c-${Date.now()}`,
      ticketId,
      authorId,
      authorName,
      content,
      createdAt: now(),
    };
    setTickets((prev) =>
      prev.map((t) =>
        t.id === ticketId ? { ...t, comments: [...t.comments, comment], updatedAt: now() } : t
      )
    );
  }, []);

  const getTicketById = useCallback((id: string) => tickets.find((t) => t.id === id), [tickets]);
  const getTicketsByUser = useCallback((userId: string) => tickets.filter((t) => t.createdBy === userId), [tickets]);

  return (
    <TicketContext.Provider value={{ tickets, createTicket, updateTicketStatus, assignTicket, addComment, getTicketById, getTicketsByUser }}>
      {children}
    </TicketContext.Provider>
  );
};

export const useTickets = () => {
  const ctx = useContext(TicketContext);
  if (!ctx) throw new Error("useTickets must be used within TicketProvider");
  return ctx;
};
