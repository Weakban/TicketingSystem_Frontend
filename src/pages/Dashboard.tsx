import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import { Box, Heading, Text, Card, SimpleGrid, Flex, Badge } from "@chakra-ui/react";
import { Ticket, Clock, CheckCircle, AlertTriangle } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tickets } = useTickets();

  const userTickets = tickets.filter((t) => t.createdBy === user?.id);
  const open = userTickets.filter((t) => t.status === "Abierto").length;
  const inProgress = userTickets.filter((t) => t.status === "En Proceso").length;
  const resolved = userTickets.filter((t) => t.status === "Resuelto").length;

  const stats = [
    { label: "Abiertos", value: open, icon: AlertTriangle, color: "orange.500" },
    { label: "En Proceso", value: inProgress, icon: Clock, color: "blue.500" },
    { label: "Resueltos", value: resolved, icon: CheckCircle, color: "green.500" },
    { label: "Total", value: userTickets.length, icon: Ticket, color: "gray.700" },
  ];

  const priorityColor = (p: string) =>
    p === "Alta" ? "red" : p === "Media" ? "orange" : "gray";

  const statusColor = (s: string) =>
    s === "Abierto" ? "orange" : s === "En Proceso" ? "blue" : "green";

  return (
    <Box>
      <Heading size="lg" mb="1">Dashboard</Heading>
      <Text color="gray.500" mb="6">Bienvenido, {user?.name}</Text>

      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap="4">
        {stats.map((s) => (
          <Card.Root key={s.label}>
            <Card.Header pb="2">
              <Flex justifyContent="space-between" alignItems="center">
                <Text fontSize="sm" fontWeight="medium" color="gray.500">{s.label}</Text>
                <s.icon size={20} color={s.color} />
              </Flex>
            </Card.Header>
            <Card.Body pt="0">
              <Text fontSize="3xl" fontWeight="bold">{s.value}</Text>
            </Card.Body>
          </Card.Root>
        ))}
      </SimpleGrid>

      <Box mt="8">
        <Heading size="md" mb="4">Tickets Recientes</Heading>
        {userTickets.length === 0 ? (
          <Text color="gray.500">No tienes tickets aún.</Text>
        ) : (
          <Box display="flex" flexDirection="column" gap="3">
            {userTickets.slice(0, 5).map((t) => (
              <Card.Root key={t.id} cursor="pointer" _hover={{ shadow: "md" }} transition="shadow 0.2s">
                <Card.Body p="4">
                  <Flex alignItems="center" justifyContent="space-between">
                    <Box>
                      <Text fontWeight="medium">{t.title}</Text>
                      <Text fontSize="sm" color="gray.500">
                        {t.id} · {t.category} · {new Date(t.createdAt).toLocaleDateString("es-MX")}
                      </Text>
                    </Box>
                    <Flex gap="2">
                      <Badge colorPalette={priorityColor(t.priority)} variant="subtle">{t.priority}</Badge>
                      <Badge colorPalette={statusColor(t.status)} variant="subtle">{t.status}</Badge>
                    </Flex>
                  </Flex>
                </Card.Body>
              </Card.Root>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Dashboard;
