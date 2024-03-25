const modules = {};

const repository = require('../train/repository');

/*
const getKey = (station, arrival_time) => {
    return `${station}_${arrival_time}`;
}
const getOptimalRouteByCost = async (source, destination,arrival_time) => {
    const routes = await getAllStops();
    const adj = {};
    const targets = []
    const edges = {};

    for(const route of routes) {
        if( route.station_id !== destination || route.arrival_time === null) continue;
        targets.append(getKey(route.station_id, route.arrival_time);
    }

    for( const route of routes ) {
        edges[route.train_stop_id] = route.next_stop_id;
    }

    for (const route of routes) {
        adj[route.station_id] = [];
    }
    for (const route of routes) {
        adj[route.station_id].append(route);
    }

    const optimalRoute = [];
    

    const distances = {};
    const stationVisited = {};
    const parent = {};

    const pq = new PriorityQueue();
    pq.enqueue({
        station: source,
        arrival_time: arrival_time,
        cost: 0
    }, 0);
    distances[getKey(source, arrival_time)] = 0;
    stationVisited[getKey(source, arrival_time)] = null;
    parent[getKey(source, arrival_time)] = null;

    while (!pq.isEmpty()) {
        const { station, arrival_time, cost } = pq.dequeue().element;
        if( station === destination ) continue;
        if (cost > distances[getKey(station, arrival_time)]) {
            continue;
        }
        for (const stop of adj[station]) {
            if ( stop.departure_time === null || stop.departure_time < arrival_time) {
                continue;
            }
            const next_stop = edges[stop.next_stop_id];
            next_stop = routes[next_stop]
            const new_arrival_time = next_stop.arrival_time;
            const new_cost = cost + next_stop.fare;
            if ( distances[getKey(stop.station_id, new_arrival_time)] === undefined || new_cost < distances[getKey(stop.station_id, new_arrival_time)]) {
                distances[getKey(stop.station_id, new_arrival_time)] = new_cost;
                stationVisited[getKey(stop.station_id, new_arrival_time)] = stop;
                pq.enqueue({
                    station: stop.station_id,
                    arrival_time: new_arrival_time,
                    cost: new_cost
                }, new_cost);
            }
        }
    }


    return optimalRoute;
}
*/

const getRouteByOneTrain = async (source, destination, arrival_time) => {
    const routes = await repository.getAllStops();

   
    let routeToTake = [];

    const adj = {};
    for(const route of routes) {
        adj[route.train_stop_id] = route;
    }

    for (const route of routes) {
        //console.log(route.departure_time,arrival_time,route.departure_time >= arrival_time,)
        if (route.station_id === source && route.departure_time >= arrival_time) {
            console.log("YES");
            routeToTake = [];
            let current = route.train_stop_id;
            
            while( current !== null ) { 
                routeToTake.push(adj[current]);
                
                current = adj[current].next_stop_id;

                if( routeToTake[routeToTake.length-1].station_id === destination ) {
                    return routeToTake;
                }
            }
        }
    }
    return [];
}

module.exports = {
    getRouteByOneTrain
}