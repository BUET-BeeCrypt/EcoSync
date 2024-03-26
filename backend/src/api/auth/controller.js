const repository = require("./repository");
const bcyrpt = require("bcrypt");
const { signAccessToken, signRefreshToken } = require("../../utils/helpers/jwt-token-helper");
const modules = {};

const roles = ["","SYSTEM_ADMIN", "STS_MANAGER","LANDFILL_MANAGER", "UNASSIGNED"];

modules.login = async (req, res) => {
  const cred = req.body;

  if (!cred.username || !cred.password)
      return res.status(400).json({ message: "Bad request." });

  user = await repository.getUserByUsername(cred.username).catch(() => {
      return res.status(500).json({ message: "Internal server error." });
  });

  if (!user)
      return res.status(401).json({ message: "User not found." });

  const isMatch = await bcyrpt.compare(cred.password, user.password);

  if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

  // get user roles
  role = roles[user.role_id];

  console.log(role);

  const accessToken = signAccessToken(user.user_id, user.username, role);
  const refreshToken = signRefreshToken(user.username);
  if( user.active == false){
    return res.status(200).json({ accessToken, refreshToken, active: false});
  }
  res.status(200).json({ accessToken, refreshToken });
};

modules.changePassword = async (req, res) => {
    const user = req.user;
    const cred = req.body;
    
    if (!cred.old_password || !cred.new_password)
        return res.status(400).json({ message: "Bad request." });

    const userOld = await repository.getUserById(user.user_id);
    if (!userOld)
        return res.status(404).json({ message: "User not found." });

    const isMatch = await bcyrpt.compare(cred.old_password, userOld.password);
    if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials." });

    const hashedPassword = await bcyrpt.hash(cred.new_password, 10);
    await repository.updatePassword(user.user_id, hashedPassword);
    await repository.updateActive(user.user_id, true);
    res.status(200).json({ message: "Password updated." });
}


module.exports = modules;
