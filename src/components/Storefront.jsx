import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  Divider,
  TextField,
  InputAdornment,
  Chip,
  Avatar,
  Container,
} from "@mui/material";
import {
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
  Star as StarIcon,
  Delete as DeleteIcon,
  ArrowForward as ArrowForwardIcon,
  Storefront as StorefrontIcon,
  Laptop as LaptopIcon,
  PhoneIphone as PhoneIcon,
  Headphones as HeadphonesIcon,
  Spa as SkincareIcon,
  Devices as GadgetIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../contents/AuthContext";

const INITIAL_PRODUCTS = [
  {
    id: "PROD-101",
    name: 'MacBook Pro 16" M3 Max',
    category: "Electronics",
    price: 2499.0,
    rating: 4.9,
    reviews: 342,
    desc: "Apple M3 Max chip, 36GB unified memory, Liquid Retina XDR display, and all-day battery life.",
    badge: "Top Seller",
    badgeColor: "#2dd4bf",
    icon: <LaptopIcon sx={{ fontSize: 32, color: "#2dd4bf" }} />,
  },
  {
    id: "PROD-102",
    name: "iPhone 15 Pro Max 256GB",
    category: "Electronics",
    price: 1199.0,
    rating: 4.8,
    reviews: 512,
    desc: "Forged in titanium, A17 Pro chip, customizable Action button, and 5x optical zoom camera system.",
    badge: "Popular",
    badgeColor: "#6366f1",
    icon: <PhoneIcon sx={{ fontSize: 32, color: "#6366f1" }} />,
  },
  {
    id: "PROD-103",
    name: "Sony WH-1000XM5 Wireless",
    category: "Gadgets",
    price: 399.0,
    rating: 4.9,
    reviews: 289,
    desc: "Industry-leading noise canceling with 2 processors, 8 microphones, and crystal-clear hands-free calling.",
    badge: "Noise Cancelling",
    badgeColor: "#c084fc",
    icon: <HeadphonesIcon sx={{ fontSize: 32, color: "#c084fc" }} />,
  },
  {
    id: "PROD-104",
    name: "Hydrating Glow SPF 50 Sunscreen",
    category: "Skincare",
    price: 28.0,
    rating: 4.7,
    reviews: 184,
    desc: "Broad spectrum UVA/UVB protection enriched with hyaluronic acid and niacinamide for daily glow.",
    badge: "Skin Shield",
    badgeColor: "#fbbf24",
    icon: <SkincareIcon sx={{ fontSize: 32, color: "#fbbf24" }} />,
  },
  {
    id: "PROD-105",
    name: "Ultra HD Smartwatch Series 9",
    category: "Gadgets",
    price: 429.0,
    rating: 4.8,
    reviews: 195,
    desc: "Advanced health sensors, ECG app, Always-On Retina display, and precision GPS workout tracking.",
    badge: "Fitness Tech",
    badgeColor: "#38bdf8",
    icon: <GadgetIcon sx={{ fontSize: 32, color: "#38bdf8" }} />,
  },
  {
    id: "PROD-106",
    name: "Vitamin C Radiance Serum",
    category: "Skincare",
    price: 34.5,
    rating: 4.9,
    reviews: 142,
    desc: "Potent 15% Pure Vitamin C antioxidant formula that brightens dark spots and boosts collagen synthesis.",
    badge: "Trending",
    badgeColor: "#ec4899",
    icon: <SkincareIcon sx={{ fontSize: 32, color: "#ec4899" }} />,
  },
];

const CATEGORIES = ["All", "Electronics", "Gadgets", "Skincare"];

export default function Storefront() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { isAuthenticated } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredProducts = INITIAL_PRODUCTS.filter((product) => {
    const matchesCategory =
      selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (product) => {
    const existingIndex = cart.findIndex((item) => item.id === product.id);
    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].qty += 1;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
    enqueueSnackbar(`Added "${product.name}" to cart!`, { variant: "success" });
  };

  const handleRemoveFromCart = (id) => {
    setCart(cart.filter((item) => item.id !== id));
    enqueueSnackbar("Item removed from cart.", { variant: "info" });
  };

  const totalCartCount = cart.reduce((total, item) => total + item.qty, 0);
  const totalCartPrice = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#090d16",
        color: "white",
        position: "relative",
        overflowX: "hidden",
      }}
    >
      {/* Animated Ambient Background Glows */}
      <Box
        sx={{
          position: "absolute",
          top: "5%",
          left: "10%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle, rgba(45, 212, 191, 0.06) 0%, transparent 70%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          right: "10%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(99, 102, 241, 0.05) 0%, transparent 70%)",
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />

      {/* Top Navbar */}
      <Paper
        square
        elevation={0}
        sx={{
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              py: 2,
            }}
          >
            {/* Logo */}
            <Box
              display="flex"
              alignItems="center"
              gap={1.5}
              sx={{ cursor: "pointer" }}
              onClick={() => navigate("/")}
            >
              <Avatar
                sx={{
                  bgcolor: "#2dd4bf",
                  color: "#090d16",
                  fontWeight: 800,
                  width: 36,
                  height: 36,
                }}
              >
                <StorefrontIcon />
              </Avatar>
              <Typography
                variant="h6"
                fontWeight={800}
                color="white"
                sx={{ letterSpacing: "-0.5px" }}
              >
                Nexus <span style={{ color: "#2dd4bf" }}>Store</span>
              </Typography>
            </Box>

            {/* Search Bar */}
            <TextField
              placeholder="Search laptops, phones, skincare..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#64748b" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: "180px", sm: "360px" },
                "& .MuiOutlinedInput-root": {
                  color: "white",
                  borderRadius: "20px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
                  "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
                  "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
                },
              }}
            />

            {/* Cart & Auth Controls */}
            <Box display="flex" alignItems="center" gap={2}>
              <IconButton
                onClick={() => setIsCartOpen(true)}
                sx={{
                  color: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  p: 1.2,
                  "&:hover": {
                    backgroundColor: "rgba(45, 212, 191, 0.1)",
                    borderColor: "rgba(45, 212, 191, 0.3)",
                    color: "#2dd4bf",
                  },
                }}
              >
                <Badge badgeContent={totalCartCount} color="secondary">
                  <ShoppingCartIcon fontSize="small" />
                </Badge>
              </IconButton>

              {isAuthenticated ? (
                <Box display="flex" gap={1.5}>
                  <Button
                    variant="text"
                    onClick={() => navigate("/my-orders")}
                    sx={{
                      color: "#94a3b8",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": { color: "#2dd4bf" },
                    }}
                  >
                    My Orders
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate("/dashboard")}
                    sx={{
                      color: "#2dd4bf",
                      borderColor: "rgba(45, 212, 191, 0.3)",
                      borderRadius: "10px",
                      fontWeight: 700,
                      textTransform: "none",
                      "&:hover": {
                        borderColor: "#2dd4bf",
                        backgroundColor: "rgba(45, 212, 191, 0.05)",
                      },
                    }}
                  >
                    Dashboard
                  </Button>
                </Box>
              ) : (
                <Button
                  variant="contained"
                  onClick={() => navigate("/login")}
                  sx={{
                    backgroundColor: "#2dd4bf",
                    color: "#090d16",
                    borderRadius: "10px",
                    fontWeight: 800,
                    textTransform: "none",
                    px: 2.5,
                    boxShadow: "0 4px 15px rgba(45, 212, 191, 0.2)",
                    "&:hover": {
                      backgroundColor: "#0d9488",
                      color: "white",
                    },
                  }}
                >
                  Sign In
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ pt: 6, pb: 4 }}>
        <Box textAlign="center" mb={5}>
          <Chip
            label="🛍️ Official Consumer Store"
            sx={{
              backgroundColor: "rgba(45, 212, 191, 0.1)",
              color: "#2dd4bf",
              border: "1px solid rgba(45, 212, 191, 0.2)",
              fontWeight: 700,
              mb: 2,
            }}
          />
          <Typography
            variant="h3"
            fontWeight={900}
            sx={{
              letterSpacing: "-1px",
              mb: 2,
              background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Upgrade Your Everyday Tech & Skincare
          </Typography>
          <Typography
            variant="body1"
            color="#94a3b8"
            maxWidth="650px"
            mx="auto"
            sx={{ fontSize: "1.1rem", lineHeight: 1.6 }}
          >
            Explore top-tier laptops, smartphones, wireless headphones, and premium skincare products delivered to your door.
          </Typography>
        </Box>

        {/* Category Filter Pills */}
        <Box
          display="flex"
          justifyContent="center"
          gap={1.5}
          flexWrap="wrap"
          mb={6}
        >
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              onClick={() => setSelectedCategory(cat)}
              sx={{
                px: 2,
                py: 2.5,
                borderRadius: "12px",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s ease",
                backgroundColor:
                  selectedCategory === cat
                    ? "#2dd4bf"
                    : "rgba(255, 255, 255, 0.03)",
                color: selectedCategory === cat ? "#090d16" : "#94a3b8",
                border:
                  selectedCategory === cat
                    ? "1px solid #2dd4bf"
                    : "1px solid rgba(255, 255, 255, 0.06)",
                "&:hover": {
                  backgroundColor:
                    selectedCategory === cat
                      ? "#2dd4bf"
                      : "rgba(255, 255, 255, 0.08)",
                  color: selectedCategory === cat ? "#090d16" : "white",
                },
              }}
            />
          ))}
        </Box>

        {/* Responsive 3-Column CSS Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", md: "repeat(3, 1fr)" },
            gap: 3.5,
          }}
        >
          {filteredProducts.map((product) => (
            <Paper
              key={product.id}
              sx={{
                borderRadius: "20px",
                backgroundColor: "rgba(15, 23, 42, 0.5)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  borderColor: "rgba(45, 212, 191, 0.3)",
                  boxShadow:
                    "0 20px 40px -15px rgba(0,0,0,0.7), 0 0 30px rgba(45, 212, 191, 0.1)",
                },
              }}
            >
              {/* Product Header Icon Box (No Images Needed!) */}
              <Box
                sx={{
                  p: 3,
                  pb: 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  backgroundColor: "rgba(255, 255, 255, 0.015)",
                  borderBottom: "1px solid rgba(255, 255, 255, 0.04)",
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: "14px",
                    backgroundColor: "rgba(255, 255, 255, 0.03)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {product.icon || <LaptopIcon sx={{ fontSize: 32, color: "#2dd4bf" }} />}
                </Box>

                <Chip
                  label={product.badge}
                  size="small"
                  sx={{
                    backgroundColor: product.badgeColor,
                    color: "#090d16",
                    fontWeight: 800,
                    fontSize: "0.75rem",
                  }}
                />
              </Box>

              {/* Card Body - Equalized Layout */}
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                {/* Category & Ratings Header */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
                  <Typography variant="caption" color="#64748b" fontWeight={700} sx={{ textTransform: "uppercase", letterSpacing: "0.5px" }}>
                    {product.category}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <StarIcon sx={{ color: "#fbbf24", fontSize: 16 }} />
                    <Typography variant="caption" color="white" fontWeight={700}>
                      {product.rating} ({product.reviews})
                    </Typography>
                  </Box>
                </Box>

                {/* Fixed Height Title */}
                <Typography
                  variant="h6"
                  fontWeight={800}
                  color="white"
                  mb={1}
                  sx={{
                    fontSize: "1.05rem",
                    lineHeight: 1.3,
                    minHeight: "44px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                  }}
                >
                  {product.name}
                </Typography>

                {/* Fixed Height Description */}
                <Typography
                  variant="body2"
                  color="#94a3b8"
                  mb={3}
                  sx={{
                    fontSize: "0.85rem",
                    lineHeight: 1.5,
                    minHeight: "38px",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    flexGrow: 1,
                  }}
                >
                  {product.desc}
                </Typography>

                <Divider sx={{ mb: 2.5, borderColor: "rgba(255, 255, 255, 0.06)" }} />

                {/* Bottom Footer Price & Button */}
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight={900} color="#2dd4bf">
                    ${product.price.toFixed(2)}
                  </Typography>

                  <Button
                    variant="contained"
                    startIcon={<ShoppingCartIcon />}
                    onClick={() => handleAddToCart(product)}
                    sx={{
                      backgroundColor: "rgba(45, 212, 191, 0.15)",
                      color: "#2dd4bf",
                      border: "1px solid rgba(45, 212, 191, 0.3)",
                      fontWeight: 700,
                      textTransform: "none",
                      borderRadius: "10px",
                      px: 2,
                      py: 0.8,
                      "&:hover": {
                        backgroundColor: "#2dd4bf",
                        color: "#090d16",
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>

      {/* Cart Side Drawer */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        PaperProps={{
          sx: {
            width: { xs: "100%", sm: "400px" },
            backgroundColor: "#0e1626",
            color: "white",
            borderLeft: "1px solid rgba(255, 255, 255, 0.1)",
            p: 3,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={1}>
            <ShoppingCartIcon sx={{ color: "#2dd4bf" }} />
            <Typography variant="h6" fontWeight={800} color="white">
              Your Shopping Cart ({totalCartCount})
            </Typography>
          </Box>
          <Button
            onClick={() => setIsCartOpen(false)}
            sx={{ color: "#64748b", textTransform: "none", minWidth: 0 }}
          >
            Close
          </Button>
        </Box>

        <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.08)" }} />

        {cart.length > 0 ? (
          <>
            <List sx={{ flexGrow: 1, overflowY: "auto", mb: 3 }}>
              {cart.map((item) => (
                <Paper
                  key={item.id}
                  sx={{
                    p: 2,
                    mb: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box sx={{ pr: 1 }}>
                    <Typography variant="body2" fontWeight={700} color="white">
                      {item.name}
                    </Typography>
                    <Typography variant="caption" color="#2dd4bf" fontWeight={700}>
                      ${item.price.toFixed(2)} x {item.qty}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={() => handleRemoveFromCart(item.id)}
                    sx={{ color: "#64748b", "&:hover": { color: "#f87171" } }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Paper>
              ))}
            </List>

            <Divider sx={{ mb: 2, borderColor: "rgba(255, 255, 255, 0.08)" }} />

            <Box mb={3}>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="#94a3b8">Subtotal</Typography>
                <Typography fontWeight={700} color="white">
                  ${totalCartPrice.toFixed(2)}
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography color="#94a3b8">Estimated Tax</Typography>
                <Typography fontWeight={700} color="white">
                  $0.00
                </Typography>
              </Box>
              <Box display="flex" justifyContent="space-between" mt={2} pt={1} borderTop="1px solid rgba(255,255,255,0.08)">
                <Typography variant="h6" fontWeight={800} color="white">
                  Total
                </Typography>
                <Typography variant="h6" fontWeight={900} color="#2dd4bf">
                  ${totalCartPrice.toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              fullWidth
              variant="contained"
              endIcon={<ArrowForwardIcon />}
              onClick={() => {
                enqueueSnackbar("Checkout feature ready for Stripe integration!", { variant: "info" });
              }}
              sx={{
                backgroundColor: "#2dd4bf",
                color: "#090d16",
                fontWeight: 800,
                py: 1.5,
                borderRadius: "12px",
                textTransform: "none",
                fontSize: "1rem",
                boxShadow: "0 4px 20px rgba(45, 212, 191, 0.3)",
                "&:hover": {
                  backgroundColor: "#0d9488",
                  color: "white",
                },
              }}
            >
              Proceed to Checkout
            </Button>
          </>
        ) : (
          <Box textAlign="center" py={8}>
            <ShoppingCartIcon sx={{ fontSize: 48, color: "#475569", mb: 2 }} />
            <Typography variant="body1" color="#94a3b8" fontWeight={600}>
              Your cart is currently empty.
            </Typography>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
