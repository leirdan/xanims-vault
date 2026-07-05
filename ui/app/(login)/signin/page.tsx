"use client";
import { JSX } from "@emotion/react/jsx-runtime";
import { Box, Button, InputAdornment, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import SignInForm from "@/components/SignInForm";

const SignIn = (): JSX.Element => {
  return (<Box
    sx={{
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      alignContent: "center",
      flexDirection: "column"
    }}
  >
    <Typography variant="h2" sx={{ marginBottom: 3 }}> Xanim's Vault Login </Typography>
    <SignInForm />
  </Box>)

}

export default SignIn;