import React, { createContext, useContext, useState, useEffect } from "react";
import { Laptop as LaptopIcon, PhoneIphone as PhoneIcon, Headphones as HeadphonesIcon, Spa as SkincareIcon, Devices as GadgetIcon } from "@mui/icons-material";
import axios from "axios";
import { REST_API } from "../constants/DefaultValues";

const ProductContext = createContext();
const API_BASE = REST_API.endsWith('/') ? REST_API.slice(0, -1) : REST_API;

const DEFAULT_PRODUCTS = [
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
    stock: 18,
    status: "In Stock",
    icon: <LaptopIcon sx={{ fontSize: 32, color: "#2dd4bf" }} />,
  },
  {
    id: "PROD-102",
    name: "iPhone 15 Pro Max 256GB",
    category: "Electronics",
    price: 1199.0,
    rating: 4.8,
    reviews: 289,
    desc: "Forged in titanium, A17 Pro chip, customizable Action button, 48MP main camera.",
    badge: "Hot",
    badgeColor: "#fbbf24",
    stock: 25,
    status: "In Stock",
    icon: <PhoneIcon sx={{ fontSize: 32, color: "#fbbf24" }} />,
  },
  {
    id: "PROD-103",
    name: "Sony WH-1000XM5 Wireless Headphones",
    category: "Gadgets",
    price: 399.0,
    rating: 4.7,
    reviews: 198,
    desc: "Industry-leading noise canceling, 30-hour battery life, ultra-comfortable lightweight design.",
    badge: "Popular",
    badgeColor: "#38bdf8",
    stock: 4,
    status: "Low Stock",
    icon: <HeadphonesIcon sx={{ fontSize: 32, color: "#38bdf8" }} />,
  },
  {
    id: "PROD-104",
    name: "Hydrating Glow SPF 50 Sunscreen",
    category: "Skincare",
    price: 28.0,
    rating: 4.9,
    reviews: 512,
    desc: "Weightless, non-comedogenic daily sunscreen infused with Hyaluronic Acid and Niacinamide.",
    badge: "Best Seller",
    badgeColor: "#c084fc",
    stock: 50,
    status: "In Stock",
    icon: <SkincareIcon sx={{ fontSize: 32, color: "#c084fc" }} />,
  },
  {
    id: "PROD-105",
    name: "Vitamin C Radiance Serum",
    category: "Skincare",
    price: 34.5,
    rating: 4.9,
    reviews: 142,
    desc: "Potent 15% Pure Vitamin C antioxidant formula that brightens dark spots and boosts collagen synthesis.",
    badge: "Trending",
    badgeColor: "#ec4899",
    stock: 0,
    status: "Out of Stock",
    icon: <SkincareIcon sx={{ fontSize: 32, color: "#ec4899" }} />,
  },
];

