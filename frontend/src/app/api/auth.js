import axios from "axios";
import { api_url } from ".";

export const login = async (username, password) =>
    axios.post(api_url("/auth/login"), { username, password }).then(res => res.data);

export const logout = async (refreshToken) =>
    axios.post(api_url("/auth/logout"), { token: refreshToken }).then(res => res.data);
    
export const forgetPassword = async (email) =>
    axios.post(api_url("/auth/reset-password/initiate"), { email }).then(res => res.data);

export const resetPassword = async (token, password) =>
    axios.post(api_url("/auth/reset-password/confirm"), { token, new_password: password }).then(res => res.data);

export const changePassword = async (token, oldPassword, newPassword) =>
    axios.post(api_url("/auth/change-password"), { token, old_password: oldPassword, new_password: newPassword }).then(res => res.data);

export const register = async (username, email, password) => 
    axios.post(api_url("/auth/register"), { username, email, password }).then(res => res.data);

export const activate = async (jwt, userInfo) =>
    axios.post(api_url("/auth/activate"), {...userInfo, jwt}).then(res => res.data);

export const registerDoctor = async (jwt, userInfo) =>
    axios.post(api_url("/auth/add-doctor"), {jwt, ...userInfo}).then(res => res.data);