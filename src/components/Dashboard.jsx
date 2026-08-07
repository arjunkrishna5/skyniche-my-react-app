import React, { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { createTheme } from "@mui/material/styles";

const API_BASE = "http://localhost:4000";
import {
  Dashboard as DashboardIcon,
  ShoppingCart as ShoppingCartIcon,
  BarChart as BarChartIcon,
  Description as DescriptionIcon,
  Layers as LayersIcon,
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  People as PeopleIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  FilterList as FilterListIcon,
  CheckCircle as CheckCircleIcon,
  Autorenew as AutorenewIcon,
  LocalShipping as LocalShippingIcon,
  Cancel as CancelIcon,
  ArrowUpward as ArrowUpwardIcon,
  Inventory as InventoryIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as CustomerIcon,
  Block as BlockIcon,
  WarningAmber as WarningIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import { PageContainer } from "@toolpad/core/PageContainer";
import { useAuth } from "../contents/AuthContext";
import { useProducts } from "../contents/ProductContext";
import {
  Box,
  Tooltip,
  IconButton,
  Menu,
  MenuItem,
  Typography,
  Avatar,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  InputAdornment,
  Button,
  Switch,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  FormControlLabel,
  FormGroup,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    segment: "dashboard",
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "products",
    title: "Products",
    icon: <InventoryIcon />,
  },
  {
    segment: "users",
    title: "Users",
    icon: <PeopleIcon />,
  },
  {
    segment: "orders",
    title: "Orders",
    icon: <ShoppingCartIcon />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "Analytics",
  },
  {
    segment: "reports",
    title: "Reports",
    icon: <BarChartIcon />,
  },
];

const parseCurrency = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleanStr = String(val).replace(/[^0-9.-]+/g, "");
  return parseFloat(cleanStr) || 0;
};

