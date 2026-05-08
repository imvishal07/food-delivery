import React, { useContext, useEffect, useState } from "react";
import "./PlaceOrder.css";
import { StoreContext } from "../../Context/StoreContext";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { api, getAuthConfig } from "../../config/api";

const PlaceOrder = () => {
  const [payment, setPayment] = useState("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const {
    cartAmount,
    token,
    food_list,
    cartItems,
    clearCart,
    currency,
    deliveryCharge,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  // input handler
  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  // place order
  const placeOrder = async (e) => {
    e.preventDefault();

    // ❌ no login
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
      return;
    }

    // ✅ build correct items (VERY IMPORTANT)
    const orderItems = food_list
      .filter((item) => (cartItems[item._id] || 0) > 0)
      .map((item) => ({
        itemId: item._id, // ✅ matches backend
        quantity: cartItems[item._id],
      }));

    // ❌ empty cart
    if (orderItems.length === 0) {
      toast.error("Cart is empty");
      navigate("/cart");
      return;
    }

    setIsSubmitting(true);

    try {
      const endpoint =
        payment === "stripe"
          ? "/api/order/place"
          : "/api/order/placecod";

      const response = await api.post(
        endpoint,
        {
          address: data,
          items: orderItems, // ✅ correct format
        },
        getAuthConfig(token)
      );

      if (!response.data?.success) {
        toast.error(response.data?.message || "Order failed");
        return;
      }

      // 💳 Stripe
      if (payment === "stripe") {
        window.location.replace(response.data.session_url);
        return;
      }

      // ✅ COD success
      clearCart();
      toast.success("Order placed successfully");
      navigate("/myorders");

    } catch (error) {
      console.error("Place order error:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // auth check
  useEffect(() => {
    if (!token) {
      toast.error("Please login first");
      navigate("/cart");
      return;
    }

    if (cartAmount === 0) {
      navigate("/cart");
    }
  }, [cartAmount, token, navigate]);

  return (
    <form onSubmit={placeOrder} className="place-order">

      {/* LEFT */}
      <div className="place-order-left">
        <p className="title">Delivery Information</p>

        <div className="multi-field">
          <input name="firstName" value={data.firstName} onChange={onChangeHandler} placeholder="First name" required />
          <input name="lastName" value={data.lastName} onChange={onChangeHandler} placeholder="Last name" required />
        </div>

        <input name="email" value={data.email} onChange={onChangeHandler} placeholder="Email" required />

        <input name="street" value={data.street} onChange={onChangeHandler} placeholder="Street" required />

        <div className="multi-field">
          <input name="city" value={data.city} onChange={onChangeHandler} placeholder="City" required />
          <input name="state" value={data.state} onChange={onChangeHandler} placeholder="State" required />
        </div>

        <div className="multi-field">
          <input name="zipcode" value={data.zipcode} onChange={onChangeHandler} placeholder="Zipcode" required />
          <input name="country" value={data.country} onChange={onChangeHandler} placeholder="Country" required />
        </div>

        <input name="phone" value={data.phone} onChange={onChangeHandler} placeholder="Phone" required />
      </div>

      {/* RIGHT */}
      <div className="place-order-right">

        <div className="cart-total">
          <h2>Cart Totals</h2>

          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>{currency}{cartAmount}</p>
          </div>

          <div className="cart-total-details">
            <p>Delivery Fee</p>
            <p>{currency}{cartAmount === 0 ? 0 : deliveryCharge}</p>
          </div>

          <div className="cart-total-details">
            <b>Total</b>
            <b>{currency}{cartAmount === 0 ? 0 : cartAmount + deliveryCharge}</b>
          </div>
        </div>

        {/* PAYMENT */}
        <div className="payment">
          <h2>Payment Method</h2>

          <div onClick={() => setPayment("cod")} className="payment-option">
            <img src={payment === "cod" ? assets.checked : assets.un_checked} alt="" />
            <p>Cash on Delivery</p>
          </div>

          <div onClick={() => setPayment("stripe")} className="payment-option">
            <img src={payment === "stripe" ? assets.checked : assets.un_checked} alt="" />
            <p>Stripe (Card)</p>
          </div>
        </div>
<button
  type="submit"
  className="place-order-submit"
  disabled={isSubmitting}
>
  {isSubmitting
    ? "Processing..."
    : payment === "cod"
    ? "Place Order"
    : "Proceed to Payment"}
</button>
      </div>
    </form>
  );
};

export default PlaceOrder;