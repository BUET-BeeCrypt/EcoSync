import { api_url } from ".";
import axios from "axios";

export const getSTSVehicles = async () =>
  axios.get(api_url(`/sts/vehicles`)).then((res) => res.data);

export const addSTSEntry = async (vehicle_id, entry_time) =>
  axios
    .post(api_url(`/sts/entries`), { entry_time, vehicle_id })
    .then((res) => res.data);

export const getSTSEntries = async () =>
  axios.get(api_url(`/sts/entries`)).then((res) => res.data);

export const addSTSDeparture = async (sts_entry_id, departure_time, volume) =>
  axios
    .put(api_url(`/sts/departures/${sts_entry_id}`), { departure_time, volume })
    .then((res) => res.data);

export const addSTSDumpEntry = async (entry_time, volume) =>
  axios
    .post(api_url(`/sts/dump`), { entry_time, volume })
    .then((res) => res.data);

export const getSTSRecords = async (page) =>
  axios.get(api_url(`/sts/records?page=${page}`)).then((res) => res.data);

export const getMySTS = async () =>
  axios.get(api_url(`/sts/my`)).then((res) => res.data);

export const getFleet = async () =>
  axios.get(api_url(`/routes/fleet/suggest`)).then((res) => res.data);

export const confirmFleet = async (route_id, vehicles) =>
  axios
    .post(api_url(`/routes/fleet/confirm`), { route_id, vehicles })
    .then((res) => res.data);

export const getRoutes = async () =>
  axios.get(api_url(`/routes`)).then((res) => res.data);
