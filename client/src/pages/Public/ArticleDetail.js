import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getArticle } from "../../api/articles";
import parse from "html-react-parser";
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Divider,
  Chip,
  Breadcrumbs,
  Link,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from "@mui/icons-material/Person";

// Create a theme with Plus Jakarta Sans font
const theme = createTheme({
  typography: {
    fontFamily: '"Plus Jakarta Sans", sans-serif',
    h1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h3: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    body1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    body2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    subtitle1: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    subtitle2: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 500,
    },
  },
});

const ArticleDetailPublic = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [readTime, setReadTime] = useState("");

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const data = await getArticle(id);
        setArticle(data);

        // calculate estimated reading time
        if (data.content) {
          const wordCount = data.content
            .replace(/<[^>]*>/g, "")
            .split(/\s+/).length;
          const readingTime = Math.ceil(wordCount / 200);
          setReadTime(`${readingTime} min read`);
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="50vh"
          >
            <CircularProgress />
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (error) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box
            mt={4}
            display="flex"
            justifyContent="center"
            flexDirection="column"
            alignItems="center"
          >
            <Typography variant="h5" color="error">
              Error loading article
            </Typography>
            <Typography color="textSecondary">{error.message}</Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  if (!article) {
    return (
      <ThemeProvider theme={theme}>
        <Container maxWidth="lg">
          <Box mt={4} display="flex" justifyContent="center">
            <Typography variant="h5" color="textSecondary">
              Article not found.
            </Typography>
          </Box>
        </Container>
      </ThemeProvider>
    );
  }

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    // handle firestore timestamp
    if (typeof timestamp === "object" && timestamp._seconds) {
      const date = new Date(timestamp._seconds * 1000);
      return new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }).format(date);
    }
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const contentStyles = {
    "& p": {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: "1.1rem",
      lineHeight: 1.7,
      mb: 3,
    },
    "& h2": {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: "1.8rem",
      fontWeight: 600,
      mt: 4,
      mb: 2,
    },
    "& h3": {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: "1.5rem",
      fontWeight: 600,
      mt: 3,
      mb: 2,
    },
    "& h4, & h5, & h6": {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    "& blockquote": {
      borderLeft: "4px solid",
      borderColor: "grey.300",
      pl: 2,
      py: 1,
      fontStyle: "italic",
      fontFamily: '"Plus Jakarta Sans", sans-serif',
    },
    "& img": {
      maxWidth: "100%",
      height: "auto",
      borderRadius: 1,
      my: 2,
    },
    "& a": {
      color: "primary.main",
      textDecoration: "none",
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      "&:hover": {
        textDecoration: "underline",
      },
    },
    "& ul, & ol": {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontSize: "1.1rem",
      lineHeight: 1.7,
      mb: 3,
      pl: 3,
    },
    "& li": {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      mb: 1,
    },
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, md: 4 },
            borderRadius: 2,
            boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
            overflow: "hidden",
          }}
        >
          {article.category && (
            <Box mb={3}>
              <Chip
                label={article.category}
                size="small"
                color="primary"
                sx={{
                  borderRadius: 1,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              />
            </Box>
          )}

          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              fontSize: { xs: "2rem", md: "2.5rem" },
              lineHeight: 1.2,
              fontFamily: '"Plus Jakarta Sans", sans-serif',
            }}
          >
            {article.title}
          </Typography>

          <Box
            display="flex"
            alignItems="center"
            flexWrap="wrap"
            sx={{ mb: 3, color: "text.secondary" }}
          >
            {article.author && (
              <Box display="flex" alignItems="center" mr={3} mb={1}>
                <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
                <Typography
                  variant="body2"
                  sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
                >
                  {article.author}
                </Typography>
              </Box>
            )}

            <Box display="flex" alignItems="center" mr={3} mb={1}>
              <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
              <Typography
                variant="body2"
                sx={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {formatDate(article.createdAt)}
              </Typography>
            </Box>

            {readTime && (
              <Typography
                variant="body2"
                sx={{ mb: 1, fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {readTime}
              </Typography>
            )}
          </Box>

          {article.imageURL && (
            <Box
              sx={{
                mt: 2,
                mb: 4,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                position: "relative",
                paddingTop: { xs: "56.25%", md: "40%" },
              }}
            >
              <img
                src={article.imageURL}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              />
            </Box>
          )}

          {article.summary && (
            <Box mb={4}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontStyle: "italic",
                  color: "text.secondary",
                  fontSize: "1.1rem",
                  borderLeft: "4px solid",
                  borderColor: "primary.main",
                  pl: 2,
                  fontFamily: '"Plus Jakarta Sans", sans-serif',
                }}
              >
                {article.summary}
              </Typography>
            </Box>
          )}

          <Divider sx={{ mb: 4 }} />

          <Box sx={contentStyles}>{parse(article.content)}</Box>

          <Box mt={6} mb={2}>
            <Divider />
            <Box
              mt={3}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
            >
              {/* Tags if available */}
              {article.tags && article.tags.length > 0 && (
                <Box display="flex" flexWrap="wrap" gap={1} mt={1}>
                  {article.tags.map((tag, index) => (
                    <Chip
                      key={index}
                      label={tag}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 1,
                        fontFamily: '"Plus Jakarta Sans", sans-serif',
                      }}
                    />
                  ))}
                </Box>
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default ArticleDetailPublic;
