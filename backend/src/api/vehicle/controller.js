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
  try{
    const newVehicle = req.body;
    const oldVehicle = await repository.getVehicle(vehicle_id);

    if(!newVehicle.registration) newVehicle.registration = oldVehicle.registration;
    if(!newVehicle.type) newVehicle.type = oldVehicle.type;
    if(!newVehicle.capacity) newVehicle.capacity = oldVehicle.capacity;
    if(!newVehicle.disabled) newVehicle.disabled = oldVehicle.disabled;
    if(!newVehicle.fuel_cost_per_km_loaded) newVehicle.fuel_cost_per_km_loaded = oldVehicle.fuel_cost_per_km_loaded;
    if(!newVehicle.fuel_cost_per_km_unloaded) newVehicle.fuel_cost_per_km_unloaded = oldVehicle.fuel_cost_per_km_unloaded;
    if(!newVehicle.sts_id) newVehicle.sts_id = oldVehicle.sts_id;

    const updatedVehicle = await repository.updateVehicle(vehicle_id, newVehicle);
    res.status(200).json({
      message: "Vehicle updated",
      vehicle: updatedVehicle
    })
  }catch(err){
    res.status(500).json({message: err.message});
  }
  
}

modules.deleteVehicle = async (req, res) => {
  const vehicle_id = req.params.vehicle_id;
  await repository.deleteVehicle(vehicle_id);
  res.status(200).json({ message: "Vehicle deleted" });
}


module.exports = modules;
