

import User from "../models/User.js";

export const updateCart = async (req, res) => {
  try {
    const userId = req.userId;  // ✅ provided by authuser middleware
    const { cartItems } = req.body;

    if (!userId) {
      return res.json({ success: false, message: "User not authenticated" });
    }

    await User.findByIdAndUpdate(userId, { cartItems });

    return res.json({ success: true, message: "Cart updated successfully" });
  } catch (error) {
    console.log(error.message);
    return res.json({ success: false, message: "Failed to update cart" });
  }
};
