import { unsplash } from "./unsplash";

export const fetchImages = async ({pageParam=1}) => {
try {
    const res = await unsplash.get("/photos", {
    params: {
      page:pageParam,
      per_page: 8,
    },
  });
 
   if (res.status !== 200) {
      throw new Error("Invalid response from Unsplash");
    }

    return res.data;
  
} catch (error) {
  console.log(error)
}

};
