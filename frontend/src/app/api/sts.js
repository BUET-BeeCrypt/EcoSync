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

export const addSTSDeparture = async (sts_entry_id) =>
  axios.put(api_url(`/sts/departures/${sts_entry_id}`)).then((res) => res.data);

export const addSTSDumpEntry = async (entry_time, volume) =>
  axios
    .post(api_url(`/sts/dump`), { entry_time, volume })
    .then((res) => res.data);

export const getSTSRecords = async () =>
  axios.get(api_url(`/sts/records`)).then((res) => res.data);
