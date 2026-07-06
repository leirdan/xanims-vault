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
import { useActionState, useState } from "react";

interface AddCatFormProps {
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

const AddCatForm = (props: AddCatFormProps) => {
    const [state, formAction, isPending] = useActionState(AddCat, initialState);

    const [feedingHours, setFeedingHours] = useState([
        DEFAULT_HOURS[0],
        DEFAULT_HOURS[2],
        DEFAULT_HOURS[4],
    ]);

    const handleMealsChange = (amount: number) => {
        setFeedingHours(DEFAULT_HOURS.slice(0, amount));
    };

    const handleHourChange = (index: number, value: string) => {
        const updated = [...feedingHours];
        updated[index] = value;
        setFeedingHours(updated);
    };

    return (
        <Paper
            elevation={4}
            sx={{
                p: 4,
                backgroundColor: "background.paper",
                borderRadius: "8px"
            }}
        >
            <Typography
                variant="h1"
                sx={{
                    fontSize: "1.8rem",
                    mb: 3,
                    color: "text.primary"
                }}
            >
                Vincular Gato
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
                    gap: 3
                }}
            >
                <TextField
                    name="name"
                    label="Nome do Gato"
                    required
                    fullWidth
                />

                <TextField
                    name="birth_date"
                    label="Data de Nascimento"
                    type="date"
                    required
                    fullWidth
                    slotProps={{
                        inputLabel: {
                            shrink: true
                        }
                    }}
                />

                <TextField
                    name="weight"
                    label="Peso (kg)"
                    type="number"
                    slotProps={{
                        htmlInput: { step: "0.01", min: "0" }
                    }}
                    variant="outlined"
                    required
                    fullWidth
                />

                <FormControl fullWidth required>
                    <InputLabel id="life-stage-label">
                        Fase de Vida
                    </InputLabel>

                    <Select
                        labelId="life-stage-label"
                        name="life_stage_factor_id"
                        label="Fase de Vida"
                        defaultValue=""
                    >
                        {props.lifeStageFactors.map((factor) => (
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
                    Horários
                </Typography>

                {feedingHours.map((hour, index) => (
                    <Box key={index}>
                        <TextField
                            label={`Horário ${index + 1}`}
                            type="time"
                            value={hour}
                            fullWidth
                            onChange={(e) =>
                                handleHourChange(index, e.target.value)
                            }
                            slotProps={{
                                inputLabel: {
                                    shrink: true
                                }
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
                    sx={{
                        backgroundColor: "black",
                        py: 1.5,
                        fontWeight: 700,
                        "&:hover": {
                            backgroundColor: "#222"
                        }
                    }}
                >
                    {isPending
                        ? "Salvando..."
                        : "Salvar e Gerar Dieta"}
                </Button>
            </Box>
        </Paper>
    );
};

export default AddCatForm;