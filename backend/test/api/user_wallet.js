const baseApi = require('./_base');

const createUser = async (user) => {
    return await baseApi.post('/users', user);
}

const getWallet = async (userId) => {
    return await baseApi.get(`/wallets/${userId}`);
}

const rechargeWallet = async (userId, recharge) => {
    return await baseApi.put(`/wallets/${userId}`, { recharge });
}

module.exports = {
    createUser,
    getWallet,
    rechargeWallet
}