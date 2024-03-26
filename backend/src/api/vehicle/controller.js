const repository = require("./repository");
const modules = {};

// modules.addUser = async (req, res) => {
//   const user = req.body;
//   const createdUser = await repository.createUser(user);
//   res.status(201).json(createdUser);
// };

modules.createVehicle = async (req, res) => {
  const vehicle = req.body;
  const createdVehicle = await repository.createVehicle(vehicle);
  res.status(201).json(createdVehicle);
}

modules.getVehicles = async (req, res) => {
  const vehicles = await repository.getVehicles();
  res.status(200).json(vehicles);
}

modules.getVehicle = async (req, res) => {
  const vehicle_id = req.params.vehicle_id;
  const vehicle = await repository.getVehicle(vehicle_id);
  res.status(200).json(vehicle);
}

modules.updateVehicle = async (req, res) => {
  const vehicle_id = req.params.vehicle_id;
  const vehicle = req.body;
  const updatedVehicle = await repository.updateVehicle(vehicle_id, vehicle);
  res.status(200).json(updatedVehicle);
}

modules.deleteVehicle = async (req, res) => {
  const vehicle_id = req.params.vehicle_id;
  await repository.deleteVehicle(vehicle_id);
  res.status(200).json({ message: "Vehicle deleted" });
}


module.exports = modules;
