const router = require("express").Router();

const authRoutes = require("./auth.routes");
const attendanceRoutes = require("./attendance.routes");
const leaveRoutes = require("./leave.routes");
const userRoutes = require("./user.routes");

router.get("/health", (req, res) => res.json({ ok: true }));

router.use("/auth", authRoutes);
router.use("/attendance", attendanceRoutes);
router.use("/leaves", leaveRoutes);
router.use("/users", userRoutes);

module.exports = router;
