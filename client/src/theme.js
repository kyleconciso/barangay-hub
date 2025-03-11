// src/theme.js
import { createTheme } from "@mui/material/styles";
import { blueGrey, grey, indigo, teal, red } from "@mui/material/colors";

const navyBlueTheme = createTheme({
  palette: {
    primary: {
      main: indigo[700],
      light: indigo[500],
      dark: indigo[900],
      contrastText: "#fff",
    },
    secondary: {
      main: teal[400],
      light: teal[300],
      dark: teal[600],
      contrastText: "#000",
    },
    error: {
      main: red[400],
    },
    background: {
      default: grey[100],
      paper: "#fff",
    },
    text: {
      primary: blueGrey[900],
      secondary: blueGrey[700],
    },
  },
  typography: {
    fontFamily:
      '"Plus Jakarta Sans", "Roboto", "Helvetica", "Arial", sans-serif', // <-- CHANGED: Use Plus Jakarta Sans
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700, // Back to 700 for bold
    h1: {
      fontWeight: 700, // Bold for h1
    },
    h2: {
      fontWeight: 700, // Bold for h2
    },
    h3: {
      fontWeight: 600, // Medium-bold for h3
    },
    h4: {
      fontWeight: 600, // Medium-bold for h4
    },
    h5: {
      fontWeight: 500, // Medium for h5
    },
    h6: {
      fontWeight: 500, // Medium for h6
    },
    subtitle1: {
      fontWeight: 500,
    },
  },
  components: {
    // ... (rest of the component overrides - no changes needed here)
    MuiAppBar: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          boxShadow: "none",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          borderRadius: 6,
          textTransform: "none",
          fontWeight: 500,
          boxShadow: "none",
        },
        contained: {
          boxShadow: "none",
        },
        outlinedPrimary: {
          borderColor: "primary.main",
          color: "primary.main",
          "&:hover": {
            backgroundColor: "rgba(26, 35, 126, 0.04)",
          },
        },
        outlinedSecondary: {
          borderColor: "secondary.main",
          color: "secondary.main",
          "&:hover": {
            backgroundColor: "rgba(0, 188, 212, 0.04)",
          },
        },
        textPrimary: {
          color: "primary.main",
          "&:hover": {
            backgroundColor: "rgba(26, 35, 126, 0.04)",
          },
        },
        textSecondary: {
          color: "secondary.main",
          "&:hover": {
            backgroundColor: "rgba(0, 188, 212, 0.04)",
          },
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          color: "text.secondary",
          "&:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: grey[400],
            },
            "&:hover fieldset": {
              borderColor: "primary.main",
            },
            "&.Mui-focused fieldset": {
              borderColor: "primary.main",
            },
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: "primary.main",
          textDecoration: "none",
          "&:hover": {
            textDecoration: "underline",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 2px 4px rgba(0,0,0,0.4)",
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          backgroundColor: grey[50],
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: blueGrey[50],
          },
        },
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: {
          color: "text.primary",
        },
        secondary: {
          color: "text.secondary",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          padding: "16px 24px",
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: "24px",
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "8px 24px",
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
        standardInfo: {
          backgroundColor: blueGrey[50],
          color: "text.primary",
        },
      },
    },
    MuiCircularProgress: {
      defaultProps: {
        color: "primary",
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: grey[300],
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "0 3px 5px rgba(0, 0, 0, 0.2)",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: "secondary.main",
          color: "secondary.contrastText",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
          fontWeight: 600,
        },
        body: {
          color: "text.primary",
        },
      },
    },
    MuiTablePagination: {
      styleOverrides: {
        root: {
          color: "text.secondary",
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "primary.main",
          color: "primary.contrastText",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "text.secondary",
          "&.Mui-focused": {
            color: "primary.main",
          },
        },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: {
          color: "text.secondary",
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          "&:focus": {
            backgroundColor: "transparent",
          },
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&:hover": {
            backgroundColor: blueGrey[50],
          },
          "&.Mui-selected": {
            backgroundColor: "primary.light",
            color: "primary.contrastText",
            "&:hover": {
              backgroundColor: "primary.light",
            },
          },
        },
      },
    },
  },
});

export default navyBlueTheme;
