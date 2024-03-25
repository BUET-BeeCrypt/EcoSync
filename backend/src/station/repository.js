const pool = require("../db/pool");
/*
CREATE TABLE IF NOT EXISTS stations (
  station_id INTEGER PRIMARY KEY,
  station_name TEXT NOT NULL,
  longitude FLOAT NOT NULL,
  latitude FLOAT NOT NULL
);
*/

const createStation = async (station) => {
    const stationExists = await pool.query("SELECT * FROM stations WHERE station_id = $1", [station.station_id]);
    if (stationExists.rows.length > 0) {
        throw {code:409, message: `Station with id: ${station.station_id} already exists`};
    }

    const query = "INSERT INTO stations (station_id, station_name, longitude, latitude) VALUES ($1, $2, $3, $4) RETURNING *";
    const result = await pool.query(query, [station.station_id, station.station_name, station.longitude, station.latitude]);
    if (result.rows.length === 0) {
        throw {code: 400, message: `Station with id: ${station.station_id} was not created`};
    }
    return result.rows[0];
}

const getAllStations = async () => {
    const query = "SELECT * FROM stations";
    const result = await pool.query(query);
    return result.rows;
}

const getTrainsAtStation = async (station_id) => {
    const stationExists = await pool.query("SELECT * FROM stations WHERE station_id = $1", [station_id]);
    if (stationExists.rows.length === 0) {
        throw {code: 404, message: `station with id: ${station_id} was not found`};
    }

    const query = "SELECT train_id, arrival_time, departure_time FROM train_stops WHERE station_id = $1 ORDER BY departure_time ASC NULLS FIRST, arrival_time ASC NULLS FIRST, train_id ASC";
    const result = await pool.query(query, [station_id]);
    return result.rows;
}

module.exports = {
    createStation,
    getAllStations,
    getTrainsAtStation
};