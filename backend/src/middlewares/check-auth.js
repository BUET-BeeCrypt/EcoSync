const {verify} = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const checkAuth = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if( token && token.startsWith("Bearer ") ) token = token.split(" ")[1];
    if( !token ) return res.status(401).json({ message: "Authorization required!" });
    
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    req.user = {};
    req.user.user_id = decoded.user_id;
    req.user.username = decoded.username;
    req.user.role = decoded.role;
    next();
  } catch (error) {
    // console.log(error);
    res.status(401).json({ message: "Invalid authorization token!" });
  }
}

const requiresAdmin = (req, res, next) => {
  try{
    const role = req.user.role;
    if( role !== "SYSTEM_ADMIN" )
      return res.status(403)
          .json({ 
            message:`Access Denied! ${role} role have no permission for this endpoint!`
          });
    next();
  } catch(error) {
    res.status(401).json({ message: "Invalid credintials!" });
  }
}

module.exports = {
	checkAuth,
  requiresAdmin
};