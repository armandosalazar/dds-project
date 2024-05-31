"use client";

import { Button, Divider, Image, Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useStore from "../../store/store";
import axiosHttp from "../../utils/axiosConfig";
import toast, { Toaster } from "react-hot-toast";

export default function Profile() {
  /* Router */
  const router = useRouter();
  /* Store */
  const { token } = useStore.getState();
  /* State */
  const twoFactorEnabled = useStore((state) => state.twoFactorEnabled);
  const twoFactorImage = useStore((state) => state.twoFactorImage);

  useEffect(() => {
    verifySession();
  }, []);

  function verifySession() {
    if (token === "") {
      router.push("/");
    }
  }

  async function handleEnableTwoFat() {
    try {
      const res = await axiosHttp.get("/api/enable-2fa");

      if (res.data.twoFactorEnabled) {
        useStore.setState({ twoFactorEnabled: res.data.twoFactorEnabled });
        useStore.setState({ twoFactorImage: res.data.twoFactorImage });
      } else {
        useStore.setState({ twoFactorEnabled: res.data.twoFactorEnabled });
        useStore.setState({ twoFactorImage: "" });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.error);
    }
  }

  return (
    <main className="container mx-auto">
      <Toaster position="top-right" />
      <section className="p-4">
        <h2 className="font-bold">Profile</h2>
        <p>Manage your account settings.</p>
      </section>
      <Divider />
      <section className="p-4">
        <h2 className="font-bold">Email and Password</h2>
        <p>{useStore((state) => state.email)}</p>
        <p>********</p>
        <Button color="primary" variant="flat">
          Change Password
        </Button>
      </section>
      <Divider />
      <section className="p-4">
        <h2 className="font-bold">Two Factor Authentication</h2>
        <p>
          If you enable 2FA, you will need to enter a code every time you log
          in.
        </p>
        {twoFactorEnabled && (
          <Image src={`data:image/png;base64,${twoFactorImage}`} width={200} />
        )}
        <Switch isSelected={twoFactorEnabled} onChange={handleEnableTwoFat}>
          {twoFactorEnabled ? "Disable" : "Enable"} 2FA
        </Switch>
      </section>
    </main>
  );
}
