const controller = require("./controller");
const router = require("express-promise-router")();

router.post("/", controller.purchaseTicket);

module.exports = router;