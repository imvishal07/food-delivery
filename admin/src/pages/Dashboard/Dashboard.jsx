import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { api } from "../../config/api";
import { FaRupeeSign, FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
import { MdToday } from "react-icons/md";
import { IoStatsChart } from "react-icons/io5";
import { useNavigate } from "react-router-dom";  // 🔥 ADD

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate(); // 🔥 ADD

  const fetchStats = async () => {
    try {
      const response = await api.get("/api/admin/stats");

      if (response.data?.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.log("Error fetching stats:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading dashboard...</p>;
  }

  return (
    <div className="dashboard">
      <h2>Admin Dashboard</h2>

      <div className="dashboard-cards">

        <div className="card revenue">
          <div className="card-icon"><FaRupeeSign /></div>
          <h3>Total Revenue</h3>
          <p>₹ {stats?.totalRevenue ?? 0}</p>
        </div>

        {/* 🔥 CLICKABLE */}
        <div className="card orders clickable" onClick={() => navigate("/orders")}>
          <div className="card-icon"><FaShoppingCart /></div>
          <h3>Total Orders</h3>
          <p>{stats?.totalOrders ?? 0}</p>
        </div>

        <div className="card users clickable" onClick={() => navigate("/users")}>
          <div className="card-icon"><FaUsers /></div>
          <h3>Total Users</h3>
          <p>{stats?.totalUsers ?? 0}</p>
        </div>

        <div className="card products clickable" onClick={() => navigate("/list")}>
          <div className="card-icon"><FaBox /></div>
          <h3>Total Products</h3>
          <p>{stats?.totalProducts ?? 0}</p>
        </div>

        <div className="card today">
          <div className="card-icon"><MdToday /></div>
          <h3>Today Sales</h3>
          <p>₹ {stats?.todaySales ?? 0}</p>
        </div>

        <div className="card week">
          <div className="card-icon"><IoStatsChart /></div>
          <h3>Week Sales</h3>
          <p>₹ {stats?.weekSales ?? 0}</p>
        </div>

        <div className="card month">
          <div className="card-icon"><IoStatsChart /></div>
          <h3>Month Sales</h3>
          <p>₹ {stats?.monthSales ?? 0}</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;