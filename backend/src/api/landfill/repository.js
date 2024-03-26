const pool = require(`../../db/pool`);

/*
CREATE TABLE public."Landfill"
(
    landfill_id serial NOT NULL,
    name character varying(256) NOT NULL,
    start_time integer NOT NULL,
    end_time integer NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (landfill_id)
);
*/
/*
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
*/

const createLandfill = async (landfill) => {
	const { name, start_time, end_time, latitude, longitude } = landfill;
	const query = `INSERT INTO public."Landfill" (name, start_time, end_time, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
	const values = [name, start_time, end_time, latitude, longitude];
	const { rows } = await pool.query(query, values);
	return rows[0];
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

const updateLandfill = async (landfill_id, landfill) => {
	const { name, start_time, end_time, latitude, longitude } = landfill;
	const query = `UPDATE public."Landfill" SET name = $1, start_time = $2, end_time = $3, latitude = $4, longitude = $5 WHERE landfill_id = $6 RETURNING *`;
	const values = [name, start_time, end_time, latitude, longitude, landfill_id];
	const result = await pool.query(query, values);
	if( result.rows.length === 0 ) return null;
	return result.rows[0];
}

const deleteLandfill = async (landfill_id) => {
	const query = `DELETE FROM public."Landfill" WHERE landfill_id = $1`;
	await pool.query(query,[landfill_id]);
}

const addManagerToLandfill = async (landfill_id, user_id) => {
	const query = `INSERT INTO public."Landfill_Manager" (landfill_id, user_id) VALUES ($1, $2)`;
	const values = [landfill_id, user_id];
	await pool.query(query, values);
}

const getManagersOfLandfill = async (landfill_id) => {
	const query = `SELECT * FROM public."Landfill_Manager" WHERE landfill_id = $1`;
	const result = await pool.query(query,[landfill_id]);
	return result.rows;
}

const removeManagerFromLandfill = async (landfill_id, user_id) => {
	const query = `DELETE FROM public."Landfill_Manager" WHERE landfill_id = $1 AND user_id = $2`;
	const values = [landfill_id, user_id];
	await pool.query(query, values);
}


module.exports = {
   createLandfill,
   getLandfills,
   getLandfill,
   updateLandfill,
   deleteLandfill,
   addManagerToLandfill,
   getManagersOfLandfill,
   removeManagerFromLandfill
};