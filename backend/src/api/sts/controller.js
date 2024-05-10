const repository = require("./repository");
const route_service = require("../routing/controller");
const userRepository = require("../user/repository");
const routeRepository = require("../routing/repository");

const modules = {};

modules.createSTS = async (req, res) => {
  const sts = req.body;
  // zono_no,ward_no,name,location,latitude,longitude,capacity,dump_area,coverage_area
  let err_msg = "";
  if (!sts.zone_no) err_msg = "Zone number is required";
  // check number
  if (isNaN(sts.zone_no)) err_msg = "Zone number must be a number";

  if (!sts.ward_no) err_msg = "Ward number is required";
  // check number
  if (isNaN(sts.ward_no)) err_msg = "Ward number must be a number";

  if (!sts.name) err_msg = "Name is required";
  if (!sts.location) err_msg = "Location is required";

  if (!sts.latitude) err_msg = "Latitude is required";
  // check number
  if (isNaN(sts.latitude)) err_msg = "Latitude must be a number";

  if (!sts.longitude) err_msg = "Longitude is required";
  // check number
  if (isNaN(sts.longitude)) err_msg = "Longitude must be a number";

  if (!sts.capacity) err_msg = "Capacity is required";
  // check number
  if (isNaN(sts.capacity)) err_msg = "Capacity must be a number";

  if (!sts.dump_area) err_msg = "Dump area is required";
  // check number
  if (isNaN(sts.dump_area)) err_msg = "Dump area must be a number";

  if (!sts.coverage_area) err_msg = "Coverage area is required";
  // check number
  if (isNaN(sts.coverage_area)) err_msg = "Coverage area must be a number";

  if (err_msg) return res.status(400).json({ message: err_msg });

  try {
    const createdSTS = await repository.createSTS(sts);
    res.status(201).json(createdSTS);
    route_service.createRoutesFromSTS(createdSTS.sts_id);
  } catch (error) {
    if (
      error.message ===
      'duplicate key value violates unique constraint "STS_name_key"'
    )
      return res.status(409).json({ message: `${sts.name} already exists` });
    res.status(500).json({ message: error.message });
  }
};

