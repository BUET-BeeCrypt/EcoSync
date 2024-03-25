const controller = require("./controller");
const router = require("express-promise-router")();


router.get("/",controller.getAllUsers);
router.get("/:user_id",controller.addUser);
router.post("/",controller.addUser);
router.put("/:user_id",controller.updateUser);
router.delete("/:user_id",controller.deleteUser);

router.get("/roles",controller.getAllRoles);
router.put("/:user_id/roles",controller.updateUserRoles);


module.exports = router;