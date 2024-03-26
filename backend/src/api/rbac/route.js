const controller = require("./controller");
const router = require("express-promise-router")();

// add a single role
router.post("/roles",controller.addRole);
// update a role info
router.put("/roles/:role_id",controller.updateRole);

router.post("/permissions",controller.addPermission);
router.put("/permissions/:permission_id",controller.updatePermission);

// router.post("/users/:user_id/roles",controller.addRolePermission);


module.exports = router;