import React, { useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";
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
    children: [
      {
        segment: "sales",
        title: "Sales",
        icon: <DescriptionIcon />,
      },
      {
        segment: "traffic",
        title: "Traffic",
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: "integrations",
    title: "Integrations",
    icon: <LayersIcon />,
  },
];

// --- 1. DASHBOARD OVERVIEW SCREEN ---
function DashboardOverview() {
  const { orders, products } = useProducts();

  const totalRevenue = orders.reduce((sum, o) => {
    const val = parseFloat(String(o.total).replace("$", "").replace(",", "")) || 0;
    return sum + val;
  }, 0);

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
  const { orders } = useProducts();

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
            sx={{
              color: "white",
              borderColor: "rgba(255, 255, 255, 0.08)",
              textTransform: "none",
              borderRadius: "10px",
              "&:hover": { borderColor: "rgba(255, 255, 255, 0.18)", backgroundColor: "rgba(255,255,255,0.02)" },
            }}
          >
            Sync
          </Button>
        </Box>
      </Box>

      {/* Orders Table */}
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
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Order ID</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Date</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 700 }} align="right">Total</TableCell>
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
                      <StatusBadge status={order.status} />
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: 800 }} align="right">
                      {order.total}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 6, color: "#64748b" }}>
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

        <Box display="flex" gap={1.5}>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
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
                      <Tooltip title="Delete Product">
                        <IconButton
                          onClick={() => promptDeleteProduct(prod)}
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
  const { registeredUsers, registerUser, deleteUserAccount, toggleUserStatus, toggleUserRole } = useAuth();

  const toggleShowPassword = (id) => {
    setShowPasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
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

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => {
    setOpenModal(false);
    setNewUser({ name: "", email: "", role: "Customer" });
  };

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) return;
    registerUser(newUser.name, newUser.email, "123456");
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
                          <Typography variant="body2" sx={{ fontFamily: "monospace", letterSpacing: showPasswords[targetId] ? "normal" : "2px" }}>
                            {showPasswords[targetId] ? (user.password || "••••••••") : "••••••••"}
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
                            bgcolor: user.role === "admin" ? "rgba(192, 132, 252, 0.1)" : "rgba(45, 212, 191, 0.1)",
                            color: user.role === "admin" ? "#c084fc" : "#2dd4bf",
                            border: user.role === "admin" ? "1px solid rgba(192, 132, 252, 0.2)" : "1px solid rgba(45, 212, 191, 0.2)",
                          }}
                        >
                          {user.role === "admin" ? <AdminIcon sx={{ fontSize: 13 }} /> : <CustomerIcon sx={{ fontSize: 13 }} />}
                          {user.role}
                        </Box>
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
    </Box>
  );
}

