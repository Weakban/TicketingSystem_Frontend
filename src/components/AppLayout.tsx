import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  TicketPlus, List, Headset, BarChart3, Settings,
  LogOut, LayoutDashboard, Menu, X,
} from "lucide-react";
import { Box, Flex, Text, IconButton } from "@chakra-ui/react";

interface NavItem {
  label: string;
  path: string;
  icon: React.ElementType;
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard, roles: ["employee", "technician", "admin"] },
  { label: "Nuevo Ticket", path: "/nuevo-ticket", icon: TicketPlus, roles: ["employee", "technician", "admin"] },
  { label: "Mis Tickets", path: "/mis-tickets", icon: List, roles: ["employee", "technician", "admin"] },
  { label: "Consola de Soporte", path: "/soporte", icon: Headset, roles: ["technician", "admin"] },
  { label: "Métricas", path: "/metricas", icon: BarChart3, roles: ["technician", "admin"] },
  { label: "Configuración SMTP", path: "/configuracion", icon: Settings, roles: ["admin"] },
];

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const filteredNav = NAV_ITEMS.filter((item) => user && item.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const sidebarWidth = sidebarOpen ? "256px" : "64px";

  return (
    <Flex minH="100vh" w="full">
      {/* Sidebar */}
      <Box
        as="aside"
        position="fixed"
        top="0"
        left="0"
        bottom="0"
        zIndex="40"
        w={sidebarWidth}
        bg="gray.900"
        color="gray.100"
        transition="width 0.3s"
        display="flex"
        flexDirection="column"
      >
        {/* Header */}
        <Flex
          h="16"
          alignItems="center"
          justifyContent="space-between"
          borderBottomWidth="1px"
          borderColor="gray.700"
          px="4"
        >
          {sidebarOpen && (
            <Flex alignItems="center" gap="2">
              <Headset size={24} color="#3b82f6" />
              <Text fontSize="sm" fontWeight="bold" letterSpacing="wide">HelpDesk TI</Text>
            </Flex>
          )}
          <IconButton
            aria-label="Toggle sidebar"
            variant="ghost"
            size="sm"
            color="gray.300"
            _hover={{ bg: "gray.800" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X size={16} /> : <Menu size={16} />}
          </IconButton>
        </Flex>

        {/* Navigation */}
        <Box flex="1" p="2" pt="4">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Box
                as="button"
                key={item.path}
                onClick={() => navigate(item.path)}
                display="flex"
                w="full"
                alignItems="center"
                gap="3"
                borderRadius="md"
                px="3"
                py="2.5"
                fontSize="sm"
                transition="all 0.2s"
                bg={isActive ? "gray.800" : "transparent"}
                color={isActive ? "blue.400" : "gray.400"}
                fontWeight={isActive ? "medium" : "normal"}
                _hover={{ bg: "gray.800", color: "gray.100" }}
                mb="1"
              >
                <item.icon size={20} style={{ flexShrink: 0 }} />
                {sidebarOpen && <Text>{item.label}</Text>}
              </Box>
            );
          })}
        </Box>

        {/* User info */}
        <Box borderTopWidth="1px" borderColor="gray.700" p="3">
          {sidebarOpen && user && (
            <Box mb="2" px="1">
              <Text fontSize="sm" fontWeight="medium">{user.name}</Text>
              <Text fontSize="xs" color="gray.500">{user.department}</Text>
            </Box>
          )}
          <Box
            as="button"
            onClick={handleLogout}
            display="flex"
            w="full"
            alignItems="center"
            gap="3"
            borderRadius="md"
            px="3"
            py="2"
            fontSize="sm"
            color="gray.400"
            _hover={{ bg: "gray.800", color: "gray.100" }}
            transition="all 0.2s"
          >
            <LogOut size={16} style={{ flexShrink: 0 }} />
            {sidebarOpen && <Text>Cerrar sesión</Text>}
          </Box>
        </Box>
      </Box>

      {/* Main content */}
      <Box
        as="main"
        flex="1"
        ml={sidebarWidth}
        transition="margin-left 0.3s"
      >
        <Box p={{ base: "6", lg: "8" }}>{children}</Box>
      </Box>
    </Flex>
  );
};
