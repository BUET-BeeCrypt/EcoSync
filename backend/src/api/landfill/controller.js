const repository = require("./repository");
const modules = {};

// modules.addUser = async (req, res) => {
//   const user = req.body;
//   const createdUser = await repository.createUser(user);
//   res.status(201).json(createdUser);
// };

modules.createLandfill = async (req, res) => {
  const landfill = req.body;
  const createdLandfill = await repository.createLandfill(landfill);
  res.status(201).json(createdLandfill);
}

modules.getLandfills = async (req, res) => {
  const landfills = await repository.getLandfills();
  res.status(200).json(landfills);
}

modules.getLandfill = async (req, res) => {
  const landfill_id = req.params.landfill_id;
  const landfill = await repository.getLandfill(landfill_id);
  res.status(200).json(landfill);
}

modules.updateLandfill = async (req, res) => {
  const landfill_id = req.params.landfill_id;
  const landfill = req.body;
  const updatedLandfill = await repository.updateLandfill(landfill_id, landfill);
  res.status(200).json(updatedLandfill);
}

modules.deleteLandfill = async (req, res) => {
  const landfill_id = req.params.landfill_id;
  await repository.deleteLandfill(landfill_id);
  res.status(200).json({ message: "Landfill deleted" });
}

modules.addManagerToLandfill = async (req, res) => {
  const { landfill_id, user_id } = req.params;
  await repository.addManagerToLandfill(landfill_id, user_id);
  res.status(200).json({ message: "Manager added to landfill" });
}

modules.getManagersOfLandfill = async (req, res) => {
  const landfill_id = req.params.landfill_id;
  const managers = await repository.getManagersOfLandfill(landfill_id);
  res.status(200).json(managers);
}

modules.removeManagerFromLandfill = async (req, res) => {
  const { landfill_id, user_id } = req.params;
  await repository.removeManagerFromLandfill(landfill_id, user_id);
  res.status(200).json({ message: "Manager removed from landfill" });
}

module.exports = modules;
