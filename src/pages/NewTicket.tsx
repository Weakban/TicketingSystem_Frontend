import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTickets } from "@/contexts/TicketContext";
import type { TicketCategory, TicketPriority} from "@/contexts/TicketContext";
import { Box, Heading, Text, Input, Button, Textarea, Card, NativeSelect, Field, SimpleGrid } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Send } from "lucide-react";

const NewTicket: React.FC = () => {
  const { user } = useAuth();
  const { createTicket } = useTickets();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TicketCategory | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "El título es obligatorio";
    if (title.trim().length > 0 && title.trim().length < 5) errs.title = "El título debe tener al menos 5 caracteres";
    if (!category) errs.category = "Selecciona una categoría";
    if (!priority) errs.priority = "Selecciona una prioridad";
    if (!description.trim()) errs.description = "La descripción es obligatoria";
    if (description.trim().length > 0 && description.trim().length < 10) errs.description = "La descripción debe tener al menos 10 caracteres";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate() || !user) return;
    const ticket = createTicket({
      title: title.trim(),
      category: category as TicketCategory,
      priority: priority as TicketPriority,
      description: description.trim(),
      createdBy: user.id,
      createdByName: user.name,
    });
    toaster.create({ title: "Ticket creado", description: `${ticket.id} se ha creado correctamente.`, type: "success" });
    navigate("/mis-tickets");
  };

  return (
    <Box maxW="2xl">
      <Heading size="lg" mb="1">Nuevo Ticket</Heading>
      <Text color="gray.500" mb="6">Describe tu problema para que el equipo de soporte pueda ayudarte.</Text>

      <Card.Root>
        <Card.Header>
          <Heading size="md">Formulario de Solicitud</Heading>
          <Text fontSize="sm" color="gray.500">Todos los campos son obligatorios</Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="5">
              <Field.Root invalid={!!errors.title}>
                <Field.Label>Título del problema</Field.Label>
                <Input
                  placeholder="Ej: No puedo acceder al sistema SAP"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                {errors.title && <Field.ErrorText>{errors.title}</Field.ErrorText>}
              </Field.Root>

              <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                <Field.Root invalid={!!errors.category}>
                  <Field.Label>Categoría</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={category}
                      onChange={(e) => setCategory(e.target.value as TicketCategory)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Software">Software</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Redes">Redes</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {errors.category && <Field.ErrorText>{errors.category}</Field.ErrorText>}
                </Field.Root>

                <Field.Root invalid={!!errors.priority}>
                  <Field.Label>Prioridad</Field.Label>
                  <NativeSelect.Root>
                    <NativeSelect.Field
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as TicketPriority)}
                    >
                      <option value="">Seleccionar...</option>
                      <option value="Baja">Baja</option>
                      <option value="Media">Media</option>
                      <option value="Alta">Alta</option>
                    </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                  {errors.priority && <Field.ErrorText>{errors.priority}</Field.ErrorText>}
                </Field.Root>
              </SimpleGrid>

              <Field.Root invalid={!!errors.description}>
                <Field.Label>Descripción detallada</Field.Label>
                <Textarea
                  placeholder="Describe el problema con el mayor detalle posible..."
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                {errors.description && <Field.ErrorText>{errors.description}</Field.ErrorText>}
              </Field.Root>

              <Button type="submit" colorPalette="blue" w={{ base: "full", sm: "auto" }} alignSelf="flex-start">
                <Send size={16} />
                Enviar Ticket
              </Button>
            </Box>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default NewTicket;
