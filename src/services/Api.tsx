import axios from "axios";

const Api = axios.create({
  baseURL: "https://apis.allsoft.co/api/documentManagement",
});

export const setAuthToken = (token: string) => {
  if (token) {
    Api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete Api.defaults.headers.common["Authorization"];
  }
};

export default Api;
