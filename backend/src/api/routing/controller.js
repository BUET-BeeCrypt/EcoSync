const repository = require("./repository");
const stsRepository = require("../sts/repository");
const landfillRepository = require("../landfill/repository");
const axios = require("axios");

const kMeansWithClusters = require("./clustering").kMeansWithClusters;
const modules = {};

const Valhalla = require("@routingjs/valhalla").Valhalla;

/**
 * 
 * @param {*} start - starting point with lat and lon
 * @param {*} end  - ending point with lat and lon
 * @returns route from start to end in json format 
 */

function wait(milliseconds){
    return new Promise(resolve => {
        setTimeout(resolve, milliseconds);
    });
}

modules.endToEnd = async (start, end) => {
   try{
    const valhalla = new Valhalla();
    const result = await valhalla.directions(
        [
            [start.lat, start.lon],
            [end.lat, end.lon]
        ],
        "truck"
    )
    const feature = result.directions[0].feature;
    return feature;
   }catch(err){
        console.log(err);
       return null;
   }
}


modules.decode = (str, precision) => {
    var index = 0,
        lat = 0,
        lng = 0,
        coordinates = [],
        shift = 0,
        result = 0,
        byte = null,
        latitude_change,
        longitude_change,
        factor = Math.pow(10, precision || 6);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {

        // Reset shift, result, and byte
        byte = null;
        shift = 0;
        result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        latitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        shift = result = 0;

        do {
            byte = str.charCodeAt(index++) - 63;
            result |= (byte & 0x1f) << shift;
            shift += 5;
        } while (byte >= 0x20);

        longitude_change = ((result & 1) ? ~(result >> 1) : (result >> 1));

        lat += latitude_change;
        lng += longitude_change;

        coordinates.push([(lng / factor)+"",(lat / factor)+""]);
    }

    return coordinates;
};

modules.endToEndLocal = async (start, end) => {
    try{
        const json_data = {
            "locations":[{"lat":start.lat,"lon":start.lon},
                        {"lat":end.lat,"lon":end.lon}],
            "costing":"auto",
            "units":"kilometers",
            "id":"my_work_route"
        }
        const valhalla_route = process.env.VALHALLA_URL+"/route?json="+JSON.stringify(json_data);
        const result = await axios.get(valhalla_route);
        const shape = modules.decode(result.data.trip.legs[0].shape);
        const route = {
            "direction": shape,
            "distance": result.data.trip.legs[0].summary.length,
            "duration": result.data.trip.legs[0].summary.time,
            "maneuvers": result.data.trip.legs[0].maneuvers
        }
        return route;
        
    }catch(err){
        console.log(err);
       return null;
   }
}

modules.matrixAPI = async (locations) => {

    const json_data = {
        "sources":locations,
        "targets":locations,
        "costing":"auto",
        "units":"kilometers"
    }
    const valhalla_route = process.env.VALHALLA_URL+"/sources_to_targets?json="+JSON.stringify(json_data);
    const result = await axios.get(valhalla_route);
    

    const distances = [];
    let distance = 0;
    let duration = 0;
    for(let tripx of result.data.sources_to_targets){
        const distance = [];
        for(const trip of tripx){
            distance.push(trip.distance);
        }
        distances.push(distance);
    }
    return distances;

}

modules.tsp = async (sts,intermediates) => {
    const locations = [sts];
    for( const intermediate of intermediates ){
        locations.push(intermediate);
    }
    locations.push(sts);
    
    const json_data = {
        "locations":locations,
        "costing":"auto",
        "units":"kilometers"
    }
    const valhalla_route = process.env.VALHALLA_URL+"/optimized_route?json="+JSON.stringify(json_data);
    const result = await axios.get(valhalla_route);

    const route = {};
    route.direction = [];
    route.distance = 0;
    route.duration = 0;
    for( const trip of result.data.trip.legs ){
        route.direction.push(...modules.decode(trip.shape));
        route.distance += trip.summary.length;
        route.duration += trip.summary.time;
    }

    return route;
}

