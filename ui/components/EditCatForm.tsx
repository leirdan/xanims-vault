'use client';

import { UpdateCat, RegenerateDiet } from "@/lib/actions";
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
    Alert,
    Divider,
    Stack,
} from "@mui/material";
import SyncIcon from '@mui/icons-material/Sync';
import { useActionState, useState } from "react";

interface EditCatFormProps {
    cat: CatDetails;
    lifeStageFactors: LifeStageFactor[];
}

const initialState = { success: false, message: "" };

const EditCatForm = ({ cat, lifeStageFactors }: EditCatFormProps) => {
    const [state, formAction, isPending] = useActionState(UpdateCat, initialState);
    const [dietState, setDietState] = useState<{ success: boolean; message: string } | null>(null);
    const [isRegenerating, setIsRegenerating] = useState(false);

    // Garante que o campo sempre receba uma data válida
    const [birthDate, setBirthDate] = useState(
        cat.birth_date?.substring(0, 10) || ""
    );

    console.log("Cat recebido:", cat);
    console.log("Birth date inicial:", cat.birth_date);

    const handleRegenerateDiet = async () => {
        setIsRegenerating(true);
        const result = await RegenerateDiet(cat.documentId);
        setDietState(result);
        setIsRegenerating(false);
    };

    return (
        <Stack spacing={3}>
            <Paper
                elevation={4}
                sx={{
                    p: 4,
                    backgroundColor: "background.paper",
                    borderRadius: "8px"
                }}
            >
                <Typography variant="h1" sx={{ fontSize: "1.8rem", mb: 3 }}>
                    Editar {cat.name}
                </Typography>

                {state?.message && (
                    <Alert severity={state.success ? "success" : "error"} sx={{ mb: 3 }}>
                        {state.message}
                    </Alert>
                )}

                <Box
                    component="form"
                    action={(formData) => {
                        console.log("Data enviada:", formData.get("birth_date"));
                        return formAction(formData);
                    }}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3
                    }}
                >
                    <input
                        type="hidden"
                        name="documentId"
                        value={cat.documentId}
                    />

                    <TextField
                        name="name"
                        label="Nome do Gato"
                        defaultValue={cat.name}
                        fullWidth
                        required
                    />

                    <TextField
                        name="birth_date"
                        label="Data de Nascimento"
                        type="date"
                        value={birthDate}
                        onChange={(e) => {
                            console.log("Nova data:", e.target.value);
                            setBirthDate(e.target.value);
                        }}
                        slotProps={{ inputLabel: { shrink: true } }}
                        fullWidth
                        required
                    />

                    <TextField
                        name="weight"
                        label="Peso (kg)"
                        type="number"
                        defaultValue={cat.weight}
                        slotProps={{
                            htmlInput: { step: "0.01", min: "0" }
                        }}
                        fullWidth
                        required
                    />

                    <FormControl fullWidth required>
                        <InputLabel id="life-stage-label">
                            Fase de Vida
                        </InputLabel>

                        <Select
                            labelId="life-stage-label"
                            name="life_stage_factor_id"
                            label="Fase de Vida"
                            defaultValue={cat.life_stage_factor?.documentId || ""}
                        >
                            {lifeStageFactors.map((factor) => (
                                <MenuItem
                                    key={factor.id}
                                    value={factor.documentId}
                                >
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
                                defaultChecked={cat.neutered}
                            />
                        }
                        label="O gato é castrado?"
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        disabled={isPending}
                    >
                        {isPending
                            ? "Salvando..."
                            : "Salvar Alterações"}
                    </Button>
                </Box>
            </Paper>

            <Paper elevation={4} sx={{ p: 4 }}>
                <Typography variant="h2" sx={{ fontSize: "1.2rem", mb: 1 }}>
                    Dieta
                </Typography>

                <Typography variant="body2" sx={{ mb: 2 }}>
                    Recalcula a porção e os horários com base nos dados atuais do gato.
                </Typography>

                {dietState?.message && (
                    <Alert severity={dietState.success ? "success" : "error"}>
                        {dietState.message}
                    </Alert>
                )}

                <Divider sx={{ my: 2 }} />

                <Button
                    variant="outlined"
                    startIcon={<SyncIcon />}
                    onClick={handleRegenerateDiet}
                    disabled={isRegenerating}
                >
                    {isRegenerating
                        ? "Gerando..."
                        : "Gerar nova dieta e enviar ao comedouro"}
                </Button>
            </Paper>
        </Stack>
    );
};

export default EditCatForm;