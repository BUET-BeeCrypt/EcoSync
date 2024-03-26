const {verify} = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if( !token ) return res.status(401).json({ message: "Authorization required!" });
    
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    req.user = {};
    req.user.user_id = decoded.user_id;
    req.user.username = decoded.username;
    req.user.roles = decoded.role;
    next();
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "Invalid authorization token!" });
  }
}

const requiresAdmin = (req, res, next) => {
  try{
    const roles = req.user.roles;
    if( !roles.includes("SYSTEM_ADMIN") ) return res.status(401).json({message:"Access Denied"});
    next();
  } catch(error) {
    res.status(401).json({ message: "Invalid credintials!" });
  }
}

module.exports = {
	checkAuth,
	requiresAdmin
};