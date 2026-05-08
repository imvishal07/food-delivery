import React, { useEffect, useState } from "react";
import "./Orders.css";
import { toast } from "react-toastify";
import { api } from "../../config/api";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("All");

  const fetchAllOrders = async () => {
    try {
      const res = await api.get("/api/order/list");
      setOrders(res.data?.data?.reverse() || []);
    } catch {
      toast.error("Error loading orders ❌");
    }
  };

  const statusHandler = async (e, id) => {
    try {
      await api.post("/api/order/status", {
        orderId: id,
        status: e.target.value,
      });
      toast.success("Status updated ✅");
      fetchAllOrders();
    } catch {
      toast.error("Error updating status ❌");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  // 🔥 FILTER LOGIC
  const filteredOrders =
    filter === "All"
      ? orders
      : orders.filter((o) => o.status === filter);

  return (
    <div className="orders-container">

      {/* 🔥 FILTER */}
      <div className="order-filter">
        <span>Filter:</span>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All</option>
          <option>Food Processing</option>
          <option>Out for delivery</option>
          <option>Delivered</option>
        </select>
      </div>

      {/* 🔥 LIST */}
      {filteredOrders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        filteredOrders.map((o) => (
          <div key={o._id} className="order-item">

            {/* LEFT */}
            <div className="order-left">
              <p className="order-item-food">
                {o.items?.map((i) => `${i.name} x ${i.quantity}`).join(", ")}
              </p>

              <p className="order-item-name">
                {o.address?.firstName} {o.address?.lastName}
              </p>

              <div className="order-item-address">
                <p>{o.address?.street}</p>
                <p>
                  {o.address?.city}, {o.address?.state}
                </p>
              </div>

              <p className="order-time">
                {new Date(o.createdAt).toLocaleString()}
              </p>
            </div>

            {/* ITEMS */}
            <p className="order-meta">Items: {o.items?.length}</p>

            {/* AMOUNT */}
            <p className="order-meta price">₹{o.amount}</p>

            {/* STATUS */}
            <select
              value={o.status}
              onChange={(e) => statusHandler(e, o._id)}
            >
              <option>Food Processing</option>
              <option>Out for delivery</option>
              <option>Delivered</option>
            </select>

          </div>
        ))
      )}
    </div>
  );
};

export default Order;