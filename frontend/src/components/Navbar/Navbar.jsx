import React, { useContext, useMemo, useState } from "react";
import "./Navbar.css";
import { assets } from "../../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";

const Navbar = ({ setShowLogin, setSearch }) => {
  const [menu, setMenu] = useState("home");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const {
    cartCount,
    token,
    setToken,
    food_list,
    user,
    setUser,
    clearCart,
  } = useContext(StoreContext);

  const navigate = useNavigate();

  const foodNames = useMemo(() => {
    return food_list.map((item) => item.name);
  }, [food_list]);

  const logout = () => {
    setToken("");
    setUser(null);
    clearCart();
    setSearchTerm("");
    setSearch("");
    navigate("/");
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setSearch(value);
  };

  const filteredSuggestions = foodNames
    .filter((item) =>
      item.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 8);

  return (
    <div className="navbar">
      {/* LOGO */}
      <Link to="/">
        <img className="logo" src={assets.logo} alt="QuickBite" />
      </Link>

      {/* MENU */}
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>
          home
        </Link>

        <a href="#explore-menu" onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>
          menu
        </a>

        <a href="#footer" onClick={() => setMenu("contact")} className={menu === "contact" ? "active" : ""}>
          contact us
        </a>
      </ul>

      {/* RIGHT SECTION */}
      <div className="navbar-right">

        {/* 🔥 SEARCH */}
        <div className="search-box">
          <input
            type="text"
            placeholder="Search dishes"
            value={searchTerm}
            onChange={handleSearch}
            onFocus={() => setShowDropdown(true)}
            onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
          />

          {showDropdown && searchTerm && (
            <div className="search-dropdown">
              {filteredSuggestions.length > 0 ? (
                filteredSuggestions.map((item) => (
                  <p
                    key={item}
                    onMouseDown={() => {
                      setSearchTerm(item);
                      setSearch(item);
                      setShowDropdown(false);
                    }}
                  >
                    {item}
                  </p>
                ))
              ) : (
                <p className="no-result">No results</p>
              )}
            </div>
          )}
        </div>

        {/* CART */}
        <Link to="/cart" className="navbar-search-icon">
          <img src={assets.basket_icon} alt="cart" />
          <div className={cartCount > 0 ? "dot" : ""}></div>
        </Link>

        {/* PROFILE */}
        {!token ? (
          <button onClick={() => setShowLogin(true)}>sign in</button>
        ) : (
          <div className="navbar-profile">
            <div className="profile-info">
              <img src={assets.profile_icon} alt="profile" />
              <p>{user?.name || "User"}</p>
            </div>

            <ul className="navbar-profile-dropdown">
              <li className="user-name">Hello, {user?.name || "User"}</li>
              <hr />
              <li onClick={() => navigate("/myorders")}>
                <img src={assets.bag_icon} alt="orders" />
                <p>Orders</p>
              </li>
              <hr />
              <li onClick={logout}>
                <img src={assets.logout_icon} alt="logout" />
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;