import axios from "axios";

const axiosClient = axios.create({
  baseURL: "https://a0d6-222-253-82-244.ngrok-free.app/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptors
// Add a request interceptor
axiosClient.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXlsb2FkIjp7InVzZXJfaWQiOiIwMThmZTJjOS1kOGZmLTdhZTctOTEwOC0xYTAzZThlYTU1ZDEiLCJyb2xlIjoidXNlciIsInNlc3Npb25faWQiOiJTeFNaREtxdGFRZGxOWWV3VmdnQyJ9LCJleHAiOjE3MzMyNjQ4MzQsImlhdCI6MTcxNzQ5NjgzNH0.BlXkkIFDEVOSxuTGzUMOW25VCdWX-AmKmaCm0TtLqoE";
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }

    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response.data;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default axiosClient;
