import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { menu_list } from "../assets/assets";
import { API_BASE_URL, api, getAuthConfig } from "../config/api";

export const StoreContext = createContext(null);

const readStoredUser = () => {
  try {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
};

const readStoredCart = () => {
  try {
    const savedCart = localStorage.getItem("guestCart");
    return savedCart ? JSON.parse(savedCart) : {};
  } catch {
    localStorage.removeItem("guestCart");
    return {};
  }
};

const StoreContextProvider = ({ children }) => {
  const [food_list, setFoodList] = useState([]);
  const [cartItems, setCartItems] = useState(readStoredCart);
const getValidToken = () => {
  const t = localStorage.getItem("token");

  if (!t || t === "undefined" || t === "null") {
    return "";
  }

  return t;
};

const [token, setToken] = useState(getValidToken);
  const [user, setUser] = useState(readStoredUser);
  const [isCartLoading, setIsCartLoading] = useState(false);

  const url = API_BASE_URL;
  const currency = "₹";
  const deliveryCharge = 50;

  // 🔥 UPDATE LOCAL CART
  const updateLocalCartItem = useCallback((itemId, nextQuantity) => {
    setCartItems((prev) => {
      const updated = { ...prev };

      if (nextQuantity <= 0) delete updated[itemId];
      else updated[itemId] = nextQuantity;

      return updated;
    });
  }, []);

  // 🔥 FETCH FOOD
  const fetchFoodList = useCallback(async () => {
    try {
      const res = await api.get("/api/food/list");
      setFoodList(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      console.error("Food fetch error:", err);
      setFoodList([]);
    }
  }, []);

  // 🔥 LOAD CART (ONLY WHEN TOKEN VALID)
  const loadCartData = useCallback(
    async (currentToken = token) => {
      if (!currentToken || currentToken === "undefined") return;

      setIsCartLoading(true);

      try {
        const res = await api.post(
          "/api/cart/get",
          {},
          getAuthConfig(currentToken)
        );

        setCartItems(res.data?.cartData || {});
      } catch (err) {
        console.error("Cart load error:", err);
        setCartItems({});
      } finally {
        setIsCartLoading(false);
      }
    },
    [token]
  );

  // 🔥 CLEAR CART
  const clearCart = useCallback(() => {
    setCartItems({});
    localStorage.removeItem("guestCart");
  }, []);

  // 🔥 SYNC CART WITH BACKEND
  const syncCartAction = useCallback(
    async (path, itemId, rollbackQuantity) => {
      if (!token || token === "undefined") return true;

      try {
        const res = await api.post(
          path,
          { itemId },
          getAuthConfig(token)
        );

        if (!res.data?.success) {
          throw new Error(res.data?.message);
        }

        if (res.data.cartData) {
          setCartItems(res.data.cartData);
        }

        return true;
      } catch (err) {
        updateLocalCartItem(itemId, rollbackQuantity);
        console.error("Cart sync error:", err);
        return false;
      }
    },
    [token, updateLocalCartItem]
  );

  // 🔥 ADD TO CART
  const addToCart = useCallback(
    async (itemId) => {
      const prev = cartItems[itemId] || 0;
      const next = prev + 1;

      updateLocalCartItem(itemId, next);

      if (!token || token === "undefined") return;

      await syncCartAction("/api/cart/add", itemId, prev);
    },
    [cartItems, token, syncCartAction, updateLocalCartItem]
  );

  // 🔥 REMOVE FROM CART
  const removeFromCart = useCallback(
    async (itemId) => {
      const prev = cartItems[itemId] || 0;
      if (prev <= 0) return;

      const next = prev - 1;
      updateLocalCartItem(itemId, next);

      if (!token || token === "undefined") return;

      await syncCartAction("/api/cart/remove", itemId, prev);
    },
    [cartItems, token, syncCartAction, updateLocalCartItem]
  );

  // 🔥 FOOD MAP
  const foodMap = useMemo(() => {
    return food_list.reduce((acc, item) => {
      acc[item._id] = item;
      return acc;
    }, {});
  }, [food_list]);

  // 🔥 CART COUNT
  const cartCount = useMemo(() => {
    return Object.values(cartItems).reduce((sum, q) => sum + q, 0);
  }, [cartItems]);

  // 🔥 CART AMOUNT
  const cartAmount = useMemo(() => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const item = foodMap[id];
      if (!item || qty <= 0) return total;
      return total + item.price * qty;
    }, 0);
  }, [cartItems, foodMap]);

  const getTotalCartAmount = useCallback(() => cartAmount, [cartAmount]);

  // 🔥 INITIAL LOAD
  useEffect(() => {
    fetchFoodList();
  }, [fetchFoodList]);

  // 🔥 LOAD CART ONLY WHEN TOKEN READY
  useEffect(() => {
    if (token && token !== "undefined") {
      loadCartData(token);
    }
  }, [token, loadCartData]);

  // 🔥 SAVE TOKEN
  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      localStorage.removeItem("guestCart");
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  // 🔥 SAVE USER
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  // 🔥 SAVE GUEST CART
  useEffect(() => {
    if (!token) {
      localStorage.setItem("guestCart", JSON.stringify(cartItems));
    }
  }, [cartItems, token]);

  const value = {
    url,
    food_list,
    menu_list,
    cartItems,
    cartCount,
    cartAmount,
    isCartLoading,
    addToCart,
    removeFromCart,
    clearCart,
    getTotalCartAmount,
    token,
    setToken,
    loadCartData,
    setCartItems,
    currency,
    deliveryCharge,
    user,
    setUser,
  };

  return (
    <StoreContext.Provider value={value}>
      {children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;