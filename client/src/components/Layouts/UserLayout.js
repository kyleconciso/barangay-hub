import React from "react";
import UserNav from "../Navigation/UserNav";
import { Container } from "@mui/material";
import Footer from "./Footer";
import { Box } from "@mui/material";

const UserLayout = ({ children = true }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <UserNav />
      <Container
        sx={{
          flexGrow: 1, //  content to grow and push footer down
        }}
      >
        {children}
      </Container>
      <Footer />
    </Box>
  );
};

export default UserLayout;
