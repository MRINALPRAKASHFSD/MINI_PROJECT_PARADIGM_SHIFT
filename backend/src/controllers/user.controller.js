const User = require("../models/User");
const { asyncHandler } = require("../utils/asyncHandler");

const me = asyncHandler(async (req, res) => {
  const userId = req.user?.sub || req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const user = await User.findById(userId).select("_id name email role isActive createdAt updatedAt");
  if (!user) return res.status(404).json({ message: "User not found" });

  res.json({ user });
});

module.exports = { me };
