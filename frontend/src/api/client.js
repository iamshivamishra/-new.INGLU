import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("inglu_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Give a clear, actionable message when the backend can't be reached at all
// (as opposed to a normal 4xx/5xx response), since that's the most common
// setup issue ("login not working" usually means the API server isn't running).
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (!error.response) {
      error.response = {
        data: {
          message:
            "Can't reach the INGLU EMS server. Make sure the backend is running (npm run dev in /backend) on port 5000, and that MongoDB is running too.",
        },
      };
    }
    return Promise.reject(error);
  }
);

export default api;
