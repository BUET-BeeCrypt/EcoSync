const controller = require("./controller");
const router = require("express-promise-router")();
const { checkAuth } = require("../../middlewares/check-auth");

router.post("/login", controller.login);
router.post("/change-password", checkAuth,  controller.changePassword);
module.exports = router;