const { get } = require("../../../app");
const pool = require(`../../db/pool`);
const routeRepository = require(`../routing/repository`);

/*
CREATE TABLE public."Landfill"
(
    landfill_id serial NOT NULL,
    name character varying(256) NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (landfill_id),
    FOREIGN KEY (manager_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Landfill_Manager"
(
    landfill_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (landfill_id, user_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (user_id)
        REFERENCES public."User" (user_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);


CREATE TABLE public."Landfill_Entry"
(
    landfill_entry_id serial NOT NULL,
    landfill_id integer NOT NULL,
    manager_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    entry_time integer NOT NULL,
    departure_time integer NOT NULL,
    volume double precision NOT NULL,
    PRIMARY KEY (landfill_entry_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
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

const createLandfill = async (landfill) => {
  const { name, latitude, longitude } = landfill;
  const query = `INSERT INTO public."Landfill" (name, latitude, longitude) VALUES ($1, $2, $3) RETURNING *`;
  const values = [name, latitude, longitude];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getLandfills = async () => {
  const query = `SELECT *,
	(SELECT COUNT(*) FROM public."Landfill_Manager" lm WHERE lm.landfill_id = l.landfill_id) AS managers_count,
	(SELECT COALESCE(SUM(volume),0) FROM public."Landfill_Entry" le WHERE le.landfill_id = l.landfill_id) AS total_volume
    FROM public."Landfill" l`;
  const result = await pool.query(query, []);
  return result.rows;
};

const getLandfill = async (landfill_id) => {
  const query = `SELECT *,
	(SELECT COUNT(*) FROM public."Landfill_Manager" WHERE landfill_id = $1) AS managers_count,
	(SELECT COALESCE(SUM(volume),0) FROM public."Landfill_Entry" WHERE landfill_id = $1) AS total_volume
	FROM public."Landfill" WHERE landfill_id = $1`;
  const result = await pool.query(query, [landfill_id]);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

const existsLandfill = async (landfill_id) => {
  const query = `SELECT 1 FROM public."Landfill" WHERE landfill_id = $1`;
  const result = await pool.query(query, [landfill_id]);
  return result.rows.length > 0;
};

const updateLandfill = async (landfill_id, landfill) => {
  const { name, latitude, longitude } = landfill;
  const query = `UPDATE public."Landfill" SET name = $1, latitude = $2, longitude = $3 WHERE landfill_id = $4 RETURNING *`;
  const values = [name, latitude, longitude, landfill_id];
  const result = await pool.query(query, values);
  if (result.rows.length === 0) return null;
  return result.rows[0];
};

const deleteLandfill = async (landfill_id) => {
  const query = `DELETE FROM public."Landfill" WHERE landfill_id = $1`;
  await pool.query(query, [landfill_id]);
};

const addManagerToLandfill = async (landfill_id, user_id) => {
  const query = `INSERT INTO public."Landfill_Manager" (landfill_id, user_id) VALUES ($1, $2)`;
  const values = [landfill_id, user_id];
  await pool.query(query, values);
};

const getManagersOfLandfill = async (landfill_id) => {
  const query = `SELECT user_id, "name", username, email 
    FROM "User" WHERE user_id IN (SELECT user_id FROM public."Landfill_Manager" WHERE landfill_id = $1)`;
  const result = await pool.query(query, [landfill_id]);
  return result.rows;
};

const isManagerOfLandfill = async (landfill_id, user_id) => {
  const query = `SELECT 1 FROM public."Landfill_Manager" WHERE landfill_id = $1 AND user_id = $2`;
  const result = await pool.query(query, [landfill_id, user_id]);
  return result.rows.length > 0;
};

const removeManagerFromLandfill = async (landfill_id, user_id) => {
  const query = `DELETE FROM public."Landfill_Manager" WHERE landfill_id = $1 AND user_id = $2`;
  const values = [landfill_id, user_id];
  await pool.query(query, values);
};

const addEntryToLandfill = async (
  landfill_id,
  manager_id,
  entry_time,
  vehicle_id,
  weight
) => {
  const sts_id_query = `SELECT sts_id FROM public."Vehicle" WHERE vehicle_id = $1`;
  const sts_id_result = await pool.query(sts_id_query, [vehicle_id]);
  if (sts_id_result.rows.length === 0) return null;
  const sts_id = sts_id_result.rows[0].sts_id;
  const fleet = await routeRepository.getLastFleetOfSTS(sts_id);
  if (fleet === null) return null;
  const fleet_id = fleet.fleet_id;

  const query = `INSERT INTO public."Landfill_Entry" 
  (landfill_id, manager_id, vehicle_id, entry_time, departure_time, volume, fleet_id) 
  VALUES ($1, $2, $3, $4, NULL, $5, $6) RETURNING *`;
  const values = [
    landfill_id,
    manager_id,
    vehicle_id,
    new Date(entry_time),
    weight,
    fleet_id,
  ];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getEntriesOfLandfill = async (landfill_id, page, limit) => {
  page = page - 1;
  const query = `SELECT le.*,
    (SELECT username FROM public."User" WHERE user_id = le.manager_id) as manager_name,
    (SELECT registration FROM public."Vehicle" WHERE vehicle_id = le.vehicle_id) as registration
    FROM public."Landfill_Entry" le WHERE le.landfill_id = $1 ORDER BY entry_time DESC
    LIMIT $2 OFFSET $3`;
  const result = await pool.query(query, [landfill_id, limit, page * limit]);
  return result.rows;
};

const getOnlyEntriesOfLandfill = async (landfill_id) => {
  const query = `SELECT * FROM public."Landfill_Entry" WHERE landfill_id = $1 AND departure_time IS NULL`;
  const { rows } = await pool.query(query, [landfill_id]);
  return rows;
};

const addDepartureToLandfill = async (landfill_entry_id, departure_time) => {
  const query = `UPDATE public."Landfill_Entry" SET departure_time = $1 WHERE landfill_entry_id = $2 AND departure_time IS NULL RETURNING *`;
  const values = [new Date(departure_time), landfill_entry_id];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

const getLandfillIdfromManagerId = async (user_id) => {
  const query = `SELECT landfill_id FROM public."Landfill_Manager" WHERE user_id = $1`;
  const { rows } = await pool.query(query, [user_id]);
  if (rows.length === 0) return null;
  return rows[0].landfill_id;
};

const getVehiclesOfLandfill = async (landfill_id) => {
    const query = `with last_fleets_sts as (
        select vr.sts_id, MAX(f.time_stamp) as "time_stamp" from "Fleet" f natural join "Vehicle_Route" vr 
        where vr.landfill_id = $1 group by (vr.sts_id)
    ), fleet_sts as (
        select f.fleet_id, lfs.sts_id from last_fleets_sts lfs join "Vehicle_Route" vr using (sts_id) join "Fleet" f using (route_id, time_stamp)
    ) select v.*, CAST((
        select COUNT(*) from "Landfill_Entry" le where le.fleet_id = fs.fleet_id and le.vehicle_id = t.vehicle_id
    ) as INTEGER) as done_trip, (t.total_trip - t.remaining_trip) as available_trip, t.fleet_id from fleet_sts fs join "Trip" t using (fleet_id) natural join "Vehicle" v;`;
    const result = await pool.query(query, [landfill_id]);
    return result.rows;
}

const createBill = async (vehicle_id, weight, landfill_id) => {
    //   get capacity of vehicle
    const vehicle_query = `SELECT sts_id, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, capacity FROM public."Vehicle" WHERE vehicle_id = $1`;
    const vehicle_result = await pool.query(vehicle_query, [vehicle_id]);
    const { fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, capacity, sts_id } = vehicle_result.rows[0];

    // get distance from sts to landfill
    const distance_query = `SELECT distance FROM public."Vehicle_Route" WHERE sts_id = $1 AND landfill_id = $2`;
    const distance_result = await pool.query(distance_query, [sts_id, landfill_id]);
    const distance = distance_result.rows[0].distance;

    // calculate cost - round trip
    const cost = (2*fuel_cost_per_km_unloaded + weight / capacity * (fuel_cost_per_km_loaded - fuel_cost_per_km_unloaded)) * distance;

    const insert_query = `INSERT INTO public."Bill" (vehicle_id, landfill_id, sts_id, amount, distance, timestamp) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *`;
    const insert_result = await pool.query(insert_query, [vehicle_id, landfill_id, sts_id, cost, distance]);
    return insert_result.rows[0];
}

const getLandfillBills = async (landfill_id, page, limit) => {
    page = page - 1;
    const query = `SELECT b.*, v.registration, v."type", v.capacity, s."name", s."location", s.zone_no, s.ward_no FROM public."Bill" b JOIN public."Vehicle" v USING (vehicle_id) join "STS" s on (s.sts_id = b.sts_id) WHERE b.landfill_id = $1 ORDER BY timestamp DESC LIMIT $2 OFFSET $3`;
    const result = await pool.query(query, [landfill_id, limit, page * limit]);
    return result.rows;
}

module.exports = {
    createLandfill,
    existsLandfill,
    getLandfills,
    getLandfill,
    updateLandfill,
    deleteLandfill,
    addManagerToLandfill,
    isManagerOfLandfill,
    getManagersOfLandfill,
    removeManagerFromLandfill,
    addEntryToLandfill,
    getEntriesOfLandfill,
    getOnlyEntriesOfLandfill,
    addDepartureToLandfill,
    getLandfillIdfromManagerId,
    getVehiclesOfLandfill,
    createBill,
    getLandfillBills
};
