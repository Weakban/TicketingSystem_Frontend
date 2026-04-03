import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { TicketProvider } from "@/contexts/TicketContext";
import { AppLayout } from "@/components/AppLayout";
import { Toaster } from "@/components/ui/toaster";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import NewTicket from "@/pages/NewTicket";
import MyTickets from "@/pages/MyTickets";
import SupportConsole from "@/pages/SupportConsole";
import TicketDetail from "@/pages/TicketDetail";
import Metrics from "@/pages/Metrics";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();


const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TicketProvider>
        <Outlet />
        <Toaster />
      </TicketProvider>
    </AuthProvider>
  </QueryClientProvider>
);

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/dashboard" replace />;
  return <AppLayout>{children}</AppLayout>;
};

const LoginRoute = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />;
};

const RootRedirect = () => {
  const { isAuthenticated } = useAuth();
  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
};

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <RootRedirect /> },
      { path: "/login", element: <LoginRoute /> },
      { path: "/dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
      { path: "/nuevo-ticket", element: <ProtectedRoute><NewTicket /></ProtectedRoute> },
      { path: "/mis-tickets", element: <ProtectedRoute><MyTickets /></ProtectedRoute> },
      { path: "/ticket/:id", element: <ProtectedRoute><TicketDetail /></ProtectedRoute> },
      { path: "/soporte", element: <ProtectedRoute roles={["technician", "admin"]}><SupportConsole /></ProtectedRoute> },
      { path: "/metricas", element: <ProtectedRoute roles={["technician", "admin"]}><Metrics /></ProtectedRoute> },
      { path: "/configuracion", element: <ProtectedRoute roles={["admin"]}><Settings /></ProtectedRoute> },
      { path: "*", element: <NotFound /> },
    ],
  },

]);



/*
   {
    path: "/",
    element: <AppLayout />,
    children: [
        {index: true, element: <h1>Home</h1>},
        {path: "dashboard", element: <Dashboard/>},
    ]
  },

  {path:"/app", element: <App/>,
    children:[
        {path:"dashboard", element: <h1>Dashboard</h1>},
    ]
  }

*/