import React, { useContext, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import "./Verify.css";
import { api } from "../../config/api";

const Verify = () => {
  const { clearCart } = useContext(StoreContext);
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      if (!success || !orderId) {
        navigate("/");
        return;
      }

      try {
        const response = await api.post("/api/order/verify", { success, orderId });
        if (response.data?.success) {
          clearCart();
          navigate("/myorders");
        } else {
          navigate("/");
        }
      } catch (error) {
        console.error("Payment verification failed:", error);
        navigate("/");
      }
    };

    verifyPayment();
  }, [clearCart, navigate, orderId, success]);

  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
