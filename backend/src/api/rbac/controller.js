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
