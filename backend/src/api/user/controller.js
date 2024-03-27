const repository = require("./repository");
const bcyrpt = require("bcrypt");
const { sendMail } = require("../../utils/helpers/send-email");
const modules = {};

modules.addUser = async (req, res) => {
  const user =  {...req.body};
  err_msg = "";
  if( !user.username) err_msg = "Username is required";
  if( !user.email) err_msg = "Email is required";
  if( !user.password) err_msg = "Password is required";
  if( !user.name) err_msg = "Name is required";
  if( err_msg !== "") return res.status(400).json({message: err_msg});

  // check password length is greater than 6
  if( user.password.length < 6){
    return res.status(400).json({message: "Password must be at least 6 characters"});
  }

  user.password = await bcyrpt.hash(user.password, 10);
  const existingUserByEmail = await repository.getUserByEmail(user.email);

  if( existingUserByEmail ){
    return res.status(409).json({message: `User with email ${user.email} already exists`});
  }

  const existingUserByUsername = await repository.getUserByUsername(user.username);
  if( existingUserByUsername ){
    return res.status(409).json({message: `User with username ${user.username} already exists`});
  }


  const createdUser = await repository.createUser(user);
  if( req.body.send_email && req.body.send_email === true)
    sendMail(user.email, "Welcome to our platform", 
        `Hello ${user.name},\n\nWelcome to EcoSync. You can log in to your account using the following credentials:\n\nEmail: ${user.email}\nPassword: ${req.body.password}\n\nThank you for joining us`);
  res.status(201).json(createdUser);
}


modules.getAllUsers = async (req, res) => {
  const users = await repository.getUsers();
  res.status(200).json(users);
};

modules.getUser = async (req, res) => {
  const user_id = req.params.user_id;
  // check is user id is an integer
  if( isNaN(user_id) ){
    return res.status(400).json({message: "Invalid user id! User id must be an integer!"});
  }
  try{
    const user = await repository.getUser(user_id);
    res.status(200).json(user);
  }catch(err){
    console.log(err)
    if(err.code !== 404){
      return res.status(500).json({message: "Internal server error!"});
    }else{
      return res.status(404).json({message: err.message});
    }
  }
}



modules.deleteUser = async(req, res) => {
  const user_id = req.params.user_id;
  if( req.user.user_id+"" === user_id ){
    return res.status(401).json({message: `Cannot delete yourself`});
  }
  try{
    await repository.deleteUser(user_id);
    res.status(200).json({"message":"Deleted successfully"});
  }catch(err){
    if(err.code !== 404){
      return res.status(500).json({message: err.message});
    }else{
      return res.status(404).json({message: err.message});
    }
  }
  
}

modules.updateUser = async (req, res) => {
  const user_id = req.params.user_id;

  if (isNaN(user_id)) {
    return res.status(400).json({message: "Invalid user id! User id must be an integer!"});
  }

  const username = req.body.username;
  const email = req.body.email;
  const name = req.body.name;
  const banned = req.body.banned;
  const active = req.body.active;

  // restricted to own details or System Admin access
  if( req.user.role !== "SYSTEM_ADMIN" && req.user.user_id+"" !== user_id ){
    return res.status(403).json({message: `Only system admin can update other users`});
  }
  try{
    const updatedUser = await repository.updateUser(user_id, username, email, name, banned, active);
    res.status(200).json(updatedUser);
  }catch(err){
    if(err.code !== 404){
      return res.status(500).json({message: err.message});
    }else{
      return res.status(404).json({message: err.message});
    }
  }
}

modules.getAllRoles = async (req, res) => {
  const roles = await repository.getRoles().catch(err => {
    return res.status(500).json({message: "Internal server error"});
  });
  return res.status(200).json(roles);
}

modules.updateUserRole = async (req, res) => {
  const user_id = req.params.user_id;
  const role_name = req.body.role_name;
  if (!role_name) return res.status(400).json({message: "Role name is required"});
  try{
    const result = await repository.updateUserRole(user_id, role_name)
    return res.status(200).json({"message":`User role updated to ${role_name}`});
  }catch(err){
    //console.log(err);
    const err_msg = err.message || "Internal server error";
    if (err_msg.includes("violates foreign key constraint")) {
      return res.status(400).json({message: "Role does not exist"});
    }
    return res.status(500).json({message: err_msg});
  }
}

modules.getProfile = async (req, res) => {
  const user = req.user;
  const userProfile = await repository.getUser(user.user_id);
  return res.status(201).json(userProfile);
}

modules.updateProfile = async (req, res) => {
  const user = req.user;
  const userProfile = req.body.profile;
  await repository.updateUser(user.user_id, userProfile);
}


module.exports = modules;
