const repository = require("./repository");
const modules = {};

modules.addUser = async (req, res) => {
  const user = req.body;
  const createdUser = await repository.createUser(user);
  res.status(201).json(createdUser);
};


module.exports = modules;
