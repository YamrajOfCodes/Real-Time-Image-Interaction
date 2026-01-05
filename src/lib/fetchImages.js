import { unsplash } from "./unsplash";

export const fetchImages = async ({pageParam=1}) => {
  const res = await unsplash.get("/photos", {
    params: {
      page:pageParam,
      per_page: 8,
    },
  });

  return res.data;
};
