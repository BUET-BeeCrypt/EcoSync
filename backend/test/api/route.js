const baseApi = require("./_base");

const getRoute = async (from, to, optimize) => {
  return await baseApi.get("/routes", { params: { from, to, optimize } });
};

module.exports = {
  getRoute,
};
