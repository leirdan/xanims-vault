import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, Button, Box, Typography } from "@mui/material";
import CatStatsCharts from "@/components/CatStatsCharts";
import { GetCatByDocumentId, GetConsumptions, GetIntrusionAlerts } from "@/lib/actions";

export default async function CatStatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cat = await GetCatByDocumentId(id);

    if (!cat) {
        notFound();
    }

    const [consumptions, intrusionAlerts] = await Promise.all([
        GetConsumptions(id),
        GetIntrusionAlerts(id),
    ]);

    return <Container maxWidth="md" sx={{ py: 4 }}>
        <Link href="/home" passHref style={{ textDecoration: 'none' }}>
            <Button sx={{ color: "text.primary", mb: 2 }}>
                Voltar
            </Button>
        </Link>
        <Box sx={{ mb: 3 }}>
            <Typography variant="h1" sx={{ fontSize: "2rem", color: "text.primary" }}>
                Estatísticas de {cat.name}
            </Typography>
        </Box>
        <CatStatsCharts
            catName={cat.name}
            expectedPortion={cat.diet?.portion}
            consumptions={consumptions}
            intrusionAlerts={intrusionAlerts}
        />
    </Container>
}
