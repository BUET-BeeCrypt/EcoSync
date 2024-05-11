const controller = require("./controller");
const router = require("express-promise-router")();

// add a single role
router.get("/",controller.getRoutes);
router.post("/",controller.testLocal);
router.get("/recalculate",controller.calculateRoutes);
router.get("/fleet/suggest",controller.suggestFleet);
router.post("/fleet/confirm",controller.confirmFleet);
router.post("/schedule",controller.scheduleCollection);


module.exports = router;