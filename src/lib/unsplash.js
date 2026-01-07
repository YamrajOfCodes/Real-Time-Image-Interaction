import axios from "axios";

const AUTHORIZATION = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;


export const unsplash = axios.create({
  baseURL: "https://api.unsplash.com",
  headers: {
    Authorization:AUTHORIZATION
  },
});
