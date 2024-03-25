const repository = require("./repository");
const modules = {};

modules.addUser = async (req, res) => {
  const user = req.body;
  const createdUser = await repository.createUser(user);
  res.status(201).json(createdUser);
};

const userToWallet = (user) => ({
  wallet_id: user.user_id,
  balance: user.balance,
  wallet_user: { user_id: user.user_id, user_name: user.user_name },
});

modules.getWallet = async (req, res) => {
  const walletId = req.params.wallet_id;
  try {
    const user = await repository.getWallet(walletId);
    res.status(200).json(userToWallet(user));
  } catch (error) {
    console.log(error);
    const { code, message } = error;
    res.status(code).json({ message });
  }
};

modules.addWalletBalance = async (req, res) => {
  const walletId = req.params.wallet_id;
  const recharge = req.body.recharge;
  try {
    if (Number.isNaN(recharge)) {
      throw { code: 400, message: "recharge must be an integer" };
    }
    
    let rechargeInt = parseInt(recharge);
    if (rechargeInt > 10000 || rechargeInt < 100) {
      throw { code: 400, message: `invalid amount: ${rechargeInt}` };
    }

    const user = await repository.rechargeWallet(walletId, rechargeInt);
    res.status(200).json(userToWallet(user));
  } catch (error) {
    console.log(error);
    const { code, message } = error;
    res.status(code).json({ message });
  }
};

module.exports = modules;
