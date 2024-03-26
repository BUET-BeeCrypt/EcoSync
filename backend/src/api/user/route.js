const controller = require("./controller");
const router = require("express-promise-router")();

const {requiresAdmin} = require("../../middlewares/check-auth");


router.get("/test", (req, res) => {
    res.json({ message: "This is secured user route" });
});

// route to get all users
router.get("/", requiresAdmin, controller.getAllUsers);
// get all roles
router.get("/roles",controller.getAllRoles);
router.delete("/:user_id", requiresAdmin, controller.deleteUser);

router.get("/:user_id", controller.getUser);
router.post("/", requiresAdmin, controller.addUser);
// route to get a single user
router.get("/:user_id", controller.getUser);
// route to update a single user
router.put("/:user_id", controller.updateUser);

// assign role to user
router.put("/:user_id/roles", requiresAdmin, controller.updateUserRole);




module.exports = router;