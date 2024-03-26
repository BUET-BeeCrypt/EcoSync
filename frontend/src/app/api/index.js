import axios from "axios";

export const UNAUTHORIZED = 401,
  FORBIDDEN = 403;
export const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:8000";

export const api_url = (path) => `${BASE_URL}/api${path}`;

axios.interceptors.request.use((config) => {
  const jwt = localStorage.getItem("token");
  if (jwt && config.url.includes(BASE_URL))
    config.headers.Authorization = `Bearer ${jwt}`;
  return config;
});

const removeTokenFromStorage = (tokenType) => {
  localStorage.removeItem(tokenType);
};

const getRefreshToken = async () => {
  const response = await axios.post(api_url("/auth/refresh-token"), {
    refreshToken: localStorage.getItem("refreshToken"),
  });
  if (response.status !== 200) {
    removeTokenFromStorage("refreshToken");
    return Promise.reject("Failed to refresh token");
  }
  return response.data.token;
};

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      (error.response.status === UNAUTHORIZED ||
        error.response.status === FORBIDDEN) &&
      error?.response?.config?.url?.includes(BASE_URL)
    ) {
      if (localStorage.getItem("refreshToken")) {
        localStorage.removeItem("token");
        try {
          const token = getRefreshToken();
          localStorage.setItem("token", token);
          // return axios.request(error.config);
        } catch (error) {
          removeTokenFromStorage("token");
          removeTokenFromStorage("refreshToken");
          return Promise.reject(error);
        }
      }
    } else {
      return Promise.reject(error);
    }
  }
);
