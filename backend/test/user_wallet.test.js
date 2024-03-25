const api = require("./api/user_wallet");

const user = {
  user_id: 1,
  user_name: "Fahim",
  balance: 100,
};

const wallet = {
  wallet_id: 1,
  balance: 100,
  wallet_user: {
    user_id: 1,
    user_name: "Fahim",
  },
};

describe("User Wallet API", () => {
  it("it should add a user", async () => {
    const response = await api.createUser(user);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(user);
  });

  it("should return wallet of a user", async () => {
    const response = await api.getWallet(1);
    expect(response.status).toBe(200);
    expect(response.data).toEqual(wallet);
  });

  it("should show error for not found wallet", async () => {
    const response = await api.getWallet(2);
    expect(response.status).toBe(404);
    expect(response.data).toEqual({
      message: "wallet with id: 2 was not found",
    });
  });

  it("should recharge wallet of a user", async () => {
    const response = await api.rechargeWallet(1, 100);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ...wallet, balance: 200 });
  });

  it("should show error for not found wallet", async () => {
    const response = await api.rechargeWallet(2, 100);
    expect(response.status).toBe(404);
    expect(response.data).toEqual({
      message: "wallet with id: 2 was not found",
    });
  });

  it("should not allow recharge less than 100", async () => {
    const response = await api.rechargeWallet(1, 50);
    expect(response.status).toBe(400);
    expect(response.data).toEqual({ message: "invalid amount: 50" });
  });

  it("should not allow recharge more than 10000", async () => {
    const response = await api.rechargeWallet(1, 10001);
    expect(response.status).toBe(400);
    expect(response.data).toEqual({ message: "invalid amount: 10001" });
  });

  it("should allow recharge 10000", async () => {
    const response = await api.rechargeWallet(1, 10000);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ ...wallet, balance: 10200 });
  });
});
