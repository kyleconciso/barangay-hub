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
  keyframes,
  styled,
  Zoom,
  Tooltip,
  Badge,
  Fade,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import PersonIcon from "@mui/icons-material/Person";
import MicIcon from "@mui/icons-material/Mic";
import { useApi } from "../../hooks/useApi";
import { sendMessage } from "../../api/chat";
import ReactMarkdown from "react-markdown";

// pulsing
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
  transition: all 0.3s ease;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
`;

// Typing dots animation
const typingDots = keyframes`
  0%, 20% {
    content: ".";
  }
  40% {
    content: "..";
  }
  60%, 100% {
    content: "...";
  }
`;

const TypingContainer = styled(Box)`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  height: 36px;
`;

const TypingDots = styled(Typography)`
  &::after {
    content: "";
    animation: ${typingDots} 1.5s infinite;
  }
`;

// Message appear animation
const messageAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AnimatedMessage = styled(Paper)`
  animation: ${messageAppear} 0.3s ease-out forwards;
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`;

const MessageInput = styled(TextField)`
  & .MuiOutlinedInput-root {
    border-radius: 20px;
    background-color: ${(props) => props.theme.palette.background.paper};
    transition: all 0.3s ease;

    &:hover {
      background-color: ${(props) => props.theme.palette.background.default};
    }

    &.Mui-focused {
      box-shadow: 0 0 8px rgba(0, 123, 255, 0.4);
    }
  }
`;

const MarkdownContent = styled("div")`
  font-family: ${(props) => props.theme.typography.fontFamily};
  word-break: break-word;
  line-height: 1.5;

  p {
    margin: 0;
    padding: 0;
  }

  p + p {
    margin-top: 0.5em;
  }

  ul,
  ol {
    margin: 0.5em 0;
    padding-left: 1.5em;
  }

  li {
    margin-bottom: 0.25em;
  }

  a {
    color: ${(props) =>
      props.isUserMessage ? "white" : props.theme.palette.primary.main};
    text-decoration: underline;
  }

  code {
    font-family: "Courier New", Courier, monospace;
    background-color: ${(props) =>
      props.isUserMessage ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)"};
    padding: 0.1em 0.3em;
    border-radius: 3px;
    font-size: 0.9em;
  }

  pre {
    background-color: ${(props) =>
      props.isUserMessage ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.05)"};
    padding: 0.5em;
    border-radius: 4px;
    overflow-x: auto;
    margin: 0.5em 0;
  }

  blockquote {
    border-left: 3px solid
      ${(props) =>
        props.isUserMessage ? "white" : props.theme.palette.grey[300]};
    margin: 0.5em 0;
    padding-left: 0.8em;
    font-style: italic;
  }

  strong {
    font-weight: bold;
  }

  em {
    font-style: italic;
  }
