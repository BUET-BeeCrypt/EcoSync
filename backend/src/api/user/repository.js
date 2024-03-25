const pool = require("../../db/pool");


const createUser = async (user) => {
	const query = "INSERT INTO user (user_id, user_name, balance) VALUES ($1, $2, $3) RETURNING *";
	const result = await pool.query(query, [user.user_id,user.user_name, user.balance]);
	if (result.rows.length === 0) {
		throw {code:404,message: "User not created"};
	}
	return result.rows[0];
}


module.exports = {
	createUser,
};