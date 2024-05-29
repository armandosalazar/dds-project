"use client";

import { Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const [twoFatEnabled, setTwoFatEnabled] = useState(false);
  const [imageBase64, setImageBase64] = useState("");

  useEffect(() => {
    verifySession();
  }, []);

  function verifySession() {
    if (!localStorage.getItem("token")) {
      router.push("/login");
    }
    setTwoFatEnabled(localStorage.getItem("twoFatEnabled"));
  }

  async function handleEnableTwoFat() {
    const res = await axios.get("http://localhost:8080/api/enable-2fa", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    if (res.data.twoFatEnabled) {
      setImageBase64(`data:image/png;base64,${res.data.qrCode}`);
    }

    setTwoFatEnabled(res.data.twoFatEnabled);
    localStorage.setItem("twoFatEnabled", res.data.twoFatEnabled);
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("twoFatEnabled");
    router.push("/login");
  }

  return (
    <main>
      <h1>
        Home page
      </h1>
      <button onClick={handleLogout}>
        Logout
      </button>
      <img src={imageBase64} />
      <br />
      <Switch
        cheecked={`${twoFatEnabled}`}
        onChange={handleEnableTwoFat}>
        {twoFatEnabled ? "Disable" : "Enable"} 2FA
      </Switch>
    </main>
  );
}
