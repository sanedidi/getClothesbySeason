import axios from "axios";

const httpRequestAuth = axios.create({
  baseURL: "https://admin-api.ucode.run/v2/object",
  timeout: 100000,
  headers: {
    Authorization: "API-KEY",
    "X-API-KEY": "P-ai8jhYIGkNEcCOVBrMs3dRlnL0Vnw9dO"
  },
});

const errorHandler = (error) => {
  if (error?.response) {
    const description = error.response?.data?.data
      ? JSON.stringify(error.response.data.data)
      : "";


  } else {

  }

  return Promise.reject(error.response);
};

httpRequestAuth.interceptors.response.use(
  (response) => response.data.data,
  errorHandler
);

export default httpRequestAuth;
