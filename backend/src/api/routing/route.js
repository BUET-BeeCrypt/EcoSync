const controller = require("./controller");
const router = require("express-promise-router")();

// add a single role
router.get("/:sts_id",controller.assignSTSsToLandfills);
router.get("/recalculate",controller.calculateRoutes);

module.exports = router;