// --- 3. SALES REPORTS SCREEN ---
function SalesReports() {
  const topProducts = [
    { name: "SaaS Pro Plan Upgrade", sales: 482, revenue: "$43,139.00" },
    { name: "3D Asset Design Bundle", sales: 310, revenue: "$13,950.00" },
    { name: "Interactive Web UI Pack", sales: 245, revenue: "$12,005.00" },
    { name: "Premium Widget Starter", sales: 110, revenue: "$4,400.00" },
  ];

  // Animated visual chart bar heights (simulated values)
  const salesHistory = [
    { month: "Jan", pct: 35, val: "$12K" },
    { month: "Feb", pct: 48, val: "$15K" },
    { month: "Mar", pct: 60, val: "$22K" },
    { month: "Apr", pct: 52, val: "$18K" },
    { month: "May", pct: 75, val: "$31K" },
    { month: "Jun", pct: 95, val: "$48K" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
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
              Sales Revenue
            </Typography>
            <Typography variant="caption" color="#64748b">
              Monthly breakdown of generated income.
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5} sx={{ color: "#2dd4bf" }}>
            <ArrowUpwardIcon sx={{ fontSize: 16 }} />
            <Typography variant="body2" fontWeight={700}>
              +15.2% Growth
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
              {/* Tooltip value */}
              <Typography variant="caption" fontWeight={700} color="#94a3b8" sx={{ mb: 1, fontSize: "0.75rem" }}>
                {item.val}
              </Typography>
              {/* Bar */}
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
              {/* Label */}
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
          Top Selling Products
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }}>Product Name</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }} align="center">Units Sold</TableCell>
                <TableCell sx={{ color: "#64748b", fontWeight: 600 }} align="right">Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.map((prod, idx) => (
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

// --- 4. TRAFFIC REPORTS SCREEN ---
function TrafficReports() {
  const sources = [
    { name: "Direct Traffic", pct: 42, visits: "12,450", color: "#2dd4bf" },
    { name: "Organic Search", pct: 33, visits: "9,780", color: "#6366f1" },
    { name: "Social Media", pct: 15, visits: "4,440", color: "#38bdf8" },
    { name: "Referrals", pct: 10, visits: "2,960", color: "#ec4899" },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3.5 }}>
      <Paper
        sx={{
          p: 3.5,
          borderRadius: "16px",
          backgroundColor: "rgba(15, 23, 42, 0.4)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <Typography variant="h6" fontWeight={700} color="white" mb={1}>
          Traffic Channels
        </Typography>
        <Typography variant="body2" color="#64748b" mb={4}>
          Acquisition reports showing where your site visitors are coming from.
        </Typography>

        <Box display="flex" flexDirection="column" gap={3.5}>
          {sources.map((source, idx) => (
            <Box key={idx}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                <Typography variant="body2" fontWeight={600} color="white">
                  {source.name}
                </Typography>
                <Box display="flex" gap={1.5}>
                  <Typography variant="body2" color="#94a3b8" fontWeight={500}>
                    {source.visits} visits
                  </Typography>
                  <Typography variant="body2" color={source.color} fontWeight={700}>
                    {source.pct}%
                  </Typography>
                </Box>
              </Box>

              {/* Progress bar container */}
              <Box
                sx={{
                  width: "100%",
                  height: "8px",
                  borderRadius: "4px",
                  backgroundColor: "rgba(255, 255, 255, 0.03)",
                  overflow: "hidden",
                }}
              >
                {/* Visual meter */}
                <Box
                  sx={{
                    width: `${source.pct}%`,
                    height: "100%",
                    borderRadius: "4px",
                    backgroundColor: source.color,
                    boxShadow: `0 0 10px ${source.color}40`,
                    transition: "width 0.8s ease-out",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}

// --- 5. INTEGRATIONS SCREEN ---
function IntegrationsList() {
  const [integrations, setIntegrations] = useState([
    { id: "stripe", name: "Stripe Payments", desc: "Process order payments and track payouts in real-time.", icon: <AttachMoneyIcon />, enabled: true },
    { id: "shopify", name: "Shopify Store", desc: "Automate stock levels and import catalog details.", icon: <ShoppingCartIcon />, enabled: false },
    { id: "fedex", name: "FedEx Logistics", desc: "Print tracking labels and coordinate shipments.", icon: <LocalShippingIcon />, enabled: true },
    { id: "mailchimp", name: "Mailchimp Campaigns", desc: "Auto-sync customers with email marketing newsletters.", icon: <LayersIcon />, enabled: false },
  ]);

  const handleToggle = (id) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, enabled: !item.enabled } : item))
    );
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
        gap: 3,
      }}
    >
      {integrations.map((item) => (
        <Paper
          key={item.id}
          sx={{
            p: 3,
            borderRadius: "16px",
            background: "linear-gradient(135deg, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.7) 100%)",
            border: "1px solid rgba(255, 255, 255, 0.06)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: 2,
            transition: "all 0.2s",
            "&:hover": {
              borderColor: item.enabled ? "rgba(45, 212, 191, 0.2)" : "rgba(255, 255, 255, 0.12)",
            },
          }}
        >
          <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box display="flex" gap={2} alignItems="center">
              <Avatar
                sx={{
                  bgcolor: item.enabled ? "rgba(45, 212, 191, 0.1)" : "rgba(255, 255, 255, 0.03)",
                  color: item.enabled ? "#2dd4bf" : "#64748b",
                  border: item.enabled ? "1px solid rgba(45, 212, 191, 0.2)" : "1px solid rgba(255, 255, 255, 0.05)",
                  width: 48,
                  height: 48,
                }}
              >
                {item.icon}
              </Avatar>
              <Box>
                <Typography variant="body1" fontWeight={700} color="white">
                  {item.name}
                </Typography>
                <Box display="flex" alignItems="center" gap={0.5}>
                  <Box
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      backgroundColor: item.enabled ? "#2dd4bf" : "#475569",
                    }}
                  />
                  <Typography variant="caption" color={item.enabled ? "#2dd4bf" : "#475569"} fontWeight={700}>
                    {item.enabled ? "Connected" : "Disconnected"}
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Switch
              checked={item.enabled}
              onChange={() => handleToggle(item.id)}
              color="primary"
              sx={{
                "& .MuiSwitch-switchBase.Mui-checked": { color: "#2dd4bf" },
                "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { backgroundColor: "#2dd4bf" },
              }}
            />
          </Box>

          <Typography variant="body2" color="#94a3b8" sx={{ fontSize: "0.85rem", lineHeight: 1.5 }}>
            {item.desc}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}

// --- MAIN WRAPPER CONTAINER ---
export default function DashboardLayoutBasic() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const [anchorElUser, setAnchorElUser] = useState(null);
  const [pathname, setPathname] = useState("/dashboard");

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
      case "/reports/sales":
        return <SalesReports />;
      case "/reports/traffic":
        return <TrafficReports />;
      case "/integrations":
        return <IntegrationsList />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <AppProvider
      navigation={NAVIGATION}
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
