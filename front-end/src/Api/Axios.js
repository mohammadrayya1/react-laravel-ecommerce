import axios from "axios";
import { baseUrl } from "./Api";
import Cookie from "cookie-universal";

const cookie = Cookie();
const tokenAdmin = cookie.get("admin-token");

export const AxiosAdmin = axios.create({
  baseURL: baseUrl,
  headers: {
    Authorization: `Bearer ${tokenAdmin}`,
  },
});
