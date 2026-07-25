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
  FlashOn as FlashIcon,
  CheckCircle as CheckIcon,
  AutoAwesome as SparklesIcon
} from '@mui/icons-material';
import { useAuth } from '../contents/AuthContext';
import { useProducts } from '../contents/ProductContext';

export default function ViteLanding() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { products } = useProducts();

  const canvasRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  // 1. LUSION.CO-INSPIRED 3D PARTICLE CONSTELLATION CANVAS ENGINE (Pure Native Canvas Math)
  useEffect(() => {
    const canvas = canvasRef.current;
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

    const mouse = { x: width / 2, y: height / 2, active: false };
    const handlePointerMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    window.addEventListener('mousemove', handlePointerMove);

    // Initialize 130 3D Constellation Nodes
    const numParticles = 130;
    const particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 2 + 0.5, // 3D depth scale factor
        radius: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        baseColor: Math.random() > 0.5 ? "rgba(45, 212, 191, " : "rgba(192, 132, 252, ",
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw particle nodes & magnetic connection web
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move 3D particles
        p.x += p.vx * p.z;
        p.y += p.vy * p.z;

        // Bounce from walls
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Magnetic mouse pull effect
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            p.x += (dx / dist) * 0.6;
            p.y += (dy / dist) * 0.6;

            // Draw glowing magnetic connection lines to cursor
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${p.baseColor}${(1 - dist / 180) * 0.35})`;
            ctx.lineWidth = 0.8 * p.z;
            ctx.stroke();
          }
        }

        // Draw connections between nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(45, 212, 191, ${(1 - dist / 110) * 0.18})`;
            ctx.lineWidth = 0.5 * p.z;
            ctx.stroke();
          }
        }

        // Render glowing 3D node dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * p.z, 0, Math.PI * 2);
        ctx.fillStyle = `${p.baseColor}0.85)`;
        ctx.shadowBlur = 12 * p.z;
        ctx.shadowColor = "#2dd4bf";
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // 2. 3D PERSPECTIVE MOUSE TILT HANDLER FOR PRODUCT SHOWCASE
  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    const rotX = (-y / (rect.height / 2)) * 12; // 12 deg tilt max
    const rotY = (x / (rect.width / 2)) * 12;
    setTilt({ x: rotX, y: rotY });
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
      {/* Interactive 3D Canvas Background */}
      <canvas
        ref={canvasRef}
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
          backgroundColor: "rgba(6, 9, 17, 0.8)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          px: { xs: 2, md: 6 },
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Brand Mark */}
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
              SKYNICHE<span style={{ color: "#2dd4bf" }}>.</span>
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "1px" }}>
              3D DIGITAL STOREFRONT
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
            Explore Catalog
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
              {user?.role?.toLowerCase() === "admin" ? "Admin Portal" : "My Account"}
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

      {/* --- 2. LUSION-STYLE HERO SECTION (COMPACT & INTERNSHIP READY) --- */}
      <Container maxWidth="lg" sx={{ pt: { xs: 6, md: 9 }, pb: { xs: 6, md: 8 }, position: "relative", zIndex: 2 }}>
        <Grid container spacing={5} alignItems="center">
          {/* Left Text & CTA */}
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
                <span>Lusion-Inspired 3D E-Commerce Engine</span>
              </Box>

              {/* Headline */}
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: "2.6rem", sm: "3.6rem", md: "4.2rem" },
                  fontWeight: 900,
                  letterSpacing: "-2px",
                  lineHeight: 1.08,
                  mb: 3,
                }}
              >
                Experience Shopping in{" "}
                <span
                  style={{
                    background: "linear-gradient(135deg, #2dd4bf 0%, #c084fc 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  3D Motion.
                </span>
              </Typography>

              <Typography variant="body1" sx={{ color: "#94a3b8", fontSize: { xs: "1.05rem", md: "1.2rem" }, lineHeight: 1.7, mb: 4, maxWidth: "560px" }}>
                A high-performance digital store featuring interactive 3D particle physics, real-time MySQL database synchronization, and instant order tracking.
              </Typography>

              {/* Hero Action Buttons */}
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
                  Enter Storefront
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
                  Sign In / Register
                </Button>
              </Box>

              {/* Tech Badges */}
              <Box display="flex" alignItems="center" gap={3} mt={4} flexWrap="wrap">
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckIcon sx={{ color: "#2dd4bf", fontSize: 18 }} />
                  <Typography variant="caption" color="#cbd5e1" fontWeight={600}>Native WebGL / Canvas</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckIcon sx={{ color: "#2dd4bf", fontSize: 18 }} />
                  <Typography variant="caption" color="#cbd5e1" fontWeight={600}>XAMPP MySQL Sync</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <CheckIcon sx={{ color: "#2dd4bf", fontSize: 18 }} />
                  <Typography variant="caption" color="#cbd5e1" fontWeight={600}>Fastify REST API</Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          {/* Right 3D Perspective Mouse Tilt Card */}
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
                    label="✨ 3D Interactive Card"
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
                    View in Store
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
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          backdropFilter: "blur(12px)",
          py: 3.5,
          position: "relative",
          zIndex: 2,
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={3} justifyContent="space-between" alignItems="center">
            {[
              { value: "15,000+", label: "Active Customers" },
              { value: "99.8%", label: "On-Time Delivery" },
              { value: "4.9 ★", label: "Average Rating" },
              { value: "24 / 7", label: "Instant Support" },
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

      {/* --- 4. COMPACT 3-CARD FEATURE HIGHLIGHT (NO LONG SCROLLING) --- */}
      <Container maxWidth="lg" sx={{ py: 6, position: "relative", zIndex: 2 }}>
        <Grid container spacing={3}>
          {[
            { title: "Lightning Fast Dispatch", desc: "Automated MySQL inventory allocation and global express tracking.", icon: <ShippingIcon sx={{ fontSize: 28, color: "#2dd4bf" }} /> },
            { title: "Bank-Grade Encryption", desc: "All user logins and checkouts are protected with SHA-256 password hashing.", icon: <SecurityIcon sx={{ fontSize: 28, color: "#c084fc" }} /> },
            { title: "24/7 Live Ledger Sync", desc: "Real-time purchase updates synced live between Customer and Admin portals.", icon: <SupportIcon sx={{ fontSize: 28, color: "#38bdf8" }} /> },
          ].map((feat, idx) => (
            <Grid item xs={12} md={4} key={idx}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: "16px",
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
            SKYNICHE 3D DIGITAL STOREFRONT
          </Typography>
          <Typography variant="caption" color="#64748b">
            © 2026 Skyniche Inc. Built with Native HTML5 Canvas 3D Physics, Fastify & XAMPP MySQL.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
