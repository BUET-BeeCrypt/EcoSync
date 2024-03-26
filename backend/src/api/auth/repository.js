const pool = require("../../db/pool");

const createUser = async (user) => {
	const query = "INSERT INTO user (user_id, username) VALUES ($1, $2, $3) RETURNING *";
	const result = await pool.query(query, [user.user_id,user.user_name, user.balance]);
	if (result.rows.length === 0) {
		throw {code:404,message: "User not created"};
	}
	return result.rows[0];
}

const getUserById = async (user_id) => {
	const query = "SELECT * FROM user WHERE user_id = $1";
	const result = await pool.query(query, [user_id]);
	if (result.rows.length === 0) {
		throw {code:404,message: "User not found"};
	}
	return result.rows[0];
}

const getUserByUsername = async (username) => {
	const query = `SELECT * FROM "User" WHERE username = $1`;
	const result = await pool.query(query, [username]);
	if (result.rows.length === 0) {
		return null;
	}
	return result.rows[0];
}

const getUserRoles = async (user_id) => {
	const query = `SELECT "name" FROM "User_Role" natural join "Role" WHERE user_id = $1`;
	const result = await pool.query(query, [user_id]);

	if (result.rows.length === 0) {
		return ["unassigned"];
	}

	// return an array of roles
	return result.rows.map((row) => row.name);
}


module.exports = {
	createUser,
	getUserById,
	getUserByUsername,
	getUserRoles,
};