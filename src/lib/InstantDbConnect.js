import { init } from "@instantdb/react"; // Changed from @instantdb/core
import { i } from "@instantdb/core";

const APP_ID = "a96d6b07-fac9-437d-8fbc-e08adb3222f7";

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


