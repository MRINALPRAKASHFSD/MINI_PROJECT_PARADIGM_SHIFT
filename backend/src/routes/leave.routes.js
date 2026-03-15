const LeaveRequest = require("../models/LeaveRequest");
const { asyncHandler } = require("../utils/asyncHandler");

const createLeave = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.sub;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const { from, to, reason } = req.body || {};
  if (!from || !to) return res.status(400).json({ message: "from and to are required" });

  const doc = await LeaveRequest.create({
    user: userId,
    from: new Date(from),
    to: new Date(to),
    reason: reason || ""
  });

  res.status(201).json(doc);
});

const myLeaves = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.sub;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const items = await LeaveRequest.find({ user: userId }).sort({ createdAt: -1 }).limit(200);
  res.json({ items });
});

module.exports = { createLeave, myLeaves };