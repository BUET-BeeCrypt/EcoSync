const {verify} = require("jsonwebtoken");
const dotenv = require("dotenv").config();

const checkAuth = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // oauth2 token from google sign in
    if( token && token.startsWith("OAuth ") ) {
      token = token.split(" ")[1].split(".")[1];
      // base64 decoded token from google sign in
      g_data = Buffer.from(token, 'base64').toString('ascii');
      // convert to jsobject
      g_data = JSON.parse(g_data);
      //console.log(g_data);
      if(g_data.firebase.sign_in_provider === "google.com" &&
        g_data.aud === 'ecosync-1c755'
      ){
        req.user = {};
        req.user.user_id = g_data.user_id;
        req.user.username = g_data.name;
        req.user.role = "CITIZEN";
        next();
        return;
      }
      res.status(401).json({ message: "Invalid OAuth authorization token!" });
      return;
    }

    if( token && token.startsWith("Bearer ") ) token = token.split(" ")[1];
    if( !token ) return res.status(401).json({ message: "Authorization required!" });
    
    const decoded = verify(token, process.env.JWT_SECRET_KEY);
    req.user = {};
    req.user.user_id = decoded.user_id;
    req.user.username = decoded.username;
    req.user.role = decoded.role;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Invalid authorization token!" });
  }
}

const requiresAdmin = (req, res, next) => {
  try{
    const role = req.user.role;
    if( role !== "SYSTEM_ADMIN" )
      return res.status(403)
          .json({ 
            message:`Access Denied! ${role} role have no permission for this endpoint! Only admin can access this endpoint!`
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