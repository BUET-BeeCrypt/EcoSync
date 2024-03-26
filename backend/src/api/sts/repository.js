const pool = require(`../../db/pool`);

/*
CREATE TABLE public."STS"
(
    sts_id serial NOT NULL,
    ward_id integer NOT NULL,
    capacity double precision NOT NULL,
    amount double precision NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    PRIMARY KEY (sts_id)
);
*/
/*
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
*/

const createSTS = async (sts) => {
	const { ward_id, capacity, amount, latitude, longitude } = sts;
	const query = `INSERT INTO public."STS" (ward_id, capacity, amount, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
	const values = [ward_id, capacity, amount, latitude, longitude];
	const { rows } = await pool.query(query, values);
	return rows[0];
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

const updateSTS = async (sts_id, sts) => {
	const { ward_id, capacity, amount, latitude, longitude } = sts;
	const query = `UPDATE public."STS" SET ward_id = $1, capacity = $2, amount = $3, latitude = $4, longitude = $5 WHERE sts_id = $6 RETURNING *`;
	const values = [ward_id, capacity, amount, latitude, longitude, sts_id];
	const result = await pool.query(query, values);
	if( result.rows.length === 0 ) return null;
	return result.rows[0];
}

const deleteSTS = async (sts_id) => {
	const query = `DELETE FROM public."STS" WHERE sts_id = $1`;
	await pool.query(query,[sts_id]);
}

const addManagerToSTS = async (sts_id, user_id) => {
	const query = `INSERT INTO public."STS_Manager" (sts_id, user_id) VALUES ($1, $2)`;
	const values = [sts_id, user_id];
	await pool.query(query, values);
}

const getManagersOfSTS = async (sts_id) => {
	const query = `SELECT * FROM public."STS_Manager" WHERE sts_id = $1`;
	const result = await pool.query(query,[sts_id]);
	return result.rows;
}

const removeManagerFromSTS = async (sts_id, user_id) => {
	const query = `DELETE FROM public."STS_Manager" WHERE sts_id = $1 AND user_id = $2`;
	const values = [sts_id, user_id];
	await pool.query(query, values);
}

module.exports = {
   createSTS,
   getSTSs,
   getSTS,
   updateSTS,
   deleteSTS,
   addManagerToSTS,
   getManagersOfSTS,
   removeManagerFromSTS
};