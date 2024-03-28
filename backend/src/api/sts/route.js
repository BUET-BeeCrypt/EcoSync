const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

// create a new STS. Only admin 
router.post("/", checkPermission("CREATE_STS"), controller.createSTS);
router.get("/", checkPermission("VIEW_ALL_STS"),controller.getSTSs);
router.get("/:sts_id",checkPermission("VIEW_STS"), controller.getSTS);
router.put("/:sts_id", checkPermission("UPDATE_STS"), controller.updateSTS);
router.delete("/:sts_id", checkPermission("DELETE_STS"), controller.deleteSTS);

router.get("/entries", controller.getOnlyEntriesOfSTS);
router.post("/entries", controller.addEntryToSTS);
router.put("/departures/:sts_entry_id", controller.addDepartureToSTS);
router.post("/dump", controller.addDumpEntryToSTS);
router.get("/records", controller.getEntriesOfSTS);

router.get("/vehicles", controller.getVehiclesOfSTS);



router.post("/:sts_id/managers", controller.addManagerToSTS);
router.get("/:sts_id/managers", controller.getManagersOfSTS);
router.delete("/:sts_id/managers/:user_id", controller.removeManagerFromSTS);

module.exports = router;
