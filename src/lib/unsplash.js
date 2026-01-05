import axios from "axios";

export const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization: `Client-ID XoPRrhpn6-_rsvNu2ivHWYZDortB-303pd8s9I_fhVI`,
  },
});
