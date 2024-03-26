const controller = require("./controller");
const router = require("express-promise-router")();

const {requiresAdmin} = require("../../middlewares/check-auth");


router.get("/test", (req, res) => {
    res.json({ message: "This is secured user route" });
});

router.get("/", requiresAdmin, controller.getAllUsers);
router.get("/roles",controller.getAllRoles);
router.delete("/:user_id", requiresAdmin, controller.deleteUser);

router.get("/:user_id", controller.getUser);
router.post("/", requiresAdmin, controller.addUser);
router.put("/:user_id", controller.updateUser);


router.put("/:user_id/roles", requiresAdmin, controller.updateUserRoles);




module.exports = router;