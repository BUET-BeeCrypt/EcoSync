const baseApi = require("./_base");

const addTrain = async (train) => {
  return await baseApi.post("/trains", train);
};

module.exports = {
  addTrain,
};
