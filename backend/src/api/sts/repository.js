const { get } = require("../../../app");
const pool = require(`../../db/pool`);

const modules = {};

/*
CREATE TABLE public."STS"
(
    sts_id serial NOT NULL,
    ward_no integer NOT NULL,
    capacity double precision NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (sts_id)
);


CREATE TABLE public."STS_Manager"
(
    sts_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (sts_id, user_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."STS_Entry"
(
    sts_entry_id serial NOT
    sts_id integer NOT NULL,
    manager_id integer NOT NULL,
    entry_time integer NOT NULL,
    departure_time integer,
    vehicle_id integer,
    volume double precision NOT NULL,
    PRIMARY KEY (sts_entry_id),
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
*/

modules.createSTS = async (sts) => {
  const {
    zone_no,
    ward_no,
    name,
    location,
    latitude,
    longitude,
    capacity,
    dump_area,
    coverage_area,
  } = sts;
  const query = `INSERT INTO public."STS" (zone_no,ward_no,name,location,latitude,longitude,capacity,dump_area,coverage_area) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`;
  const values = [
    zone_no,
    ward_no,
    name,
    location,
    latitude,
    longitude,
    capacity,
    dump_area,
    coverage_area,
  ];
  const result = await pool.query(query, values);
  return result.rows[0];
};

modules.existsSTS = async (sts_id) => {
  const query = `SELECT 1 FROM public."STS" WHERE sts_id = $1`;
  const result = await pool.query(query, [sts_id]);
  return result.rows.length > 0;
};

modules.getSTSs = async (limit, offset) => {
  const query = `SELECT *,
	(SELECT COUNT(*) FROM public."STS_Manager" sm WHERE sm.sts_id = s.sts_id) as manager_count,
	(SELECT COALESCE(SUM(volume),0) FROM public."STS_Entry" se WHERE se.sts_id = s.sts_id) as amount
	FROM public."STS" s
  LIMIT $1 OFFSET $2`;
  const result = await pool.query(query, [limit, offset]);
  return result.rows;
};

modules.getSTS = async (sts_id) => {
  // json_agg(json_build_object('user_id', user_id, 'username', username, 'email', email, 'role', role)) FROM public."User" WHERE user_id IN (SELECT user_id FROM public."STS_Manager" WHERE sts_id = $1)
  const query = `SELECT * ,
	(SELECT COUNT(*) FROM public."STS_Manager" WHERE sts_id = $1) as manager_count,
	(SELECT COALESCE(SUM(volume),0) FROM public."STS_Entry" WHERE sts_id = $1) as amount
	FROM public."STS" WHERE sts_id = $1`;
  const result = await pool.query(query, [sts_id]);
  if (result.rows.length === 0) {
    throw { code: 404, message: "STS not found" };
  }
  return result.rows[0];
};

modules.updateSTS = async (sts_id, sts) => {
  const {
    zone_no,
    ward_no,
    name,
    location,
    latitude,
    longitude,
    capacity,
    dump_area,
    coverage_area,
  } = sts;
  const query = `UPDATE public."STS" SET zone_no = $1, ward_no = $2, name = $3, location = $4, latitude = $5, longitude = $6, capacity = $7, dump_area = $8, coverage_area = $9 WHERE sts_id = $10 RETURNING *`;
  const values = [
    zone_no,
    ward_no,
    name,
    location,
    latitude,
    longitude,
    capacity,
    dump_area,
    coverage_area,
    sts_id,
  ];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) {
    throw { code: 404, message: "STS not found" };
  }
  return result.rows[0];
};

modules.deleteSTS = async (sts_id) => {
  const query = `DELETE FROM public."STS" WHERE sts_id = $1`;
  await pool.query(query, [sts_id]);
};

