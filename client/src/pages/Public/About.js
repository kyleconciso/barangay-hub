import React from "react";
import {
  Typography,
  Container,
  Box,
  Paper,
  Grid,
  Card,
  CardContent,
  Divider,
  Avatar,
  useTheme,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PhoneIcon from "@mui/icons-material/Phone";
import Banner from "../../components/UI/Banner";

const About = () => {
  const theme = useTheme();
  const bannerURL =
    "https://scontent.fmnl8-6.fna.fbcdn.net/v/t39.30808-6/480112241_924487019858553_4729428384347088706_n.jpg?stp=cp6_dst-jpg_tt6&_nc_cat=100&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeHrN81Qdx0Veg8WUQrwctG9cngVqCSYzMJyeBWoJJjMwnuO83xYsl5kwUQH0-wo1csZu_uFQPVtHHIGfQKHOQua&_nc_ohc=pPOmogKYR2wQ7kNvgFzxaZL&_nc_oc=Adj0mJ_GtPGDtvi7wH6UyDr_BRKH0OkO3bgVw_aDwHCdAzi0KeH9WHGXk242Le5vraU&_nc_zt=23&_nc_ht=scontent.fmnl8-6.fna&_nc_gid=AQ3aIFJQKn8FoylMvWzV4V8&oh=00_AYGQqLzwAuVZ24Uxap9KgZu3mZA90ryJs6e4ImUp-v3Zdg&oe=67D763B2";

  return (
    <>
      <Banner imageUrl={bannerURL} title="About Our Barangay" />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Welcome Section */}
        <Paper
          elevation={0}
          sx={{
            p: 4,
            mb: 5,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.light}15, ${theme.palette.background.paper})`,
            border: `1px solid ${theme.palette.primary.light}30`,
          }}
        >
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: theme.palette.primary.main,
              textAlign: "center",
              mb: 3,
            }}
          >
            Barangay San Antonio
          </Typography>

          <Typography
            variant="h6"
            sx={{ textAlign: "center", fontStyle: "italic", mb: 4 }}
          ></Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
            Welcome to the official page of Barangay San Antonio, Candon City,
            Ilocos Sur. Here, you can find everything you need to know about our
            barangay.
          </Typography>

          <Typography variant="body1" paragraph sx={{ fontSize: "1.1rem" }}>
            Learn about the happenings, services, and other information for
            residents. Let's get to know our barangay better!
          </Typography>
        </Paper>

        {/* Mission and Vision Section */}
        <Grid container spacing={4} sx={{ mb: 5 }}>
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: theme.palette.primary.main,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.palette.primary.main,
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      mr: 2,
                    }}
                  >
                    M
                  </Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    Our Mission
                  </Typography>
                </Box>

                <Divider
                  sx={{ mb: 3, borderColor: theme.palette.primary.light }}
                />

                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  We aim to provide honest and fast service to everyone in San
                  Antonio. We will strive to make our barangay orderly and
                  progressive, for the good of all!
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 3,
                transition: "transform 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    color: theme.palette.secondary.main,
                  }}
                >
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: theme.palette.secondary.main,
                      color: "#fff",
                      fontWeight: "bold",
                      fontSize: "1.5rem",
                      mr: 2,
                    }}
                  >
                    V
                  </Box>
                  <Typography
                    variant="h4"
                    component="h2"
                    sx={{ fontWeight: 600 }}
                  >
                    Our Vision
                  </Typography>
                </Box>

                <Divider
                  sx={{ mb: 3, borderColor: theme.palette.secondary.light }}
                />

                <Typography variant="body1" sx={{ fontSize: "1.1rem" }}>
                  We dream of a Barangay San Antonio that is prosperous,
                  peaceful, and united. A place where everyone has a bright
                  future!
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Contact Section */}
        <Paper
          elevation={3}
          sx={{
            p: 4,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.secondary.light}15)`,
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 3,
              textAlign: "center",
            }}
          >
            Contact Us
          </Typography>

          <Typography
            variant="body1"
            paragraph
            sx={{ fontSize: "1.1rem", textAlign: "center", mb: 4 }}
          >
            If you have questions, suggestions, or need help, don't hesitate to
            approach us! We're here for you.
          </Typography>

          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.primary.main,
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    <LocationOnIcon fontSize="large" />
                  </Avatar>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, textAlign: "center" }}
                  >
                    Our Location
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    We are located at the Barangay Hall, San Antonio, Candon
                    City, Ilocos Sur.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.secondary.main,
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    <AccessTimeIcon fontSize="large" />
                  </Avatar>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, textAlign: "center" }}
                  >
                    Office Hours
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    We are open from Monday to Friday, 8:00 AM to 5:00 PM.
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={4}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4 },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    p: 3,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: theme.palette.info.main,
                      width: 60,
                      height: 60,
                      mb: 2,
                    }}
                  >
                    <PhoneIcon fontSize="large" />
                  </Avatar>
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{ mb: 1, textAlign: "center" }}
                  >
                    Phone
                  </Typography>
                  <Typography variant="body2" sx={{ textAlign: "center" }}>
                    Call (077) 123-4567. You can also text!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>

        {/* Tagline */}
        <Box
          sx={{
            textAlign: "center",
            mt: 6,
            p: 3,
            borderRadius: "0 0 16px 16px",
            background: `linear-gradient(90deg, ${theme.palette.primary.main}20, ${theme.palette.primary.main}50, ${theme.palette.primary.main}20)`,
          }}
        >
          <Typography
            variant="h5"
            component="p"
            sx={{
              fontStyle: "italic",
              fontWeight: 500,
              color: theme.palette.text.primary,
            }}
          >
            For a Better San Antonio!
          </Typography>
        </Box>
      </Container>
    </>
  );
};

export default About;
