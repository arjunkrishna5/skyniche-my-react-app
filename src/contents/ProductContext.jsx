import React, { createContext, useContext, useState, useEffect } from "react";
import { Laptop as LaptopIcon, PhoneIphone as PhoneIcon, Headphones as HeadphonesIcon, Spa as SkincareIcon, Devices as GadgetIcon } from "@mui/icons-material";

const ProductContext = createContext();

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
    reviews: 512,
    desc: "Forged in titanium, A17 Pro chip, customizable Action button, and 5x optical zoom camera system.",
    badge: "Popular",
    badgeColor: "#6366f1",
    stock: 24,
    status: "In Stock",
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
    stock: 5,
    status: "Low Stock",
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
    stock: 140,
    status: "In Stock",
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
    stock: 3,
    status: "Low Stock",
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

  const addProduct = (newProd) => {
    const formattedProd = {
      id: `PROD-${100 + products.length + 1}`,
      name: newProd.name,
      category: newProd.category,
      price: parseFloat(newProd.price) || 0,
      rating: 5.0,
      reviews: 1,
      desc: newProd.desc || `${newProd.name} - high quality ${newProd.category.toLowerCase()} item.`,
      badge: "New Item",
      badgeColor: "#2dd4bf",
      stock: parseInt(newProd.stock) || 10,
      status: parseInt(newProd.stock) > 5 ? "In Stock" : parseInt(newProd.stock) > 0 ? "Low Stock" : "Out of Stock",
    };

    if (!categories.includes(newProd.category)) {
      setCategories([...categories, newProd.category]);
    }

    setProducts([formattedProd, ...products]);
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  const placeOrder = (cartItems, totalAmount, customerName = "Customer") => {
    const newOrder = {
      id: `#ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: customerName,
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
