import { api_url } from ".";
import axios from "axios";

export const getVehicles = async () =>
  axios.get(api_url(`/landfill/vehicles`)).then((res) => res.data);

export const addLandfillEntry = async (vehicle_id, entry_time, weight) =>
  axios
    .post(api_url(`/landfill/entries`), { entry_time, vehicle_id, weight })
    .then((res) => res.data);

export const getLandfillEntries = async () =>
  axios.get(api_url(`/landfill/entries`)).then((res) => res.data);

export const addLandfillDeparture = async (landfill_entry_id, departure_time) =>
  axios
    .put(api_url(`/landfill/departures/${landfill_entry_id}`), {
      departure_time,
    })
    .then((res) => res.data);

export const getLandfillRecords = async (page) =>
  axios.get(api_url(`/landfill/records?page=${page}`)).then((res) => res.data);

export const getMyLandfill = async () =>
  axios.get(api_url(`/landfill/my`)).then((res) => res.data);

export const getBills = async () =>
  axios.get(api_url(`/landfill/bills`)).then((res) => res.data);