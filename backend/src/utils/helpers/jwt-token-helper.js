const { sign } = require('jsonwebtoken');
require("dotenv").config();

const jwtSecretKey = process.env.JWT_SECRET_KEY;
const refreshTokenSecretKey = process.env.REFRESH_TOKEN_SECRET_KEY;

function signAccessToken(user_id, username, role) {
  const accessToken = sign(
    { user_id: user_id, username: username , role: role},
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

function signForgetPasswordToken(username) {
  const forgetPasswordToken = sign(
    { username: username, type: 'forget-password-token'},
    jwtSecretKey,
    {
      expiresIn: '1h',
    }
  );
  return forgetPasswordToken;
}

module.exports = {
  signAccessToken,
  signRefreshToken,
  signConfirmCodeToken,
  signForgetPasswordToken
};
