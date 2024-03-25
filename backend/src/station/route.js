const controller = require("./controller");
const router = require("express-promise-router")();

router.post("/", controller.addStation);
router.get("/", controller.getAllStations);
router.get("/:station_id/trains", controller.getTrainsAtStation);

module.exports = router;