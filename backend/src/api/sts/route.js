const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

router.get("/entries", checkPermission("VIEW_STS_ENTRY"), controller.getArrivalEntriesOfSTS);
router.post("/entries", checkPermission("CREATE_STS_ENTRY"),controller.addEntryToSTS);
router.put("/departures/:sts_entry_id", checkPermission("UPDATE_STS_ENTRY"), controller.addDepartureToSTS);
router.post("/dump", checkPermission("CREATE_STS_ENTRY"), controller.addDumpEntryToSTS);
router.get("/records", checkPermission("VIEW_STS_ENTRY"), controller.getEntriesOfSTS);
router.get("/vehicles", checkPermission("VIEW_VEHICLE"),controller.getVehiclesOfManager);
router.get("/my", checkPermission("VIEW_STS_ENTRY"), controller.getSTSOfManager);

router.get("/contractors", controller.getContractorsOfSTS);

router.get("/bills", controller.getAllBill);
router.post("/bills", controller.generateTodaysBill);

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

// assign vehicle to STS
router.post("/:sts_id/vehicles", checkPermission("ASSIGN_VEHCILE"),controller.assignVehicleToSTS);
// get vehicles of STS
router.get("/:sts_id/vehicles", checkPermission("VIEW_VEHICLE"),controller.getVehiclesOfSTS);
// remove vehicle from STS
router.delete("/:sts_id/vehicles/:vehicle_id", checkPermission("UNASSIGN_VEHICLE"),controller.removeVehicleFromSTS);



module.exports = router;