const DEFAULT_ORDERS = [
  {
    id: "#ORD-9821",
    customer: "Sarah Jenkins",
    date: "Oct 20, 2026",
    total: "$2,499.00",
    status: "Processing",
    activeStep: 2,
    items: [
      {
        name: 'MacBook Pro 16" M3 Max',
        qty: 1,
        price: "$2,499.00",
      },
    ],
    trackingNumber: "FDX-901248912",
  },
  {
    id: "#ORD-9818",
    customer: "Sarah Jenkins",
    date: "Oct 12, 2026",
    total: "$427.00",
    status: "Delivered",
    activeStep: 3,
    items: [
      {
        name: "Sony WH-1000XM5 Wireless Headphones",
        qty: 1,
        price: "$399.00",
      },
      {
        name: "Hydrating Glow SPF 50 Sunscreen",
        qty: 1,
        price: "$28.00",
      },
    ],
    trackingNumber: "FDX-882104921",
  },
];

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState(["Electronics", "Gadgets", "Skincare"]);

  // Fetch Products directly from MySQL Database via Fastify Backend API
  useEffect(() => {
    const fetchProductsFromDB = async () => {
      try {
        const res = await axios.post(`${API_BASE}/webservices/products/get-all-products`);
        if (res.data?.success && Array.isArray(res.data.data) && res.data.data.length > 0) {
          const dbProducts = res.data.data.map((p) => ({
            id: `PROD-${p.id}`,
            name: p.name,
            category: p.category,
            price: parseFloat(p.price) || 0,
            rating: 4.9,
            reviews: 15,
            desc: p.desc,
            badge: "MySQL Sync",
            badgeColor: "#2dd4bf",
            stock: p.stock,
            status: p.status,
          }));
          setProducts(dbProducts);
        }
      } catch (err) {
        console.log("Products DB fetch fallback:", err.message);
      }
    };
    fetchProductsFromDB();
  }, []);

  // Orders start clean and persist real purchases in localStorage
  const [orders, setOrders] = useState(() => {
    const saved = localStorage.getItem("ecommerce_real_orders");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("ecommerce_real_orders", JSON.stringify(orders));
  }, [orders]);

  const addCategory = (categoryName) => {
    const trimmed = categoryName.trim();
    if (trimmed && !categories.includes(trimmed)) {
      setCategories([...categories, trimmed]);
    }
  };

  const addProduct = async (newProd) => {
    const formattedProd = {
      id: `PROD-${100 + products.length + 1}`,
      name: newProd.name,
      category: newProd.category || "General",
      price: parseFloat(newProd.price) || 0,
      rating: 5.0,
      reviews: 1,
      desc: newProd.desc || `${newProd.name} - high quality ${newProd.category || 'general'} item.`,
      badge: "New Item",
      badgeColor: "#2dd4bf",
      stock: parseInt(newProd.stock) || 10,
      status: parseInt(newProd.stock) > 5 ? "In Stock" : parseInt(newProd.stock) > 0 ? "Low Stock" : "Out of Stock",
    };

    if (!categories.includes(newProd.category)) {
      setCategories([...categories, newProd.category]);
    }

    setProducts([formattedProd, ...products]);

    // Sync insertion to MySQL database table 'products'
    try {
      const res = await axios.post(`${API_BASE}/webservices/products/add-product`, {
        name: newProd.name,
        category: newProd.category || "General",
        price: parseFloat(newProd.price) || 0,
        stock: parseInt(newProd.stock) || 10,
        desc: newProd.desc || `${newProd.name} - high quality item.`,
      });
      if (res.data?.data?.id) {
        formattedProd.id = `PROD-${res.data.data.id}`;
      }
    } catch (err) {
      console.error("Failed to insert product into MySQL database:", err);
    }
  };

  const deleteProduct = async (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));

    // Sync deletion to MySQL database table 'products'
    try {
      await axios.post(`${API_BASE}/webservices/products/delete-product`, { id });
    } catch (err) {
      console.error("Failed to delete product from MySQL database:", err);
    }
  };

  const placeOrder = (cartItems, totalAmount, customerName = "Customer", userEmail = "") => {
    const newOrder = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerName,
      userEmail: userEmail ? userEmail.toLowerCase() : "",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      total: `$${totalAmount.toFixed(2)}`,
      status: "Processing",
      activeStep: 0,
      items: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        price: `$${item.price.toFixed(2)}`,
      })),
      trackingNumber: `FDX-${Math.floor(100000000 + Math.random() * 900000000)}`,
    };

    setOrders((prevOrders) => [newOrder, ...prevOrders]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    let step = 0;
    if (newStatus === "Processing") step = 0;
    if (newStatus === "Shipped") step = 1;
    if (newStatus === "Out for Delivery") step = 2;
    if (newStatus === "Delivered") step = 3;
    if (newStatus === "Cancelled") step = -1;

    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, activeStep: step } : o
      )
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        addCategory,
        addProduct,
        deleteProduct,
        orders,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
