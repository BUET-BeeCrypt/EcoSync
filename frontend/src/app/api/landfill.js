import { api_url } from ".";
import axios from "axios";

export const getVehicles = async () =>
  axios.get(api_url(`/vehicles`)).then((res) => res.data);

export const addSTSEntry = async (vehicle_id, entry_time) =>
  axios
    .post(api_url(`/landfill/entries`), { entry_time, vehicle_id })
    .then((res) => res.data);

export const getSTSEntries = async () =>
  axios.get(api_url(`/landfill/entries`)).then((res) => res.data);

export const addSTSDeparture = async (sts_entry_id, departure_time, volume) =>
  axios
    .put(api_url(`/landfill/departures/${sts_entry_id}`), { departure_time, volume })
    .then((res) => res.data);

export const getSTSRecords = async (page) =>
  axios.get(api_url(`/landfill/records?page=${page}`)).then((res) => res.data);

export const getMySTS = async () =>
  axios.get(api_url(`/landfill/my`)).then((res) => res.data);
