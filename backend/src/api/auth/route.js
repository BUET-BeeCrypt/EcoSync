const controller = require("./controller");
const router = require("express-promise-router")();
const { checkAuth } = require("../../middlewares/check-auth");
const checkPermission = require("../../middlewares/check-permission");
const repository = require("./repository");

router.post("/login", async (req, res, next) => {
    console.log("login route");
    const username = req.body.username;
    if (!username) {
        return res.status(400).json({message: "Username is required"});
    }
    role = await repository.getUserRole(req.body.username);
    if (!role) {
        return res.status(400).json({message: "User not found"});
    }
    console.log("role: ", role);
    req.user = {};
    req.user.username = username;
    req.user.role = role;
    next();
}, checkPermission("LOGIN"), controller.login);
router.post("/logout", controller.logout);
router.post("/change-password",  controller.changePassword);
router.post("/reset-password/initiate", controller.initiateResetPassword);
router.post("/reset-password/confirm", controller.resetPassword);
router.post("/refresh-token", controller.refreshToken);
module.exports = router;