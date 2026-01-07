import { init } from "@instantdb/react";
import { i } from "@instantdb/core";

const APP_ID =import.meta.env.VITE_INSTANT_APP_ID;

export const schema = i.schema({
  entities: {
    
    reactions: i.entity({
      imageId: i.string(),
      userName:i.string(),
      emojis: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
    comments: i.entity({
      userName:i.string(),
      imageId: i.string(),
      text: i.string(),
      userId: i.string(),
      createdAt: i.number(),
    }),
  },
});

export const db = init({ appId: APP_ID, schema });


