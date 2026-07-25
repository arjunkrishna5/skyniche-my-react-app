import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Chip,
  Avatar
} from '@mui/material';
import {
  ShoppingBag as ShoppingBagIcon,
  Login as LoginIcon,
  Dashboard as DashboardIcon,
  Star as StarIcon,
  LocalShipping as ShippingIcon,
  Security as SecurityIcon,
  HeadsetMic as SupportIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckIcon,
  AutoAwesome as SparklesIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Autorenew as ReturnIcon
} from '@mui/icons-material';
import { useAuth } from '../contents/AuthContext';
import { useProducts } from '../contents/ProductContext';

export default function ViteLanding() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { products } = useProducts();

  const globeCanvasRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 1. ACTIVE THEORY-INSPIRED SCROLL-DRIVEN 3D EARTH GLOBE ENGINE
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    const canvas = globeCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate 550 High-Density 3D Earth Globe Points
    const radius = 220;
    const globePoints = [];
    const numLat = 24;
    const numLon = 36;

    for (let i = 0; i <= numLat; i++) {
      const lat = (Math.PI * i) / numLat - Math.PI / 2;
      for (let j = 0; j < numLon; j++) {
        const lon = (2 * Math.PI * j) / numLon;
        globePoints.push({
          x: radius * Math.cos(lat) * Math.cos(lon),
          y: radius * Math.sin(lat),
          z: radius * Math.cos(lat) * Math.sin(lon),
          isEquator: Math.abs(i - numLat / 2) < 1,
        });
      }
    }

    let rotationY = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Scroll Y drives 3D expansion scale & rotation speed
      const currentScroll = window.scrollY || 0;
      const scrollFactor = Math.min(currentScroll / 600, 1.8);
      const scaleMultiplier = 1 + scrollFactor * 0.95; // Earth expands toward screen on scroll
      const globeOpacity = Math.max(0.12, 1 - scrollFactor * 0.65);

      rotationY += 0.008 + scrollFactor * 0.015; // Scrolling accelerates 3D rotation
      const rotationX = 0.25;

      const cosY = Math.cos(rotationY);
      const sinY = Math.sin(rotationY);
      const cosX = Math.cos(rotationX);
      const sinX = Math.sin(rotationX);

      const projectedPoints = [];

      // Globe Center shifts smoothly upwards on scroll
      const centerY = height / 2.3 - scrollFactor * 120;

      // 3D Matrix Projection
      for (let i = 0; i < globePoints.length; i++) {
        const p = globePoints[i];

        let x1 = p.x * cosY - p.z * sinY;
        let z1 = p.x * sinY + p.z * cosY;

        let y2 = p.y * cosX - z1 * sinX;
        let z2 = p.y * sinX + z1 * cosX;

        const focalLength = 450;
        const scale = (focalLength / (focalLength + z2)) * scaleMultiplier;

        const projX = width / 2 + x1 * scale;
        const projY = centerY + y2 * scale;

        projectedPoints.push({ x: projX, y: projY, z: z2, scale, isEquator: p.isEquator });

        // Draw 3D Globe Node
        if (z2 < 40) {
          ctx.beginPath();
          ctx.arc(projX, projY, Math.max(0.6, (p.isEquator ? 2.4 : 1.5) * scale), 0, Math.PI * 2);
          ctx.fillStyle = z2 < -30 
            ? `rgba(45, 212, 191, ${globeOpacity})` 
            : `rgba(192, 132, 252, ${globeOpacity * 0.5})`;
          if (z2 < -50) {
            ctx.shadowBlur = 10;
            ctx.shadowColor = "#2dd4bf";
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // Draw Arc Lines (Global Trade & Logistics Routes)
      ctx.lineWidth = 0.9;
      for (let i = 0; i < projectedPoints.length; i += 6) {
        const p1 = projectedPoints[i];
        const p2 = projectedPoints[(i + 13) % projectedPoints.length];
        if (p1.z < 10 && p2.z < 10) {
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.quadraticCurveTo(width / 2, centerY - 60, p2.x, p2.y);
          ctx.strokeStyle = `rgba(45, 212, 191, ${globeOpacity * 0.35})`;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 3D Perspective Mouse Tilt Handler
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setTilt({ x: (-y / (rect.height / 2)) * 10, y: (x / (rect.width / 2)) * 10 });
  };

  const handleCardMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const featuredProduct = products[0] || {
    name: 'MacBook Pro 16" M3 Max',
    price: 2499.00,
    desc: 'Flagship performance workstation featuring 36GB Unified Memory and liquid retina XDR display.',
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#060911",
        color: "white",
        position: "relative",
        overflowX: "hidden",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Active Theory Scroll-Driven 3D Earth Globe Canvas */}
      <canvas
        ref={globeCanvasRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* --- 1. GLASSMORPHISM NAVBAR HEADER --- */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          backdropFilter: "blur(18px)",
          backgroundColor: "rgba(6, 9, 17, 0.82)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          px: { xs: 2, md: 6 },
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Universal Brand Logo */}
        <Box display="flex" alignItems="center" gap={1.5} sx={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: "12px",
              background: "linear-gradient(135deg, #2dd4bf 0%, #0d9488 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 25px rgba(45, 212, 191, 0.5)",
            }}
          >
            <ShoppingBagIcon sx={{ color: "#060911", fontSize: 22 }} />
          </Box>
          <Box>
            <Typography variant="h6" fontWeight={900} letterSpacing="-0.5px" sx={{ color: "white", lineHeight: 1 }}>
              AURA<span style={{ color: "#2dd4bf" }}>.</span>
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1px" }}>
              GLOBAL E-STORE
            </Typography>
          </Box>
        </Box>

        {/* Action Buttons */}
        <Box display="flex" alignItems="center" gap={2}>
          <Button
            onClick={() => navigate("/shop")}
            variant="outlined"
            startIcon={<ShoppingBagIcon sx={{ fontSize: 18 }} />}
            sx={{
              color: "#2dd4bf",
              borderColor: "rgba(45, 212, 191, 0.4)",
              fontWeight: 700,
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              textTransform: "none",
              backgroundColor: "rgba(45, 212, 191, 0.05)",
              "&:hover": {
                backgroundColor: "rgba(45, 212, 191, 0.18)",
                borderColor: "#2dd4bf",
                boxShadow: "0 0 20px rgba(45, 212, 191, 0.25)",
              },
            }}
          >
            Explore Shop
          </Button>

          {isAuthenticated ? (
            <Button
              onClick={() => navigate(user?.role?.toLowerCase() === "admin" ? "/dashboard" : "/my-orders")}
              variant="contained"
              startIcon={user?.role?.toLowerCase() === "admin" ? <DashboardIcon /> : <Avatar sx={{ width: 22, height: 22, fontSize: "0.75rem", bgcolor: "#060911", color: "#2dd4bf" }}>{user?.name?.[0]}</Avatar>}
              sx={{
                backgroundColor: "#2dd4bf",
                color: "#060911",
                fontWeight: 800,
                borderRadius: "10px",
                px: 3,
                py: 1,
                textTransform: "none",
                boxShadow: "0 4px 20px rgba(45, 212, 191, 0.3)",
                "&:hover": { backgroundColor: "#0d9488", color: "white" },
              }}
            >
              {user?.role?.toLowerCase() === "admin" ? "Dashboard" : "My Account"}
            </Button>
          ) : (
            <Button
              onClick={() => navigate("/login")}
              variant="contained"
              startIcon={<LoginIcon />}
              sx={{
                backgroundColor: "#2dd4bf",
                color: "#060911",
                fontWeight: 800,
                borderRadius: "10px",
                px: 3,
                py: 1,
                textTransform: "none",
                boxShadow: "0 4px 20px rgba(45, 212, 191, 0.3)",
                "&:hover": { backgroundColor: "#0d9488", color: "white" },
              }}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Box>

      {/* --- 2. ACTIVE THEORY HERO SECTION WITH SCROLL INDICATOR --- */}
      <Container maxWidth="lg" sx={{ pt: { xs: 8, md: 12 }, pb: { xs: 8, md: 10 }, position: "relative", zIndex: 2 }}>
        <Grid container spacing={5} alignItems="center">
          {/* Left Text & CTAs */}
          <Grid item xs={12} md={7}>
            <Box>
              {/* Badge */}
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.8,
                  borderRadius: "30px",
                  backgroundColor: "rgba(45, 212, 191, 0.08)",
                  border: "1px solid rgba(45, 212, 191, 0.3)",
                  color: "#2dd4bf",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  mb: 3,
                  boxShadow: "0 0 20px rgba(45, 212, 191, 0.15)",
                }}
              >
                <SparklesIcon sx={{ fontSize: 16 }} />
                <span>✦ Global E-Commerce Network</span>
              </Box>

              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.8rem", sm: "3.8rem", md: "4.5rem" },
                  fontWeight: 900,
                  letterSpacing: "-2px",
                  lineHeight: 1.05,
                  mb: 3,
                }}
              >
                Discover Tomorrow's Products{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #2dd4bf 0%, #c084fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Today.
                </span>
              </Typography>

              <Typography variant="body1" sx={{ color: "#94a3b8", fontSize: { xs: "1.05rem", md: "1.25rem" }, lineHeight: 1.7, mb: 4, maxWidth: "580px" }}>
                Curated high-performance electronics, luxury skincare, and everyday lifestyle essentials delivered worldwide with real-time logistics tracking.
              </Typography>

              {/* Action Buttons */}
              <Box display="flex" flexWrap="wrap" gap={2}>
                <Button
                  onClick={() => navigate("/shop")}
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    backgroundColor: "#2dd4bf",
                    color: "#060911",
                    fontWeight: 800,
                    fontSize: "1.05rem",
                    px: 4,
                    py: 1.8,
                    borderRadius: "14px",
                    textTransform: "none",
                    boxShadow: "0 8px 30px rgba(45, 212, 191, 0.35)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      backgroundColor: "#0d9488",
                      color: "white",
                      transform: "translateY(-2px)",
                      boxShadow: "0 12px 35px rgba(45, 212, 191, 0.45)",
                    },
                  }}
                >
                  Explore Shop
                </Button>

                <Button
                  onClick={() => navigate("/login")}
                  variant="outlined"
                  size="large"
                  sx={{
                    color: "white",
                    borderColor: "rgba(255, 255, 255, 0.15)",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                    px: 3.5,
                    py: 1.8,
                    borderRadius: "14px",
                    textTransform: "none",
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    "&:hover": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                      backgroundColor: "rgba(255, 255, 255, 0.06)",
                    },
                  }}
                >
                  Sign In / Account
                </Button>
              </Box>

              {/* Active Scroll Hint Indicator */}
              <Box display="flex" alignItems="center" gap={1.5} mt={5}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    border: "1px solid rgba(45, 212, 191, 0.4)",
                    color: "#2dd4bf",
                    animation: "bounceDown 2s infinite ease-in-out",
                    "@keyframes bounceDown": {
                      "0%, 100%": { transform: "translateY(0)" },
                      "50%": { transform: "translateY(6px)" },
                    },
                  }}
                >
                  <ArrowDownIcon fontSize="small" />
                </Box>
                <Typography variant="caption" color="#94a3b8" fontWeight={700} letterSpacing="1px">
                  SCROLL TO EXPAND 3D WORLD
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Right 3D Perspective Mouse Tilt Product Showcase Card */}
          <Grid item xs={12} md={5}>
            <Box style={{ perspective: "1000px" }}>
              <Paper
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
                elevation={0}
                sx={{
                  p: 3.5,
                  borderRadius: "24px",
                  background: "linear-gradient(135deg, rgba(30, 41, 59, 0.6) 0%, rgba(15, 23, 42, 0.9) 100%)",
                  border: "1px solid rgba(45, 212, 191, 0.3)",
                  boxShadow: "0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(45, 212, 191, 0.25)",
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                  transition: "transform 0.1s ease-out, box-shadow 0.3s ease",
                  cursor: "pointer",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    height: "220px",
                    borderRadius: "16px",
                    background: "radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, rgba(192, 132, 252, 0.1) 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    position: "relative",
                    mb: 2.5,
                  }}
                >
                  <ShoppingBagIcon sx={{ fontSize: 90, color: "rgba(45, 212, 191, 0.5)", filter: "drop-shadow(0 0 20px rgba(45, 212, 191, 0.4))" }} />
                  <Chip
                    label="🔥 Top Rated"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "rgba(6, 9, 17, 0.85)",
                      color: "#2dd4bf",
                      fontWeight: 800,
                      border: "1px solid rgba(45, 212, 191, 0.4)",
                      fontSize: "0.75rem",
                    }}
                  />
                </Box>

                <Typography variant="h5" fontWeight={900} color="white" mb={1}>
                  {featuredProduct.name}
                </Typography>
                <Typography variant="body2" color="#94a3b8" mb={2.5} lineHeight={1.6}>
                  {featuredProduct.desc}
                </Typography>

                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" color="#64748b" display="block">FEATURED ITEM</Typography>
                    <Typography variant="h5" fontWeight={900} color="#2dd4bf">
                      ${typeof featuredProduct.price === "number" ? featuredProduct.price.toFixed(2) : featuredProduct.price}
                    </Typography>
                  </Box>
                  <Button
                    onClick={() => navigate("/shop")}
                    variant="contained"
                    sx={{
                      backgroundColor: "#2dd4bf",
                      color: "#060911",
                      fontWeight: 800,
                      borderRadius: "10px",
                      px: 3,
                      "&:hover": { backgroundColor: "#0d9488", color: "white" },
                    }}
                  >
                    Buy in Store
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* --- 3. LIVE STATS BANNER --- */}
      <Box
        sx={{
          borderTop: "1px solid rgba(255, 255, 255, 0.08)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          backgroundColor: "rgba(15, 23, 42, 0.5)",
          backdropFilter: "blur(12px)",
          py: 4,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between" alignItems="center">
            {[
              { value: "15,000+", label: "Happy Customers" },
              { value: "99.8%", label: "On-Time Delivery" },
              { value: "4.9 ★", label: "Average Product Rating" },
              { value: "24 / 7", label: "Global Customer Support" },
            ].map((stat, i) => (
              <Grid item xs={6} md={3} key={i} textAlign="center">
                <Typography variant="h4" fontWeight={900} color="#2dd4bf" mb={0.2}>
                  {stat.value}
                </Typography>
                <Typography variant="caption" color="#64748b" fontWeight={700} letterSpacing="0.5px">
                  {stat.label.toUpperCase()}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* --- 4. FEATURE HIGHLIGHTS GRID --- */}
      <Container maxWidth="lg" sx={{ py: 8, position: "relative", zIndex: 2 }}>
        <Grid container spacing={3}>
          {[
            { title: "Worldwide Express Delivery", desc: "Global logistics network with real-time tracking updates delivered straight to your email.", icon: <ShippingIcon sx={{ fontSize: 28, color: "#2dd4bf" }} /> },
            { title: "256-Bit Encrypted Payments", desc: "Bank-grade checkout security protecting all customer payment methods.", icon: <SecurityIcon sx={{ fontSize: 28, color: "#c084fc" }} /> },
            { title: "Easy 30-Day Returns", desc: "Hassle-free replacement policy and instant refund processing.", icon: <ReturnIcon sx={{ fontSize: 28, color: "#38bdf8" }} /> },
          ].map((feat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 3.5,
                  borderRadius: "18px",
                  backgroundColor: "rgba(15, 23, 42, 0.5)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  transition: "transform 0.2s ease, border-color 0.2s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    borderColor: "rgba(45, 212, 191, 0.3)",
                  },
                }}
              >
                <Box mb={1.5}>{feat.icon}</Box>
                <Typography variant="h6" fontWeight={800} color="white" mb={0.8}>
                  {feat.title}
                </Typography>
                <Typography variant="body2" color="#94a3b8" lineHeight={1.6}>
                  {feat.desc}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* --- 5. COMPACT FOOTER --- */}
      <Box sx={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", py: 4, textAlign: "center", position: "relative", zIndex: 2 }}>
        <Container maxWidth="lg">
          <Typography variant="body2" color="#94a3b8" fontWeight={700} mb={0.5}>
            AURA DIGITAL STOREFRONT
          </Typography>
          <Typography variant="caption" color="#64748b">
            © 2026 AURA Storefront Inc. All rights reserved. Express Worldwide Delivery.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
