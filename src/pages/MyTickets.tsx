import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import { Box, Heading, Text, Card, Table, Badge, IconButton } from "@chakra-ui/react";
import { Eye } from "lucide-react";

const MyTickets: React.FC = () => {
  const { user } = useAuth();
  const { getTicketsByUser } = useTickets();
  const navigate = useNavigate();
  const tickets = user ? getTicketsByUser(user.id) : [];

  const priorityColor = (p: string) =>
    p === "Alta" ? "red" : p === "Media" ? "orange" : "gray";

  const statusColor = (s: string) =>
    s === "Abierto" ? "orange" : s === "En Proceso" ? "blue" : "green";

  return (
    <Box>
      <Heading size="lg" mb="1">Mis Tickets</Heading>
      <Text color="gray.500" mb="6">Revisa el estado de tus solicitudes de soporte.</Text>

      {tickets.length === 0 ? (
        <Card.Root>
          <Card.Body py="12" textAlign="center" color="gray.500">
            No tienes tickets registrados aún.
          </Card.Body>
        </Card.Root>
      ) : (
        <Card.Root>
          <Card.Header>
            <Text fontSize="md" fontWeight="semibold">Listado de tickets ({tickets.length})</Text>
          </Card.Header>
          <Card.Body p="0">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Título</Table.ColumnHeader>
                  <Table.ColumnHeader>Categoría</Table.ColumnHeader>
                  <Table.ColumnHeader>Prioridad</Table.ColumnHeader>
                  <Table.ColumnHeader>Estado</Table.ColumnHeader>
                  <Table.ColumnHeader>Fecha</Table.ColumnHeader>
                  <Table.ColumnHeader w="12"></Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {tickets.map((t) => (
                  <Table.Row key={t.id}>
                    <Table.Cell fontFamily="mono" fontSize="xs">{t.id}</Table.Cell>
                    <Table.Cell fontWeight="medium">{t.title}</Table.Cell>
                    <Table.Cell>{t.category}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={priorityColor(t.priority)} variant="subtle">{t.priority}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={statusColor(t.status)} variant="outline">{t.status}</Badge>
                    </Table.Cell>
                    <Table.Cell fontSize="sm" color="gray.500">
                      {new Date(t.createdAt).toLocaleDateString("es-MX")}
                    </Table.Cell>
                    <Table.Cell>
                      <IconButton
                        aria-label="Ver ticket"
                        variant="ghost"
                        size="sm"
                        onClick={() => navigate(`/ticket/${t.id}`)}
                      >
                        <Eye size={16} />
                      </IconButton>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Card.Body>
        </Card.Root>
      )}
    </Box>
  );
};

export default MyTickets;
