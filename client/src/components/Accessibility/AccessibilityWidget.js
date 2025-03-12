import React, { useState, useRef, useEffect } from "react";
import {
  Fab,
  Box,
  Tooltip,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Typography,
  useTheme,
  Divider,
  styled,
  IconButton,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import ContrastIcon from "@mui/icons-material/Contrast";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import TranslateIcon from "@mui/icons-material/Translate";
import CloseIcon from "@mui/icons-material/Close";

// Styled components for better organization
const StyledMenu = styled(Menu)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 8,
    minWidth: 320,
    boxShadow: theme.shadows[3],
    padding: theme.spacing(1, 0),
  },
}));

const OptionMenuItem = styled(MenuItem)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  "&:hover": {
    backgroundColor: theme.palette.action.hover,
  },
}));

const CategoryTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.text.secondary,
  padding: theme.spacing(1, 2, 0.5),
}));

// Create a stylesheet to inject custom CSS rules
const createStyleElement = () => {
  const styleElement = document.createElement("style");
  styleElement.id = "accessibility-styles";
  document.head.appendChild(styleElement);
  return styleElement;
};

const AccessibilityWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [contrast, setContrast] = useState(100);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [focusHighlight, setFocusHighlight] = useState(false);
  const [screenReader, setScreenReader] = useState(false);

  const theme = useTheme();
  const styleElementRef = useRef(null);

  // Initialize the style element on component mount
  useEffect(() => {
    const existingStyleElement = document.getElementById(
      "accessibility-styles"
    );
    styleElementRef.current = existingStyleElement || createStyleElement();

    // Clean up styles on unmount
    return () => {
      if (styleElementRef.current && !existingStyleElement) {
        styleElementRef.current.remove();
      }
    };
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  // Apply styles when settings change
  useEffect(() => {
    applyStyles();
  }, [
    fontSize,
    contrast,
    dyslexiaFont,
    highContrast,
    focusHighlight,
    screenReader,
  ]);

  // Function to apply all accessibility styles
  const applyStyles = () => {
    if (!styleElementRef.current) return;

    const cssRules = [];

    // Font size adjustments
    cssRules.push(`
      html {
        font-size: ${fontSize}px !important;
      }
      body {
        font-size: ${fontSize}px !important;
      }
    `);

    // Contrast adjustment
    if (contrast !== 100) {
      cssRules.push(`
        body {
          filter: contrast(${contrast}%) !important;
        }
      `);
    }

    // High contrast (black and white)
    if (highContrast) {
      cssRules.push(`
        body {
          background-color: white !important;
          color: black !important;
        }
        
        p, h1, h2, h3, h4, h5, h6, span, div, li, td, th {
          color: black !important;
          background-color: white !important;
        }
        
        a {
          color: #000066 !important;
          background-color: white !important;
          text-decoration: underline !important;
        }
        
        button, input[type="button"], input[type="submit"], .MuiButton-root {
          background-color: black !important;
          color: white !important;
          border: 2px solid black !important;
        }
        
        input, textarea, select {
          background-color: white !important;
          color: black !important;
          border: 1px solid black !important;
        }
        
        img, video, svg, canvas {
          filter: grayscale(100%) contrast(120%) !important;
        }
        
        header, footer, nav, aside, section, article {
          background-color: white !important;
          color: black !important;
          border-color: black !important;
        }
        
        * {
          border-color: black !important;
          box-shadow: none !important;
        }
        
        .MuiPaper-root {
          background-color: white !important;
          color: black !important;
        }
      `);
    }

    // Dyslexia-friendly font
    if (dyslexiaFont) {
      cssRules.push(`
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
          font-weight: normal;
          font-style: normal;
        }
        
        body, p, h1, h2, h3, h4, h5, h6, span, div, a, button, input, textarea, select {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      `);
    }

    // Focus highlighting
    if (focusHighlight) {
      cssRules.push(`
        *:focus {
          outline: 3px solid #4285f4 !important;
          outline-offset: 2px !important;
        }
        
        a:focus, button:focus, [role="button"]:focus, input:focus, select:focus, textarea:focus {
          box-shadow: 0 0 0 3px #4285f4 !important;
        }
      `);
    }

    // Screen reader support
    if (screenReader) {
      cssRules.push(`
        .sr-only {
          position: absolute !important;
          width: 1px !important;
          height: 1px !important;
          padding: 0 !important;
          margin: -1px !important;
          overflow: hidden !important;
          clip: rect(0, 0, 0, 0) !important;
          white-space: nowrap !important;
          border: 0 !important;
        }
      `);

      // Add ARIA attributes to essential elements if they don't have them
      document.querySelectorAll('a, button, [role="button"]').forEach((el) => {
        if (!el.hasAttribute("aria-label") && el.textContent) {
          el.setAttribute("aria-label", el.textContent.trim());
        }
      });

      // Add role to elements that might need it
      document.querySelectorAll("header, footer, main, nav").forEach((el) => {
        if (!el.hasAttribute("role")) {
          const tagName = el.tagName.toLowerCase();
          if (tagName === "header") el.setAttribute("role", "banner");
          if (tagName === "footer") el.setAttribute("role", "contentinfo");
          if (tagName === "main") el.setAttribute("role", "main");
          if (tagName === "nav") el.setAttribute("role", "navigation");
        }
      });
    }

    // Apply all CSS rules
    styleElementRef.current.textContent = cssRules.join("\n");
  };

  const handleResetAll = () => {
    setFontSize(16);
    setContrast(100);
    setDyslexiaFont(false);
    setHighContrast(false);
    setFocusHighlight(false);
    setScreenReader(false);

    // Clear all custom styles
    if (styleElementRef.current) {
      styleElementRef.current.textContent = "";
    }
  };

  const open = Boolean(anchorEl);

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 1000,
      }}
    >
      <Tooltip title="Accessibility Options">
        <Fab
          color="primary"
          aria-label="accessibility"
          onClick={handleClick}
          sx={{
            boxShadow: 3,
            "&:hover": {
              boxShadow: 4,
            },
          }}
        >
          <AccessibilityIcon />
        </Fab>
      </Tooltip>

      <StyledMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            pb: 1,
          }}
        >
          <Typography variant="h6" color="primary">
            Accessibility Options
          </Typography>
          <IconButton
            size="small"
            onClick={handleClose}
            aria-label="Close menu"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider sx={{ mb: 1 }} />

        <CategoryTitle>Text Options</CategoryTitle>

        <OptionMenuItem>
          <ListItemIcon>
            <FormatSizeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Font Size" />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <Select
                value={fontSize}
                onChange={(e) => setFontSize(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Font size" }}
              >
                <MenuItem value={12}>Small (12px)</MenuItem>
                <MenuItem value={16}>Normal (16px)</MenuItem>
                <MenuItem value={20}>Large (20px)</MenuItem>
                <MenuItem value={24}>X-Large (24px)</MenuItem>
                <MenuItem value={28}>XX-Large (28px)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </OptionMenuItem>

        <OptionMenuItem>
          <ListItemIcon>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Dyslexia-friendly Font"
            secondary="OpenDyslexic font"
          />
          <Switch
            checked={dyslexiaFont}
            onChange={(e) => setDyslexiaFont(e.target.checked)}
            edge="end"
            inputProps={{ "aria-label": "Toggle dyslexia-friendly font" }}
          />
        </OptionMenuItem>

        <Divider sx={{ my: 1 }} />

        <CategoryTitle>Display Options</CategoryTitle>

        <OptionMenuItem>
          <ListItemIcon>
            <ContrastIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Contrast"
            secondary={`${contrast}%`}
            secondaryTypographyProps={{ variant: "caption" }}
          />
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth size="small">
              <Select
                value={contrast}
                onChange={(e) => setContrast(e.target.value)}
                displayEmpty
                inputProps={{ "aria-label": "Contrast level" }}
              >
                <MenuItem value={100}>Normal (100%)</MenuItem>
                <MenuItem value={125}>Medium (125%)</MenuItem>
                <MenuItem value={150}>High (150%)</MenuItem>
                <MenuItem value={175}>Very High (175%)</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </OptionMenuItem>

        <OptionMenuItem>
          <ListItemIcon>
            <ContrastIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="High Contrast"
            secondary="Black and white mode"
          />
          <Switch
            checked={highContrast}
            onChange={(e) => setHighContrast(e.target.checked)}
            edge="end"
            inputProps={{ "aria-label": "Toggle high contrast" }}
          />
        </OptionMenuItem>

        <Divider sx={{ my: 1 }} />

        <CategoryTitle>Additional Features</CategoryTitle>

        <OptionMenuItem>
          <ListItemIcon>
            <HighlightAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Focus Highlighting"
            secondary="Emphasizes focused elements"
          />
          <Switch
            checked={focusHighlight}
            onChange={(e) => setFocusHighlight(e.target.checked)}
            edge="end"
            inputProps={{ "aria-label": "Toggle focus highlighting" }}
          />
        </OptionMenuItem>

        <OptionMenuItem>
          <ListItemIcon>
            <VolumeUpIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText
            primary="Screen Reader Support"
            secondary="Enhances screen reader compatibility"
          />
          <Switch
            checked={screenReader}
            onChange={(e) => setScreenReader(e.target.checked)}
            edge="end"
            inputProps={{ "aria-label": "Toggle screen reader support" }}
          />
        </OptionMenuItem>

        <Divider sx={{ my: 1 }} />

        <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
          <Typography
            variant="button"
            color="primary"
            onClick={handleResetAll}
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
            role="button"
            tabIndex={0}
            aria-label="Reset all accessibility settings"
          >
            Reset All Settings
          </Typography>
        </Box>
      </StyledMenu>
    </Box>
  );
};

export default AccessibilityWidget;
