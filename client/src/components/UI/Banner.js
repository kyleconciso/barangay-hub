import React from "react";
import { Box, Typography, useTheme } from "@mui/material";

const Banner = ({ imageUrl, title }) => {
  return (
    <Box
      sx={{
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: "100vw",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        marginLeft: "calc(-50vw + 50%)",
        marginBottom: "2vw",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          backdropFilter: "blur(3px)",
          background:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.8), transparent)",
        },
      }}
    >
      {title && (
        <Typography
          variant="h2"
          sx={{
            color: "white",
            zIndex: 1,
            textShadow: "2px 2px 6px rgba(0, 0, 0, 0.8)",
            fontWeight: 600,
          }}
        >
          {title}
        </Typography>
      )}
    </Box>
  );
};

export default Banner;
