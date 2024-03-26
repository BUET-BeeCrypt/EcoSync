const controller = require("./controller");
const router = require("express-promise-router")();

router.post("/",controller.createSTS);
router.get("/",controller.getSTSs);
router.put("/:sts_id",controller.updateSTS);
router.get("/:sts_id",controller.getSTS);
router.delete("/:sts_id",controller.deleteSTS);

router.post("/:sts_id/managers",controller.addManagerToSTS);
router.get("/:sts_id/managers",controller.getManagersOfSTS);
router.delete("/:sts_id/managers/:user_id",controller.removeManagerFromSTS);


module.exports = router;