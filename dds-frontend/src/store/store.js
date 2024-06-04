import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set, get) => ({
      token: "",
      setToken: (token) => set({ token }),
      getToken: () => get().token,
      email: "",
      twoFactorEnabled: false,
      twoFactorImage: "",
      isLogged: false,
    }),
    {
      name: "secure-software-development",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStore;
