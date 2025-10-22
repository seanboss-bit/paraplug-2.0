import { User } from "@/interface/interface";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type State = {
  user: User | null;
};

type Actions = {
  login: (userData: User) => void;
  logout: () => void;
};

export const useUserStore = create<State & Actions>()(
  persist(
    (set) => ({
      user: null,

      login: (userData) => set({ user: userData }),

      logout: () => set({ user: null }),
    }),
    {
      name: "user", // key name in localStorage
    }
  )
);
