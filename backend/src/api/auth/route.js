const controller = require("./controller");
const router = require("express-promise-router")();
const { checkAuth } = require("../../middlewares/check-auth");

router.post("/login", controller.login);
router.post("/logout", controller.logout);
router.post("/change-password",  controller.changePassword);
router.post("/reset-password/initiate", controller.initiateResetPassword);
router.post("/reset-password/confirm", controller.resetPassword);
router.post("/refresh-token", controller.refreshToken);
module.exports = router;