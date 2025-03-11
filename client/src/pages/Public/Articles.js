import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getArticles } from "../../api/articles";
import Banner from "../../components/UI/Banner";
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  TextField,
  InputAdornment,
  Fade,
  Paper,
  Button,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import { ArrowForward, Event } from "@mui/icons-material";

const ArticlesPublic = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [page, setPage] = useState(1);
  const [fadeIn, setFadeIn] = useState(true);
  const articlesPerPage = 9;

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const data = await getArticles();
        setArticles(data);
        setFilteredArticles(data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    setFadeIn(false);
    const timer = setTimeout(() => {
      let results = [...articles];

      if (searchTerm) {
        results = results.filter((article) =>
          article.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      results.sort((a, b) => {
        const dateA = a.createdAt?._seconds
          ? new Date(a.createdAt._seconds * 1000)
          : new Date(a.createdAt);
        const dateB = b.createdAt?._seconds
          ? new Date(b.createdAt._seconds * 1000)
          : new Date(b.createdAt);

        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      });

      setFilteredArticles(results);
      setPage(1);
      setFadeIn(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [articles, searchTerm, sortOrder]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    if (typeof timestamp === "object" && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }

    const date = new Date(timestamp);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleChangePage = (event, newPage) => {
    setFadeIn(false);
    setTimeout(() => {
      setPage(newPage);
      setFadeIn(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 300);
  };

  const paginatedArticles = filteredArticles.slice(
    (page - 1) * articlesPerPage,
    page * articlesPerPage
  );

  const pageCount = Math.ceil(filteredArticles.length / articlesPerPage);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Box mt={4} mb={4}>
          <Skeleton variant="text" height={60} width="40%" />
          <Skeleton variant="rectangular" height={60} sx={{ my: 3 }} />

          <Grid container spacing={3} sx={{ mt: 2 }}>
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <Grid item xs={12} sm={6} md={4} key={item}>
                <Card sx={{ height: "100%" }}>
                  <Skeleton variant="rectangular" height={140} />
                  <CardContent>
                    <Skeleton variant="text" height={30} width="80%" />
                    <Skeleton variant="text" height={20} width="40%" />
                    <Skeleton variant="text" height={60} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box mt={4} mb={4} textAlign="center">
          <Typography variant="h5" color="error" gutterBottom>
            Error Loading Articles
          </Typography>
          <Typography>{error.message}</Typography>
          <Button
            variant="contained"
            onClick={() => window.location.reload()}
            sx={{ mt: 2 }}
          >
            Try Again
          </Button>
        </Box>
      </Container>
    );
  }

  const bannerURL =
    "https://i.ibb.co/BVxPjCrZ/475172880-122193205580173185-8945588955944178897-n.jpg";

  return (
    <Box sx={{ py: 0, minHeight: "100vh" }}>
      {" "}
      <Banner imageUrl={bannerURL} title="News & Updates" />{" "}
      {/* banner component */}
      <Container maxWidth="lg" sx={{ mt: 2 }}>
        {" "}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          {" "}
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                sx: { borderRadius: "50px", height: "40px" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                },
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={2}>
            <FormControl fullWidth size="medium" sx={{ height: "40px" }}>
              <InputLabel id="sort-select-label">
                <Stack
                  direction="row"
                  spacing={1}
                  alignItems="center"
                  sx={{ height: "24px" }}
                >
                  <SortIcon fontSize="small" />
                  Sort
                </Stack>
              </InputLabel>
              <Select
                labelId="sort-select-label"
                value={sortOrder}
                label={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <SortIcon fontSize="small" />
                    Sort
                  </Stack>
                }
                onChange={(e) => setSortOrder(e.target.value)}
                sx={{ height: "40px" }}
              >
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Box
          sx={{
            mb: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="body2" color="textSecondary">
            {" "}
            {filteredArticles.length === 0
              ? "No articles found"
              : `Showing ${filteredArticles.length} articles`}
          </Typography>
        </Box>
        <Fade in={fadeIn} timeout={500}>
          <Box>
            {filteredArticles.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: "center", borderRadius: "12px" }}>
                {" "}
                <Typography variant="subtitle1" gutterBottom>
                  No articles found
                </Typography>{" "}
                <Typography variant="body2" color="text.secondary">
                  Try adjusting your search criteria
                </Typography>
              </Paper>
            ) : (
              <Grid container spacing={3}>
                {paginatedArticles.map((article) => (
                  <Grid item xs={12} sm={6} md={4} key={article.id}>
                    <Card
                      sx={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-4px)",
                          boxShadow: "0 8px 15px rgba(0,0,0,0.08)",
                        },
                        borderRadius: "8px",
                        overflow: "hidden",
                      }}
                    >
                      <CardActionArea
                        component={RouterLink}
                        to={`/articles/${article.id}`}
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "stretch",
                        }}
                      >
                        {article.imageURL ? (
                          <CardMedia
                            component="img"
                            height="160"
                            image={article.imageURL}
                            alt={article.title}
                            sx={{
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.02)",
                              },
                            }}
                          />
                        ) : (
                          <CardMedia
                            component="img"
                            height="160"
                            image={`https://source.unsplash.com/random/400x200/?news`}
                            alt={article.title}
                            sx={{
                              transition: "all 0.3s ease",
                              "&:hover": {
                                transform: "scale(1.02)",
                              },
                            }}
                          />
                        )}
                        <CardContent
                          sx={{
                            flexGrow: 1,
                            display: "flex",
                            flexDirection: "column",
                            padding: 2,
                          }}
                        >
                          {" "}
                          {/* reduced padding in card content */}
                          <Typography
                            gutterBottom
                            variant="h6"
                            component="div"
                            sx={{
                              fontWeight: 500,
                              height: "3em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              fontSize: "1.1rem",
                            }}
                          >
                            {article.title}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mb: 1,
                              fontSize: "0.85rem",
                            }}
                          >
                            <Event sx={{ fontSize: "0.85rem", mr: 0.5 }} />{" "}
                            {formatDate(article.createdAt)}
                          </Typography>
                          {article.summary && (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mb: 1,
                                height: "3.5em",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                fontSize: "0.9rem",
                              }}
                            >
                              {article.summary}
                            </Typography>
                          )}
                          <Typography
                            variant="body2"
                            color="primary"
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              mt: "auto",
                              fontWeight: 500,
                              fontSize: "0.9rem",
                            }}
                          >
                            Read More{" "}
                            <ArrowForward
                              sx={{ fontSize: "0.9rem", ml: 0.5 }}
                            />{" "}
                            {/* smaller icon size */}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Fade>
        {/* pagination */}
        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            {" "}
            {/* reduced mt */}
            <Pagination
              count={pageCount}
              page={page}
              onChange={handleChangePage}
              color="primary"
              size={isMobile ? "small" : "medium"}
              showFirstButton
              showLastButton
              sx={{
                "& .MuiPaginationItem-root": {
                  "&.Mui-selected": {
                    fontWeight: "bold",
                  },
                },
              }}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default ArticlesPublic;
