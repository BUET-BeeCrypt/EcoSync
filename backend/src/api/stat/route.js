const router = require("express-promise-router")();
const controller = require("./controller");

router.use("/", controller.getStats);

module.exports = router;
