const controller = require("./controller");
const router = require("express-promise-router")();


router.post("/", controller.addTrain);


module.exports = router;