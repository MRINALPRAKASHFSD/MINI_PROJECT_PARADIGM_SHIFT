const router = require("express").Router();
const {
  checkIn,
  checkOut,
  myAttendance
} = require("../controllers/attendance.controller");

// If you already have auth middleware, add it here, e.g.
// const { requireAuth } = require("../middleware/auth");
// router.use(requireAuth);

router.post("/check-in", checkIn);
router.post("/check-out", checkOut);
router.get("/me", myAttendance);

module.exports = router;
