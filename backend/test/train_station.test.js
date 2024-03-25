const stationApi = require("./api/station");
const trainApi = require("./api/train");

const trainReq = {
  train_id: 1,
  train_name: "Mahanagar 123",
  capacity: 200,
  stops: [
    {
      station_id: 1,
      arrival_time: null,
      departure_time: "07:00",
      fare: 0,
    },
    {
      station_id: 3,
      arrival_time: "07:45",
      departure_time: "07:50",
      fare: 20,
    },
    {
      station_id: 4,
      arrival_time: "08:30",
      departure_time: null,
      fare: 30,
    },
  ],
};

const trainRes = {
  train_id: 1,
  train_name: "Mahanagar 123",
  capacity: 200,
  service_start: "07:00",
  service_ends: "08:30",
  num_stations: 3,
};

// todo : rearrange the test cases to follow the arrange, act and assert pattern
const stations = [
  {
    station_id: 1,
    station_name: "Dhaka GPO",
    longitude: 90.399452,
    latitude: 23.777176,
  },
  {
    station_id: 3,
    station_name: "Motijheel",
    longitude: 90.417458,
    latitude: 23.73333,
  },
  {
    station_id: 4,
    station_name: "Rajarbagh",
    longitude: 90.4166667,
    latitude: 23.7333333,
  },
];

describe("Train & Station API", () => {
  it("it should return an empty array of stations", async () => {
    const response = await stationApi.getAllStations();
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ stations: [] });
  });

  it("should create 3 stations", async () => {
    for (let i = 0; i < 3; i++) {
      const response = await stationApi.addStation(stations[i]);
      expect(response.status).toBe(201);
      expect(response.data).toEqual(stations[i]);
    }
  });

  it("should return all stations", async () => {
    const response = await stationApi.getAllStations();
    expect(response.status).toBe(200);
    expect(response.data).toEqual({ stations });
  });

  it("should add a train", async () => {
    const response = await trainApi.addTrain(trainReq);
    expect(response.status).toBe(201);
    expect(response.data).toEqual(trainRes);
  });

  it("should add another train", async () => {
    const response = await trainApi.addTrain({
      train_id: 2,
      train_name: "Mahanagar 125",
      capacity: 200,
      stops: [
        {
          station_id: 4,
          arrival_time: null,
          departure_time: "08:00",
          fare: 0,
        },
        {
          station_id: 3,
          arrival_time: "08:45",
          departure_time: "08:50",
          fare: 20,
        },
        {
          station_id: 1,
          arrival_time: "09:30",
          departure_time: null,
          fare: 30,
        },
      ],
    });
    expect(response.status).toBe(201);
    expect(response.data).toEqual({
      train_id: 2,
      train_name: "Mahanagar 125",
      capacity: 200,
      service_start: "08:00",
      service_ends: "09:30",
      num_stations: 3,
    });
  });

  it("should return trains at a station", async () => {
    const response = await stationApi.getTrainsAtStation(1);
    expect(response.status).toBe(200);
    expect(response.data).toEqual({
      station_id: 1,
      trains: [
        {
          train_id: 2,
          arrival_time: "09:30",
          departure_time: null,
        },
        {
          train_id: 1,
          arrival_time: null,
          departure_time: "07:00",
        },
      ],
    });
  });

  it("should return 404 for not found station", async () => {
    const response = await stationApi.getTrainsAtStation(44);
    expect(response.status).toBe(404);
    expect(response.data).toEqual({
      message: "station with id: 44 was not found",
    });
  });
});
