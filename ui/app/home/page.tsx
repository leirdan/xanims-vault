"use server";
import { GetCats } from "@/lib/actions";
import { Container, Box, Typography, Button, Paper, List, ListItem, ListItemText } from "@mui/material";
import Link from "next/link";
import { JSX } from "react/jsx-runtime";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import PetsIcon from '@mui/icons-material/Pets';

const Page = async (): Promise<JSX.Element> => {
    const cats = await GetCats();
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
                <List sx={{ display: "flex", flexDirection: "column", gap: 2, p: 0 }}>
                    {cats.map((cat) => {
                        return (
                            <ListItem
                                key={cat.id}
                                component={Paper}
                                elevation={2}
                                sx={{
                                    p: 2,
                                    backgroundColor: "background.paper",
                                    borderLeft: "6px solid",
                                    borderColor: "primary.main",
                                    borderRadius: "4px 8px 8px 4px",
                                }}
                            >
                                <ListItemText
                                    primary={
                                        <Typography variant="h2" sx={{ fontSize: "1.25rem", color: "text.primary" }}>
                                            {cat.name || "Gato sem nome"}
                                        </Typography>
                                    }
                                    secondary={
                                        <Typography variant="body1" sx={{ color: "text.secondary", mt: 0.5 }}>
                                            {cat.nfc || "Sem NFC cadastrado"}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        );
                    })}
                </List>
            )}
        </Container>
    );
}

export default Page;