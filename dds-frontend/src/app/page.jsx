"use client";

import { Button, Image, Navbar, NavbarBrand, NavbarContent, NavbarItem, Switch } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
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

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("twoFatEnabled");
    localStorage.removeItem("image");
    router.push("/login");
  }

  return (
    <main>
      <Navbar>
        <NavbarBrand>
          <h1 className="font-bold">
            Secure Software Development
          </h1>
        </NavbarBrand>
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              onClick={handleLogout}>
              Logout
            </Button>
          </NavbarItem>
        </NavbarContent>
      </Navbar>
      <section className="container mx-auto flex flex-col items-center p-4 max-w-fit my-4">
        <h2 className="text-center text-xl font-bold">Two Factor Authentication</h2>
        <p>If you enable 2FA, you will need to enter a code every time you log in.</p>
        {twoFatEnabled === "true" && (
          <Image src={imageBase64} width={200} />
        )}
        <Button
          color="primary"
          onClick={handleEnableTwoFat}>
          {twoFatEnabled === "false" ? "Enable" : "Disable"} 2FA
        </Button>
      </section>
    </main>
  );
}
