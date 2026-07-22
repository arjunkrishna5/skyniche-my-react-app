import React, { useState } from "react";
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Link,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useAuth } from "../contents/AuthContext";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State to track absolute cursor coordinates relative to screen container
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0 });

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  const handleScreenMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMouseCoords({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Please enter a valid email").required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    const response = await login(values.email, values.password);
    setLoading(false);

    if (response.success) {
      enqueueSnackbar("Welcome back!", { variant: "success" });
      navigate("/dashboard");
    } else {
      enqueueSnackbar(response.error || "Authentication failed", { variant: "error" });
      setSubmitting(false);
    }
  };

  return (
    <Box
      onMouseMove={handleScreenMouseMove}
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #090d16 0%, #020617 100%)", // Deep dark background
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        p: 3,
        overflow: "hidden",
      }}
    >
      {/* Animated Moving Background Grid */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.05) 1.5px, transparent 1.5px)",
          backgroundSize: "32px 32px",
          animation: "gridMove 15s linear infinite",
          zIndex: 1,
        }}
      />

      {/* Dynamic Cursor Spotlight Glow (Follows mouse cursor) */}
      <Box
        sx={{
          position: "absolute",
          width: "550px",
          height: "550px",
          background: "radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, rgba(99, 102, 241, 0.08) 45%, transparent 70%)",
          left: `${mouseCoords.x - 275}px`,
          top: `${mouseCoords.y - 275}px`,
          filter: "blur(40px)",
          pointerEvents: "none", // Ensures mouse events pass through to form inputs
          zIndex: 2,
          transition: "left 0.1s ease-out, top 0.1s ease-out", // Adds smooth lag to the cursor spotlight
        }}
      />

      {/* Ambient static neon backdrops */}
      <Box
        sx={{
          position: "absolute",
          top: "15%",
          left: "20%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(13, 148, 136, 0.12) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulseGlow 12s infinite ease-in-out alternate",
          zIndex: 2,
        }}
      />
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "20%",
          width: "450px",
          height: "450px",
          background: "radial-gradient(circle, rgba(99, 102, 241, 0.10) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "pulseGlow 10s infinite ease-in-out alternate-reverse",
          zIndex: 2,
        }}
      />

      {/* Centered Login Card */}
      <Paper
        elevation={24}
        sx={{
          width: "100%",
          maxWidth: "420px",
          background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.8) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "24px",
          padding: { xs: "30px 24px", sm: "40px 36px" },
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          zIndex: 3,
          position: "relative",
          transition: "box-shadow 0.3s ease, border-color 0.3s",
          "&:hover": {
            boxShadow: "0 35px 60px -10px rgba(0, 0, 0, 0.7), 0 0 50px rgba(45, 212, 191, 0.08)",
            borderColor: "rgba(45, 212, 191, 0.15)",
          }
        }}
      >
        {/* Back to Home Link */}
        <Box sx={{ mb: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate("/")}
            sx={{
              color: "#64748b",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.85rem",
              p: 0,
              minWidth: 0,
              transition: "color 0.2s",
              "&:hover": { color: "#2dd4bf", backgroundColor: "transparent" },
              "& .MuiButton-startIcon": {
                transition: "transform 0.2s ease",
              },
              "&:hover .MuiButton-startIcon": {
                transform: "translateX(-4px)",
              }
            }}
          >
            Back to Home
          </Button>
        </Box>

        {/* Header Title */}
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h4"
            fontWeight={800}
            color="white"
            sx={{ letterSpacing: "-0.5px", mb: 1 }}
          >
            Sign In
          </Typography>
          <Typography variant="body2" color="#64748b" fontWeight={500}>
            Welcome back! Please enter your credentials below.
          </Typography>
        </Box>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
          }) => (
            <Form onSubmit={handleSubmit}>
              <TextField
                label="Email Address"
                type="email"
                name="email"
                fullWidth
                variant="outlined"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    transition: "box-shadow 0.25s ease-in-out, border-color 0.2s",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      transition: "border-color 0.2s",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.18)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 16px rgba(45, 212, 191, 0.15)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2dd4bf",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#64748b",
                    fontWeight: 500,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#2dd4bf",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f87171",
                  }
                }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                fullWidth
                variant="outlined"
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                sx={{
                  mb: 2.5,
                  "& .MuiOutlinedInput-root": {
                    color: "white",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    borderRadius: "10px",
                    transition: "box-shadow 0.25s ease-in-out, border-color 0.2s",
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.08)",
                      transition: "border-color 0.2s",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.18)",
                    },
                    "&.Mui-focused": {
                      boxShadow: "0 0 16px rgba(45, 212, 191, 0.15)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#2dd4bf",
                    },
                  },
                  "& .MuiInputLabel-root": {
                    color: "#64748b",
                    fontWeight: 500,
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#2dd4bf",
                  },
                  "& .MuiFormHelperText-root": {
                    color: "#f87171",
                  }
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        sx={{ color: "#64748b" }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Box display="flex" justifyContent="flex-end" mb={3.5}>
                <Link
                  href="#"
                  underline="hover"
                  sx={{
                    color: "#2dd4bf",
                    fontSize: "0.85rem",
                    fontWeight: 600,
                    transition: "color 0.2s",
                    "&:hover": { color: "#0d9488" },
                  }}
                >
                  Forgot password?
                </Link>
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                className="shimmer-btn"
                sx={{
                  background: "linear-gradient(90deg, #2dd4bf 0%, #0d9488 100%)",
                  color: "#020617",
                  fontWeight: 800,
                  fontSize: "0.95rem",
                  padding: "12px 0",
                  borderRadius: "10px",
                  textTransform: "none",
                  boxShadow: "0 4px 20px rgba(45, 212, 191, 0.25)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(90deg, #0d9488 0%, #0f766e 100%)",
                    boxShadow: "0 6px 24px rgba(13, 148, 136, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&.Mui-disabled": {
                    background: "rgba(255, 255, 255, 0.15)",
                    color: "#64748b",
                  }
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
              </Button>
            </Form>
          )}
        </Formik>

        <Typography
          sx={{
            color: "#64748b",
            textAlign: "center",
            fontSize: "0.85rem",
            fontWeight: 500,
            mb: 4,
          }}
        >
          Don't have an account?{" "}
          <Link
            href="#"
            underline="hover"
            sx={{
              color: "#2dd4bf",
              fontWeight: 700,
              "&:hover": { color: "#0d9488" },
            }}
          >
            Sign Up
          </Link>
        </Typography>

        {/* Social login divider */}
        <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
          <Box sx={{ flexGrow: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }} />
          <Typography variant="caption" sx={{ color: "#475569", px: 2, fontWeight: 600, letterSpacing: "0.5px" }}>
            OR CONTINUE WITH
          </Typography>
          <Box sx={{ flexGrow: 1, borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }} />
        </Box>

        {/* Social login buttons */}
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GoogleIcon sx={{ color: "#ea4335" }} />}
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                py: 1.2,
                backgroundColor: "rgba(255, 255, 255, 0.01)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                },
              }}
            >
              Google
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHubIcon sx={{ color: "white" }} />}
              sx={{
                border: "1px solid rgba(255, 255, 255, 0.06)",
                borderRadius: "10px",
                color: "white",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                py: 1.2,
                backgroundColor: "rgba(255, 255, 255, 0.01)",
                "&:hover": {
                  borderColor: "rgba(255, 255, 255, 0.15)",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                },
              }}
            >
              GitHub
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default Login;
