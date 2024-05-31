import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useStore = create(
  persist(
    (set) => ({
      token: "",
      setToken: (token) => set({ token }),
      removeToken: () => set({ token: "" }),
      email: "",
      setEmail: (email) => set({ email }),
      removeEmail: () => set({ email: "" }),
      twoFactorEnabled: false,
      setTwoFactorEnabled: (twoFactorEnabled) => set({ twoFactorEnabled }),
      removeTwoFactorEnabled: () => set({ twoFactorEnabled: false }),
      twoFactorImage: "",
    }),
    {
      name: "secure-software-development",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStore;
