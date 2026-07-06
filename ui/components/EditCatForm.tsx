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
import SyncIcon from "@mui/icons-material/Sync";
import { useActionState, useState } from "react";

interface EditCatFormProps {
    cat: CatDetails;
    lifeStageFactors: LifeStageFactor[];
}

const initialState = { success: false, message: "" };

const DEFAULT_HOURS = [
    "08:00",
    "11:00",
    "14:00",
    "17:00",
    "19:00",
    "22:00",
];

const EditCatForm = ({ cat, lifeStageFactors }: EditCatFormProps) => {
    const [state, formAction, isPending] = useActionState(UpdateCat, initialState);

    const [dietState, setDietState] = useState<{
        success: boolean;
        message: string;
    } | null>(null);

    const [isRegenerating, setIsRegenerating] = useState(false);

    const [birthDate, setBirthDate] = useState(
        cat.birth_date?.substring(0, 10) || ""
    );

    const [feedingHours, setFeedingHours] = useState<string[]>(
        cat.feeding_hours?.length
            ? cat.feeding_hours.map((h: string) => h.substring(0, 5))
            : [
                DEFAULT_HOURS[0],
                DEFAULT_HOURS[2],
                DEFAULT_HOURS[4],
            ]
    );

    const handleMealsChange = (amount: number) => {
        setFeedingHours(DEFAULT_HOURS.slice(0, amount));
    };

    const handleHourChange = (index: number, value: string) => {
        const updated = [...feedingHours];
        updated[index] = value;
        setFeedingHours(updated);
    };

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
                    borderRadius: 2,
                }}
            >
                <Typography
                    variant="h1"
                    sx={{
                        fontSize: "1.8rem",
                        mb: 3,
                    }}
                >
                    Editar {cat.name}
                </Typography>

                {state?.message && (
                    <Alert
                        severity={state.success ? "success" : "error"}
                        sx={{ mb: 3 }}
                    >
                        {state.message}
                    </Alert>
                )}

                <Box
                    component="form"
                    action={formAction}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
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
                        required
                        fullWidth
                    />

                    <TextField
                        name="birth_date"
                        label="Data de Nascimento"
                        type="date"
                        value={birthDate}
                        onChange={(e) =>
                            setBirthDate(e.target.value)
                        }
                        slotProps={{
                            inputLabel: {
                                shrink: true,
                            },
                        }}
                        required
                        fullWidth
                    />

                    <TextField
                        name="weight"
                        label="Peso (kg)"
                        type="number"
                        defaultValue={cat.weight}
                        slotProps={{
                            htmlInput: { step: "0.01", min: "0" }
                        }}
                        required
                        fullWidth
                    />

                    <FormControl fullWidth required>
                        <InputLabel>
                            Fase de Vida
                        </InputLabel>

                        <Select
                            name="life_stage_factor_id"
                            label="Fase de Vida"
                            defaultValue={
                                cat.life_stage_factor?.documentId || ""
                            }
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

                    <FormControl fullWidth>
                        <InputLabel>
                            Refeições por dia
                        </InputLabel>

                        <Select
                            value={feedingHours.length}
                            label="Refeições por dia"
                            onChange={(e) =>
                                handleMealsChange(Number(e.target.value))
                            }
                        >
                            <MenuItem value={3}>
                                3 refeições
                            </MenuItem>

                            <MenuItem value={4}>
                                4 refeições
                            </MenuItem>

                            <MenuItem value={6}>
                                6 refeições
                            </MenuItem>
                        </Select>
                    </FormControl>

                    <Typography variant="h6">
                        Horários de alimentação
                    </Typography>

                    {feedingHours.map((hour, index) => (
                        <Box key={index}>
                            <TextField
                                label={`Horário ${index + 1}`}
                                type="time"
                                value={hour}
                                fullWidth
                                onChange={(e) =>
                                    handleHourChange(
                                        index,
                                        e.target.value
                                    )
                                }
                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />

                            <input
                                type="hidden"
                                name="feeding_hours"
                                value={`${hour}:00`}
                            />
                        </Box>
                    ))}

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

            <Paper
                elevation={4}
                sx={{ p: 4 }}
            >
                <Typography
                    variant="h2"
                    sx={{
                        fontSize: "1.2rem",
                        mb: 1,
                    }}
                >
                    Dieta
                </Typography>

                <Typography
                    variant="body2"
                    sx={{ mb: 2 }}
                >
                    Recalcula a porção e os horários com base nos dados atuais do gato.
                </Typography>

                {dietState?.message && (
                    <Alert
                        severity={
                            dietState.success
                                ? "success"
                                : "error"
                        }
                    >
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