const baseApi = require('./_base');

const getAllStations = async () => {
    return await baseApi.get('/stations');
}

const getTrainsAtStation = async (stationId) => {
    return await baseApi.get(`/stations/${stationId}/trains`);
}

const addStation = async (station) => {
    return await baseApi.post('/stations', station);
}

module.exports = {
    getAllStations,
    getTrainsAtStation,
    addStation
}