const { sign } = require('jsonwebtoken');
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

function signAccessToken(username, role) {
  const accessToken = sign(
    { username: username , role: role},
    jwtSecretKey,
    {
      expiresIn: '1h',
    }
  );
  return accessToken;
}
function signRefreshToken(username) {
  const refreshToken = sign(
    { username: username},
    refreshTokenSecretKey,
    {
      expiresIn: '7d',
    }
  );
  return refreshToken;
}
function signConfirmCodeToken(username, confirmCode) {
  const confirmCodeToken = sign(
    { username: username, code: confirmCode },
    jwtSecretKey,
    {
      expiresIn: '5m',
    }
  );
  return confirmCodeToken;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  signConfirmCodeToken,
};
