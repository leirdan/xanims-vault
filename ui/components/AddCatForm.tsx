'use client';

import { AddCat } from "@/lib/actions";
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Button,
    Paper,
    Typography,
    Alert
} from "@mui/material";
import { useActionState } from "react";

interface AddCatFormProps {
    lifeStageFactors: LifeStageFactor[];
}

const initialState = { success: false, message: "" };

const AddCatForm = (props: AddCatFormProps) => {
    const [state, formAction, isPending] = useActionState(AddCat, initialState);

    return (
        <Paper
            elevation={4}
            sx={{
                p: 4,
                backgroundColor: "background.paper",
                borderRadius: "8px"
            }}
        >
            <Typography variant="h1" sx={{ fontSize: "1.8rem", mb: 3, color: "text.primary" }}>
                Cadastrar Felino
            </Typography>

            {state?.message && (
                <Alert severity={state.success ? "success" : "error"} sx={{ mb: 3 }}>
                    {state.message}
                </Alert>
            )}

            <Box component="form" action={formAction} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <TextField
                    name="name"
                    label="Nome do Gato"
                    variant="outlined"
                    required
                    fullWidth
                />

                <TextField
                    name="birth_date"
                    label="Data de Nascimento"
                    type="date"
                    variant="outlined"
                    required
                    fullWidth
                // InputLabelProps={{ shrink: true }}
                />

                <TextField
                    name="weight"
                    label="Peso (kg)"
                    type="number"
                    // inputProps={{ step: "0.01" }}
                    variant="outlined"
                    required
                    fullWidth
                />

                <FormControl fullWidth required>
                    <InputLabel id="life-stage-label">Fase de Vida</InputLabel>
                    <Select
                        labelId="life-stage-label"
                        name="life_stage_factor_id"
                        label="Fase de Vida"
                        defaultValue=""
                    >
                        {props.lifeStageFactors && props.lifeStageFactors.map((factor) => (
                            <MenuItem key={factor.id} value={factor.documentId}>
                                {factor.description}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            name="neutered"
                            value="true"
                            sx={{ color: "primary.main" }}
                        />
                    }
                    label="O gato é castrado?"
                    sx={{ color: "text.secondary" }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    sx={{
                        backgroundColor: "black",
                        color: "text.primary",
                        py: 1.5,
                        fontWeight: 700,
                        '&:hover': { backgroundColor: "#222" }
                    }}
                >
                    Salvar e Gerar Dieta
                </Button>
            </Box>
        </Paper>
    );
}

export default AddCatForm;