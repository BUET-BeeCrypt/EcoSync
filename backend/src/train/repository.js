const pool = require("../db/pool");
/*
CREATE TABLE IF NOT EXISTS trains (
  train_id INTEGER PRIMARY KEY,
  train_name TEXT NOT NULL,
  capacity INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS train_stops (
  train_id INTEGER,
  station_id INTEGER,
  arrival_time TEXT,
  departure_time TEXT,
  fare INTEGER NOT NULL,
  stopage_order INTEGER NOT NULL,
  FOREIGN KEY (train_id) REFERENCES trains (train_id),
  FOREIGN KEY (station_id) REFERENCES stations (station_id)
);
*/

const createTrain = async (train) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    let query =
      "INSERT INTO trains (train_id, train_name, capacity) VALUES ($1, $2, $3) RETURNING *";
    let result = await client.query(query, [
      train.train_id,
      train.train_name,
      train.capacity,
    ]);
    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      throw { code: 404, message: "Train not created" };
    }
    const savedTrain = result.rows[0];
    let next_stop_id = null;
    for (let i = train.stops.length - 1; i >= 0; i--) {
      const train_stop = train.stops[i];
      let query =
        "INSERT INTO train_stops (train_id, station_id, arrival_time, departure_time, fare, next_stop_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *";
      let result = await client.query(query, [
        train.train_id,
        train_stop.station_id,
        train_stop.arrival_time,
        train_stop.departure_time,
        train_stop.fare,
        next_stop_id,
      ]);
      if (result.rows.length === 0) {
        await client.query("ROLLBACK");
        throw { code: 404, message: "Train stop not created" };
      }
      next_stop_id = result.rows[0].train_stop_id;
      if (train_stop.arrival_time == null) {
        savedTrain.service_start = train_stop.departure_time;
      }
      if (train_stop.departure_time == null) {
        savedTrain.service_ends = train_stop.arrival_time;
      }
    }
    savedTrain.num_stations = train.stops.length;
    await client.query("COMMIT");
    return savedTrain;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getAllStops = async () => {
  const query = "SELECT * FROM train_stops ORDER BY train_stop_id";
  const result = await pool.query(query);
  return result.rows;
};

module.exports = {
  createTrain,
  getAllStops,
};
