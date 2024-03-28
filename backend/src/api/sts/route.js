const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

// create a new STS. Only admin 
router.post("/", checkPermission("CREATE_STS"), controller.createSTS);
router.get("/", checkPermission("VIEW_ALL_STS"),controller.getSTSs);
router.get("/:sts_id",checkPermission("VIEW_STS"), controller.getSTS);
router.put("/:sts_id", checkPermission("UPDATE_STS"), controller.updateSTS);
router.delete("/:sts_id", checkPermission("DELETE_STS"), controller.deleteSTS);

// assign manager to STS
router.post("/:sts_id/managers", checkPermission("ASSIGN_STS_MANAGER"),controller.assignManagerToSTS);
// get managers of STS
router.get("/:sts_id/managers", checkPermission("VIEW_STS_MANAGER"),controller.getManagersOfSTS);
// remove manager from STS
router.delete("/:sts_id/managers/:user_id", checkPermission("UNASSIGN_STS_MANAGER"),controller.removeManagerFromSTS);


router.get("/entries", controller.getOnlyEntriesOfSTS);
router.post("/entries", controller.addEntryToSTS);
router.put("/departures/:sts_entry_id", controller.addDepartureToSTS);
router.post("/dump", controller.addDumpEntryToSTS);
router.get("/records", controller.getEntriesOfSTS);

router.get("/vehicles", controller.getVehiclesOfSTS);


module.exports = router;
