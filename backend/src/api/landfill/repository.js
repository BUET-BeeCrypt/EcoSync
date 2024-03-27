const pool = require(`../../db/pool`);

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
}

const getLandfills = async () => {
	const query = `SELECT *,
	(SELECT COUNT(*) FROM public."Landfill_Manager" lm WHERE lm.landfill_id = l.landfill_id) AS managers_count,
	(SELECT COALESCE(SUM(volume),0) FROM public."Landfill_Entry" le WHERE le.landfill_id = l.landfill_id) AS total_volume
    FROM public."Landfill" l`;
	const result = await pool.query(query,[]);
	return result.rows;
}

const getLandfill = async (landfill_id) => {
	const query = `SELECT *,
	(SELECT COUNT(*) FROM public."Landfill_Manager" WHERE landfill_id = $1) AS managers_count,
	(SELECT COALESCE(SUM(volume),0) FROM public."Landfill_Entry" WHERE landfill_id = $1) AS total_volume
	FROM public."Landfill" WHERE landfill_id = $1`;
	const result = await pool.query(query,[landfill_id]);
	if( result.rows.length === 0 ) return null;
	return result.rows[0];
}

const updateLandfill = async (landfill_id, landfill) => {
	const { name, latitude, longitude } = landfill;
	const query = `UPDATE public."Landfill" SET name = $1, latitude = $2, longitude = $3 WHERE landfill_id = $4 RETURNING *`;
	const values = [name, latitude, longitude, landfill_id];
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
	const query = `SELECT * FROM "User" WHERE user_id IN (SELECT user_id FROM public."Landfill_Manager" WHERE landfill_id = $1)`;
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