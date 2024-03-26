const controller = require("./controller");
const router = require("express-promise-router")();

router.get("/", controller.getProfile);
router.put("/", controller.updateProfile);

module.exports = router;
