import { init } from "@instantdb/react"; // Changed from @instantdb/core
import { i } from "@instantdb/core";

const APP_ID = "aef4df1b-447c-49c0-ba91-de4f8237a3d0";

export const schema = i.schema({
  entities: {
    
    reactions: i.entity({
      imageId: i.string(),
      emojis: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
    comments: i.entity({
      imageId: i.string(),
      text: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
});

export const db = init({ appId: APP_ID, schema });


