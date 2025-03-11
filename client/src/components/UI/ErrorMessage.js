import React from "react";
import { Alert } from "@mui/material";

const ErrorMessage = ({ message }) => {
  return <Alert severity="error">{message}</Alert>;
};

export default ErrorMessage;
