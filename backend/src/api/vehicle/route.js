const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

// create a single vehicle
router.post("/", checkPermission("CREATE_VEHICLE"),controller.createVehicle);
// get all vehicles
router.get("/", checkPermission("VIEW_VEHICLE"), controller.getVehicles);
// get a single vehicle
router.get("/:vehicle_id", checkPermission("VIEW_VEHICLE"), controller.getVehicle);
// update a single vehicle
router.put("/:vehicle_id", checkPermission("UPDATE_VEHICLE"),controller.updateVehicle);
// delete a single vehicle
router.delete("/:vehicle_id", checkPermission("DELETE_VEHICLE"), controller.deleteVehicle);

module.exports = router;