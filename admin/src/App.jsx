import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import { Route, Routes, Navigate } from "react-router-dom";

import Add from "./pages/Add/Add";
import List from "./pages/List/List";
import Orders from "./pages/Orders/Orders";
import Category from "./pages/Category/Category";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Users from "./pages/users/users";   // ✅ IMPORTANT

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  // 🔥 Sync token with localStorage
  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  // 🔐 Not logged in → show login
  if (!token) {
    return (
      <>
        <ToastContainer position="top-right" />
        <Login setToken={setToken} />
      </>
    );
  }

  return (
    <div className="app">

      <ToastContainer position="top-right" />

      <Navbar setToken={setToken} />

      <hr />

      <div className="app-content">

        <Sidebar />

        <Routes>

          {/* DEFAULT */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* MAIN */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add" element={<Add />} />
          <Route path="/list" element={<List />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/category" element={<Category />} />
          <Route path="/users" element={<Users />} />   {/* ✅ USERS */}

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />

        </Routes>

      </div>
    </div>
  );
};

export default App;