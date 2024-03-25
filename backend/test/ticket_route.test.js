const ticketApi = require("./api/ticket");
const routeApi = require("./api/route");

describe("Ticket Route", () => {
  it("should show no route available", async () => {
    const from = 1;
    const to = 2;
    const optimize = "cost";
    const res = await routeApi.getRoute(from, to, optimize);
    expect(res.status).toBe(403);
    expect(res.data.message).toBe(
      `no route available from station: ${from} to station: ${to}`
    );
  });
  it("should show no ticket available", async () => {
    const ticket = {
      wallet_id: 1,
      time_after: "08:00",
      station_from: 1,
      station_to: 2,
    };
    const res = await ticketApi.purchaseTicket(ticket);
    expect(res.status).toBe(403);
    expect(res.data.message).toBe(
      `no ticket available for station: ${ticket.station_from} to station: ${ticket.station_to}`
    );
  });
});
