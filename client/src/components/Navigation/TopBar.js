import React, { useState, useEffect } from "react";
import { Box, Typography, Link } from "@mui/material"; // import link
import { useAuth } from "../../hooks/useAuth";
import { formatDate, formatDateTime } from "../../utils/dateUtils";

const TopBar = () => {
  const { user, userType } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "#f0f0f0",
        color: "#333",
        padding: "5px 10px",
        fontSize: "0.8rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Box>
        <Typography variant="body2">
          <Link
            href="https://www.gov.ph/"
            target="_blank"
            rel="noopener noreferrer"
            color="#000000"
            fontWeight="500"
            sx={{ textDecoration: "none" }}
          >
            GOV.PH
          </Link>
            |   THE UNOFFICIAL* WEBSITE OF BRGY. SAN ANTONIO, CANDON CITY,
          ILOCOS SUR
        </Typography>
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Typography variant="body2">
          Open Hours: Mon - Fri: 8:00 am - 6:00 pm
        </Typography>
        <Typography variant="body2">+1 800 123 456 789</Typography>
        <Typography variant="body2">
          {formatDateTime(currentTime)} 🇵🇭
        </Typography>
      </Box>
    </Box>
  );
};

export default TopBar;
