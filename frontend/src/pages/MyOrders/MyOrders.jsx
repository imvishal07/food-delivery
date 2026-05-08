import React, { useCallback, useContext, useEffect, useState } from "react";
import "./MyOrders.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { api, getAuthConfig } from "../../config/api";

const MyOrders = () => {
  const [data, setData] = useState([]);
  const { token, currency } = useContext(StoreContext);

  const fetchOrders = useCallback(async () => {
    if (!token) {
      setData([]);
      return;
    }

    try {
      const response = await api.post(
        "/api/order/userorders",
        {},
        getAuthConfig(token)
      );
      setData(Array.isArray(response.data?.data) ? response.data.data : []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setData([]);
    }
  }, [token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="my-orders">
      <h2>My Orders</h2>
      <div className="container">
        {data.map((order) => (
          <div key={order._id} className="my-orders-order">
            <img src={assets.parcel_icon} alt="parcel" />
            <p>
              {order.items.map((item, index) =>
                index === order.items.length - 1
                  ? `${item.name} x ${item.quantity}`
                  : `${item.name} x ${item.quantity}, `
              )}
            </p>
            <p>{currency}{order.amount}.00</p>
            <p>Items: {order.items.length}</p>
            <p><span>&#x25cf;</span> <b>{order.status}</b></p>
            <button onClick={fetchOrders}>Track Order</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
