const Attendance = require("../models/Attendance");
const { asyncHandler } = require("../utils/asyncHandler");

function toDayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const checkIn = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.sub; // depending on your auth middleware
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const day = toDayKey(new Date());

  const doc = await Attendance.findOneAndUpdate(
    { user: userId, day },
    { $setOnInsert: { user: userId, day }, $set: { checkInAt: new Date() } },
    { upsert: true, new: true }
  );

  res.status(201).json(doc);
});

const checkOut = asyncHandler(async (req, res) => {
  const userId = req.user?.id || req.user?.sub;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const day = toDayKey(new Date());

  const doc = await Attendance.findOneAndUpdate(
    { user: userId, day },
    { $set: { checkOutAt: new Date() } },
    { new: true }
  );

  if (!doc) return res.status(404).json({ message: "No check-in found for today" });

  res.json(doc);
});


module.exports = { checkIn, checkOut, myAttendance };