modules.getSTSs = async (req, res) => {
  // pagination
  const limit = req.query.limit || 500;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;
  try {
    const result = await repository.getSTSs(limit, offset);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

modules.getSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  try {
    const result = await repository.getSTS(sts_id);
    res.status(200).json(result);
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.updateSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const sts = req.body;
  // zono_no,ward_no,name,location,latitude,longitude,capacity,dump_area,coverage_area
  let err_msg = "";
  if (sts.zone_no && isNaN(sts.zone_no))
    err_msg = "Zone number must be a number";
  if (sts.ward_no && isNaN(sts.ward_no))
    err_msg = "Ward number must be a number";
  if (sts.latitude && isNaN(sts.latitude))
    err_msg = "Latitude must be a number";
  if (sts.longitude && isNaN(sts.longitude))
    err_msg = "Longitude must be a number";
  if (sts.capacity && isNaN(sts.capacity))
    err_msg = "Capacity must be a number";
  if (sts.dump_area && isNaN(sts.dump_area))
    err_msg = "Dump area must be a number";
  if (sts.coverage_area && isNaN(sts.coverage_area))
    err_msg = "Coverage area must be a number";

  if (err_msg) return res.status(400).json({ message: err_msg });
  //console.log(sts)
  try {
    const old_sts = await repository.getSTS(sts_id);
    if (!sts.zone_no) sts.zone_no = old_sts.zone_no;
    if (!sts.ward_no) sts.ward_no = old_sts.ward_no;
    if (!sts.name) sts.name = old_sts.name;
    if (!sts.location) sts.location = old_sts.location;
    if (!sts.latitude) sts.latitude = old_sts.latitude;
    if (!sts.longitude) sts.longitude = old_sts.longitude;
    if (!sts.capacity) sts.capacity = old_sts.capacity;
    if (!sts.dump_area) sts.dump_area = old_sts.dump_area;
    if (!sts.coverage_area) sts.coverage_area = old_sts.coverage_area;
    console.log(sts);
    const updatedSTS = await repository.updateSTS(sts_id, sts);
    res.status(200).json(updatedSTS);
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.deleteSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  if (!sts_id) return res.status(400).json({ message: "STS id is required" });
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });
  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });
    await repository.deleteSTS(sts_id);
    res.status(200).json({ message: "STS deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

modules.assignManagerToSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const { user_id } = req.body;

  // check if number
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });
  // check negative
  if (sts_id < 0)
    return res.status(400).json({ message: "STS id cannot be negative" });
  // check user id
  if (!user_id) return res.status(400).json({ message: "User id is required" });

  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });

    const user = await userRepository.getUser(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // check if user has STS_MANAGER role
    if (user.role_name !== "STS_MANAGER")
      return res
        .status(400)
        .json({ message: "User must have STS_MANAGER role" });

    await repository.addManagerToSTS(sts_id, user_id);
    res.status(200).json({ message: "Manager assigned to sts" });
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.getManagersOfSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  // check if number
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });
  // check negative
  if (sts_id < 0)
    return res.status(400).json({ message: "STS id cannot be negative" });

  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });

    const managers = await repository.getManagersOfSTS(sts_id);
    res.status(200).json(managers);
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.removeManagerFromSTS = async (req, res) => {
  const { sts_id, user_id } = req.params;
  // check if number
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });
  // check negative
  if (sts_id < 0)
    return res.status(400).json({ message: "STS id cannot be negative" });
  // check if number
  if (isNaN(user_id))
    return res.status(400).json({ message: "User id must be a number" });
  // check negative
  if (user_id < 0)
    return res.status(400).json({ message: "User id cannot be negative" });

  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });

    const user = await userRepository.getUser(user_id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isManager = await repository.isManagerOfSTS(sts_id, user_id);
    if (!isManager)
      return res
        .status(404)
        .json({ message: "User is not a manager of this sts" });

    await repository.removeManagerFromSTS(sts_id, user_id);
    res.status(200).json({ message: "Manager removed from sts" });
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

// vehicle assignment
modules.assignVehicleToSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  const { vehicle_id } = req.body;

  // check if number
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });
  // check is vehicle id
  if (!vehicle_id)
    return res.status(400).json({ message: "Vehicle id is required" });
  if (isNaN(vehicle_id))
    return res.status(400).json({ message: "Vehicle id must be a number" });

  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });

    const isAssigned = await repository.isAlreadyAssigned(sts_id, vehicle_id);
    if (isAssigned)
      return res
        .status(409)
        .json({ message: "Vehicle is already assigned to sts" });

    await repository.assignVehicleToSTS(sts_id, vehicle_id);
    res.status(200).json({ message: "Vehicle assigned to sts" });
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.removeVehicleFromSTS = async (req, res) => {
  const { sts_id, vehicle_id } = req.params;
  // check if number
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });

  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });

    const isAssigned = await repository.isAlreadyAssigned(sts_id, vehicle_id);
    if (!isAssigned)
      return res
        .status(404)
        .json({ message: "Vehicle is not assigned to sts" });

    await repository.removeVehicleFromSTS(sts_id, vehicle_id);
    res.status(200).json({ message: "Vehicle removed from sts" });
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.getVehiclesOfManager = async (req, res) => {
  const manager_id = req.user.user_id;
  try {
    const sts_id = await repository.getSTSIDfromManagerID(manager_id);
    const fleet_id =
      (await routeRepository.getLastFleetOfSTS(sts_id))?.fleet_id || null;
    const vehicles = await routeRepository.getVehiclesOfFleet(fleet_id);
    res.status(200).json(vehicles);
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.getVehiclesOfSTS = async (req, res) => {
  const sts_id = req.params.sts_id;
  // check if number
  if (isNaN(sts_id))
    return res.status(400).json({ message: "STS id must be a number" });

  try {
    const exists = await repository.existsSTS(sts_id);
    if (!exists) return res.status(404).json({ message: "STS not found" });

    const isManager = await repository.isManagerOfSTS(sts_id, req.user.user_id);
    if (req.user.role_name !== "SYSTEM_ADMIN" && !isManager)
      return res
        .status(403)
        .json({ message: "You are not a manager of this sts" });

    const vehicles = await repository.getVehiclesOfSTS(sts_id);
    res.status(200).json(vehicles);
  } catch (err) {
    if (err.code === 404) return res.status(404).json({ message: err.message });
    res.status(500).json({ message: err.message });
  }
};

modules.addEntryToSTS = async (req, res) => {
  const manager_id = req.user.user_id;
  try{
    const sts_id = await repository.getSTSIDfromManagerID(manager_id);

    if (sts_id === null) {
      return res
        .status(404)
        .json({ message: "Manager is not assigned to any sts" });
    }

    const { entry_time, vehicle_id } = req.body;

    const existsVehicle = await repository.existsVehicleInSTS(sts_id, vehicle_id);
    if (!existsVehicle) return res.status(400).json({ message: "Vehicle not assigned to this sts" });

    const fleet_id =
      (await routeRepository.getLastFleetOfSTS(sts_id))?.fleet_id || null;
    await routeRepository.decreaseRemainingTrip(fleet_id, vehicle_id);
    await repository.addEntryToSTS(sts_id, manager_id, entry_time, vehicle_id);
    res.status(200).json({ message: "Entry added to sts" });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

modules.getEntriesOfSTS = async (req, res) => {
  const sts_id = await repository.getSTSIDfromManagerID(req.user.user_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }

  const page = Number.parseInt(req.query.page) || 1;
  const limit = 50;

  const entries = await repository.getEntriesOfSTS(sts_id, page, limit);
  res.status(200).json(entries);
};

modules.getArrivalEntriesOfSTS = async (req, res) => {
  const sts_id = await repository.getSTSIDfromManagerID(req.user.user_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }

  const entries = await repository.getArrivalEntriesOfSTS(sts_id);
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

  const exists = await repository.existsEntry(sts_entry_id);
  if (!exists) return res.status(404).json({ message: "Entry not found" });

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
  let { entry_time, volume, waste_type, contract_company_id, contract_vehicle } = req.body;
  const manager_id = req.user.user_id;
  waste_type = waste_type || "Domestic";

  if (!contract_company_id) {
    return res.status(400).json({ message: "Contract company id is required" });
  }

  try{
    const sts_id = await repository.getSTSIDfromManagerID(manager_id);

    if (sts_id === null) {
      return res
        .status(404)
        .json({ message: "Manager is not assigned to any sts" });
    }

    if (volume < 0) {
      res.status(400).json({ message: "Volume cannot be negative" });
    }
    await repository.addDumpEntryToSTS(sts_id, manager_id, entry_time, volume, waste_type, contract_company_id, contract_vehicle);
    res.status(200).json({ message: "Dump entry added to sts" });
  }catch(err){
    res.status(500).json({ message: err.message });
  }
};

modules.getContractorsOfSTS = async (req, res) => {
  const sts_id = await repository.getSTSIDfromManagerID(req.user.user_id);

  if (sts_id === null) {
    return res
      .status(404)
      .json({ message: "Manager is not assigned to any sts" });
  }

  const contractors = await repository.getContractorsOfSTS(sts_id);
  res.status(200).json(contractors);
}

modules.getSTSOfManager = async (req, res) => {
  const manager_id = req.user.user_id;
  const sts_id = await repository.getSTSIDfromManagerID(manager_id);
  const sts = await repository.getSTS(sts_id);
  res.status(200).json(sts);
};

module.exports = modules;
