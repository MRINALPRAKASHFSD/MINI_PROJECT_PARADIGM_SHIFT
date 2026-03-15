const router = require("express").Router();
const { me } = require("../controllers/user.controller");
const { requireAuth } = require("../middleware/requireAuth");

router.get("/me", requireAuth, me);

module.exports = router;

