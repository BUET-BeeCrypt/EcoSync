import axios from "axios";
import { api_url } from ".";

export const getProfile = async () =>
  axios.get(api_url("/profile")).then((res) => res.data);

export const updateProfile = async (name, username, email) =>
  axios
    .put(api_url("/profile"), { name, username, email })
    .then((res) => res.data);

export const getStats = async () =>
  axios.get(api_url("/stats")).then((res) => res.data);