import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";

const currency = "inr";
const deliveryCharge = 50;
const frontendURL = process.env.FRONTEND_URL || "http://localhost:5173";

const getStripeClient = () => {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Stripe secret key is not configured");
  }

  return new Stripe(process.env.STRIPE_SECRET_KEY);
};

const buildOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Order items are required");
  }

  const itemIds = items.map((item) => item.itemId);
  const foods = await foodModel.find({ _id: { $in: itemIds } });
  const foodMap = new Map(foods.map((food) => [food._id.toString(), food]));

  const normalizedItems = items.map((item) => {
    const food = foodMap.get(item.itemId);
    const quantity = Number(item.quantity);

    if (!food) {
      throw new Error("One or more food items are invalid");
    }

    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Invalid item quantity");
    }

    return {
      itemId: food._id.toString(),
      name: food.name,
      price: food.price,
      image: food.image,
      quantity,
    };
  });

  const subtotal = normalizedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return {
    normalizedItems,
    totalAmount: subtotal + deliveryCharge,
  };
};

const placeOrder = async (req, res) => {
  try {
    const { normalizedItems, totalAmount } = await buildOrderItems(req.body.items);

    const newOrder = new orderModel({
      userId: req.userId,
      items: normalizedItems,
      amount: totalAmount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    const line_items = normalizedItems.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const stripe = getStripeClient();
    const session = await stripe.checkout.sessions.create({
      success_url: `${frontendURL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontendURL}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message || "Error" });
  }
};

const placeOrderCod = async (req, res) => {
  try {
    const { normalizedItems, totalAmount } = await buildOrderItems(req.body.items);

    const newOrder = new orderModel({
      userId: req.userId,
      items: normalizedItems,
      amount: totalAmount,
      address: req.body.address,
      payment: true,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.userId, { cartData: {} });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ success: false, message: error.message || "Error" });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, { status: req.body.status });
    res.json({ success: true, message: "Status Updated" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Paid" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Not Paid" });
    }
  } catch (error) {
    res.json({ success: false, message: "Not Verified" });
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  placeOrderCod,
};
