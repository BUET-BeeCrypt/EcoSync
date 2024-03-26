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
	const query = `SELECT * FROM "User" WHERE user_id = $1`;
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

// const getUserRole = async (user_id) => {
// 	const query = `SELECT "name" FROM "User_Role" natural join "Role" WHERE user_id = $1`;
// 	const result = await pool.query(query, [user_id]);

// 	if (result.rows.length === 0) {
// 		return ["unassigned"];
// 	}

// 	// return an array of roles
// 	return result.rows[0].name;
// }

const updatePassword = async (user_id, password) => {
	const query = `UPDATE "User" SET password = $1 WHERE user_id = $2`;
	const result = await pool.query(query, [password, user_id]);
}

const updateActive = async (user_id, active) => {
	const query = `UPDATE "User" SET active = $1 WHERE user_id = $2`;
	const result = await pool.query(query, [active, user_id]);
}

module.exports = {
	createUser,
	getUserById,
	getUserByUsername,
	// getUserRole,
	updatePassword,
	updateActive
};