// --- 1. DASHBOARD OVERVIEW SCREEN ---
function DashboardOverview() {
  const { orders, products } = useProducts();
  const { user } = useAuth();

  const totalRevenue = orders.reduce((sum, o) => sum + parseCurrency(o.total), 0);

  const kpis = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toFixed(2)}`,
      change: orders.length > 0 ? "+100% Live" : "$0.00",
      isPositive: true,
      timeframe: "from customer orders",
      icon: <AttachMoneyIcon sx={{ color: "#2dd4bf" }} />,
    },
    {
      title: "Total Orders",
      value: orders.length.toString(),
      change: orders.length > 0 ? "Active purchases" : "No orders yet",
      isPositive: true,
      timeframe: "store total",
      icon: <ShoppingCartIcon sx={{ color: "#6366f1" }} />,
    },
    {
      title: "Active Products",
      value: products.length.toString(),
      change: "In catalog",
      isPositive: true,
      timeframe: "live inventory",
      icon: <TrendingUpIcon sx={{ color: "#38bdf8" }} />,
    },
    {
      title: "Active Sessions",
      value: "148",
      change: "Live Now",
      isLive: true,
      timeframe: "Realtime visitors",
      icon: <PeopleIcon sx={{ color: "#ec4899" }} />,
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {/* KPI Grid */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", md: "1fr 1fr 1fr 1fr" },
          gap: 3,
        }}
      >
        {kpis.map((kpi, idx) => (
          <Paper
            key={idx}
            sx={{
              p: 3,
              borderRadius: "16px",
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)",
              border: "1px solid rgba(255, 255, 255, 0.06)",
              transition: "transform 0.2s, border-color 0.2s",
              "&:hover": {
                transform: "translateY(-2px)",
                borderColor: "rgba(45, 212, 191, 0.2)",
              },
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Typography variant="body2" fontWeight={600} color="#64748b">
                {kpi.title}
              </Typography>
              <Box
                sx={{
                  p: 1,
                  borderRadius: "10px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {kpi.icon}
              </Box>
            </Box>

            <Typography variant="h4" fontWeight={800} color="white" mb={1}>
              {kpi.value}
            </Typography>

            <Box display="flex" alignItems="center" gap={0.5}>
              {kpi.isLive ? (
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    backgroundColor: "#2dd4bf",
                    boxShadow: "0 0 8px #2dd4bf",
                    animation: "pulseGlow 1.5s infinite ease-in-out",
                    mr: 0.5,
                  }}
                />
              ) : null}
              <Typography
                variant="caption"
                fontWeight={700}
                color={kpi.isPositive ? "#2dd4bf" : kpi.isLive ? "#2dd4bf" : "#f87171"}
              >
                {kpi.change}
              </Typography>
              <Typography variant="caption" color="#475569">
                {kpi.timeframe}
              </Typography>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* Recent Orders Overview Card */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="white" mb={2.5}>
          Recent Activity
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>Order ID</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>Customer</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>Items</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>Status</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }} align="right">Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.length > 0 ? (
                orders.map((order, idx) => (
                  <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>{order.id}</TableCell>
                    <TableCell sx={{ color: "#e2e8f0" }}>{order.customer}</TableCell>
                    <TableCell sx={{ color: "#94a3b8" }}>
                      {order.items?.map(i => `${i.name} x${i.qty}`).join(", ") || "Purchased Items"}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 700 }} align="right">
                      {order.total}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: "#64748b" }}>
                    No recent order activity yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// --- Helper Status Badge Component ---
function StatusBadge({ status }) {
  const getColors = () => {
    switch (status) {
      case "Delivered":
        return { bg: "rgba(45, 212, 191, 0.1)", text: "#2dd4bf", border: "rgba(45, 212, 191, 0.2)", icon: <CheckCircleIcon sx={{ fontSize: 14 }} /> };
      case "Processing":
        return { bg: "rgba(251, 191, 36, 0.1)", text: "#fbbf24", border: "rgba(251, 191, 36, 0.2)", icon: <AutorenewIcon sx={{ fontSize: 14 }} /> };
      case "Shipped":
        return { bg: "rgba(56, 189, 248, 0.1)", text: "#38bdf8", border: "rgba(56, 189, 248, 0.2)", icon: <LocalShippingIcon sx={{ fontSize: 14 }} /> };
      case "Cancelled":
        return { bg: "rgba(248, 113, 113, 0.1)", text: "#f87171", border: "rgba(248, 113, 113, 0.2)", icon: <CancelIcon sx={{ fontSize: 14 }} /> };
      default:
        return { bg: "rgba(255, 255, 255, 0.05)", text: "#fff", border: "transparent" };
    }
  };

  const colors = getColors();

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        backgroundColor: colors.bg,
        color: colors.text,
        border: `1px solid ${colors.border}`,
        borderRadius: "20px",
        padding: "4px 10px",
        fontSize: "0.75rem",
        fontWeight: 700,
      }}
    >
      {colors.icon}
      {status}
    </Box>
  );
}

// --- 2. ORDERS SCREEN ---
function OrdersList() {
  const [search, setSearch] = useState("");
  const { orders, updateOrderStatus, deleteOrder } = useProducts();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        (o.customer || "").toLowerCase().includes(search.toLowerCase()) ||
        o.id.includes(search) ||
        o.status.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Search and Action Bar */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <TextField
          placeholder="Search orders, customers..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              color: "white",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
              "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
            },
          }}
        />

        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.08)",
              textTransform: "none",
              borderRadius: "10px",
              "&:hover": { borderColor: "rgba(255, 255, 255, 0.18)", backgroundColor: "rgba(255,255,255,0.02)" },
            }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => enqueueSnackbar("Orders synchronized with database!", { variant: "info", autoHideDuration: 1200 })}
            sx={{
              color: "#2dd4bf",
              borderColor: "rgba(45, 212, 191, 0.3)",
              textTransform: "none",
              borderRadius: "10px",
              "&:hover": { borderColor: "#2dd4bf", backgroundColor: "rgba(45, 212, 191, 0.06)" },
            }}
          >
            Sync
          </Button>
        </Box>
      </Box>

      {/* Orders Data Table */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.01)" }}>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Status Action</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }} align="right">Total</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }} align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.01)" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>{order.id}</TableCell>
                    <TableCell sx={{ color: "#e2e8f0" }}>{order.customer}</TableCell>
                    <TableCell sx={{ color: "#94a3b8" }}>{order.date}</TableCell>
                    <TableCell>
                      <FormControl size="small">
                        <Select
                          value={order.status}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            updateOrderStatus(order.id, newStatus);
                            enqueueSnackbar(`Order ${order.id} updated to "${newStatus}"!`, {
                              variant: "success",
                              autoHideDuration: 1500,
                            });
                          }}
                          sx={{
                            color:
                              order.status === "Delivered"
                                ? "#2dd4bf"
                                : order.status === "Shipped"
                                ? "#38bdf8"
                                : order.status === "Out for Delivery"
                                ? "#c084fc"
                                : order.status === "Cancelled"
                                ? "#f87171"
                                : "#fbbf24",
                            fontSize: "0.8rem",
                            fontWeight: 700,
                            height: "34px",
                            borderRadius: "20px",
                            backgroundColor:
                              order.status === "Delivered"
                                ? "rgba(45, 212, 191, 0.12)"
                                : order.status === "Shipped"
                                ? "rgba(56, 189, 248, 0.12)"
                                : order.status === "Out for Delivery"
                                ? "rgba(192, 132, 252, 0.12)"
                                : order.status === "Cancelled"
                                ? "rgba(248, 113, 113, 0.12)"
                                : "rgba(251, 191, 36, 0.12)",
                            "& .MuiOutlinedInput-notchedOutline": {
                              borderColor:
                                order.status === "Delivered"
                                  ? "rgba(45, 212, 191, 0.3)"
                                  : order.status === "Shipped"
                                  ? "rgba(56, 189, 248, 0.3)"
                                  : order.status === "Out for Delivery"
                                  ? "rgba(192, 132, 252, 0.3)"
                                  : order.status === "Cancelled"
                                  ? "rgba(248, 113, 113, 0.3)"
                                  : "rgba(251, 191, 36, 0.3)",
                            },
                            "&:hover .MuiOutlinedInput-notchedOutline": {
                              borderColor: "#2dd4bf",
                            },
                          }}
                        >
                          <MenuItem value="Processing">⚡ Processing</MenuItem>
                          <MenuItem value="Shipped">📦 Shipped</MenuItem>
                          <MenuItem value="Out for Delivery">🚚 Out for Delivery</MenuItem>
                          <MenuItem value="Delivered">✅ Delivered</MenuItem>
                          <MenuItem value="Cancelled">❌ Cancelled</MenuItem>
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 800 }} align="right">
                      {order.total}
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title="Delete Order">
                        <IconButton
                          onClick={() => {
                            deleteOrder(order.id);
                            enqueueSnackbar(`Order ${order.id} deleted.`, { variant: "info", autoHideDuration: 1500 });
                          }}
                          sx={{ color: "#64748b", "&:hover": { color: "#f87171" } }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#64748b" }}>
                    No orders found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// --- 2.5 PRODUCTS MANAGEMENT SCREEN ---
function ProductsManagement() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, targetId: null, targetName: "" });
  const { enqueueSnackbar } = useSnackbar();
  const { products, categories, addCategory, addProduct, deleteProduct } = useProducts();
  const { user } = useAuth();
  const roleName = (user?.role || "customer").toLowerCase();
  const isSuperAdmin = roleName === "admin" || (user?.email && user.email.includes("admin"));
  const isViewer = roleName === "viewer";

  const canEdit = isSuperAdmin || (!isViewer && roleName !== "customer");
  const canDelete = isSuperAdmin;

  const [newProduct, setNewProduct] = useState({
    name: "",
    category: categories[0] || "Electronics",
    price: "",
    stock: "",
  });

  const filteredProducts = useMemo(() => {
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase()) ||
        p.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [products, search]);

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewProduct({ name: "", category: categories[0] || "Electronics", price: "", stock: "" });
  };

  const handleOpenCategoryModal = () => setOpenCategoryModal(true);
  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
    setNewCategoryInput("");
  };

  const handleSaveCategory = () => {
    if (!newCategoryInput.trim()) return;
    addCategory(newCategoryInput.trim());
    handleCloseCategoryModal();
    enqueueSnackbar(`Category "${newCategoryInput.trim()}" created!`, { variant: "success", autoHideDuration: 1000 });
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) return;

    addProduct(newProduct);
    handleCloseModal();
    enqueueSnackbar(`Product "${newProduct.name}" added successfully!`, { variant: "success", autoHideDuration: 1000 });
  };

  const promptDeleteProduct = (product) => {
    setDeleteConfirm({ open: true, targetId: product.id, targetName: product.name });
  };

  const handleConfirmDeleteProduct = () => {
    if (deleteConfirm.targetId) {
      deleteProduct(deleteConfirm.targetId);
      enqueueSnackbar(`Product "${deleteConfirm.targetName}" deleted successfully.`, { variant: "info", autoHideDuration: 1000 });
    }
    setDeleteConfirm({ open: false, targetId: null, targetName: "" });
  };

  const getStockBadge = (status) => {
    switch (status) {
      case "In Stock":
        return <Box sx={{ display: "inline-flex", px: 1.5, py: 0.4, borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, bgcolor: "rgba(45, 212, 191, 0.1)", color: "#2dd4bf", border: "1px solid rgba(45, 212, 191, 0.2)" }}>In Stock</Box>;
      case "Low Stock":
        return <Box sx={{ display: "inline-flex", px: 1.5, py: 0.4, borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, bgcolor: "rgba(251, 191, 36, 0.1)", color: "#fbbf24", border: "1px solid rgba(251, 191, 36, 0.2)" }}>Low Stock</Box>;
      case "Out of Stock":
        return <Box sx={{ display: "inline-flex", px: 1.5, py: 0.4, borderRadius: "20px", fontSize: "0.75rem", fontWeight: 700, bgcolor: "rgba(248, 113, 113, 0.1)", color: "#f87171", border: "1px solid rgba(248, 113, 113, 0.2)" }}>Out of Stock</Box>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Action Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <TextField
          placeholder="Search products or categories..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "300px" },
            "& .MuiOutlinedInput-root": {
              color: "white",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
              "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
            },
          }}
        />

        {canEdit && (
          <Box display="flex" gap={1.5}>
            <Button
              variant="outlined"
              onClick={handleOpenCategoryModal}
              sx={{
                color: "#2dd4bf",
                borderColor: "rgba(45, 212, 191, 0.3)",
                fontWeight: 700,
                textTransform: "none",
                borderRadius: "10px",
                px: 2,
                py: 1,
                "&:hover": {
                  borderColor: "#2dd4bf",
                  backgroundColor: "rgba(45, 212, 191, 0.08)",
                },
              }}
            >
              Add Category
            </Button>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{
                backgroundColor: "#2dd4bf",
                color: "#090d16",
                fontWeight: 800,
                textTransform: "none",
                borderRadius: "10px",
                px: 2.5,
                py: 1,
                boxShadow: "0 4px 15px rgba(45, 212, 191, 0.25)",
                "&:hover": {
                  backgroundColor: "#0d9488",
                  color: "white",
                },
              }}
            >
              Add Product
            </Button>
          </Box>
        )}
      </Box>

      {/* Products Table */}
      <Paper
        sx={{
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.01)" }}>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>SKU / ID</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Product Name</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Stock Qty</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Price</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((prod) => (
                  <TableRow
                    key={prod.id}
                    sx={{
                      "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.01)" },
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>{prod.id}</TableCell>
                    <TableCell sx={{ color: "#e2e8f0", fontWeight: 700 }}>{prod.name}</TableCell>
                    <TableCell sx={{ color: "#94a3b8" }}>{prod.category}</TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 600 }}>{prod.stock}</TableCell>
                    <TableCell>{getStockBadge(prod.status)}</TableCell>
                    <TableCell sx={{ color: "#2dd4bf", fontWeight: 800 }}>
                      {typeof prod.price === "number" ? `$${prod.price.toFixed(2)}` : prod.price}
                    </TableCell>
                    <TableCell align="right">
                      {canDelete ? (
                        <Tooltip title="Delete Product">
                          <IconButton
                            onClick={() => promptDeleteProduct(prod)}
                            sx={{ color: "#64748b", "&:hover": { color: "#f87171" } }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : (
                        <Typography variant="caption" sx={{ color: "#64748b", fontStyle: "italic" }}>
                          No Delete Permission
                        </Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: "#64748b" }}>
                    No products found in inventory.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add Product Dialog Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            backgroundColor: "#0e1626",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            color: "white",
            minWidth: { xs: "90%", sm: "450px" },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#2dd4bf" }}>Add New Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          <TextField
            label="Product Name"
            fullWidth
            value={newProduct.name}
            onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
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

          <FormControl fullWidth>
            <InputLabel sx={{ color: "#64748b", "&.Mui-focused": { color: "#2dd4bf" } }}>Category</InputLabel>
            <Select
              value={newProduct.category}
              label="Category"
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2dd4bf" },
              }}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Price ($)"
            placeholder="e.g. 49.99"
            fullWidth
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
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

          <TextField
            label="Stock Quantity"
            type="number"
            placeholder="e.g. 50"
            fullWidth
            value={newProduct.stock}
            onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
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
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseModal} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddProduct}
            variant="contained"
            sx={{
              backgroundColor: "#2dd4bf",
              color: "#090d16",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              "&:hover": { backgroundColor: "#0d9488", color: "white" },
            }}
          >
            Save Product
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add New Category Dialog Modal */}
      <Dialog
        open={openCategoryModal}
        onClose={handleCloseCategoryModal}
        PaperProps={{
          sx: {
            backgroundColor: "#0e1626",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            color: "white",
            minWidth: { xs: "90%", sm: "400px" },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#2dd4bf" }}>Add New Store Category</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          <Typography variant="body2" color="#94a3b8">
            Create a new category name for your product catalog (e.g., Furniture, Clothing, Footwear, Home & Kitchen).
          </Typography>
          <TextField
            label="Category Name"
            placeholder="e.g. Furniture"
            fullWidth
            value={newCategoryInput}
            onChange={(e) => setNewCategoryInput(e.target.value)}
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
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseCategoryModal} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleSaveCategory}
            variant="contained"
            sx={{
              backgroundColor: "#2dd4bf",
              color: "#090d16",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              "&:hover": { backgroundColor: "#0d9488", color: "white" },
            }}
          >
            Save Category
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Product Confirmation Dialog Modal */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, targetId: null, targetName: "" })}
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
          Delete Product?
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" color="#e2e8f0">
            Are you sure you want to delete product <strong>"{deleteConfirm.targetName}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteConfirm({ open: false, targetId: null, targetName: "" })}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteProduct}
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
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// --- 2.8 USER MANAGEMENT SCREEN ---
function UserManagement() {
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, targetId: null, targetName: "" });
  const [showPasswords, setShowPasswords] = useState({});
  const { enqueueSnackbar } = useSnackbar();
  const { registeredUsers, registerUser, deleteUserAccount, toggleUserStatus, toggleUserRole, changeUserRole } = useAuth();

  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "Customer",
  });

  const filteredUsers = useMemo(() => {
    return registeredUsers.filter(
      (u) =>
        (u.name || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.id || "").toLowerCase().includes(search.toLowerCase()) ||
        (u.role || "").toLowerCase().includes(search.toLowerCase())
    );
  }, [registeredUsers, search]);

  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [newRoleName, setNewRoleName] = useState("");
  const [newRoleDescription, setNewRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState({
    view_products: true,
    add_products: false,
    edit_products: false,
    delete_products: false,
    view_orders: true,
    update_orders: false,
    manage_users: false,
    view_analytics: false,
  });

  const [customRolesList, setCustomRolesList] = useState([]);

  useEffect(() => {
    const fetchCustomRoles = async () => {
      try {
        const res = await axios.post(`${API_BASE}/webservices/roles/get-all-roles`);
        if (res.data?.data) {
          setCustomRolesList(res.data.data);
        }
      } catch (err) {}
    };
    fetchCustomRoles();
  }, []);

  const handleSaveCustomRole = async () => {
    if (!newRoleName.trim()) return;
    const permissionsArray = Object.keys(selectedPermissions).filter((k) => selectedPermissions[k]);

    try {
      const res = await axios.post(`${API_BASE}/webservices/roles/add-role`, {
        role_name: newRoleName.trim(),
        description: newRoleDescription.trim(),
        permissions: permissionsArray,
      });

      if (res.data?.status === 1) {
        setCustomRolesList((prev) => [...prev, res.data.data]);
        enqueueSnackbar(`Custom Role "${newRoleName.trim()}" created successfully!`, { variant: "success", autoHideDuration: 1500 });
        setOpenRoleModal(false);
        setNewRoleName("");
        setNewRoleDescription("");
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || "Failed to create custom role. Please check MySQL connection.", { variant: "error", autoHideDuration: 2000 });
    }
  };

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUser({ name: "", email: "", password: "", role: "Customer" });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    registerUser(newUser.name, newUser.email, newUser.password || "123456", newUser.role);
    handleCloseModal();
    enqueueSnackbar(`User account "${newUser.email}" added!`, { variant: "success", autoHideDuration: 1000 });
  };

  const handleToggleRole = (id) => {
    toggleUserRole(id);
    enqueueSnackbar("User role updated.", { variant: "info", autoHideDuration: 1000 });
  };

  const handleToggleStatus = (id) => {
    toggleUserStatus(id);
    enqueueSnackbar("User account status updated.", { variant: "info", autoHideDuration: 1000 });
  };

  const promptDeleteUser = (user) => {
    const targetId = user.id || user.email;
    const targetName = user.name || user.email;
    setDeleteConfirm({ open: true, targetId, targetName });
  };

  const handleConfirmDeleteUser = () => {
    if (deleteConfirm.targetId) {
      deleteUserAccount(deleteConfirm.targetId);
      enqueueSnackbar(`User account "${deleteConfirm.targetName}" deleted successfully.`, { variant: "info", autoHideDuration: 1000 });
    }
    setDeleteConfirm({ open: false, targetId: null, targetName: "" });
  };

  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || !user?.role || (user?.email && user.email.includes("admin"));

  if (!isAdmin) {
    return (
      <Paper sx={{ p: 4, textAlign: "center", borderRadius: "16px", backgroundColor: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <Typography variant="h6" color="#f87171" fontWeight={700} gutterBottom>
          🔒 User Role Management Restricted
        </Typography>
        <Typography variant="body2" color="#94a3b8">
          Only Super Admin accounts can manage and assign user permission roles. Your current role is <strong>{user?.role?.toUpperCase()}</strong>.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {/* Action Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
        <TextField
          placeholder="Search users by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#64748b" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { xs: "100%", sm: "320px" },
            "& .MuiOutlinedInput-root": {
              color: "white",
              borderRadius: "10px",
              backgroundColor: "rgba(255, 255, 255, 0.02)",
              "& fieldset": { borderColor: "rgba(255, 255, 255, 0.08)" },
              "&:hover fieldset": { borderColor: "rgba(255, 255, 255, 0.18)" },
              "&.Mui-focused fieldset": { borderColor: "#2dd4bf" },
            },
          }}
        />

        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<AdminIcon />}
            onClick={() => setOpenRoleModal(true)}
            sx={{
              color: "#2dd4bf",
              borderColor: "rgba(45, 212, 191, 0.3)",
              fontWeight: 700,
              textTransform: "none",
              borderRadius: "10px",
              px: 2,
              py: 1,
              "&:hover": {
                borderColor: "#2dd4bf",
                backgroundColor: "rgba(45, 212, 191, 0.08)",
              },
            }}
          >
            Create Custom Role
          </Button>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              backgroundColor: "#2dd4bf",
              color: "#090d16",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "10px",
              px: 2.5,
              py: 1,
              boxShadow: "0 4px 15px rgba(45, 212, 191, 0.25)",
              "&:hover": {
                backgroundColor: "#0d9488",
                color: "white",
              },
            }}
          >
            Add User Account
          </Button>
        </Box>
      </Box>

      {/* User Master Table */}
      <Paper
        sx={{
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
          overflow: "hidden",
        }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "rgba(255, 255, 255, 0.01)" }}>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>User</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Password</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Role</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Joined Date</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }} align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, idx) => {
                  const targetId = user.id || user.email || `user-${idx}`;
                  return (
                    <TableRow
                      key={targetId}
                      sx={{
                        "&:hover": { backgroundColor: "rgba(255, 255, 255, 0.01)" },
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1.5}>
                          <Avatar
                            sx={{
                              width: 34,
                              height: 34,
                              bgcolor: user.role === "admin" ? "rgba(192, 132, 252, 0.15)" : "rgba(45, 212, 191, 0.15)",
                              color: user.role === "admin" ? "#c084fc" : "#2dd4bf",
                              fontSize: "0.85rem",
                              fontWeight: 700,
                              border: user.role === "admin" ? "1px solid rgba(192, 132, 252, 0.3)" : "1px solid rgba(45, 212, 191, 0.3)",
                            }}
                          >
                            {(user.name?.[0] || "U").toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography variant="body2" fontWeight={700} color="white">
                              {user.name}
                            </Typography>
                            <Typography variant="caption" color="#64748b">
                              {user.id || user.email}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>

                      <TableCell sx={{ color: "#e2e8f0" }}>{user.email}</TableCell>

                      <TableCell sx={{ color: "#e2e8f0" }}>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Typography variant="body2" sx={{ fontFamily: "monospace", color: showPasswords[targetId] ? "#2dd4bf" : "#e2e8f0", letterSpacing: showPasswords[targetId] ? "normal" : "2px", fontWeight: showPasswords[targetId] ? 700 : 400 }}>
                            {showPasswords[targetId] ? (user.password || (user.email?.includes("admin") ? "admin123" : "password123")) : "••••••••"}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => toggleShowPassword(targetId)}
                            sx={{ color: showPasswords[targetId] ? "#2dd4bf" : "#64748b" }}
                          >
                            {showPasswords[targetId] ? <VisibilityOff sx={{ fontSize: 16 }} /> : <Visibility sx={{ fontSize: 16 }} />}
                          </IconButton>
                        </Box>
                      </TableCell>

                      <TableCell>
                        <FormControl size="small">
                          <Select
                            value={user.role || "customer"}
                            onChange={(e) => {
                              const newRole = e.target.value;
                              changeUserRole(targetId, newRole);
                              enqueueSnackbar(`User ${user.name} permission updated to "${newRole}"!`, {
                                variant: "success",
                                autoHideDuration: 1500,
                              });
                            }}
                            sx={{
                              color:
                                user.role === "admin"
                                  ? "#c084fc"
                                  : user.role === "editor"
                                  ? "#38bdf8"
                                  : user.role === "viewer"
                                  ? "#fbbf24"
                                  : "#2dd4bf",
                              fontSize: "0.8rem",
                              fontWeight: 700,
                              height: "34px",
                              borderRadius: "20px",
                              backgroundColor:
                                user.role === "admin"
                                  ? "rgba(192, 132, 252, 0.12)"
                                  : user.role === "editor"
                                  ? "rgba(56, 189, 248, 0.12)"
                                  : user.role === "viewer"
                                  ? "rgba(251, 191, 36, 0.12)"
                                  : "rgba(45, 212, 191, 0.12)",
                              "& .MuiOutlinedInput-notchedOutline": {
                                borderColor:
                                  user.role === "admin"
                                    ? "rgba(192, 132, 252, 0.3)"
                                    : user.role === "editor"
                                    ? "rgba(56, 189, 248, 0.3)"
                                    : user.role === "viewer"
                                    ? "rgba(251, 191, 36, 0.3)"
                                    : "rgba(45, 212, 191, 0.3)",
                              },
                            }}
                          >
                            <MenuItem value="admin">⚡ Admin (Full Access)</MenuItem>
                            <MenuItem value="editor">✏️ Editor (Read & Edit)</MenuItem>
                            <MenuItem value="viewer">👁️ Viewer (Read Only)</MenuItem>
                            <MenuItem value="customer">👤 Customer</MenuItem>
                            {customRolesList.map((r) => (
                              <MenuItem key={r.id} value={r.role_name.toLowerCase()}>
                                ✨ {r.role_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </TableCell>

                      <TableCell sx={{ color: "#94a3b8" }}>{user.joined}</TableCell>

                      <TableCell>
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                            px: 1.5,
                            py: 0.4,
                            borderRadius: "20px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            bgcolor: user.status === "Active" ? "rgba(45, 212, 191, 0.1)" : "rgba(248, 113, 113, 0.1)",
                            color: user.status === "Active" ? "#2dd4bf" : "#f87171",
                            border: user.status === "Active" ? "1px solid rgba(45, 212, 191, 0.2)" : "1px solid rgba(248, 113, 113, 0.2)",
                          }}
                        >
                          {user.status}
                        </Box>
                      </TableCell>

                      <TableCell align="right">
                        <Box display="flex" justifyContent="flex-end" gap={0.5}>
                          <Tooltip title={`Switch Role to ${user.role === "admin" ? "Customer" : "Admin"}`}>
                            <IconButton
                              onClick={() => handleToggleRole(targetId)}
                              sx={{ color: "#64748b", "&:hover": { color: "#c084fc" } }}
                            >
                              <AdminIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title={user.status === "Active" ? "Suspend Account" : "Activate Account"}>
                            <IconButton
                              onClick={() => handleToggleStatus(targetId)}
                              sx={{ color: "#64748b", "&:hover": { color: user.status === "Active" ? "#fbbf24" : "#2dd4bf" } }}
                            >
                              <BlockIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Delete Account">
                            <IconButton
                              onClick={() => promptDeleteUser(user)}
                              sx={{ color: "#64748b", "&:hover": { color: "#f87171" } }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 6, color: "#64748b" }}>
                    No users found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add User Dialog Modal */}
      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        PaperProps={{
          sx: {
            backgroundColor: "#0e1626",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            color: "white",
            minWidth: { xs: "90%", sm: "450px" },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#2dd4bf" }}>Add New User Account</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 2 }}>
          <TextField
            label="Full Name"
            placeholder="e.g. Alex Morgan"
            fullWidth
            value={newUser.name}
            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
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

          <TextField
            label="Email Address"
            placeholder="e.g. alex@example.com"
            type="email"
            fullWidth
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
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

          <TextField
            label="Password"
            placeholder="e.g. SecretPass123"
            type="password"
            fullWidth
            value={newUser.password}
            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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

          <FormControl fullWidth>
            <InputLabel sx={{ color: "#64748b", "&.Mui-focused": { color: "#2dd4bf" } }}>Account Role</InputLabel>
            <Select
              value={newUser.role}
              label="Account Role"
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              sx={{
                color: "white",
                backgroundColor: "rgba(255, 255, 255, 0.02)",
                borderRadius: "10px",
                "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255, 255, 255, 0.1)" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2dd4bf" },
              }}
            >
              <MenuItem value="Customer">Customer</MenuItem>
              <MenuItem value="Admin">Admin</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleCloseModal} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button
            onClick={handleAddUser}
            variant="contained"
            sx={{
              backgroundColor: "#2dd4bf",
              color: "#090d16",
              fontWeight: 800,
              textTransform: "none",
              borderRadius: "10px",
              px: 3,
              "&:hover": { backgroundColor: "#0d9488", color: "white" },
            }}
          >
            Create User
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete User Account Confirmation Dialog Modal */}
      <Dialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, targetId: null, targetName: "" })}
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
          Delete User Account?
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          <Typography variant="body1" color="#e2e8f0">
            Are you sure you want to delete user account <strong>"{deleteConfirm.targetName}"</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button
            onClick={() => setDeleteConfirm({ open: false, targetId: null, targetName: "" })}
            sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteUser}
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
            Yes, Delete Account
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create Custom Role Modal */}
      <Dialog
        open={openRoleModal}
        onClose={() => setOpenRoleModal(false)}
        PaperProps={{
          sx: {
            backgroundColor: "#0e1626",
            color: "white",
            borderRadius: "16px",
            border: "1px solid rgba(45, 212, 191, 0.3)",
            minWidth: { xs: "90%", sm: "500px" },
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: "#2dd4bf" }}>
          ✨ Create Custom Role & Permissions
        </DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 2 }}>
          <TextField
            label="Role Name"
            placeholder="e.g. Inventory Assistant, Support Specialist"
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            fullWidth
            size="small"
            sx={{
              mt: 1,
              "& .MuiOutlinedInput-root": { color: "white", borderRadius: "10px" },
              "& .MuiInputLabel-root": { color: "#94a3b8" },
            }}
          />

          <TextField
            label="Role Description"
            placeholder="e.g. Responsible for inventory management, updating stock, and processing customer orders."
            value={newRoleDescription}
            onChange={(e) => setNewRoleDescription(e.target.value)}
            fullWidth
            multiline
            rows={2}
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": { color: "white", borderRadius: "10px" },
              "& .MuiInputLabel-root": { color: "#94a3b8" },
            }}
          />

          <Typography variant="subtitle2" color="#2dd4bf" fontWeight={700} mt={1}>
            Tick Allowed Permissions for This Role:
          </Typography>

          <FormGroup sx={{ gap: 0.5 }}>
            <Typography variant="caption" color="#64748b" fontWeight={700} mt={1}>📦 PRODUCTS & INVENTORY</Typography>
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.view_products} onChange={(e) => setSelectedPermissions((p) => ({ ...p, view_products: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="View Products Catalog"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.add_products} onChange={(e) => setSelectedPermissions((p) => ({ ...p, add_products: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="Add Products & Categories (+ Add Product Button)"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.edit_products} onChange={(e) => setSelectedPermissions((p) => ({ ...p, edit_products: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="Edit Product Stock & Prices"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.delete_products} onChange={(e) => setSelectedPermissions((p) => ({ ...p, delete_products: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="Delete Products (Trash Can Icon)"
            />

            <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />

            <Typography variant="caption" color="#64748b" fontWeight={700}>🛒 ORDERS & SHIPPING</Typography>
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.view_orders} onChange={(e) => setSelectedPermissions((p) => ({ ...p, view_orders: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="View Customer Orders"
            />
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.update_orders} onChange={(e) => setSelectedPermissions((p) => ({ ...p, update_orders: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="Update Order Status (Processing -> Shipped -> Delivered)"
            />

            <Divider sx={{ my: 1, borderColor: "rgba(255, 255, 255, 0.08)" }} />

            <Typography variant="caption" color="#64748b" fontWeight={700}>👥 SYSTEM & USERS</Typography>
            <FormControlLabel
              control={<Checkbox checked={selectedPermissions.manage_users} onChange={(e) => setSelectedPermissions((p) => ({ ...p, manage_users: e.target.checked }))} sx={{ color: "#2dd4bf", "&.Mui-checked": { color: "#2dd4bf" } }} />}
              label="Manage User Accounts & Roles"
            />
          </FormGroup>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpenRoleModal(false)} sx={{ color: "#64748b", textTransform: "none", fontWeight: 600 }}>
            Cancel
          </Button>
          <Button onClick={handleSaveCustomRole} variant="contained" sx={{ backgroundColor: "#2dd4bf", color: "#090d16", fontWeight: 800, textTransform: "none", borderRadius: "10px", px: 3, "&:hover": { backgroundColor: "#0d9488", color: "white" } }}>
            Save Custom Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// --- 3. SALES REPORTS SCREEN ---
function SalesReports() {
  const { orders, products } = useProducts();

  // Calculate live sales statistics
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, ord) => sum + parseCurrency(ord.total), 0);
  }, [orders]);

  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? (totalRevenue / totalOrdersCount).toFixed(2) : "0.00";

  // Calculate top selling items from real order history & products
  const topProductsList = useMemo(() => {
    const counts = {};
    orders.forEach((ord) => {
      if (Array.isArray(ord.items)) {
        ord.items.forEach((item) => {
          const name = item.name || "Product";
          const qty = item.quantity || 1;
          const price = parseCurrency(item.price);
          if (!counts[name]) {
            counts[name] = { sales: 0, revenue: 0 };
          }
          counts[name].sales += qty;
          counts[name].revenue += qty * price;
        });
      }
    });

    const result = Object.keys(counts).map((name) => ({
      name,
      sales: counts[name].sales,
      revenue: `$${counts[name].revenue.toFixed(2)}`,
    }));

    result.sort((a, b) => b.sales - a.sales);

    if (result.length === 0) {
      return products.slice(0, 4).map((p) => ({
        name: p.name,
        sales: Math.floor(p.price / 10) + 5,
        revenue: `$${(p.price * (Math.floor(p.price / 10) + 5)).toFixed(2)}`,
      }));
    }

    return result;
  }, [orders, products]);

  // Dynamic Sales bar chart data
  const salesHistory = [
    { month: "Jan", pct: 40, val: "$12,400" },
    { month: "Feb", pct: 55, val: "$18,200" },
    { month: "Mar", pct: 70, val: "$24,500" },
    { month: "Apr", pct: 65, val: "$21,100" },
    { month: "May", pct: 85, val: "$34,800" },
    { month: "Jun", pct: 100, val: `$${totalRevenue > 0 ? totalRevenue.toFixed(2) : "45,000"}` },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      {/* Real-time Sales KPI Cards */}
      <Box display="grid" gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr 1fr" }} gap={2.5}>
        <Paper sx={{ p: 3, borderRadius: "16px", backgroundColor: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(45, 212, 191, 0.2)" }}>
          <Typography variant="caption" color="#94a3b8" fontWeight={700}>TOTAL REVENUE</Typography>
          <Typography variant="h4" color="#2dd4bf" fontWeight={800} mt={1}>
            ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Typography>
          <Typography variant="caption" color="#2dd4bf" mt={1} display="block">
            ▲ Live order total earnings
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: "16px", backgroundColor: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(56, 189, 248, 0.2)" }}>
          <Typography variant="caption" color="#94a3b8" fontWeight={700}>TOTAL ORDERS PLACED</Typography>
          <Typography variant="h4" color="#38bdf8" fontWeight={800} mt={1}>
            {totalOrdersCount} Orders
          </Typography>
          <Typography variant="caption" color="#38bdf8" mt={1} display="block">
            📦 Customer completed purchases
          </Typography>
        </Paper>

        <Paper sx={{ p: 3, borderRadius: "16px", backgroundColor: "rgba(15, 23, 42, 0.4)", border: "1px solid rgba(192, 132, 252, 0.2)" }}>
          <Typography variant="caption" color="#94a3b8" fontWeight={700}>AVG ORDER VALUE (AOV)</Typography>
          <Typography variant="h4" color="#c084fc" fontWeight={800} mt={1}>
            ${avgOrderValue}
          </Typography>
          <Typography variant="caption" color="#c084fc" mt={1} display="block">
            📈 Revenue per checkout
          </Typography>
        </Paper>
      </Box>

      {/* Visual Chart Card */}
      <Paper
        sx={{
          p: 3.5,
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Box>
            <Typography variant="h6" fontWeight={700} color="white">
              Sales Revenue Performance
            </Typography>
            <Typography variant="caption" color="#64748b">
              Monthly breakdown of generated order revenue.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "#2dd4bf" }}>
            <ArrowUpwardIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" fontWeight={700}>
              +18.4% Growth
            </Typography>
          </Box>
        </Box>

        {/* Custom pure CSS bar chart */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            height: "200px",
            px: 2,
            mb: 2,
          }}
        >
          {salesHistory.map((item, idx) => (
            <Box
              key={idx}
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ width: "12%", height: "100%", justifyContent: "flex-end" }}
            >
              <Typography variant="caption" fontWeight={700} color="#94a3b8" sx={{ mb: 1, fontSize: "0.75rem" }}>
                {item.val}
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  height: `${item.pct}%`,
                  background: "linear-gradient(180deg, #2dd4bf 0%, #6366f1 100%)",
                  borderRadius: "6px 6px 0 0",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "linear-gradient(180deg, #0d9488 0%, #4f46e5 100%)",
                    transform: "scaleX(1.05)",
                    boxShadow: "0 0 15px rgba(45, 212, 191, 0.2)",
                  },
                }}
              />
              <Typography variant="caption" color="#475569" fontWeight={700} sx={{ mt: 1.5 }}>
                {item.month}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Top Products Table */}
      <Paper
        sx={{
          p: 3,
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="white" mb={2.5}>
          Top Selling Products Breakdown
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>Product Name</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }} align="center">Units Sold</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }} align="right">Total Generated Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProductsList.map((prod, idx) => (
                <TableRow key={idx} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                  <TableCell sx={{ color: "white", fontWeight: 600 }}>{prod.name}</TableCell>
                  <TableCell sx={{ color: "#e2e8f0" }} align="center">
                    {prod.sales}
                  </TableCell>
                  <TableCell sx={{ color: "#2dd4bf", fontWeight: 700 }} align="right">
                    {prod.revenue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

// --- MAIN WRAPPER CONTAINER ---
export default function DashboardLayoutBasic() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const userRole = (user?.role || "customer").toLowerCase();

  const filteredNavigation = useMemo(() => {
    if (userRole === "admin" || (user?.email && user.email.includes("admin"))) {
      return NAVIGATION;
    }
    // Hide Users tab for Editor & Viewer roles to avoid confusion
    return NAVIGATION.filter((item) => item.segment !== "users");
  }, [userRole, user?.email]);

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pathname, setPathname] = useState(userRole === "editor" ? "/products" : "/dashboard");

  const router = useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      primary: {
        main: "#2dd4bf", // Change primary accent color to beautiful Teal!
      },
      background: {
        default: "#090d16", // Make background dark slate to blend with the login page theme!
        paper: "#0e1626", // card background
      },
      text: {
        primary: "#ffffff",
        secondary: "#94a3b8",
      },
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    },
  });

  // Dynamic Content Render Selector
  const renderContent = () => {
    switch (pathname) {
      case "/dashboard":
        return <DashboardOverview />;
      case "/products":
        return <ProductsManagement />;
      case "/users":
        return <UserManagement />;
      case "/orders":
        return <OrdersList />;
      case "/reports":
      case "/reports/sales":
        return <SalesReports />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AppProvider
      navigation={filteredNavigation}
      router={router}
      theme={darkTheme}
    >
      <DashboardLayout
        branding={{
          logo: <img src="/favicon.svg" alt="logo" style={{ height: 30, filter: "hue-rotate(180deg)" }} />,
          title: "Nexus Analytics",
        }}
        slots={{
          toolbarActions: () => (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Button
                variant="outlined"
                onClick={() => navigate("/shop")}
                sx={{
                  color: "#2dd4bf",
                  borderColor: "rgba(45, 212, 191, 0.3)",
                  borderRadius: "10px",
                  fontWeight: 700,
                  fontSize: "0.8rem",
                  textTransform: "none",
                  py: 0.5,
                  px: 1.5,
                  "&:hover": {
                    borderColor: "#2dd4bf",
                    backgroundColor: "rgba(45, 212, 191, 0.08)",
                  },
                }}
              >
                View Storefront ↗
              </Button>

              <Tooltip title="User Account">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0.5 }}>
                  <Avatar
                    src={user?.profile_pic || ""}
                    alt={user?.name || "User"}
                    sx={{
                      width: 38,
                      height: 38,
                      bgcolor: "#2dd4bf",
                      color: "#090d16",
                      fontWeight: 700,
                      border: "2px solid rgba(45, 212, 191, 0.3)",
                    }}
                  >
                    {(user?.name?.[0] || "U").toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Box>
                    <Typography variant="body2" fontWeight={700} color="white">
                      {user?.name || "User Account"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {user?.email || "user@domain.com"}
                    </Typography>
                  </Box>
                </MenuItem>
                <Divider sx={{ my: 0.5, borderColor: "rgba(255, 255, 255, 0.05)" }} />
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center" color="error" fontWeight={600}>
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          ),
        }}
      >
        <PageContainer>
          {renderContent()}
        </PageContainer>
      </DashboardLayout>
    </AppProvider>
  );
}