`;

const ChatbotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const { execute: executeSendMessage, loading, error } = useApi(sendMessage);
  const messagesEndRef = useRef(null);
  const theme = useTheme();
  const [showNotification, setShowNotification] = useState(true);
  const [conversationId, setConversationId] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [newMessageCount, setNewMessageCount] = useState(0);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowNotification(false);
    setNewMessageCount(0);

    // Init bot message when chat opens
    if (!isOpen && messages.length === 0) {
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          setMessages([
            {
              sender: "bot",
              text: "Hello po! 😊 I am the Barangay San Antonio chatbot. I’m here to answer your questions about our barangay, local news, events, and services. Don’t hesitate to ask po!",
              timestamp: new Date(),
            },
          ]);
        }, 1500);
      }, 500);
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = {
      sender: "user",
      text: input,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");

    setIsTyping(true);

    try {
      const response = await executeSendMessage({
        message: input,
        id: conversationId,
      });

      if (response) {
        setConversationId(response.conversationId);

        // sim typing
        const typingDelay = Math.min(
          Math.max(response.response.length * 10, 800),
          2500
        );

        setTimeout(() => {
          setIsTyping(false);

          const botMessage = {
            sender: "bot",
            text: response.response,
            timestamp: new Date(),
          };

          setMessages((prevMessages) => [...prevMessages, botMessage]);

          if (!isOpen) {
            setNewMessageCount((count) => count + 1);
          }
        }, typingDelay);
      }
    } catch (err) {
      setIsTyping(false);
      // Error is handled by the useApi hook
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (timestamp) => {
    if (!timestamp) return "";
    return timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      {!isOpen && showNotification && (
        <Fade in={showNotification}>
          <Paper
            elevation={2}
            sx={{
              padding: "8px 16px",
              borderRadius: "18px",
              marginRight: "10px",
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.primary.light}`,
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: "medium",
                display: "flex",
                alignItems: "center",
              }}
            >
              <SmartToyIcon
                fontSize="small"
                sx={{ mr: 1, color: theme.palette.primary.main }}
              />
              Need help? Chat with me!
            </Typography>
          </Paper>
        </Fade>
      )}

      {!isOpen && (
        <Tooltip title="Chat with Barangay Assistant" arrow>
          <Badge
            color="error"
            badgeContent={newMessageCount}
            invisible={newMessageCount === 0}
          >
            <GlowingFab
              color="primary"
              aria-label="chat"
              onClick={toggleChat}
              sx={{ mr: 1 }}
            >
              <ChatIcon />
            </GlowingFab>
          </Badge>
        </Tooltip>
      )}

      <Slide direction="up" in={isOpen} mountOnEnter unmountOnExit>
        <Paper
          elevation={6}
          sx={{
            width: 350,
            maxWidth: "90vw",
            display: "flex",
            flexDirection: "column",
            borderRadius: 3,
            overflow: "hidden",
            boxShadow: "0 10px 30px rgba(0, 0, 0, 0.15)",
            border: `1px solid ${theme.palette.primary.light}`,
          }}
        >
          <Box
            sx={{
              p: 2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main} 30%, ${theme.palette.primary.dark} 90%)`,
              color: "white",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  bgcolor: "white",
                  color: theme.palette.primary.main,
                  mr: 1,
                }}
              >
                <SmartToyIcon />
              </Avatar>
              <Box>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ fontWeight: "bold" }}
                >
                  Barangay Assistant
                </Typography>
                <Typography variant="caption">
                  Online | Ready to help
                </Typography>
              </Box>
            </Box>
            <IconButton
              color="inherit"
              onClick={toggleChat}
              sx={{
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                "&:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              p: 2,
              height: 350,
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              bgcolor: theme.palette.grey[50],
              backgroundImage:
                "radial-gradient(circle at center, rgba(0, 123, 255, 0.03) 0%, rgba(0, 123, 255, 0) 70%)",
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
                  {message.sender === "bot" && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.secondary.main,
                        mr: 1,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <SmartToyIcon fontSize="small" />
                    </Avatar>
                  )}

                  <Box
                    sx={{
                      maxWidth: "75%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems:
                        message.sender === "user" ? "flex-end" : "flex-start",
                    }}
                  >
                    <AnimatedMessage
                      elevation={1}
                      sx={{
                        p: 1.5,
                        borderRadius:
                          message.sender === "user"
                            ? "18px 18px 4px 18px"
                            : "18px 18px 18px 4px",
                        backgroundColor:
                          message.sender === "user"
                            ? theme.palette.primary.main
                            : "white",
                        color:
                          message.sender === "user" ? "white" : "text.primary",
                        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                      }}
                    >
                      <MarkdownContent
                        isUserMessage={message.sender === "user"}
                        theme={theme}
                      >
                        <ReactMarkdown>{message.text}</ReactMarkdown>
                      </MarkdownContent>
                    </AnimatedMessage>

                    <Typography
                      variant="caption"
                      sx={{
                        mt: 0.5,
                        color: theme.palette.text.secondary,
                        fontSize: "0.7rem",
                      }}
                    >
                      {formatTime(message.timestamp)}
                    </Typography>
                  </Box>

                  {message.sender === "user" && (
                    <Avatar
                      sx={{
                        bgcolor: theme.palette.grey[300],
                        ml: 1,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                  )}
                </Box>
              ))}

              {isTyping && (
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 1,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      mr: 1,
                    }}
                  >
                    <SmartToyIcon fontSize="small" />
                  </Avatar>

                  <TypingContainer
                    sx={{
                      backgroundColor: "white",
                      borderRadius: "18px 18px 18px 4px",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                    }}
                  >
                    <TypingDots variant="body2">Typing</TypingDots>
                  </TypingContainer>
                </Box>
              )}

              <div ref={messagesEndRef} />
            </Stack>

            {error && (
              <Zoom in={!!error}>
                <Alert
                  severity="error"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                  }}
                  onClose={() => {}}
                >
                  {error.message || "Failed to send message. Please try again."}
                </Alert>
              </Zoom>
            )}
          </Box>

          <Box
            sx={{
              p: 2,
              borderTop: `1px solid ${theme.palette.divider}`,
              display: "flex",
              alignItems: "center",
              backgroundColor: theme.palette.grey[100],
            }}
          >
            <MessageInput
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              size="small"
              theme={theme}
              sx={{ mr: 1 }}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" color="primary" sx={{ mr: -0.5 }}>
                    <MicIcon fontSize="small" />
                  </IconButton>
                ),
              }}
            />
            <Tooltip title="Send message" arrow>
              <span>
                <IconButton
                  color="primary"
                  onClick={handleSendMessage}
                  disabled={loading || input.trim() === ""}
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    "&:hover": {
                      bgcolor: theme.palette.primary.dark,
                    },
                    "&.Mui-disabled": {
                      bgcolor: theme.palette.grey[300],
                      color: theme.palette.grey[500],
                    },
                    width: 40,
                    height: 40,
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SendIcon />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          </Box>

          <Box
            sx={{
              p: 1,
              borderTop: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.grey[50],
              textAlign: "center",
            }}
          >
            <Typography variant="caption" color="text.secondary">
              For A Better San Antonio • Powered by AI
            </Typography>
          </Box>
        </Paper>
      </Slide>
    </Box>
  );
};

export default ChatbotWidget;
