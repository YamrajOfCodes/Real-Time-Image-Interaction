import { create } from "zustand";

const STORAGE_KEY = "realtime-gallery-user";

const createUser = () => {
  return {
    id: crypto.randomUUID(),
    name: generateName(),
    color: generateColor(),
  };
};

const generateName = () => {
  const adjectives = ["Cool", "Fast", "Lazy", "Smart", "Happy"];
  const animals = ["Cat", "Dog", "Fox", "Panda", "Tiger"];
  return (
    adjectives[Math.floor(Math.random() * adjectives.length)] +
    animals[Math.floor(Math.random() * animals.length)]
  );
};

const generateColor = () => {
  const colors = ["red", "blue", "green", "purple", "orange"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const useUserStore = create((set) => {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (stored) {
    return JSON.parse(stored);
  }

  const user = createUser();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  return user;
});
