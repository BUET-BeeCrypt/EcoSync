const controller = require("./controller");
const router = require("express-promise-router")();

// add a single role
router.get("/recalculate",controller.calculateRoutes);
router.get("/:sts_id",controller.assignSTSsToLandfills);


module.exports = router;