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
  IconButton,
  Select,
  FormControl,
} from "@mui/material";
import AccessibilityIcon from "@mui/icons-material/Accessibility";
import FormatSizeIcon from "@mui/icons-material/FormatSize";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
import TranslateIcon from "@mui/icons-material/Translate";
import CloseIcon from "@mui/icons-material/Close";

const AccessibilityWidget = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [fontSize, setFontSize] = useState(16);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [focusHighlight, setFocusHighlight] = useState(false);
  const theme = useTheme();
  const styleElementRef = useRef(null);

  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.id = "accessibility-styles";
    document.head.appendChild(styleElement);
    styleElementRef.current = styleElement;
    return () => styleElement.remove();
  }, []);

  useEffect(() => {
    if (!styleElementRef.current) return;
    const cssRules = [];

    // Font size adjustments
    cssRules.push(`html, body { font-size: ${fontSize}px !important; }`);

    if (dyslexiaFont) {
      cssRules.push(`
        @font-face {
          font-family: 'OpenDyslexic';
          src: url('https://cdn.jsdelivr.net/npm/open-dyslexic@1.0.3/woff/OpenDyslexic-Regular.woff') format('woff');
        }
        * {
          font-family: 'OpenDyslexic', sans-serif !important;
        }
      `);
    }

    // Focus highlighting
    if (focusHighlight) {
      cssRules.push(`
        *:focus { outline: 3px solid #4285f4 !important; }
      `);
    }

    styleElementRef.current.textContent = cssRules.join("\n");
  }, [fontSize, dyslexiaFont, focusHighlight]);

  const handleResetAll = () => {
    setFontSize(16);
    setDyslexiaFont(false);
    setFocusHighlight(false);
    if (styleElementRef.current) styleElementRef.current.textContent = "";
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, left: 20, zIndex: 1000 }}>
      <Tooltip title="Accessibility Options">
        <Fab color="primary" onClick={(e) => setAnchorEl(e.currentTarget)}>
          <AccessibilityIcon />
        </Fab>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
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
          <IconButton size="small" onClick={() => setAnchorEl(null)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Divider />

        <MenuItem>
          <ListItemIcon>
            <FormatSizeIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Font Size" />
          <FormControl size="small">
            <Select
              value={fontSize}
              onChange={(e) => setFontSize(e.target.value)}
            >
              {[12, 16, 20, 24, 28].map((size) => (
                <MenuItem key={size} value={size}>
                  {size}px
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <TranslateIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Dyslexia-friendly Font" />
          <Switch
            checked={dyslexiaFont}
            onChange={(e) => setDyslexiaFont(e.target.checked)}
          />
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <HighlightAltIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText primary="Focus Highlighting" />
          <Switch
            checked={focusHighlight}
            onChange={(e) => setFocusHighlight(e.target.checked)}
          />
        </MenuItem>

        <Divider />

        <Box sx={{ display: "flex", justifyContent: "center", p: 1 }}>
          <Typography
            variant="button"
            color="primary"
            onClick={handleResetAll}
            sx={{
              cursor: "pointer",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Reset All Settings
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
};

export default AccessibilityWidget;
