import React, { useState, useRef, useEffect } from "react";
import {
  Paper,
  Box,
  IconButton,
  TextField,
  Typography,
  Slide,
  Fab,
  Avatar,
  CircularProgress,
  useTheme,
  Stack,
  Alert,
  keyframes, // import keyframes
  styled, // import styled
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useApi } from "../../hooks/useApi";
import { sendMessage } from "../../api/chat";

// define the pulse animation using keyframes and styled
const pulse = keyframes`
  0% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0.7);
  }
  70% {
    transform: scale(1.05);
    opacity: 1;
    box-shadow: 0 0 0 10px rgba(0, 123, 255, 0);
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
    box-shadow: 0 0 0 0 rgba(0, 123, 255, 0);
  }
`;

const GlowingFab = styled(Fab)`
  animation: ${pulse} 2s infinite;
`;

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { execute: executeSendMessage, loading, error } = useApi(sendMessage);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const [showNotification, setShowNotification] = useState(true);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowNotification(false);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { sender: "user", text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    const response = await executeSendMessage({ message: input });
    if (response) {
      const botMessage = { sender: "bot", text: response.response };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getInitials = (sender) => {
    return sender.toUpperCase().charAt(0);
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: "row", // fab on the left, notification on right
        alignItems: "center",
      }}
    >
      {!isOpen && showNotification && (
        <Typography
          variant="caption"
          sx={{
            color: theme.palette.text.secondary,
            backgroundColor: theme.palette.grey[200],
            padding: "4px 8px",
            borderRadius: "8px",
            fontWeight: "bold",
            marginRight: "10px",
          }}
        >
          Need help? Chat with us!
        </Typography>
      )}

      {/* fab button to open chat (left side) */}
      {!isOpen && (
        <GlowingFab
          color="primary"
          aria-label="chat"
          onClick={toggleChat}
          sx={{ mr: 1 }}
        >
          {" "}
          {/* Added mr: 1 for gap, Using GlowingFab */}
          <ChatIcon />
        </GlowingFab>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={4}
          sx={{
            width: 350,
            maxWidth: "90vw",
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* chat header */}
          <Box
            sx={{
              p: 2,
              backgroundColor: theme.palette.primary.main,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6" component="div">
              Barangay Chatbot
            </Typography>
            <IconButton color="inherit" onClick={toggleChat}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* message area */}
          <Box
            sx={{
              p: 2,
              height: 300,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.grey[50],
            }}
          >
            <Stack spacing={2}>
              {messages.map((message, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    justifyContent:
                      message.sender === "user" ? "flex-end" : "flex-start",
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      maxWidth: "80%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        message.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <Paper
                      variant="outlined"
                      sx={{
                        p: 1,
                        borderRadius: "20px",
                        backgroundColor:
                          message.sender === "user"
                            ? theme.palette.primary.light
                            : "white",
                        color:
                          message.sender === "user" ? "white" : "text.primary",
                      }}
                    >
                      <Typography variant="body2">{message.text}</Typography>
                    </Paper>
                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        color: theme.palette.text.secondary,
                        alignSelf: "flex-end",
                      }}
                    >
                      {formatTime(new Date())}
                    </Typography>
                  </Box>
                  {message.sender === "bot" && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        ml: 1,
                        order: -1,
                      }}
                    >
                      {getInitials("bot")}
                    </Avatar>
                  )}
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Stack>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                Error: {error.message}
              </Alert>
            )}
            {loading && (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress size={24} />
              </Box>
            )}
          </Box>

          {/* input area */}
          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              size="small"
              sx={{ mr: 1 }}
            />
            <IconButton
              color="primary"
              onClick={handleSendMessage}
              disabled={loading}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ChatbotWidget;
