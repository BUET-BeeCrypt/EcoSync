const repository = require("./repository");
const modules = {};

// modules.addUser = async (req, res) => {
//   const user = req.body;
//   const createdUser = await repository.createUser(user);
//   res.status(201).json(createdUser);
// };


modules.addRole = async (req, res) => {
  const role = req.body;
  const result = await repository.createRole(role);
  return res.status(201).json({"message":"Role created"});
}

modules.updateRole = async (req, res) => {
  const role_id = req.params.role_id;
  const role = req.body;
  const result = await repository.updateRole(role_id, role);
  return res.status(200).json({"message":"Role updated"});
}

modules.addPermission = async (req, res) => {
  const permission = req.body;
  const result = await repository.createPermission(permission);
  return res.status(201).json({"message":"Permission created"});
}

modules.updatePermission = async (req, res) => {
  const permission_id = req.params.permission_id;
  const permission = req.body;
  const result = await repository.updatePermission(permission_id, permission);
  return res.status(201).json({"message":"Permission updated"});
}

modules.addRolePermission = async (req, res) => {
  const role_id = req.params.role_id;
  const permissions = req.body;
  for(const permission in permissions) {
    const result = await repository.addRolePermission(role_id, permission);
  }
  return res.status(201).json({"message":""});
}



module.exports = modules;
