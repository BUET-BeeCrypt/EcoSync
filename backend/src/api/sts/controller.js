const repository = require("./repository");
const route_service = require("../../service/routing/routing");
const modules = {};


modules.createSTS = async (req, res) => {
  const sts = req.body;
  const createdSTS = await repository.createSTS(sts);
  route_service.createRoutesFromSTS(createdSTS.sts_id);
  res.status(201).json(createdSTS);
}

modules.getSTSs = async (req, res) => {
  const stss = await repository.getSTSs();
  res.status(200).json(stss);
}

modules.getSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const sts = await repository.getSTS(sts_id);
  res.status(200).json(sts);
}

modules.updateSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const sts = req.body;
  const updatedSTS = await repository.updateSTS(sts_id, sts);
  res.status(200).json(updatedSTS);
}

modules.deleteSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  await repository.deleteSTS(sts_id);
  res.status(200).json({ message: "STS deleted" });
}

modules.addManagerToSTS = async (req, res) => {
  const {sts_id} = req.params;
  const {user_id} = req.body;
  await repository.addManagerToSTS(sts_id, user_id);
  res.status(200).json({ message: "Manager added to sts" });
}

modules.getManagersOfSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const managers = await repository.getManagersOfSTS(sts_id);
  res.status(200).json(managers);
}

modules.removeManagerFromSTS = async (req, res) => {
  const { sts_id, user_id } = req.params;
  await repository.removeManagerFromSTS(sts_id, user_id);
  res.status(200).json({ message: "Manager removed from sts" });
}

module.exports = modules;
