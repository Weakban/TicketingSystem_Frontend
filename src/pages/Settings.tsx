import React, { useState } from "react";
import { Box, Heading, Text, Input, Button, Card, Flex, SimpleGrid, Field } from "@chakra-ui/react";
import { toaster } from "@/components/ui/toaster";
import { Save, Server } from "lucide-react";

const Settings: React.FC = () => {
  const [smtp, setSmtp] = useState({
    host: "smtp.televisa.com.mx",
    port: "587",
    user: "soporte@televisa.com.mx",
    password: "",
    from: "soporte-ti@televisa.com.mx",
  });

  const handleChange = (field: string, value: string) => {
    setSmtp((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toaster.create({ title: "Configuración guardada", description: "Los ajustes SMTP se han actualizado correctamente.", type: "success" });
  };

  return (
    <Box maxW="2xl">
      <Heading size="lg" mb="1">Configuración</Heading>
      <Text color="gray.500" mb="6">Configuración del servidor de correo para notificaciones.</Text>

      <Card.Root>
        <Card.Header>
          <Flex alignItems="center" gap="3">
            <Flex h="10" w="10" alignItems="center" justifyContent="center" borderRadius="lg" bg="blue.50">
              <Server size={20} color="#2563eb" />
            </Flex>
            <Box>
              <Heading size="md">Servidor SMTP Corporativo</Heading>
              <Text fontSize="sm" color="gray.500">Configura la conexión al servidor de correo @televisa.com.mx</Text>
            </Box>
          </Flex>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSave}>
            <Box display="flex" flexDirection="column" gap="5">
              <SimpleGrid columns={{ base: 1, sm: 2 }} gap="4">
                <Field.Root>
                  <Field.Label>Host del servidor</Field.Label>
                  <Input placeholder="smtp.televisa.com.mx" value={smtp.host} onChange={(e) => handleChange("host", e.target.value)} />
                </Field.Root>
                <Field.Root>
                  <Field.Label>Puerto</Field.Label>
                  <Input placeholder="587" value={smtp.port} onChange={(e) => handleChange("port", e.target.value)} />
                </Field.Root>
              </SimpleGrid>
              <Field.Root>
                <Field.Label>Usuario SMTP</Field.Label>
                <Input placeholder="soporte@televisa.com.mx" value={smtp.user} onChange={(e) => handleChange("user", e.target.value)} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Contraseña</Field.Label>
                <Input type="password" placeholder="••••••••" value={smtp.password} onChange={(e) => handleChange("password", e.target.value)} />
              </Field.Root>
              <Field.Root>
                <Field.Label>Correo remitente</Field.Label>
                <Input placeholder="soporte-ti@televisa.com.mx" value={smtp.from} onChange={(e) => handleChange("from", e.target.value)} />
              </Field.Root>
              <Button type="submit" colorPalette="blue" alignSelf="flex-start">
                <Save size={16} />
                Guardar Configuración
              </Button>
            </Box>
          </form>
        </Card.Body>
      </Card.Root>
    </Box>
  );
};

export default Settings;
