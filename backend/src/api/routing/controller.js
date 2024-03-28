const repository = require("./repository");
const stsRepository = require("../sts/repository");
const landfillRepository = require("../landfill/repository");
const { PriorityQueue } = require('@datastructures-js/priority-queue');
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

modules.createRoutesFromLandfill = async (landfill_id) => {
    const landfill = await repository.getLandfill(landfill_id);
    if( landfill === null ) return;
    const STSs = await repository.getSTSs();
    for( const sts of STSs ){
        const result = await modules.endToEnd({lat:landfill.latitude, lon:landfill.longitude}, 
                                                {lat:sts.latitude, lon:sts.longitude});
        if( result !== null ){
            const direction = result.geometry.coordinates;
            const distance = result.properties.distance;
            const duration = result.properties.duration;
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
        const result = await modules.endToEnd({lat:landfill.latitude, lon:landfill.longitude},
                                                {lat:sts.latitude, lon:sts.longitude});
        if( result !== null ){
            const direction = result.geometry.coordinates;
            const distance = result.properties.distance;
            const duration = result.properties.duration;
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
    const result = await modules.endToEnd({lat:landfill.latitude, lon:landfill.longitude},
                                            {lat:sts.latitude, lon:sts.longitude});
    if( result !== null ){
        const direction = result.geometry.coordinates;
        const distance = result.properties.distance;
        const duration = result.properties.duration;
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
                await wait(1000);
            }
        }
    }
}

modules.calculateRoutes = async (req, res) => {
    modules.recalculateRoutes();
    return res.status(200).json({message:"Recalculating routes"});
}

module.exports = modules;