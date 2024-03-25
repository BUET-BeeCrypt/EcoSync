const controller = require("./controller");
const router = require("express-promise-router")();


router.post("/", controller.addUser);


module.exports = router;