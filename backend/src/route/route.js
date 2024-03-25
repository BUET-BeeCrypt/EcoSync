// const controller = require("./controller");
const router = require("express-promise-router")();
const ticketService = require('./service');

const getTime = (start, end) => {
    let startTime = start.split(":");
    let endTime = end.split(":");
    let startHour = parseInt(startTime[0]);
    let startMinute = parseInt(startTime[1]);
    let endHour = parseInt(endTime[0]);
    let endMinute = parseInt(endTime[1]);
    let hour = endHour - startHour;
    let minute = endMinute - startMinute;
    if (minute < 0) {
        hour = hour - 1;
        minute = minute + 60;
    }
    return hour*60+minute;

}

router.get("/", async (req, res) => {
    let {from, to, optimize} = req.query;
    console.log(from, to);
    from = parseInt(from);
    to = parseInt(to);
    const result = await ticketService.getRouteByOneTrain(from, to,"00:00");
    if( result.length === 0) {
        return res.status(403).json({message: `no route available from station: ${from} to station: ${to}`});
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

    newArr[0].arrival_time = null;
    newArr[newArr.length-1].departure_time = null;

    let time = getTime(result[0].departure_time,result[result.length-1].arrival_time);
    res.status(200).json({total_cost: cost, total_time: time, stations:newArr});
    
});

module.exports = router;