import Link from "next/link";
import {
    Container,
    Button,
} from "@mui/material";
import AddCatForm from "@/components/AddCatForm";
import { GetLifeStageFactors } from "@/lib/actions";


export default async function NewCatPage() {
    const lifeStageFactors = await GetLifeStageFactors();
    return <Container maxWidth="sm" sx={{ py: 4 }}>
        <Link href="/home" passHref style={{ textDecoration: 'none' }}>
            <Button
                // startIcon={<ArrowBackIcon />}
                sx={{ color: "text.primary", mb: 2 }}
            >
                Voltar
            </Button>
        </Link>
        <AddCatForm lifeStageFactors={lifeStageFactors} />
    </Container >
}