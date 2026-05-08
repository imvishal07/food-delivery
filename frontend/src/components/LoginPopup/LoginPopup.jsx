import React, { useContext, useState } from "react";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import { api } from "../../config/api";

const LoginPopup = ({ setShowLogin }) => {
  const { setToken, setUser, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Sign Up");
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onLogin = async (e) => {
    e.preventDefault();

    try {
      const endpoint =
        currState === "Login" ? "/api/user/login" : "/api/user/register";

      const response = await api.post(endpoint, data);

      if (!response.data?.success) {
        toast.error(response.data?.message || "Unable to authenticate");
        return;
      }

      setToken(response.data.token || "");
      setUser(response.data.user || null);
      await loadCartData(response.data.token);
      setShowLogin(false);

      toast.success(
        currState === "Login" ? "Login successful" : "Account created"
      );
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="login-popup">
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>
          <img
            onClick={() => setShowLogin(false)}
            src={assets.cross_icon}
            alt="close"
          />
        </div>

        <div className="login-popup-inputs">
          {currState === "Sign Up" && (
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="Your name"
              required
            />
          )}

          <input
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Your email"
            required
          />

          <input
            name="password"
            onChange={onChangeHandler}
            value={data.password}
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button type="submit">
          {currState === "Login" ? "Login" : "Create Account"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>I agree to terms and privacy policy</p>
        </div>

        <p className="switch-text">
          {currState === "Login" ? (
            <>
              New here?{" "}
              <span onClick={() => setCurrState("Sign Up")}>Create account</span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span onClick={() => setCurrState("Login")}>Login</span>
            </>
          )}
        </p>
      </form>
    </div>
  );
};

export default LoginPopup;