modules.createRoutesFromLandfill = async (landfill_id) => {
    const landfill = await repository.getLandfill(landfill_id);
    if( landfill === null ) return;
    const STSs = await repository.getSTSs();
    for( const sts of STSs ){
        const result = await modules.endToEndLocal({lat:landfill.latitude, lon:landfill.longitude}, 
                                                {lat:sts.latitude, lon:sts.longitude});
        if( result !== null ){
            const direction = result.direction;
            const distance = result.distance;
            const duration = result.duration;
            await repository.createRoute(landfill_id, sts.sts_id, direction,distance,duration);
            console.log(`Route created from landfill ${landfill_id} to sts ${sts.sts_id}`);
        }
        await wait(1000);
    }
}

modules.createRoutesFromSTS = async (sts_id) => {
    const sts = await repository.getSTS(sts_id);
    if( sts === null ) return;
    const landfills = await repository.getLandfills();
    for( const landfill of landfills ){
        const result = await modules.endToEndLocal({lat:landfill.latitude, lon:landfill.longitude},
                                                {lat:sts.latitude, lon:sts.longitude});
        if( result !== null ){
            const direction = result.direction;
            const distance = result.distance;
            const duration = result.duration;
            await repository.createRoute(landfill.landfill_id, sts_id, direction,distance,duration);
            console.log(`Route created from landfill ${landfill.landfill_id} to sts ${sts_id}`);
        }
        await wait(1000);
    }
}

modules.createRouteFromLandfillToSTS = async (landfill_id, sts_id) => {
    const landfill = await repository.getLandfill(landfill_id);
    const sts = await repository.getSTS(sts_id);
    if( landfill === null || sts === null ) return;
    const result = await modules.endToEndLocal({lat:landfill.latitude, lon:landfill.longitude},
                                            {lat:sts.latitude, lon:sts.longitude});
    if( result !== null ){
        const direction = result.direction;
        const distance = result.distance;
        const duration = result.duration;
        await repository.createRoute(landfill_id, sts_id, direction,distance,duration);
        console.log(`Route created from landfill ${landfill_id} to sts ${sts_id}`);
    }
}

modules.suggestFleet = async (req, res) => {
    const manager_id = req.user.user_id;
    const sts_id = await stsRepository.getSTSIDfromManagerID(manager_id);
    // const sts_id = req.params.sts_id;
    if( sts_id === null ) return res.status(400).json({message: "Manager not assigned to any STS"});
    let routes = await repository.getRoutesBySTS(sts_id);
    const sts = await stsRepository.getSTS(sts_id);
    if( sts === null ) return res.status(400).json({message: "STS not found"});
    const landfills = await repository.getLandfills();
    let distances = {};
    for( const route of routes ){
        distances[route.landfill_id] = route.distance;
    }
    // checking if all assignment between landfill and sts is used
    let added = false;
    for( const landfill of landfills ){
       
        if( distances[landfill.landfill_id] === undefined ){
            console.log(`Creating route from landfill ${landfill.landfill_id} to sts ${sts_id}`);
            modules.createRouteFromLandfillToSTS(landfill.landfill_id, sts.sts_id);
            added = true;
            await wait(1000);
        }
        
    }

    if( added ){
        console.log("Routes added. Recalculating distances");
        routes = await repository.getRoutesBySTS();
    }
    
    let minDistance = Number.MAX_VALUE;
    let minLandfillDirection = null;
    for( const route of routes ){
        if( route.distance < minDistance ){
            minDistance = route.distance;
            minLandfillDirection = route;
        }
    }
    // console.log(JSON.stringify(minLandfillDirection));
    if( minLandfillDirection === null ) return res.status(400).json({message: "No landfills available"});

    const vehicles = await repository.getVehiclesBySTS(sts_id);
    vehicles.sort((a,b) => {
        if( !a.capacity ) a.capacity = 1;
        if( !b.capacity ) b.capacity = 1;
        return a.fuel_cost_per_km_loaded/a.capacity - b.fuel_cost_per_km_loaded/b.capacity;
    });
    let chosenVehicles = [];
    let garbage = sts.amount;
    console.log(`Garbage: ${garbage}`);
    for( const vehicle of vehicles ){
        if( garbage <= 0 ) break;

        for(let i=1;i<=3;i++){
            vehicle.total_trip = i;
            if( vehicle.capacity >= garbage ){
                garbage = 0;
                break;
            }else{
                garbage -= vehicle.capacity;
            }
        }
        chosenVehicles.push(vehicle);
    }

    let minLandfill = null;
    for( const landfill of landfills ){
        if( landfill.landfill_id === minLandfillDirection.landfill_id ){
            minLandfill = landfill;
            break;
        }
    }

    return res.status(200).json({landfill:minLandfill,direction: minLandfillDirection, vehicles: chosenVehicles});
}

