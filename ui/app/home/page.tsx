"use server";

import { GetCatsWithDetails } from "@/lib/actions";
import {
    Container,
    Box,
    Typography,
    Button,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Chip,
    Divider,
    Stack,
    Alert,
} from "@mui/material";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import PetsIcon from "@mui/icons-material/Pets";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import EditIcon from "@mui/icons-material/EditOutlined";
import QueryStatsIcon from "@mui/icons-material/QueryStatsOutlined";

function isValidDate(date: string) {
    return !!date && !isNaN(new Date(date).getTime());
}

function formatBirthDate(date: string) {
    if (!isValidDate(date)) return "Não informada";

    return new Date(date).toLocaleDateString("pt-BR");
}

function calculateAge(birthDate: string): string {
    if (!isValidDate(birthDate)) {
        return "idade indisponível";
    }

    const birth = new Date(birthDate);
    const now = new Date();

    let months =
        (now.getFullYear() - birth.getFullYear()) * 12 +
        (now.getMonth() - birth.getMonth());

    if (now.getDate() < birth.getDate()) {
        months--;
    }

    if (months < 0) {
        return "idade indisponível";
    }

    if (months < 12) {
        return `${months} ${months === 1 ? "mês" : "meses"}`;
    }

    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return `${years} ${years === 1 ? "ano" : "anos"}${
        remainingMonths > 0
            ? ` e ${remainingMonths} ${remainingMonths === 1 ? "mês" : "meses"}`
            : ""
    }`;
}


const Page = async (): Promise<JSX.Element> => {
    let cats: CatDetails[] = [];

    try {
        cats = await GetCatsWithDetails();
    } catch (error) {
        console.error(error);

        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    Não foi possível carregar os gatos.
                </Alert>
            </Container>
        );
    }

    console.log("Cats:", cats);

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 4,
                    flexDirection: { xs: "column", sm: "row" },
                    gap: 2
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <PetsIcon sx={{ fontSize: 40, color: "text.primary" }} />
                    <Typography variant="h1" color="text.primary" sx={{ fontSize: { xs: "2rem", sm: "2.5rem" } }}>
                        Lista de Gatos
                    </Typography>
                </Box>

                <Link href="/cats/new" passHref style={{ textDecoration: 'none' }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<AddCircleOutlineIcon />}
                        sx={{
                            backgroundColor: "black",
                            color: "text.primary",
                            px: 3,
                            py: 1,
                            '&:hover': {
                                backgroundColor: "#222",
                            }
                        }}
                    >
                        Vincular Gato
                    </Button>
                </Link>
            </Box>

            {cats.length === 0 ? (
                <Paper
                    elevation={0}
                    sx={{
                        p: 4,
                        textAlign: "center",
                        backgroundColor: "background.paper",
                        borderRadius: "8px"
                    }}
                >
                    <Typography variant="subtitle1" color="text.secondary">
                        Nenhum gato encontrado.
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {cats.map((cat) => {
                        return (
                            <Accordion
                                key={cat.id}
                                component={Paper}
                                elevation={2}
                                defaultExpanded={cats.length === 1}
                                sx={{
                                    backgroundColor: "background.paper",
                                    borderLeft: "6px solid",
                                    borderColor: "primary.main",
                                    borderRadius: "4px 8px 8px 4px !important",
                                    "&:before": { display: "none" },
                                }}
                            >
                                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "text.secondary" }} />}>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5, width: "100%" }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap" }}>
                                            <Typography variant="h2" sx={{ fontSize: "1.25rem", color: "text.primary" }}>
                                                {cat.name || "Gato sem nome"}
                                            </Typography>
                                            {cat.nfc ? (
                                                <Chip size="small" label="NFC vinculado" color="primary" variant="outlined" />
                                            ) : (
                                                <Chip size="small" label="Sem NFC" variant="outlined" sx={{ color: "text.secondary", borderColor: "text.secondary" }} />
                                            )}
                                            {cat.neutered && (
                                                <Chip size="small" label="Castrado" variant="outlined" sx={{ color: "text.secondary", borderColor: "text.secondary" }} />
                                            )}
                                        </Box>
                                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                            {calculateAge(cat.birth_date)} • {cat.weight} kg
                                            {cat.life_stage_factor ? ` • ${cat.life_stage_factor.description}` : ""}
                                        </Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Divider sx={{ mb: 2, borderColor: "rgba(230, 211, 197, 0.15)" }} />
                                    <Stack spacing={1.5}>
                                        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1 }}>
                                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                <b style={{ color: "#E6D3C5" }}>Nascimento:</b>{" "}{formatBirthDate(cat.birth_date)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                <b style={{ color: "#E6D3C5" }}>NFC:</b> {cat.nfc || "não cadastrado"}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                <b style={{ color: "#E6D3C5" }}>Peso:</b> {cat.weight} kg
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                <b style={{ color: "#E6D3C5" }}>Fase de vida:</b> {cat.life_stage_factor?.description || "não definida"}
                                            </Typography>
                                        </Box>

                                        {cat.diet ? (
                                            <Box sx={{ mt: 1 }}>
                                                <Typography variant="subtitle2" sx={{ color: "text.primary", fontWeight: 700, mb: 0.5 }}>
                                                    Dieta atual
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                    {cat.diet.portion?.toFixed(1)} g por refeição
                                                    {cat.diet.ration ? ` de ${cat.diet.ration.description}${cat.diet.ration.brand ? ` (${cat.diet.ration.brand})` : ""}` : ""}
                                                </Typography>
                                                {cat.schedules.length > 0 && (
                                                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                                        Horários: {cat.schedules.map(s => s.hour.substring(0, 5)).join(", ")}
                                                    </Typography>
                                                )}
                                            </Box>
                                        ) : (
                                            <Typography variant="body2" sx={{ color: "text.secondary", fontStyle: "italic" }}>
                                                Nenhuma dieta cadastrada ainda.
                                            </Typography>
                                        )}

                                        <Box sx={{ display: "flex", gap: 1.5, mt: 1, flexWrap: "wrap" }}>
                                            <Link href={`/cats/${cat.documentId}/edit`} passHref style={{ textDecoration: "none" }}>
                                                <Button size="small" variant="outlined" startIcon={<EditIcon />} sx={{ color: "text.primary", borderColor: "text.primary" }}>
                                                    Editar / Gerar dieta
                                                </Button>
                                            </Link>
                                            <Link href={`/cats/${cat.documentId}/stats`} passHref style={{ textDecoration: "none" }}>
                                                <Button size="small" variant="outlined" startIcon={<QueryStatsIcon />} sx={{ color: "text.primary", borderColor: "text.primary" }}>
                                                    Estatísticas de consumo
                                                </Button>
                                            </Link>
                                        </Box>
                                    </Stack>
                                </AccordionDetails>
                            </Accordion>
                        );
                    })}
                </Stack>
            )}
        </Container>
    );
}

export default Page;
