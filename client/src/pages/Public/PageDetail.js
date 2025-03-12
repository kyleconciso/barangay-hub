import React, { useState, useEffect } from "react";
import {
  Typography,
  Container,
  Box,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { getPage } from "../../api/pages";
import LoadingSpinner from "../../components/UI/LoadingSpinner";
import ErrorMessage from "../../components/UI/ErrorMessage";
import DOMPurify from "dompurify";
import Banner from "../../components/UI/Banner";
import { grey } from "@mui/material/colors";

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

const PageDetail = ({ pageSlug }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPageData = async () => {
      try {
        const fetchedPage = await getPage(pageSlug);
        if (fetchedPage) {
          setPage(fetchedPage);
        } else {
          setError(new Error("Page not found"));
        }
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPageData();
  }, [pageSlug]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!page) return <div>Page not found.</div>;

  return (
    <ThemeProvider theme={theme}>
      {" "}
      <Banner imageUrl={page.imageURL} title={page.title} />
      <Container maxWidth="lg" sx={{ pt: 4, pb: 6 }}>
        <Box
          sx={{
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
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(page.content),
            }}
          />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default PageDetail;
