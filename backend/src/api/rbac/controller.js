const repository = require("./repository");
const modules = {};

// modules.addUser = async (req, res) => {
//   const user = req.body;
//   const createdUser = await repository.createUser(user);
//   res.status(201).json(createdUser);
// };


modules.addRole = async (req, res) => {
  const role_name = req.body.role_name;
  const role_description = req.body.description;
  if (!role_name) {
    return res.status(400).json({"message":"Role name is required"});
  }
  if (!role_description) {
    return res.status(400).json({"message":"Role description is required"});
  }
  console.log(role_name)
  try{
    const result = await repository.createRole(role_name, role_description);
    return res.status(201).json({"message":"Role created"});
  }catch(err){
    //console.log(err.code);
    if(err.code === '23505'){
      return res.status(409).json({"message":"Role already exists"});
    }
    return res.status(500).json({"message":"Internal server error"});
  }
}

modules.updateRole = async (req, res) => {
  const old_role_name = req.params.role_name;
  if(!old_role_name){
    return res.status(400).json({"message":"Role name is required"});
  }
  const new_role_name = req.body.role_name;
  const role_desc = req.body.description;

  if(!role_desc){
    return res.status(400).json({"message":"Role description is required"});
  }

  try{
    // check if role exists
    const roleExists = await repository.existsRole(old_role_name);
    if(!roleExists){
      return res.status(404).json({"message":"Role not found"});
    }

    if (!new_role_name || old_role_name === new_role_name) {
      const result = await repository.updateRoleDescription(old_role_name, role_desc);
      return res.status(200).json({"message":"Role description updated"});
    }
    const result = await repository.updateRole(old_role_name, new_role_name, role_desc);
    return res.status(200).json({"message":"Role updated"});
  }catch(err){
    console.log(err);
    if(err.code === '23505'){
      return res.status(409).json({"message":"Role already exists"});
    }
    return res.status(500).json({"message":"Internal server error"});
  }
  
}

modules.deleteRole = async (req, res) => {
  const role_name = req.params.role_name;
  if(!role_name){
    return res.status(400).json({"message":"Role name is required"});
  }
  try{
    const roleExists = await repository.existsRole(role_name);
    if(!roleExists){
      return res.status(404).json({"message":"Role not found"});
    }
    const result = await repository.deleteRole(role_name);
    return res.status(200).json({"message":"Role deleted"});
  }catch(err){
    return res.status(500).json({"message":"Internal server error"});
  }
}

modules.addPermission = async (req, res) => {
  const permission_name = req.body.permission_name;
  const permission_description = req.body.description;
  if (!permission_name) {
    return res.status(400).json({ "message": "Permission name is required" });
  }
  if (!permission_description) {
    return res.status(400).json({ "message": "Permission description is required" });
  }
  try {
    const exists = await repository.existsPermission(permission_name);
    if (exists) {
      return res.status(409).json({ "message": "Permission already exists" });
    }
    const result = await repository.createPermission(permission_name, permission_description);
    return res.status(201).json({ "message": "Permission created" });
  } catch (err) {
    return res.status(500).json({ "message": "Internal server error" });
  }
}

modules.updatePermission = async (req, res) => {
  const permission_name = req.params.permission_name;
  try{
    const exists = await repository.existsPermission(permission_name);
    if (!exists) {
      return res.status(404).json({ "message": "Permission not found" });
    }
    const oldPermission = await repository.getPermission(permission_name);
    const newPermission = req.body.permission_name;
    const permission_description = req.body.description;
    if (!newPermission) newPermission = oldPermission.name;
    if (!permission_description) permission_description = oldPermission.details;
    const result = await repository.updatePermission(permission_name, newPermission, permission_description);
    return res.status(200).json({ "message": "Permission updated" });
  }catch(err){  
    return res.status(500).json({ "message": err.message });
  }
}

modules.deletePermission = async (req, res) => {
  const permission_name = req.params.permission_name;
  if (!permission_name) {
    return res.status(400).json({ "message": "Permission name is required" });
  }
  try {
    const exists = await repository.existsPermission(permission_name);
    if (!exists) {
      return res.status(404).json({ "message": "Permission not found" });
    }
    const result = await repository.deletePermission(permission_name);
    return res.status(200).json({ "message": "Permission deleted" });
  } catch (err) {
    return res.status(500).json({ "message": "Internal server error" });
  }
}

modules.assignPermission = async (req, res) => {
  const role_name = req.params.role_name;
  const permission_name = req.body.permission_name;
  if (!role_name) {
    return res.status(400).json({ "message": "Role name is required" });
  }
  if (!permission_name) {
    return res.status(400).json({ "message": "Permission name is required" });
  }

  try {
    const roleExists = await repository.existsRole(role_name);
    if (!roleExists) {
      return res.status(404).json({ "message": "Role not found" });
    }
    const permissionExists = await repository.existsPermission(permission_name);
    if (!permissionExists) {
      return res.status(404).json({ "message": "Permission not found" });
    }
    const result = await repository.assignPermission(role_name, permission_name);
    return res.status(201).json(
      {
        "message": "Permission assigned to role",
        "data": result
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ "message": "Internal server error" });
  }
}

modules.revokePermission = async (req, res) => {
  const role_name = req.params.role_name;
  const permission_name = req.params.permission_name;
  if (!role_name) {
    return res.status(400).json({ "message": "Role name is required" });
  }
  if (!permission_name) {
    return res.status(400).json({ "message": "Permission name is required" });
  }

  try {
    const roleExists = await repository.existsRole(role_name);
    if (!roleExists) {
      return res.status(404).json({ "message": "Role not found" });
    }
    const permissionExists = await repository.existsPermission(permission_name);
    if (!permissionExists) {
      return res.status(404).json({ "message": "Permission not found" });
    }
    const result = await repository.revokePermission(role_name, permission_name);
    return res.status(200).json({ "message": "Permission revoked from role" });
  } catch (err) {
    return res.status(500).json({ "message": "Internal server error" });
  }
}

modules.getPermissions = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  try {
    const permissions = await repository.getPermissions(limit, offset);
    return res.status(200).json(permissions);
  } catch (err) {
    return res.status(500).json({ "message": "Internal server error" });
  }
}

modules.getRolePermissions = async (req, res) => {
  const role_name = req.params.role_name;
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  try {
    const roleExists = await repository.existsRole(role_name);
    if (!roleExists) {
      return res.status(404).json({ "message": "Role not found" });
    }
    const permissions = await repository.getRolePermissions(role_name, limit, offset);
    return res.status(200).json(permissions);
  } catch (err) {
    return res.status(500).json({ "message": "Internal server error" });
  }
}



module.exports = modules;
