const controller = require("./controller");
const router = require("express-promise-router")();


router.post("/login", controller.login);

module.exports = router;