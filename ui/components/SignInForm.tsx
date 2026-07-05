"use client"

import { SignIn } from "@/lib/actions";
import { Box, TextField, InputAdornment, Button, Alert, CircularProgress } from "@mui/material"
import { useActionState } from "react";

const initialState = { success: false, message: "" };
const SignInForm = () => {
    const [state, formAction, isPending] = useActionState(SignIn, initialState);
    return <>
        <Box component="form" action={formAction}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: "12px",
            }}
        >
            {state?.message && !state.success && (
                <Alert severity="error" variant="filled" sx={{ mb: 1 }}>
                    {state.message}
                </Alert>
            )}

            <TextField variant="outlined" required type="text" label="Usuário" name="user" disabled={isPending} />
            <TextField variant="outlined" required type="password" label="Senha" name="password" disabled={isPending} />
            <Button type="submit" variant="contained" sx={{ backgroundColor: "black" }}>
                {isPending ? (
                    <CircularProgress size={24} sx={{ color: "primary.contrastText" }} />
                ) : (
                    "Entrar"
                )}</Button>
        </Box>
    </>
}

export default SignInForm;