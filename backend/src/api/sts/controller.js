const repository = require("./repository");
const modules = {};

// modules.addUser = async (req, res) => {
//   const user = req.body;
//   const createdUser = await repository.createUser(user);
//   res.status(201).json(createdUser);
// };

modules.createSTS = async (req, res) => {
  const sts = req.body;
  const createdSTS = await repository.createSTS(sts);
  res.status(201).json(createdSTS);
};

modules.getSTSs = async (req, res) => {
  const stss = await repository.getSTSs();
  res.status(200).json(stss);
};

modules.getSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const sts = await repository.getSTS(sts_id);
  res.status(200).json(sts);
};

modules.updateSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const sts = req.body;
  const updatedSTS = await repository.updateSTS(sts_id, sts);
  res.status(200).json(updatedSTS);
};

modules.deleteSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  await repository.deleteSTS(sts_id);
  res.status(200).json({ message: "STS deleted" });
};

modules.addManagerToSTS = async (req, res) => {
  const { sts_id } = req.params;
  const { user_id } = req.body;
  await repository.addManagerToSTS(sts_id, user_id);
  res.status(200).json({ message: "Manager added to sts" });
};

modules.getManagersOfSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const managers = await repository.getManagersOfSTS(sts_id);
  res.status(200).json(managers);
};

modules.removeManagerFromSTS = async (req, res) => {
  const { sts_id, user_id } = req.params;
  await repository.removeManagerFromSTS(sts_id, user_id);
  res.status(200).json({ message: "Manager removed from sts" });
};

modules.addEntryToSTS = async (req, res) => {
  const manager_id = req.user.user_id;
  const sts_id = await repository.getSTSIDfromManagerID(manager_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }
  const { entry_time, vehicle_id } = req.body;
  await repository.addEntryToSTS(sts_id, manager_id, entry_time, vehicle_id);
  res.status(200).json({ message: "Entry added to sts" });
};

modules.getEntriesOfSTS = async (req, res) => {
  const sts_id = await repository.getSTSIDfromManagerID(req.user.user_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }

  const entries = await repository.getEntriesOfSTS(sts_id);
  res.status(200).json(entries);
};

modules.getOnlyEntriesOfSTS = async (req, res) => {
  const sts_id = await repository.getSTSIDfromManagerID(req.user.user_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }

  const entries = await repository.getOnlyEntriesOfSTS(sts_id);
  res.status(200).json(entries);
};

modules.addDepartureToSTS = async (req, res) => {
  const { sts_entry_id } = req.params;
  const { departure_time, volume } = req.body;

  const manager_id = req.user.user_id;
  const sts_id = await repository.getSTSIDfromManagerID(manager_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }

  if (volume < 0) {
    res.status(400).json({ message: "Volume cannot be negative" });
  }
  await repository.addDepartureToSTS(
    sts_entry_id,
    sts_id,
    manager_id,
    departure_time,
    volume
  );
  res.status(200).json({ message: "Departure added to sts" });
};

modules.addDumpEntryToSTS = async (req, res) => {
  const { entry_time, volume } = req.body;
  const manager_id = req.user.user_id;
  const sts_id = await repository.getSTSIDfromManagerID(manager_id);

  if (volume < 0) {
    res.status(400).json({ message: "Volume cannot be negative" });
  }
  await repository.addDumpEntryToSTS(sts_id, manager_id, entry_time, volume);
  res.status(200).json({ message: "Dump entry added to sts" });
};

modules.getVehiclesOfSTS = async (req, res) => {
  const manager_id = req.user.user_id;
  const sts_id = await repository.getSTSIDfromManagerID(manager_id);
  const vehicles = await repository.getVehiclesOfSTS(sts_id);
  res.status(200).json(vehicles);
};

module.exports = modules;
