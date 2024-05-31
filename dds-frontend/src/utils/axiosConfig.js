import axios from "axios";
import useStore from "../store/store";

const axiosHttp = axios.create({
  baseURL: "http://localhost:8080",
});

axiosHttp.interceptors.request.use(
  (config) => {
    const { token } = useStore.getState();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosHttp;
