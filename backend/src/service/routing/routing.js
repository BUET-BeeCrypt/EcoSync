const repository = require("./repository");
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
    return JSON.stringify(feature);
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
            await repository.createRoute(landfill_id, sts.sts_id, result);
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
            await repository.createRoute(landfill.landfill_id, sts_id, result);
            console.log(`Route created from landfill ${landfill.landfill_id} to sts ${sts_id}`);
        }
        await wait(1000);
    }
}

module.exports = modules;