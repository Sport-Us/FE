import Axios from "axios";

export const axios = Axios.create({
  baseURL: "http://43.202.94.217/",
  withCredentials: true,
});

axios.interceptors.request.use((config) => {
  const token = window?.localStorage.getItem("accessToken");

  config.headers = config.headers || {};

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
