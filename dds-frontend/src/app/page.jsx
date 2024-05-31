"use client";

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
    if (
      !localStorage.getItem("token") ||
      !localStorage.getItem("twoFatEnabled")
    ) {
      router.push("/login");
    }
    setTwoFatEnabled(localStorage.getItem("twoFatEnabled"));
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
    <main className="container mx-auto">
      <div className="flex">
        <div>
          <h1 className="text-4xl text-right font-bold">
            Secure Software Development
          </h1>
          <h2 className="text-4xl text-right">
            Best Practices, Frameworks, and Resources
          </h2>
        </div>
        <div>
          <p className="m-4">
            Secure software development is the process of developing software in
            a way that protects it from security vulnerabilities and threats.
            This involves identifying potential security risks, implementing
            security controls, and testing the software to ensure that it is
            secure. Secure software development is essential for protecting
            sensitive data, preventing cyber attacks, and maintaining the trust
            of users. In this guide, we will explore best practices, frameworks,
            and resources for secure software development.
          </p>
        </div>
      </div>
    </main>
  );
}
