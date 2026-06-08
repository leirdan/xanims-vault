import { Box, TextField, InputAdornment, Button } from "@mui/material"
import { useState } from "react";

const SignInForm = () => {
  return <>
    <Box component="form" action={() => { }}
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: "12px",
      }}
    >
      <TextField variant="outlined" required type="text" label="Usuário" />
      <TextField variant="outlined" required type="password" label="Senha" />
      <Button variant="contained" sx={{ backgroundColor: "black" }}> Enviar </Button>
    </Box>
  </>
}

export default SignInForm;