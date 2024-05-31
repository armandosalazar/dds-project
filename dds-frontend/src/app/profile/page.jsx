"use client";
import { Divider, Image, Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const router = useRouter();
  const [twoFatEnabled, setTwoFatEnabled] = useState("false");
  const [imageBase64, setImageBase64] = useState("");

  useEffect(() => {
    verifySession();
  }, []);

  function verifySession() {
    if (!localStorage.getItem("token") || !localStorage.getItem("twoFatEnabled")) {
      router.push("/login");
    }
    setTwoFatEnabled(localStorage.getItem("twoFatEnabled"))
    setImageBase64(`data:image/png;base64,${localStorage.getItem("image")}`);

    console.log(twoFatEnabled);
  }

  async function handleEnableTwoFat() {
    const res = await axios.get("http://localhost:8080/api/enable-2fa", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.twoFatEnabled) {
      localStorage.setItem("image", res.data.image);
      setImageBase64(`data:image/png;base64,${res.data.image}`);
    } else {
      localStorage.removeItem("image");
    }

    localStorage.setItem("twoFatEnabled", res.data.twoFatEnabled);
    setTwoFatEnabled(res.data.twoFatEnabled.toString());
  }
  return (
    <main className="container border border-slate-300 mx-auto">
      <section className="p-4">
        <h1 className="font-bold">Profile</h1>
        <p>Manage your account settings.</p>
      </section>
      <Divider />
      <section className="p-4">
        <h2 className="font-bold">Two Factor Authentication</h2>
        <p>If you enable 2FA, you will need to enter a code every time you log in.</p>
        {twoFatEnabled === "true" && (
          <Image src={imageBase64} width={200} />
        )}
        <Switch isSelected={twoFatEnabled === "true"} onChange={handleEnableTwoFat}>
          {twoFatEnabled === "false" ? "Enable" : "Disable"} 2FA
        </Switch>
      </section>
    </main>
  );
}