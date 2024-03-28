const controller = require("./controller");
const router = require("express-promise-router")();
const checkPermission = require("../../middlewares/check-permission");

router.get('/entries', checkPermission("VIEW_LANDFILL_ENTRY"), controller.getArrivalEntriesOfLandfill);
router.post("/entries", checkPermission("CREATE_LANDFILL_ENTRY"),controller.addEntryToLandfill);
router.put("/departures/:landfill_entry_id", checkPermission("UPDATE_LANDFILL_ENTRY"), controller.addDepartureToLandfill);
router.get("/records",checkPermission("VIEW_LANDFILL_ENTRY"), controller.getEntriesOfLandfill);


router.post("/", checkPermission("CREATE_LANDFILL"),controller.createLandfill);
router.get("/", checkPermission("VIEW_LANDFILL"), controller.getLandfills);
router.put("/:landfill_id", checkPermission("UPDATE_LANDFILL"),controller.updateLandfill);
router.get("/:landfill_id", checkPermission("VIEW_LANDFILL"), controller.getLandfill);
router.delete("/:landfill_id", checkPermission("DELETE_LANDFILL"), controller.deleteLandfill);

router.post("/:landfill_id/managers", checkPermission("ASSIGN_LANDFILL_MANAGER"), controller.addManagerToLandfill);
router.get("/:landfill_id/managers", checkPermission("VIEW_LANDFILL_MANAGER"), controller.getManagersOfLandfill);
router.delete("/:landfill_id/managers/:user_id", checkPermission("UNASSIGN_LANDFILL_MANAGER"), controller.removeManagerFromLandfill);



module.exports = router;