modules.confirmFleet = async (req, res) => {
    const route_id = req.body.route_id;
    const vehicles = req.body.vehicles;

    // create fleet
    const fleet = await repository.createFleet(route_id);
    // assign trips to fleet
    for( const vehicle of vehicles ){
        await repository.createTrip(fleet.fleet_id, vehicle.vehicle_id, vehicle.total_trip);
    }
    return res.status(200).json({message: "Fleet created"});
}

modules.recalculateRoutes = async ( ) => {
    
    let routes = await repository.getRoutes();
    const STSs = await stsRepository.getSTSs();
    const landfills = await repository.getLandfills();

    let distances = {};
    for( const route of routes ){
        if( distances[route.landfill_id] === undefined ) distances[route.landfill_id] = {};
        distances[route.landfill_id][route.sts_id] = route.distance;
    }
    // checking if all assignment between landfill and sts is used
    
    for( const landfill of landfills ){
        if( distances[landfill.landfill_id] === undefined ){
            distances[landfill.landfill_id] = {};
        }
        for( const sts of STSs ){
            if( distances[landfill.landfill_id][sts.sts_id] === undefined ){
                console.log(`Creating route from landfill ${landfill.landfill_id} to sts ${sts.sts_id}`);
            
                await modules.createRouteFromLandfillToSTS(landfill.landfill_id, sts.sts_id);
                // await wait(1000);
            }
        }
    }
}

modules.calculateRoutes = async (req, res) => {
    modules.recalculateRoutes();
    return res.status(200).json({message:"Recalculating routes"});
}

modules.getRoutes = async (req, res) => {
    const manager_id = req.user.user_id;
    const sts_id = await stsRepository.getSTSIDfromManagerID(manager_id);
    const routes = await repository.getRoute(sts_id);
    const landfills = await landfillRepository.getLandfills();
    return res.status(200).json({
        routes,
        landfills
    });
}

modules.testLocal = async (req, res) => {
    const start = req.body.start;
    const end = req.body.end;
    await modules.endToEndLocal(start,end);
    return res.status(200).json({"ok":"ok"});
}

modules.scheduleCollection = async (req, res) => {
    
    try{
        const sts_location = req.body.sts_location;
        const locations = req.body.locations;
        let van_capacity = 10;//req.body.van_capacity;
        const routes = [];
        for(const location of locations) {
            if( location.weight >= van_capacity ){
                const ret = await modules.endToEndLocal(sts_location, location);
                const route = {};
                route.direction = ret.direction;
                route.distance = ret.distance;
                route.duration = ret.duration;
                route.locations = [sts_location, location];
                while( location.weight > van_capacity ){
                    // route.direction = "";
                    routes.push(route);
                    location.weight -= van_capacity;
                }
                
            }
        }
        const distances = [];//await modules.matrixAPI(locations);
        const clusters = kMeansWithClusters(locations, 3, distances, 100);
        // return res.status(200).json({clusters:clusters.clusters});
        // console.log(clusters);
        for(let ii = 0; ii>=0; ii++) {
            let weight = 0;
            const cluster = clusters.clusters[ii];
            if( cluster === undefined ) break;
            for(let iii=0;iii<cluster.length;iii++){
                weight += cluster[iii].weight;
            }
            const route = {};
            const ret = await modules.tsp(sts_location, cluster);
            route.direction = ret.direction;
            route.distance = ret.distance;
            route.duration = ret.duration;
            route.locations = cluster;
            route.locations.push(sts_location);

            while(weight>0){
                routes.push(route);
                weight -= van_capacity;
            }
        }

        return res.status(200).json({routes});
    }catch(err){
        console.log(err);
        return res.status(400).json({message: err.message});
    }

}

module.exports = modules;