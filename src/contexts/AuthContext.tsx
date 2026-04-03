import React, { createContext, useContext, useState, useCallback } from "react";

export type UserRole = "employee" | "technician" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const MOCK_USERS: Record<string, User & { password: string }> = {
  "empleado@televisa.com.mx": {
    id: "usr-001",
    name: "Carlos Hernández",
    email: "empleado@televisa.com.mx",
    role: "employee",
    department: "Producción",
    password: "123456",
  },
  "tecnico@televisa.com.mx": {
    id: "usr-002",
    name: "Ana García",
    email: "tecnico@televisa.com.mx",
    role: "technician",
    department: "Soporte TI",
    password: "123456",
  },
  "admin@televisa.com.mx": {
    id: "usr-003",
    name: "Luis Martínez",
    email: "admin@televisa.com.mx",
    role: "admin",
    department: "Sistemas",
    password: "123456",
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      const { password: _, ...userData } = mockUser;
      setUser(userData);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
