const {verify} = require("jsonwebtoken");
const dotenv = require("dotenv").config();

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    console.log(token)
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    req.username = decoded.username;
    req.roles = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid authorization token!" });
  }
}