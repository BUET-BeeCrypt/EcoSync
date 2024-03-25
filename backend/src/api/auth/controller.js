const repository = require("./repository");
const bcyrpt = require("bcrypt");
const { signAccessToken, signRefreshToken } = require("../../utils/helpers/jwt-token-helper");
const modules = {};

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
  roles = await repository.getUserRoles(user.user_id).catch(() => {
      return res.status(500).json({ message: "Internal server error." });
  });

  console.log(roles);

  const accessToken = signAccessToken(user.username, roles);
  const refreshToken = signRefreshToken(user.username);

  res.status(200).json({ accessToken, refreshToken });
};


module.exports = modules;
