import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";

const getUserCart = async (userId) => {
  const userData = await userModel.findById(userId);

  if (!userData) {
    throw new Error("User not found");
  }

  return {
    userData,
    cartData: { ...(userData.cartData || {}) },
  };
};

const addToCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Item id is required" });
    }

    const foodExists = await foodModel.exists({ _id: itemId });
    if (!foodExists) {
      return res
        .status(404)
        .json({ success: false, message: "Food item not found" });
    }

    const { cartData } = await getUserCart(req.userId);
    cartData[itemId] = (cartData[itemId] || 0) + 1;

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Added To Cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || "Error" });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { itemId } = req.body;

    if (!itemId) {
      return res
        .status(400)
        .json({ success: false, message: "Item id is required" });
    }

    const { cartData } = await getUserCart(req.userId);

    if (!cartData[itemId]) {
      return res.json({ success: true, message: "Cart already updated", cartData });
    }

    if (cartData[itemId] > 1) {
      cartData[itemId] -= 1;
    } else {
      delete cartData[itemId];
    }

    await userModel.findByIdAndUpdate(req.userId, { cartData });
    res.json({ success: true, message: "Removed From Cart", cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || "Error" });
  }
};

const getCart = async (req, res) => {
  try {
    const { cartData } = await getUserCart(req.userId);
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message || "Error" });
  }
};

export { addToCart, removeFromCart, getCart };
