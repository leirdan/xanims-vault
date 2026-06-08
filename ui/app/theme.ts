// src/theme.ts
'use client';

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#A6331B', // O tom terracota/avermelhado predominante do fundo
      contrastText: '#E6D3C5', // O tom off-white/creme do texto principal
    },
    background: {
      default: '#A6331B', // Fundo padrão baseado no slide
      paper: '#1E1E1E',   // Um cinza escuro para componentes de card/conteúdo, se necessário
    },
    text: {
      primary: '#E6D3C5',   // Texto principal (XANIM'S VAULT)
      secondary: '#CFAF9A', // Um tom levemente mais escuro para subtextos (ex: nomes, códigos)
    },
  },
  typography: {
    fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      textTransform: 'uppercase',
      letterSpacing: '0.05em',
      lineHeight: 1.1,
    },
    h2: {
      fontWeight: 700,
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontWeight: 300,
      letterSpacing: '0.02em',
    },
    body1: {
      fontWeight: 400,
    },
    button: {
      textTransform: 'uppercase',
      fontWeight: 600,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#A6331B',
          color: '#E6D3C5',
          margin: 0,
          padding: 0,
          boxSizing: 'border-box',
        },
      },
    },
  },
});

export default theme;