modules.addManagerToSTS = async (sts_id, user_id) => {
  const query = `INSERT INTO public."STS_Manager" (sts_id, user_id) VALUES ($1, $2) RETURNING *`;
  const values = [sts_id, user_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

modules.getManagersOfSTS = async (sts_id) => {
  const query = `SELECT user_id, "name", username, email
  FROM public."User" WHERE user_id IN (SELECT user_id FROM public."STS_Manager" WHERE sts_id = $1)`;
  const result = await pool.query(query, [sts_id]);
  return result.rows;
};

modules.isManagerOfSTS = async (sts_id, user_id) => {
  const query = `SELECT 1 FROM public."STS_Manager" WHERE sts_id = $1 AND user_id = $2`;
  const result = await pool.query(query, [sts_id, user_id]);
  return result.rows.length > 0;
};

modules.removeManagerFromSTS = async (sts_id, user_id) => {
  const query = `DELETE FROM public."STS_Manager" WHERE sts_id = $1 AND user_id = $2`;
  const values = [sts_id, user_id];
  await pool.query(query, values);
};
// =====================
/// vechile assignment
// =====================
modules.isAlreadyAssigned = async (sts_id, vehicle_id) => {
  const query = `SELECT 1 FROM public."Vehicle" WHERE sts_id = $1 AND vehicle_id = $2`;
  const result = await pool.query(query, [sts_id, vehicle_id]);
  return result.rows.length > 0;
};

modules.assignVehicleToSTS = async (sts_id, vehicle_id) => {
  const query = `UPDATE public."Vehicle" SET sts_id = $1 WHERE vehicle_id = $2`;
  const values = [sts_id, vehicle_id];
  const result = await pool.query(query, values);
  if (result.rowCount === 0) {
    throw { code: 404, message: "Vehicle not found" };
  }
  return;
};

modules.getVehiclesOfSTS = async (sts_id) => {
  const query = `SELECT * FROM public."Vehicle" WHERE sts_id = $1 and disabled = false`;
  const result = await pool.query(query, [sts_id]);
  return result.rows;
};

modules.removeVehicleFromSTS = async (sts_id, vehicle_id) => {
  const query = `UPDATE public."Vehicle" SET sts_id = NULL WHERE vehicle_id = $1 AND sts_id = $2`;
  const values = [vehicle_id, sts_id];
  await pool.query(query, values);
};

// =====================
// STS Entry and Departure
// =====================
modules.addEntryToSTS = async (sts_id, manager_id, entry_time, vehicle_id) => {
  const query = `INSERT INTO public."STS_Entry" (sts_id, manager_id, entry_time, vehicle_id, volume) VALUES ($1, $2, $3, $4, 0)`;
  const values = [sts_id, manager_id, new Date(entry_time), vehicle_id];
  await pool.query(query, values);
};

modules.getArrivalEntriesOfSTS = async (sts_id) => {
  const query = `SELECT * FROM public."STS_Entry" WHERE sts_id = $1 AND departure_time IS NULL AND vehicle_id IS NOT NULL ORDER BY entry_time DESC`;
  const result = await pool.query(query, [sts_id]);
  return result.rows;
};

modules.getEntriesOfSTS = async (sts_id, page, limit) => {
  page = page - 1;
  const query = `SELECT se.*,
  (SELECT username FROM public."User" WHERE user_id = se.manager_id) as manager_name,
  (SELECT registration FROM public."Vehicle" WHERE vehicle_id = se.vehicle_id) as registration
  FROM public."STS_Entry" se WHERE se.sts_id = $1 ORDER BY entry_time DESC
    LIMIT $2 OFFSET $3`;
  const result = await pool.query(query, [sts_id, limit, page * limit]);
  return result.rows;
};

modules.addDepartureToSTS = async (
  sts_entry_id,
  sts_id,
  manager_id,
  departure_time,
  volume
) => {
  const query = `UPDATE public."STS_Entry" SET departure_time = $1, volume = $2, manager_id = $3 WHERE sts_entry_id = $4 AND sts_id = $5 AND departure_time IS NULL`;
  const values = [
    new Date(departure_time),
    -volume,
    manager_id,
    sts_entry_id,
    sts_id,
  ];
  await pool.query(query, values);
};

modules.addDumpEntryToSTS = async (sts_id, manager_id, entry_time, volume) => {
  const query = `INSERT INTO public."STS_Entry" (sts_id, manager_id, entry_time, volume) VALUES ($1, $2, $3, $4)`;
  const values = [sts_id, manager_id, new Date(entry_time), volume];
  await pool.query(query, values);
};

modules.getSTSIDfromManagerID = async (manager_id) => {
  const query = `SELECT sts_id FROM public."STS_Manager" WHERE user_id = $1`;
  const result = await pool.query(query, [manager_id]);
  if (result.rows.length === 0) return null;
  return result.rows[0].sts_id;
};

module.exports = modules;
