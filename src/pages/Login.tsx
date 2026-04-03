import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Box, Flex, Text, Heading, Input, Button, Card } from "@chakra-ui/react";
import { Headset, AlertCircle } from "lucide-react";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Por favor completa todos los campos.");
      return;
    }
    setLoading(true);
    const success = await login(email, password);
    setLoading(false);
    if (success) {
      navigate("/dashboard");
    } else {
      setError("Credenciales incorrectas. Intenta de nuevo.");
    }
  };

  return (
    <Flex minH="100vh" alignItems="center" justifyContent="center" bg="gray.100" p="4">
      <Card.Root w="full" maxW="md" shadow="lg">
        <Card.Header textAlign="center">
          <Flex
            mx="auto"
            mb="4"
            h="16"
            w="16"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            bg="blue.600"
          >
            <Headset size={32} color="white" />
          </Flex>
          <Heading size="lg">HelpDesk TI</Heading>
          <Text color="gray.500" fontSize="sm" mt="1">
            Sistema de Gestión de Tickets — Intranet
          </Text>
        </Card.Header>
        <Card.Body>
          <form onSubmit={handleSubmit}>
            <Box display="flex" flexDirection="column" gap="4">
              {error && (
                <Flex
                  alignItems="center"
                  gap="2"
                  borderRadius="md"
                  bg="red.50"
                  p="3"
                  fontSize="sm"
                  color="red.600"
                >
                  <AlertCircle size={16} style={{ flexShrink: 0 }} />
                  {error}
                </Flex>
              )}
              <Box>
                <label htmlFor="email" style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
                  Correo electrónico
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="usuario@televisa.com.mx"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Box>
              <Box>
                <label htmlFor="password" style={{ fontSize: "0.875rem", fontWeight: 500, marginBottom: "4px", display: "block" }}>
                  Contraseña
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Box>
              <Button type="submit" colorPalette="blue" w="full" loading={loading} loadingText="Ingresando...">
                Iniciar Sesión
              </Button>
            </Box>
          </form>
          <Box mt="6" borderRadius="md" borderWidth="1px" borderColor="gray.200" bg="gray.50" p="3" fontSize="xs" color="gray.500">
            <Text fontWeight="semibold" mb="1">Usuarios de prueba (contraseña: 123456):</Text>
            <Text>• empleado@televisa.com.mx (Empleado)</Text>
            <Text>• tecnico@televisa.com.mx (Técnico)</Text>
            <Text>• admin@televisa.com.mx (Administrador)</Text>
          </Box>
        </Card.Body>
      </Card.Root>
    </Flex>
  );
};

export default Login;
