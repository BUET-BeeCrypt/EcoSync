const modules = {};

const ticketService = require('../route/service');
const userRepo = require('../user/repository');



modules.purchaseTicket = async (req, res) => {
    const ticket = req.body;
    // const createdTicket = await createTicket(ticket);
    const result = await ticketService.getRouteByOneTrain(req.body.station_from, req.body.station_to,req.body.time_after);
    if (result.length === 0) {
        const { wallet_id, time_after, station_from, station_to } = ticket;
        return res.status(403).json({message: `no ticket available for station: ${station_from} to station: ${station_to}`});
    }
    const newArr = result.map(item => { return {
        station_id: item.station_id,
        train_id: item.train_id,
        arrival_time: item.arrival_time,
        departure_time: item.departure_time

      }});
    let cost = 0;
    for (let i = 0; i < result.length; i++) {
        cost = cost + result[i].fare;
    }


    console.log(cost);
    res.status(201).json({stations:newArr});
}

module.exports = modules;