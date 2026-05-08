import React, { useState } from "react";
import "./Login.css";
import { api } from "../../config/api";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/api/admin/login", { email, password });

      if (response.data?.success) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
      } else {
        alert(response.data?.message || "Invalid credentials");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Unable to login");
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={submitHandler}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
