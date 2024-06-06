import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const useStore = create(
  persist(
    (_set, _get) => ({
      token: "",
      email: "",
      twoFactorEnabled: false,
      twoFactorImage: "",
    }),
    {
      name: "secure-software-development",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useStore;
