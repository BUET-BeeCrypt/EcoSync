const controller = require("./controller");
const router = require("express-promise-router")();

router.post("/",controller.createVehicle);
router.get("/",controller.getVehicles);
router.put("/:vehicle_id",controller.updateVehicle);
router.get("/:vehicle_id",controller.getVehicle);
router.delete("/:vehicle_id",controller.deleteVehicle);



module.exports = router;