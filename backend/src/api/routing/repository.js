const pool = require(`../../db/pool`);

/*
CREATE TABLE public."Vehicle_Route"
(
    route_id serial NOT NULL,
    landfill_id integer NOT NULL,
    sts_id integer NOT NULL,
    route text NOT NULL,
    PRIMARY KEY (route_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (sts_id)
        REFERENCES public."STS" (sts_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Fleet"
(
    fleet_id serial NOT NULL,
    route_id integer NOT NULL,
    time_stamp timestamp NOT NULL,
    PRIMARY KEY (fleet_id),
    FOREIGN KEY (route_id)
        REFERENCES public."Vehicle_Route" (route_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);

CREATE TABLE public."Trip"
(
    trip_id serial NOT NULL,
    fleet_id integer NOT NULL,
    vehicle_id integer NOT NULL,
    remaining_trip integer NOT NULL,
    total_trip integer NOT NULL,
    PRIMARY KEY (trip_id),
    FOREIGN KEY (vehicle_id)
        REFERENCES public."Vehicle" (vehicle_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    FOREIGN KEY (fleet_id)
        REFERENCES public."Fleet" (fleet_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
*/

const createRoute = async (landfill_id, sts_id, direction, distance, duration) => {
    direction = JSON.stringify(direction).replace(/{/g, '[').replace(/}/g, ']');
    const query = `INSERT INTO public."Vehicle_Route" (landfill_id, sts_id, direction, distance, duration) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    const values = [landfill_id, sts_id, direction, distance, duration];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

const getRoutes = async () => {
    const query = `SELECT * FROM public."Vehicle_Route"`;
    const result = await pool.query(query,[]);
    return result.rows;
}

const getRoutesBySTS = async (sts_id) => {
    const query = `SELECT * FROM public."Vehicle_Route" WHERE sts_id = $1`;
    const result = await pool.query(query,[sts_id]);
    return result.rows;
}

const getRouteByLandfillAndSTS = async (landfill_id, sts_id) => {
    const query = `SELECT * FROM public."Vehicle_Route" WHERE landfill_id = $1 AND sts_id = $2`;
    const result = await pool.query(query,[landfill_id, sts_id]);
    if( result.rows.length === 0 ) return null;
    return result.rows[0];
}

const getLandfills = async () => {
    const query = `SELECT * FROM public."Landfill"`;
    const result = await pool.query(query,[]);
    return result.rows;
}

const getLandfill = async (landfill_id) => {
    const query = `SELECT * FROM public."Landfill" WHERE landfill_id = $1`;
    const result = await pool.query(query,[landfill_id]);
    if( result.rows.length === 0 ) return null;
    return result.rows[0];
}

const getSTSs = async () => {
    const query = `SELECT * FROM public."STS"`;
    const result = await pool.query(query,[]);
    return result.rows;
}

const getSTS = async (sts_id) => {
    const query = `SELECT * FROM public."STS" WHERE sts_id = $1`;
    const result = await pool.query(query,[sts_id]);
    if( result.rows.length === 0 ) return null;
    return result.rows[0];
}

const getVehiclesBySTS = async (sts_id) => {
    const query = `SELECT * FROM public."Vehicle" WHERE sts_id = $1 ORDER BY fuel_cost_per_km_loaded ASC, fuel_cost_per_km_unloaded ASC, capacity DESC`;
    const result = await pool.query(query,[sts_id]);
    return result.rows;
}

const createFleet = async (route_id) => {
    const query = `INSERT INTO public."Fleet" (route_id, time_stamp) VALUES ($1, NOW()) RETURNING *`;
    const values = [route_id];
    const { rows } = await pool.query(query, values);
    return rows[0];
}

const createTrip = async (fleet_id, vehicle_id, total_trip) => {
    const query = `INSERT INTO public."Trip" (fleet_id, vehicle_id, remaining_trip, total_trip) VALUES ($1, $2, $3, $4)`;
    const values = [fleet_id, vehicle_id, total_trip, total_trip];
    await pool.query(query, values);
}

const getRoute = async (sts_id) => {
    const query = `SELECT * FROM public."Vehicle_Route" WHERE sts_id = $1`;
    const result = await pool.query(query, [sts_id]);
    return result.rows;
}

module.exports = {
    createRoute,
    getRoutes,
    getRoute,
    getRoutesBySTS,
    getRouteByLandfillAndSTS,
    getLandfills,
    getLandfill,
    getSTSs,
    getSTS,
    getVehiclesBySTS,
    createFleet,
    createTrip
};