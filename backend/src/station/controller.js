const repository = require('./repository');
const modules = {};

modules.addStation = async (req, res) => {
    const station = req.body;
    const createdStation = await repository.createStation(station);
    res.status(201).json(createdStation);
}

modules.getAllStations = async (req, res) => {
    const stations = await repository.getAllStations();
    res.status(200).json({stations: stations});
}

modules.getTrainsAtStation = async (req, res) => {
    const stationId = req.params.station_id;
    try {
        const station_id = parseInt(stationId);
        const trains = await repository.getTrainsAtStation(station_id);
        res.status(200).json({station_id, trains: trains});
    } catch (error) {
        if (error instanceof TypeError) {
            res.status(400).json({message: "invalid station_id: " + stationId});
        }
        const {code, message} = error;
        res.status(code).json({message});
    }
}

module.exports = modules;