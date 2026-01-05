import {create} from "zustand";

export const imageStore = create((set) => ({
  imgPicker: null,
  setImg: (data) => set({ imgPicker: data }),
}))