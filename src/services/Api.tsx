import axios from "axios";

const Api = axios.create({
  baseURL: "https://apis.allsoft.co/api/documentManagement",
});

export default Api;
