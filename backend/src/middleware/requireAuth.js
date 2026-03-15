const router = require("express").Router();
const { createLeave, myLeaves } = require("../controllers/leave.controller");

// If you already have auth middleware, add it here, e.g.
// const { requireAuth } = require("../middleware/auth");
// router.use(requireAuth);

router.post("/", createLeave);
router.get("/me", myLeaves);

module.exports = router;