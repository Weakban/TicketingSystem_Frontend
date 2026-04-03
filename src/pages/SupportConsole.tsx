import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTickets } from "@/contexts/TicketContext";
import type { TicketStatus } from "@/contexts/TicketContext";
import { Box, Heading, Text, Card, Table, Badge, IconButton, Flex, NativeSelect, Button, Dialog, Portal } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Eye, UserPlus } from "lucide-react";

const TECHNICIANS = [
  { id: "usr-002", name: "Ana García" },
  { id: "usr-003", name: "Luis Martínez" },
];

const SupportConsole: React.FC = () => {
  const { tickets, updateTicketStatus, assignTicket } = useTickets();
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>("");
  const [selectedTech, setSelectedTech] = useState<string>("");

  const filtered = tickets.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (priorityFilter !== "all" && t.priority !== priorityFilter) return false;
    return true;
  });

  const handleAssign = () => {
    const tech = TECHNICIANS.find((t) => t.id === selectedTech);
    if (tech && selectedTicketId) {
      assignTicket(selectedTicketId, tech.id, tech.name);
      toaster.create({ title: "Ticket asignado", description: `Asignado a ${tech.name}`, type: "success" });
      setAssignDialogOpen(false);
      setSelectedTech("");
    }
  };

  const priorityColor = (p: string) =>
    p === "Alta" ? "red" : p === "Media" ? "orange" : "gray";

  const statusColor = (s: string) =>
    s === "Abierto" ? "orange" : s === "En Proceso" ? "blue" : "green";

  return (
    <Box>
      <Heading size="lg" mb="1">Consola de Soporte</Heading>
      <Text color="gray.500" mb="6">Gestiona y asigna tickets del equipo.</Text>

      {/* Filters */}
      <Flex gap="3" mb="4" flexWrap="wrap">
        <NativeSelect.Root w="180px">
          <NativeSelect.Field value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">Todos los estados</option>
            <option value="Abierto">Abierto</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Resuelto">Resuelto</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
        <NativeSelect.Root w="180px">
          <NativeSelect.Field value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
            <option value="all">Todas las prioridades</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </NativeSelect.Field>
          <NativeSelect.Indicator />
        </NativeSelect.Root>
      </Flex>

      <Card.Root>
        <Card.Header>
          <Text fontSize="md" fontWeight="semibold">Todos los tickets ({filtered.length})</Text>
        </Card.Header>
        <Card.Body p="0">
          <Box overflowX="auto">
            <Table.Root>
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeader>ID</Table.ColumnHeader>
                  <Table.ColumnHeader>Título</Table.ColumnHeader>
                  <Table.ColumnHeader>Solicitante</Table.ColumnHeader>
                  <Table.ColumnHeader>Categoría</Table.ColumnHeader>
                  <Table.ColumnHeader>Prioridad</Table.ColumnHeader>
                  <Table.ColumnHeader>Estado</Table.ColumnHeader>
                  <Table.ColumnHeader>Asignado a</Table.ColumnHeader>
                  <Table.ColumnHeader>Acciones</Table.ColumnHeader>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {filtered.map((t) => (
                  <Table.Row key={t.id}>
                    <Table.Cell fontFamily="mono" fontSize="xs">{t.id}</Table.Cell>
                    <Table.Cell fontWeight="medium" maxW="200px" truncate>{t.title}</Table.Cell>
                    <Table.Cell fontSize="sm">{t.createdByName}</Table.Cell>
                    <Table.Cell>{t.category}</Table.Cell>
                    <Table.Cell>
                      <Badge colorPalette={priorityColor(t.priority)} variant="subtle">{t.priority}</Badge>
                    </Table.Cell>
                    <Table.Cell>
                      <NativeSelect.Root size="sm" w="130px">
                        <NativeSelect.Field
                          value={t.status}
                          onChange={(e) => updateTicketStatus(t.id, e.target.value as TicketStatus)}
                        >
                          <option value="Abierto">Abierto</option>
                          <option value="En Proceso">En Proceso</option>
                          <option value="Resuelto">Resuelto</option>
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Table.Cell>
                    <Table.Cell fontSize="sm">{t.assignedToName || "—"}</Table.Cell>
                    <Table.Cell>
                      <Flex gap="1">
                        <IconButton aria-label="Ver" variant="ghost" size="sm" onClick={() => navigate(`/ticket/${t.id}`)}>
                          <Eye size={16} />
                        </IconButton>
                        <IconButton
                          aria-label="Asignar"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedTicketId(t.id);
                            setAssignDialogOpen(true);
                          }}
                        >
                          <UserPlus size={16} />
                        </IconButton>
                      </Flex>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          </Box>
        </Card.Body>
      </Card.Root>

      {/* Assign Dialog */}
      <Dialog.Root open={assignDialogOpen} onOpenChange={(e) => setAssignDialogOpen(e.open)}>
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Asignar Ticket {selectedTicketId}</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={selectedTech}
                    onChange={(e) => setSelectedTech(e.target.value)}
                  >
                    <option value="">Seleccionar técnico...</option>
                    {TECHNICIANS.map((tech) => (
                      <option key={tech.id} value={tech.id}>{tech.name}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Dialog.Body>
              <Dialog.Footer>
                <Flex gap="2">
                  <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancelar</Button>
                  <Button colorPalette="blue" onClick={handleAssign} disabled={!selectedTech}>Asignar</Button>
                </Flex>
              </Dialog.Footer>
              <Dialog.CloseTrigger />
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </Box>
  );
};

export default SupportConsole;
