# 🛒 Nexus E-Commerce & Management Platform

A full-stack modern E-Commerce web application built with **React**, **Vite**, **Material-UI**, **Fastify**, and **MySQL**.

---

## 🌟 Key Features

* 🛒 **Live Storefront & Catalog**: Browse products, search in real-time, filter categories, and add items to cart.
* 🔒 **Role-Based Access Control (RBAC)**:
  * ⚡ **Admin (Full Access)**: Manage users, change roles, add/edit/delete products, view analytics reports.
  * ✏️ **Editor (Read & Edit)**: Add new products and update categories. Delete buttons and User management are restricted.
  * 👁️ **Viewer (Read Only)**: Read-only access to products and reports. Add/Delete actions are hidden.
* 📦 **Per-User Cart & Order History**: User shopping carts and placed orders are strictly isolated per user account.
* 🔄 **Real-Time MySQL Database Sync**: All user accounts, products, and order status updates sync directly with MySQL (`skyniche` database).

---

## 🛠️ Tech Stack

* **Frontend**: React 18, Vite, Material-UI (MUI v5), React Router v6, Axios
* **Backend**: Node.js, Fastify, Sequelize ORM
* **Database**: MySQL (via XAMPP / phpMyAdmin on port 3306)

---

## 🚀 Step-by-Step Setup & How to Run

### 1️⃣ Prerequisite: Start XAMPP MySQL
1. Open **XAMPP Control Panel**.
2. Click **Start** next to **MySQL** (and **Apache**).
3. Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin) in your browser.
4. Create a database named **`skyniche`** (if not created yet).

---

### 2️⃣ Start Backend API Server (Terminal 1)

Open your first terminal and run:

```cmd
cd backend
node server.js
```

> 🟢 **Backend Output**: `Server is running on port 4000` | `Database connected successfully to MySQL on port 3306!`

---

### 3️⃣ Start Frontend React Application (Terminal 2)

Open a second terminal window and run:

```cmd
npm run dev
```

> 🟢 **Frontend Output**: `Local: http://localhost:5173/`

---

## 🌐 Application Links

* 🏪 **Storefront / User Login**: [http://localhost:5173](http://localhost:5173)
* 📊 **Admin / Staff Dashboard**: [http://localhost:5173/dashboard](http://localhost:5173/dashboard)
* 🗄️ **phpMyAdmin Database**: [http://localhost/phpmyadmin](http://localhost/phpmyadmin) (*Database: `skyniche`*)

---

## 📁 Project Structure

```text
my-react-app/
├── backend/                  # Fastify Node.js Backend API
│   ├── config/               # Sequelize MySQL DB Connection
│   ├── controllers/          # User, Product, & Auth Controllers
│   ├── models/               # Sequelize Data Models (User, Product, Order)
│   ├── routes/               # Fastify API Endpoint Routes
│   └── server.js             # Main Backend Server Entrypoint
├── src/                      # React Frontend Application
│   ├── components/           # UI Views (Storefront, CustomerAccount, Dashboard, Login)
│   ├── contents/             # React Context Providers (AuthContext, ProductContext)
│   ├── App.jsx               # Main React Router & Protected Route Guards
│   └── main.jsx              # React DOM Rendering Entrypoint
├── .gitignore                # Environment & Dependency Ignores
└── README.md                 # Project Documentation
```
