const controller = require("./controller");
const router = require("express-promise-router")();

// add a single role
router.post("/roles",controller.addRole,);
// update a role info
router.put("/roles/:role_name",controller.updateRole);
// delete a role
router.delete("/roles/:role_name",controller.deleteRole);

router.post("/permissions",controller.addPermission);
router.put("/permissions/:permission_name",controller.updatePermission);
router.delete("/permissions/:permission_name", controller.deletePermission);
// get all permissions
router.get("/permissions", controller.getPermissions);
// get all permissions assigned to a role
router.get("/roles/:role_name/permissions", controller.getRolePermissions);

// assign permissions to a role
router.post("/roles/:role_name/permissions", controller.assignPermission);
// revoke permissions from a role
router.delete("/roles/:role_name/permissions/:permission_name", controller.revokePermission);

module.exports = router;