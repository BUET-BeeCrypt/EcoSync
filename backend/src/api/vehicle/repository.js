const pool = require(`../../db/pool`);

/*
CREATE TABLE public."Vehicle"
(
    vehicle_id serial NOT NULL,
    registration character varying(256) UNIQUE NOT NULL,
    type character varying(256) NOT NULL,
    capacity double precision NOT NULL,
    disabled boolean DEFAULT false,
    fuel_cost_per_km_loaded double precision NOT NULL,
    fuel_cost_per_km_unloaded double precision NOT NULL,
    landfill_id integer,
    PRIMARY KEY (vehicle_id),
    FOREIGN KEY (landfill_id)
        REFERENCES public."Landfill" (landfill_id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
);
*/

const createVehicle = async (vehicle) => {
	const { registration, type, capacity, disabled, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, landfill_id } = vehicle;
	const query = `INSERT INTO public."Vehicle" (registration, type, capacity, disabled, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, landfill_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
	const values = [registration, type, capacity, disabled, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, landfill_id];
	const { rows } = await pool.query(query, values);
	return rows[0];
}

const getVehicles = async () => {
	const query = `SELECT * FROM public."Vehicle"`;
	const result = await pool.query(query,[]);
	return result.rows;
}

const getVehicle = async (vehicle_id) => {
	const query = `SELECT * FROM public."Vehicle" WHERE vehicle_id = $1`;
	const result = await pool.query(query,[vehicle_id]);
	if( result.rows.length === 0 ) return null;
	return result.rows[0];
}

const updateVehicle = async (vehicle_id, vehicle) => {
	const { registration, type, capacity, disabled, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, landfill_id } = vehicle;
	const query = `UPDATE public."Vehicle" SET registration = $1, type = $2, capacity = $3, disabled = $4, fuel_cost_per_km_loaded = $5, fuel_cost_per_km_unloaded = $6, landfill_id = $7 WHERE vehicle_id = $8 RETURNING *`;
	const values = [registration, type, capacity, disabled, fuel_cost_per_km_loaded, fuel_cost_per_km_unloaded, landfill_id, vehicle_id];
	const result = await pool.query(query, values);
	if( result.rows.length === 0 ) return null;
	return result.rows[0];
}

const deleteVehicle = async (vehicle_id) => {
	const query = `DELETE FROM public."Vehicle" WHERE vehicle_id = $1`;
	await pool.query(query,[vehicle_id]);
}

module.exports = {
   createVehicle,
   getVehicles,
   getVehicle,
   updateVehicle,
   deleteVehicle
};