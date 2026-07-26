import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Avatar,
  Container,
  Tabs,
  Tab,
  TextField,
  Divider,
  Chip,
  Stepper,
  Step,
  StepLabel,
  Menu,
  MenuItem,
  Tooltip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import {
  ShoppingBag as ShoppingBagIcon,
  Person as PersonIcon,
  Storefront as StorefrontIcon,
  LocalShipping as LocalShippingIcon,
  CheckCircle as CheckCircleIcon,
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  WarningAmber as WarningIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useAuth } from "../contents/AuthContext";
import { useProducts } from "../contents/ProductContext";

const ORDER_STEPS = ["Order Placed", "Packed", "In Transit", "Delivered"];

export default function CustomerAccount() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { user, logout, updateUserProfile } = useAuth();
  const { orders, updateOrderStatus } = useProducts();

  const [activeTab, setActiveTab] = useState(0);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState({ open: false, orderId: null });

  const promptCancelOrder = (orderId) => {
    setCancelConfirm({ open: true, orderId });
  };

  const handleConfirmCancelOrder = () => {
    if (cancelConfirm.orderId) {
      updateOrderStatus(cancelConfirm.orderId, "Cancelled");
      enqueueSnackbar(`Order ${cancelConfirm.orderId} cancelled successfully.`, {
        variant: "info",
        autoHideDuration: 1500,
      });
    }
    setCancelConfirm({ open: false, orderId: null });
  };

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleUserLogout = () => {
    handleCloseUserMenu();
    logout();
    enqueueSnackbar("Logged out successfully.", { variant: "info", autoHideDuration: 1000 });
    navigate("/login");
  };

  // Profile Form State
  const [profileData, setProfileData] = useState({
    name: user?.name || "Sarah Jenkins",
    email: user?.email || "sarah.j@example.com",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Terrace",
    city: "Springfield",
    zip: "97477",
  });

  useEffect(() => {
    if (user) {
      setProfileData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
      }));
    }
  }, [user]);

  const handleSaveProfile = async () => {
    if (updateUserProfile) {
      await updateUserProfile(profileData.name, profileData.email);
    }
    enqueueSnackbar("Profile updated in MySQL database & Admin Panel!", {
      variant: "success",
      autoHideDuration: 1500,
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#090d16",
        color: "white",
        position: "relative",
        pb: 8,
      }}
    >
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
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/shop")}
              sx={{
                color: "#2dd4bf",
                textTransform: "none",
                fontWeight: 700,
                fontSize: "0.95rem",
                "&:hover": { backgroundColor: "rgba(45, 212, 191, 0.08)" },
              }}
            >
              Back to Storefront
            </Button>

            <Box display="flex" alignItems="center" gap={1.5}>
              <Tooltip title="Account Settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                  <Avatar
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "#2dd4bf",
                      color: "#090d16",
                      fontWeight: 800,
                      border: "2px solid rgba(45, 212, 191, 0.4)",
                    }}
                  >
                    {(user?.name?.[0] || "U").toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>

              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" fontWeight={700} color="white">
                  {user?.name || profileData.name}
                </Typography>
                <Typography variant="caption" color="#64748b">
                  {user?.email || profileData.email}
                </Typography>
              </Box>

              <Menu
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  sx: {
                    mt: 1.5,
                    backgroundColor: "#0e1626",
                    color: "white",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    borderRadius: "14px",
                    minWidth: 180,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  },
                }}
              >
                <Box sx={{ px: 2, py: 1.5 }}>
                  <Typography variant="body2" fontWeight={800} color="white">
                    {user?.name || "User Account"}
                  </Typography>
                  <Typography variant="caption" color="#64748b">
                    {user?.email || "user@domain.com"}
                  </Typography>
                </Box>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }} />

                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    setActiveTab(1);
                  }}
                  sx={{ py: 1, "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#2dd4bf" } }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    My Profile
                  </Typography>
                </MenuItem>

                <MenuItem
                  onClick={() => {
                    handleCloseUserMenu();
                    setActiveTab(0);
                  }}
                  sx={{ py: 1, "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.04)", color: "#2dd4bf" } }}
                >
                  <Typography variant="body2" fontWeight={600}>
                    My Orders
                  </Typography>
                </MenuItem>

                <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.08)", my: 0.5 }} />

                <MenuItem
                  onClick={handleUserLogout}
                  sx={{ py: 1, "&:hover": { backgroundColor: "rgba(248, 113, 113, 0.1)" } }}
                >
                  <Typography variant="body2" fontWeight={700} color="#f87171">
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Container>
      </Paper>

      {/* Main Content Container */}
      <Container maxWidth="lg" sx={{ pt: 5 }}>
        {/* Header Title */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={900} color="white" mb={1}>
            Customer Account Portal
          </Typography>
          <Typography variant="body2" color="#94a3b8">
            Manage your personal purchases, live shipment status, and delivery address.
          </Typography>
        </Box>

        {/* Navigation Tabs */}
        <Paper
          sx={{
            borderRadius: "16px",
            backgroundColor: "rgba(15, 23, 42, 0.5)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            mb: 4,
            p: 0.5,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, val) => setActiveTab(val)}
            sx={{
              "& .MuiTabs-indicator": { backgroundColor: "#2dd4bf", height: 3, borderRadius: 2 },
              "& .MuiTab-root": {
                color: "#64748b",
                fontWeight: 700,
                textTransform: "none",
                fontSize: "0.95rem",
                "&.Mui-selected": { color: "#2dd4bf" },
              },
            }}
          >
            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="My Orders" />
            <Tab icon={<PersonIcon />} iconPosition="start" label="Account Profile" />
          </Tabs>
        </Paper>

        {/* TAB 0: MY ORDERS */}
        {activeTab === 0 && (
          <Box display="flex" flexDirection="column" gap={3.5}>
            {(() => {
              const userOrders = orders.filter((o) => {
                if (user?.email && o.userEmail) {
                  return o.userEmail.toLowerCase() === user.email.toLowerCase();
                }
                if (user?.name && o.customer) {
                  return o.customer.toLowerCase() === user.name.toLowerCase();
                }
                return true;
              });

              if (userOrders.length === 0) {
                return (
                  <Paper
                    sx={{
                      p: 4,
                      textAlign: "center",
                      borderRadius: "20px",
                      backgroundColor: "rgba(15, 23, 42, 0.4)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      color: "#64748b",
                    }}
                  >
                    <Typography variant="h6" fontWeight={700} color="#94a3b8" mb={1}>
                      No Orders Placed Yet
                    </Typography>
                    <Typography variant="body2">
                      When you purchase products from the store, your order tracking details will appear here.
                    </Typography>
                  </Paper>
                );
              }

              return userOrders.map((order) => (
                <Paper
                  key={order.id}
                sx={{
                  p: 3.5,
                  borderRadius: "20px",
                  backgroundColor: "rgba(15, 23, 42, 0.4)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Order Header */}
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  flexWrap="wrap"
                  gap={2}
                  mb={3}
                >
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={0.5}>
                      <Typography variant="h6" fontWeight={800} color="white">
                        {order.id}
                      </Typography>
                      <Chip
                        label={order.status}
                        size="small"
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.75rem",
                          backgroundColor:
                            order.status === "Delivered"
                              ? "rgba(45, 212, 191, 0.1)"
                              : "rgba(99, 102, 241, 0.1)",
                          color:
                            order.status === "Delivered" ? "#2dd4bf" : "#6366f1",
                          border:
                            order.status === "Delivered"
                              ? "1px solid rgba(45, 212, 191, 0.3)"
                              : "1px solid rgba(99, 102, 241, 0.3)",
                        }}
                      />
                    </Box>
                    <Typography variant="caption" color="#64748b">
                      Placed on {order.date} • Tracking: {order.trackingNumber}
                    </Typography>
                  </Box>

                  <Box display="flex" alignItems="center" gap={2}>
                    {order.status !== "Cancelled" && order.status !== "Delivered" && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<CancelIcon fontSize="small" />}
                        onClick={() => promptCancelOrder(order.id)}
                        sx={{
                          borderColor: "rgba(248, 113, 113, 0.4)",
                          color: "#f87171",
                          fontWeight: 700,
                          borderRadius: "10px",
                          textTransform: "none",
                          "&:hover": {
                            backgroundColor: "rgba(248, 113, 113, 0.1)",
                            borderColor: "#f87171",
                          },
                        }}
                      >
                        Cancel Order
                      </Button>
                    )}
                    <Typography variant="h5" fontWeight={900} color="#2dd4bf">
                      {order.total}
                    </Typography>
                  </Box>
                </Box>

                {/* Progress Stepper */}
                <Box sx={{ mb: 4, px: { xs: 0, sm: 2 } }}>
                  <Stepper activeStep={order.activeStep} alternativeLabel>
                    {ORDER_STEPS.map((label) => (
                      <Step key={label}>
                        <StepLabel
                          StepIconProps={{
                            sx: {
                              "&.Mui-active": { color: "#2dd4bf" },
                              "&.Mui-completed": { color: "#2dd4bf" },
                            },
                          }}
                        >
                          <Typography variant="caption" fontWeight={700} color="#94a3b8">
                            {label}
                          </Typography>
                        </StepLabel>
                      </Step>
                    ))}
                  </Stepper>
                </Box>

                <Divider sx={{ mb: 3, borderColor: "rgba(255, 255, 255, 0.06)" }} />

                {/* Purchased Items List */}
                <Typography variant="body2" fontWeight={700} color="#64748b" mb={2}>
                  Items in this order
                </Typography>
                <Grid container spacing={2}>
                  {order.items.map((item, idx) => (
                    <Grid item xs={12} sm={6} key={idx}>
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        p={1.5}
                        sx={{
                          backgroundColor: "rgba(255, 255, 255, 0.02)",
                          borderRadius: "12px",
                          border: "1px solid rgba(255, 255, 255, 0.04)",
                        }}
                      >
                        <Box
                          component="img"
                          src={item.image}
                          alt={item.name}
                          sx={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight={700} color="white">
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="#2dd4bf" fontWeight={700}>
                            {item.price} (Qty: {item.qty})
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Paper>
              ));
            })()}
          </Box>
        )}

        {/* TAB 1: ACCOUNT PROFILE */}
        {activeTab === 1 && (
          <Paper
            sx={{
              p: 4,
              borderRadius: "20px",
              backgroundColor: "rgba(15, 23, 42, 0.4)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <Typography variant="h6" fontWeight={800} color="white" mb={1}>
              Personal Details & Shipping Address
            </Typography>
            <Typography variant="body2" color="#64748b" mb={4}>
              Update your contact info and default delivery destination for faster checkout.
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Full Name"
                  fullWidth
                  value={profileData.name}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                      "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
                    },
                    "& .MuiInputLabel-root": { color: "#64748b" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#2dd4bf" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Email Address"
                  fullWidth
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                      "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
                    },
                    "& .MuiInputLabel-root": { color: "#64748b" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#2dd4bf" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Phone Number"
                  fullWidth
                  value={profileData.phone}
                  onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                      "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
                    },
                    "& .MuiInputLabel-root": { color: "#64748b" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#2dd4bf" },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Shipping Street Address"
                  fullWidth
                  value={profileData.address}
                  onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      color: "white",
                      backgroundColor: "rgba(255, 255, 255, 0.02)",
                      borderRadius: "10px",
                      "& fieldset": { borderColor: "rgba(255, 255, 255, 0.1)" },
                      "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
                    },
                    "& .MuiInputLabel-root": { color: "#64748b" },
                    "& .MuiInputLabel-root.Mui-focused": { color: "#2dd4bf" },
                  }}
                />
              </Grid>
            </Grid>

            <Box display="flex" justifyContent="flex-end" mt={4}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveProfile}
                sx={{
                  backgroundColor: "#2dd4bf",
                  color: "#090d16",
                  fontWeight: 800,
                  px: 3,
                  py: 1.2,
                  borderRadius: "10px",
                  textTransform: "none",
                  boxShadow: "0 4px 15px rgba(45, 212, 191, 0.25)",
                  "&:hover": {
                    backgroundColor: "#0d9488",
                    color: "white",
                  },
                }}
              >
                Save Changes
              </Button>
            </Box>
          </Paper>
        )}
      </Container>

      {/* Cancel Order Confirmation Dialog Modal */}
      <Dialog
        open={cancelConfirm.open}
        onClose={() => setCancelConfirm({ open: false, orderId: null })}
        PaperProps={{
          sx: {
            backgroundColor: "#0f172a",
            border: "1px solid rgba(248, 113, 113, 0.3)",
            borderRadius: "16px",
            color: "white",
            minWidth: { xs: "90%", sm: "400px" },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#f87171", display: "flex", alignItems: "center", gap: 1.5 }}>
          <WarningIcon sx={{ color: "#f87171" }} />
          Do you want to cancel this order?
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" color="#e2e8f0">
            Are you sure you want to cancel order <strong>"{cancelConfirm.orderId}"</strong>? This will update your order status to Cancelled.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setCancelConfirm({ open: false, orderId: null })}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            No, Keep Order
          </Button>
          <Button
            onClick={handleConfirmCancelOrder}
            variant="contained"
            sx={{
              backgroundColor: "#f87171",
              color: "white",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              "&:hover": { backgroundColor: "#dc2626" },
            }}
          >
            Yes, Cancel Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
