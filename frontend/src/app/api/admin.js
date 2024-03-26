import { api_url } from ".";
import axios from "axios";

export const getUsers = async () =>
  axios.get(api_url(`/users`)).then((res) => res.data);

export const getRoles = async () =>
  axios.get(api_url(`/users/roles`)).then((res) => res.data);

export const changeUserRole = async (id, role) =>
  axios
    .put(api_url(`/users/${id}/roles`), { role_name: role })
    .then((res) => res.data);

export const editUser = async (id, username, email, name, active, banned) =>
  axios
    .put(api_url(`/users/${id}`), { username, email, name, active, banned })
    .then((res) => res.data);

export const deleteUser = async (id) =>
  axios.delete(api_url(`/users/${id}`)).then((res) => res.data);

export const addDoctorRequest = async (email) =>
  axios.post(api_url("/admin/add-doctor"), { email }).then((res) => res.data);

export const changeUserBannedStatus = async (id, banned) =>
  axios(api_url(`/admin/user/${id}`), {
    method: "PUT",
    data: { banned },
  }).then((res) => res.data);

export const filterAndAnalyze = async (data) =>
  axios.post(api_url("/admin/filter"), data).then((res) => res.data);

export const addUser = async (username, email, password, name, send_email) =>
  axios
    .post(api_url("/users"), { username, email, password, name, send_email })
    .then((res) => res.data);
