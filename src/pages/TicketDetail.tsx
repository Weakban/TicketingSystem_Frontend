import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import { Box, Heading, Text, Card, Badge, Button, Textarea, Flex, Separator, SimpleGrid } from "@chakra-ui/react";
import { ArrowLeft, Send, User, Clock } from "lucide-react";

const TicketDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { getTicketById, addComment } = useTickets();
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  const ticket = id ? getTicketById(id) : undefined;

  if (!ticket) {
    return (
      <Box textAlign="center" py="12">
        <Text color="gray.500">Ticket no encontrado.</Text>
        <Button variant="outline" mt="4" onClick={() => navigate(-1)}>Volver</Button>
      </Box>
    );
  }

  const handleAddComment = () => {
    if (!newComment.trim() || !user) return;
    addComment(ticket.id, user.id, user.name, newComment.trim());
    setNewComment("");
  };

  const priorityColor = ticket.priority === "Alta" ? "red" : ticket.priority === "Media" ? "orange" : "gray";
  const statusColor = ticket.status === "Abierto" ? "orange" : ticket.status === "En Proceso" ? "blue" : "green";

  return (
    <Box maxW="3xl">
      <Button variant="ghost" mb="4" onClick={() => navigate(-1)}>
        <ArrowLeft size={16} />
        Volver
      </Button>

      <Card.Root mb="6">
        <Card.Header>
          <Flex justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Text fontSize="sm" color="gray.500" fontFamily="mono">{ticket.id}</Text>
              <Heading size="md" mt="1">{ticket.title}</Heading>
            </Box>
            <Flex gap="2">
              <Badge colorPalette={priorityColor} variant="subtle">{ticket.priority}</Badge>
              <Badge colorPalette={statusColor} variant="outline">{ticket.status}</Badge>
            </Flex>
          </Flex>
        </Card.Header>
        <Card.Body>
          <Text mb="4" whiteSpace="pre-wrap">{ticket.description}</Text>
          <SimpleGrid columns={{ base: 1, sm: 2 }} gap="2" fontSize="sm" color="gray.500">
            <Text><strong>Categoría:</strong> {ticket.category}</Text>
            <Text><strong>Solicitante:</strong> {ticket.createdByName}</Text>
            <Text><strong>Asignado a:</strong> {ticket.assignedToName || "Sin asignar"}</Text>
            <Text><strong>Creado:</strong> {new Date(ticket.createdAt).toLocaleString("es-MX")}</Text>
          </SimpleGrid>
        </Card.Body>
      </Card.Root>

      {/* Comments */}
      <Card.Root>
        <Card.Header>
          <Text fontWeight="semibold">Historial de Comentarios ({ticket.comments.length})</Text>
        </Card.Header>
        <Card.Body>
          {ticket.comments.length === 0 ? (
            <Text fontSize="sm" color="gray.500" py="4" textAlign="center">No hay comentarios aún.</Text>
          ) : (
            <Box display="flex" flexDirection="column" gap="4" mb="6">
              {ticket.comments.map((c) => (
                <Flex key={c.id} gap="3">
                  <Flex
                    h="8"
                    w="8"
                    flexShrink={0}
                    alignItems="center"
                    justifyContent="center"
                    borderRadius="full"
                    bg="blue.50"
                  >
                    <User size={16} color="#2563eb" />
                  </Flex>
                  <Box flex="1">
                    <Flex alignItems="center" gap="2">
                      <Text fontSize="sm" fontWeight="medium">{c.authorName}</Text>
                      <Flex alignItems="center" gap="1" fontSize="xs" color="gray.400">
                        <Clock size={12} />
                        {new Date(c.createdAt).toLocaleString("es-MX")}
                      </Flex>
                    </Flex>
                    <Text mt="1" fontSize="sm">{c.content}</Text>
                  </Box>
                </Flex>
              ))}
            </Box>
          )}

          <Separator mb="4" />
          <Textarea
            placeholder="Escribe un comentario..."
            rows={3}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <Button mt="3" colorPalette="blue" onClick={handleAddComment} disabled={!newComment.trim()}>
            <Send size={16} />
            Enviar comentario
          </Button>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default TicketDetail;
