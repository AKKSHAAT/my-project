import Axios from "axios";

const axios = Axios.create({
  // baseURL: 'http://192.168.29.48:6969/',
  baseURL: "http://localhost:6969/",
  timeout: 50000,
});

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth");
    if (token) {
      config.headers["authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axios;
