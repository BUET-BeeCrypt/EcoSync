const controller = require("./controller");
const router = require("express-promise-router")();

router.get('/entries',controller.getOnlyEntriesOfLandfill);
router.post("/entries",controller.addEntryToLandfill);
router.put("/departures/:landfill_entry_id",controller.addDepartureToLandfill);
router.get("/records",controller.getEntriesOfLandfill);


router.post("/",controller.createLandfill);
router.get("/",controller.getLandfills);
router.put("/:landfill_id",controller.updateLandfill);
router.get("/:landfill_id",controller.getLandfill);
router.delete("/:landfill_id",controller.deleteLandfill);

router.post("/:landfill_id/managers",controller.addManagerToLandfill);
router.get("/:landfill_id/managers",controller.getManagersOfLandfill);
router.delete("/:landfill_id/managers/:user_id",controller.removeManagerFromLandfill);



module.exports = router;