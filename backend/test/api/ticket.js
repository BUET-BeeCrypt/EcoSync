const baseApi = require("./_base");

const purchaseTicket = async (ticket) => {
  return await baseApi.post("/tickets", ticket);
};

module.exports = {
  purchaseTicket,
};
