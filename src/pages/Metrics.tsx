import React from "react";
import { useTickets } from "@/contexts/TicketContext";
import { Box, Heading, Text, Card, SimpleGrid } from "@chakra-ui/react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const COLORS = ["#2563eb", "#f59e0b", "#22c55e"];
const PRIORITY_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

const Metrics: React.FC = () => {
  const { tickets } = useTickets();

  const statusData = [
    { name: "Abierto", value: tickets.filter((t) => t.status === "Abierto").length },
    { name: "En Proceso", value: tickets.filter((t) => t.status === "En Proceso").length },
    { name: "Resuelto", value: tickets.filter((t) => t.status === "Resuelto").length },
  ];

  const categoryData = [
    { name: "Software", value: tickets.filter((t) => t.category === "Software").length },
    { name: "Hardware", value: tickets.filter((t) => t.category === "Hardware").length },
    { name: "Redes", value: tickets.filter((t) => t.category === "Redes").length },
  ];

  const priorityData = [
    { name: "Baja", value: tickets.filter((t) => t.priority === "Baja").length },
    { name: "Media", value: tickets.filter((t) => t.priority === "Media").length },
    { name: "Alta", value: tickets.filter((t) => t.priority === "Alta").length },
  ];

  return (
    <Box>
      <Heading size="lg" mb="1">Métricas</Heading>
      <Text color="gray.500" mb="6">Resumen visual del estado de los tickets.</Text>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap="6">
        <Card.Root>
          <Card.Header>
            <Text fontWeight="semibold">Tickets por Estado</Text>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" fontSize={12} />
                <YAxis allowDecimals={false} fontSize={12} />
                <Tooltip />
                <Bar dataKey="value" name="Tickets" radius={[4, 4, 0, 0]}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card.Root>

        <Card.Root>
          <Card.Header>
            <Text fontWeight="semibold">Tickets por Categoría</Text>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" label={({ name, value }) => `${name}: ${value}`} fontSize={12}>
                  {categoryData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card.Root>

        <Card.Root gridColumn={{ lg: "span 2" }}>
          <Card.Header>
            <Text fontWeight="semibold">Tickets por Prioridad</Text>
          </Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis type="number" allowDecimals={false} fontSize={12} />
                <YAxis type="category" dataKey="name" fontSize={12} width={60} />
                <Tooltip />
                <Bar dataKey="value" name="Tickets" radius={[0, 4, 4, 0]}>
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={PRIORITY_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card.Root>
      </SimpleGrid>
    </Box>
  );
};

export default Metrics;
