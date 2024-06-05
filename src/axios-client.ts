import axios from "axios";

const axiosClient = axios.create({
  baseURL:
    "http://a63b08641a04348858b07d0c71ac3eba-733487664.ap-southeast-1.elb.amazonaws.com:3000",
  // baseURL: "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
    // "Access-Control-Allow-Origin": "*",
    // "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
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
  }
  // function (error) {
  //   // Do something with request error
  //   return Promise.reject(error);
  // }
);

// Add a response interceptor
// axiosClient.interceptors.response.use(
//   function (response) {
//     // Any status code that lie within the range of 2xx cause this function to trigger
//     // Do something with response data
//     return response.data;
//   },
//   function (error) {
//     return Promise.reject(error);
//   }
// );

export default axiosClient;
