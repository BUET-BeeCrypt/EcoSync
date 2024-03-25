const pool = require("../db/pool");

/*
CREATE TABLE IF NOT EXISTS users (
  user_id INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  balance INTEGER NOT NULL
);
*/

const createUser = async (user) => {
	const query = "INSERT INTO users (user_id, user_name, balance) VALUES ($1, $2, $3) RETURNING *";
	const result = await pool.query(query, [user.user_id,user.user_name, user.balance]);
	if (result.rows.length === 0) {
		throw {code:404,message: "User not created"};
	}
	return result.rows[0];
}

const getWallet = async (user_id) => {
	const query = "SELECT * FROM users WHERE user_id = $1";
	const result = await pool.query(query, [user_id]);
	if (result.rows.length === 0) {
		throw {code:404, message: `wallet with id: ${user_id} was not found`};
	}
	return result.rows[0];
}

const rechargeWallet = async (user_id, amount) => {
	const query = "UPDATE users SET balance = balance + $1 WHERE user_id = $2 RETURNING *";
	const result = await pool.query(query, [amount, user_id]);
	if (result.rows.length === 0) {
		throw {code:404, message: `wallet with id: ${user_id} was not found`};
	}
	return result.rows[0];
}

module.exports = {
	createUser,
	getWallet,
	rechargeWallet
};