import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { getArticles } from "../../api/articles";
import parse from "html-react-parser";
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Grid,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Divider,
  Chip,
  Fade,
  Zoom,
  IconButton,
  useTheme,
  useMediaQuery,
  Skeleton,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import Banner from "../../components/UI/Banner";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EventIcon from "@mui/icons-material/Event";
import AnnouncementIcon from "@mui/icons-material/Announcement";
import SupportIcon from "@mui/icons-material/Support";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";

const HomePublic = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [articles, setArticles] = useState([]);
  const [articlesLoading, setArticlesLoading] = useState(true);
  const [articlesError, setArticlesError] = useState(null);
  const { user, userType } = useAuth();
  const [bannerImage, setBannerImage] = useState("");
  const homePageBanner =
    "https://i.ibb.co/BVxPjCrZ/475172880-122193205580173185-8945588955944178897-n.jpg";
  const [currentSlide, setCurrentSlide] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  // quick links array
  const quickLinks = [
    {
      title: "Report Concerns",
      icon: <AnnouncementIcon />,
      color: "#FF5722",
      path: "/report",
    },
    {
      title: "Upcoming Events",
      icon: <EventIcon />,
      color: "#2196F3",
      path: "/events",
    },
    {
      title: "Support Services",
      icon: <SupportIcon />,
      color: "#4CAF50",
      path: "/services",
    },
  ];

  // showcase items
  const showcaseItems = [
    {
      title: "Community Programs",
      description:
        "Join our various community initiatives designed to empower residents and foster a sense of unity.",
      imageUrl: "https://source.unsplash.com/random/400x300/?community",
      path: "/programs",
    },
    {
      title: "Local Business Directory",
      description:
        "Support local businesses and discover services available within our barangay.",
      imageUrl: "https://source.unsplash.com/random/400x300/?business",
      path: "/directory",
    },
    {
      title: "Health Services",
      description:
        "Learn about health initiatives and services offered to barangay residents.",
      imageUrl: "https://source.unsplash.com/random/400x300/?health",
      path: "/health",
    },
  ];

  const formatDate = (timestamp) => {
    if (!timestamp) return "";
    // handle firestore timestamp
    if (typeof timestamp === "object" && timestamp._seconds) {
      return new Date(timestamp._seconds * 1000).toLocaleDateString();
    }
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  // fetch latest 3 articles
  useEffect(() => {
    const fetchLatestArticles = async () => {
      try {
        const data = await getArticles();
        // sort articles by createdat
        const sortedArticles = [...data].sort((a, b) => {
          const dateA = a.createdAt?._seconds
            ? new Date(a.createdAt._seconds * 1000)
            : new Date(a.createdAt);
          const dateB = b.createdAt?._seconds
            ? new Date(b.createdAt._seconds * 1000)
            : new Date(b.createdAt);
          return dateB - dateA;
        });
        setArticles(sortedArticles.slice(0, 3)); // get the latest 3
      } catch (err) {
        setArticlesError(err);
      } finally {
        setArticlesLoading(false);
      }
    };

    fetchLatestArticles();
  }, []);

  // slide animation for showcase items
  useEffect(() => {
    const timer = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
        setFadeIn(true);
      }, 500);
    }, 6000);

    return () => clearInterval(timer);
  }, [showcaseItems.length]);

  const handlePrevSlide = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide(
        (prev) => (prev - 1 + showcaseItems.length) % showcaseItems.length
      );
      setFadeIn(true);
    }, 300);
  };

  const handleNextSlide = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % showcaseItems.length);
      setFadeIn(true);
    }, 300);
  };

  const submitTicketLink = user
    ? userType === "RESIDENT"
      ? "/user/tickets"
      : "/admin/tickets"
    : "/signup";

  useEffect(() => {
    setBannerImage(homePageBanner);
  }, []);

  return (
    <Box sx={{}}>
      {/* banner with animated overlay text */}
      <Box sx={{ position: "relative" }}>
        <Banner imageUrl={bannerImage} title="" />
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 1,
            color: "white",
            padding: 3,
            textAlign: "center",
          }}
        >
          <Zoom in={true} style={{ transitionDelay: "300ms" }}>
            <Typography
              variant="h3"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 1,
                fontSize: { xs: "1.8rem", sm: "2.5rem", md: "3rem" },
                textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
              }}
            >
              Barangay San Antonio, Candon City
            </Typography>
          </Zoom>
          <Fade in={true} style={{ transitionDelay: "600ms" }}>
            <Typography
              variant="h6"
              sx={{
                maxWidth: "800px",
                mb: 2,
                fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                textShadow: "1px 1px 2px rgba(0,0,0,0.5)",
                letterSpacing: "0.1em",
              }}
            >
              For a Better San Antonio
            </Typography>
          </Fade>
          <Fade in={true} style={{ transitionDelay: "900ms" }}>
            <Button
              variant="contained"
              size="medium"
              component={RouterLink}
              to="/about"
              sx={{
                backgroundColor: "primary.main",
                color: "white",
                px: 3,
                py: 1,
                fontSize: "1rem",
                borderRadius: "50px",
                "&:hover": {
                  backgroundColor: "primary.dark",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Discover Our Barangay
            </Button>
          </Fade>
        </Box>
      </Box>

      <Container maxWidth="lg">
        {/* quick links section */}
        <Box
          sx={{
            mt: -5,
            position: "relative",
            zIndex: 10,
            mx: { xs: 2, md: 0 },
          }}
        ></Box>

        {/* welcome section with animation */}
        <Box mt={8} mb={6}>
          <Fade in={true} style={{ transitionDelay: "300ms" }}>
            <Paper
              elevation={0}
              sx={{
                p: 4,
                mb: 4,
                borderRadius: "16px",
                backgroundImage:
                  "linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)",
                border: "1px solid rgba(230, 230, 230, 0.5)",
              }}
            >
              <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={7}>
                  <Typography
                    variant="h4"
                    component="h2"
                    gutterBottom
                    sx={{
                      fontWeight: 700,
                      color: "primary.main",
                    }}
                  >
                    Welcome to Barangay San Antonio!
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.6 }}
                  >
                    Here in our barangay, we are committed to serving our
                    community and making it easier for everyone to access
                    important information and services. Our goal is to build a
                    safe, inclusive, and progressive environment where all
                    residents can thrive.
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ mb: 3, fontSize: "1.1rem", lineHeight: 1.6 }}
                  >
                    Feel free to explore our site for the latest updates,
                    announcements, community programs, and contact details.
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    <Chip
                      icon={<LocationOnIcon />}
                      label="Dario St."
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label="Office Hours: 8AM - 6PM"
                      sx={{ mr: 1, mb: 1 }}
                    />
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={5}
                  sx={{ display: { xs: "none", md: "block" } }}
                >
                  <Box
                    sx={{
                      borderRadius: "12px",
                      overflow: "hidden",
                      // boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    }}
                  >
                    <img
                      src="https://i.ibb.co/Ps6D83RM/logo.png"
                      alt="Logo"
                      style={{
                        width: "100%",
                        height: "auto",
                        display: "block",
                      }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Fade>
        </Box>

        {/* latest news with hover effects */}
        <Box mb={8}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
            Latest News
          </Typography>
          <Divider sx={{ mb: 4 }} />

          {articlesLoading ? (
            <Grid container spacing={3}>
              {[1, 2, 3].map((item) => (
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
          ) : articlesError ? (
            <Typography color="error">
              Error loading articles: {articlesError.message}
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {articles.map((article) => (
                <Grid item xs={12} sm={6} md={4} key={article.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-10px)",
                        boxShadow: "0 12px 20px rgba(0,0,0,0.1)",
                      },
                      borderRadius: "12px",
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
                            transition: "all 0.5s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      ) : (
                        <CardMedia
                          component="img"
                          height="160"
                          image="https://source.unsplash.com/random/400x200/?news"
                          alt="News placeholder"
                          sx={{
                            transition: "all 0.5s ease",
                            "&:hover": {
                              transform: "scale(1.05)",
                            },
                          }}
                        />
                      )}
                      <CardContent
                        sx={{
                          flexGrow: 1,
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <Typography
                          gutterBottom
                          variant="h6"
                          component="div"
                          sx={{ fontWeight: 600 }}
                        >
                          {article.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 2 }}
                        >
                          <EventIcon
                            sx={{
                              fontSize: "0.9rem",
                              verticalAlign: "middle",
                              mr: 0.5,
                            }}
                          />
                          {formatDate(article.createdAt)}
                        </Typography>
                        {article.summary && (
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, flexGrow: 1 }}
                          >
                            {article.summary.length > 100
                              ? `${article.summary.substring(0, 100)}...`
                              : article.summary}
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
                          }}
                        >
                          Read More{" "}
                          <ArrowForwardIcon
                            sx={{ fontSize: "0.9rem", ml: 0.5 }}
                          />
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="outlined"
              component={RouterLink}
              to="/articles"
              endIcon={<ArrowForwardIcon />}
              sx={{
                borderRadius: "50px",
                px: 4,
                py: 1,
                "&:hover": {
                  backgroundColor: "rgba(0,0,0,0.04)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              View All News
            </Button>
          </Box>
        </Box>

        {/* call to action with animation */}
        <Zoom in={true}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              mb: 8,
              borderRadius: "20px",
              background: "linear-gradient(45deg, #1a237e 0%, #3949ab 100%)",
              color: "white",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* background decoration */}
            <Box
              sx={{
                position: "absolute",
                top: -50,
                right: -50,
                width: "200px",
                height: "200px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
                zIndex: 0,
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: -30,
                left: -30,
                width: "150px",
                height: "150px",
                borderRadius: "50%",
                backgroundColor: "rgba(255,255,255,0.1)",
                zIndex: 0,
              }}
            />

            <Box sx={{ position: "relative", zIndex: 1 }}>
              <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
                Need Assistance?
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  mb: 4,
                  maxWidth: "700px",
                  mx: "auto",
                  fontSize: "1.1rem",
                }}
              >
                Our barangay officials are always ready to assist you. Just
                submit a request through our system, and we’ll get back to you
                as soon as possible to address your concerns.
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={RouterLink}
                to={submitTicketLink}
                sx={{
                  bgcolor: "white",
                  color: "primary.dark",
                  px: 4,
                  py: 1.5,
                  borderRadius: "50px",
                  textTransform: "none",
                  fontWeight: 600,
                  fontSize: "1.1rem",
                  "&:hover": {
                    bgcolor: "#f0f0f0",
                    transform: "translateY(-3px)",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.2)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                {user ? "View My Tickets" : "Sign Up to Submit a Ticket"}
              </Button>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
};

export default HomePublic;
