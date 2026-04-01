export type Priority = 'Baja' | 'Media' | 'Alta';
export type Status = 'Abierto' | 'En Proceso' | 'Resuelto';
export type Category = 'Software' | 'Hardware' | 'Redes';
export type UserRole = 'empleado' | 'tecnico' | 'admin';

export interface Comment {
  id: string;
  author: string;
  text: string;
  createdAt: string;
}

export interface Ticket {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  status: Status;
  description: string;
  createdAt: string;
  createdBy: string;
  assignedTo?: string;
  comments: Comment[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface SMTPConfig {
  host: string;
  port: string;
  user: string;
  pass: string;
  secure: boolean;
}
