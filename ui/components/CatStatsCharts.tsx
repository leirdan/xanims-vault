'use client';

import { Box, Paper, Typography, Stack, List, ListItem, ListItemText, Chip } from "@mui/material";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ReferenceLine,
    PieChart,
    Pie,
    Cell,
    Legend,
} from "recharts";

interface CatStatsChartsProps {
    catName: string;
    expectedPortion?: number;
    consumptions: Consumption[];
    intrusionAlerts: IntrusionAlert[];
}

const TYPE_COLORS: Record<string, string> = {
    "Completo": "#4CAF50",
    "Parcial": "#E6B800",
    "Não consumiu": "#D32F2F",
};

const CARD_SX = {
    p: 3,
    backgroundColor: "background.paper",
    borderRadius: "8px",
};

const CatStatsCharts = ({ catName, expectedPortion, consumptions, intrusionAlerts }: CatStatsChartsProps) => {
    const consumptionSeries = consumptions.map((c) => ({
        label: new Date(c.createdAt).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }),
        amount: c.amount,
        type: c.consumption_type?.description || "Desconhecido",
    }));

    const typeCounts: Record<string, number> = {};
    for (const c of consumptions) {
        const type = c.consumption_type?.description || "Desconhecido";
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    }
    const typeData = Object.entries(typeCounts).map(([name, value]) => ({ name, value }));

    return (
        <Stack spacing={3}>
            <Paper elevation={2} sx={CARD_SX}>
                <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 2, color: "text.primary" }}>
                    Consumo ao longo do tempo
                </Typography>
                {consumptionSeries.length === 0 ? (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                        Ainda não há leituras de consumo registradas para {catName}.
                    </Typography>
                ) : (
                    <Box sx={{ width: "100%", height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={consumptionSeries} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(230, 211, 197, 0.15)" />
                                <XAxis dataKey="label" tick={{ fill: "#CFAF9A", fontSize: 11 }} />
                                <YAxis tick={{ fill: "#CFAF9A", fontSize: 11 }} label={{ value: "gramas", angle: -90, position: "insideLeft", fill: "#CFAF9A" }} />
                                <Tooltip contentStyle={{ backgroundColor: "#1E1E1E", border: "1px solid #A6331B" }} labelStyle={{ color: "#E6D3C5" }} />
                                {expectedPortion && (
                                    <ReferenceLine y={expectedPortion} stroke="#E6D3C5" strokeDasharray="4 4" label={{ value: "porção esperada", fill: "#E6D3C5", fontSize: 11, position: "insideTopLeft" }} />
                                )}
                                <Line type="monotone" dataKey="amount" stroke="#A6331B" strokeWidth={2} dot={{ r: 3 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Paper>

            <Paper elevation={2} sx={CARD_SX}>
                <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 2, color: "text.primary" }}>
                    Tipos de consumo
                </Typography>
                {typeData.length === 0 ? (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                        Sem dados suficientes ainda.
                    </Typography>
                ) : (
                    <Box sx={{ width: "100%", height: 260 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie data={typeData} dataKey="value" nameKey="name" outerRadius={90} label>
                                    {typeData.map((entry) => (
                                        <Cell key={entry.name} fill={TYPE_COLORS[entry.name] || "#8884d8"} />
                                    ))}
                                </Pie>
                                <Legend wrapperStyle={{ color: "#E6D3C5" }} />
                                <Tooltip contentStyle={{ backgroundColor: "#1E1E1E", border: "1px solid #A6331B" }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Box>
                )}
            </Paper>

            <Paper elevation={2} sx={CARD_SX}>
                <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 2, color: "text.primary" }}>
                    Alertas de invasores
                </Typography>
                {intrusionAlerts.length === 0 ? (
                    <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                        Nenhum invasor detectado no comedouro de {catName}.
                    </Typography>
                ) : (
                    <List sx={{ p: 0 }}>
                        {intrusionAlerts.map((alert) => (
                            <ListItem key={alert.documentId} sx={{ px: 0 }}>
                                <ListItemText
                                    primary={
                                        <Typography variant="body1" sx={{ color: "text.primary" }}>
                                            NFC do invasor: {alert.intruder_nfc}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {new Date(alert.date).toLocaleString("pt-BR")}
                                        </Typography>
                                    }
                                />
                                <Chip size="small" label="Intruso" sx={{ backgroundColor: "#D32F2F", color: "#fff" }} />
                            </ListItem>
                        ))}
                    </List>
                )}
            </Paper>
        </Stack>
    );
};

export default CatStatsCharts;
