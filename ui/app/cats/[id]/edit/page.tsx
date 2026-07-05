import Link from "next/link";
import { notFound } from "next/navigation";
import {
    Container,
    Button,
} from "@mui/material";
import EditCatForm from "@/components/EditCatForm";
import { GetCatByDocumentId, GetLifeStageFactors } from "@/lib/actions";

export default async function EditCatPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [cat, lifeStageFactors] = await Promise.all([
        GetCatByDocumentId(id),
        GetLifeStageFactors(),
    ]);

    if (!cat) {
        notFound();
    }

    return <Container maxWidth="sm" sx={{ py: 4 }}>
        <Link href="/home" passHref style={{ textDecoration: 'none' }}>
            <Button sx={{ color: "text.primary", mb: 2 }}>
                Voltar
            </Button>
        </Link>
        <EditCatForm cat={cat} lifeStageFactors={lifeStageFactors} />
    </Container>
}
