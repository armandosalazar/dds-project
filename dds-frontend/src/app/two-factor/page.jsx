"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const [qrCode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    loadQr();
  }, []);

  function loadQr() {
    const qr = localStorage.getItem("qr");
    const token = localStorage.getItem("token");

    setQrCode(qr);
    setToken(token);
  }

  function handleVerify() {
    fetch("http://localhost:8080/api/two-factor/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, token }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.error);
          return;
        }

        // localStorage.setItem("token", res.token);
        window.location.href = "/";
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred");
      });
  }

  return (
    <main>
      <h1 className={"text-4xl font-bold text-center py-2 text-sky-500"}>
        Two-Factor Authentication
      </h1>
      <div className="container shadow m-auto flex flex-col items-center">
        <p className={"text-center pt-4"}>
          Scan the QR code with your authenticator app
        </p>
        <img src={qrCode} width={"500px"} />

        <div className={"flex items-center pb-4"}>
          <input
            className={"border border-sky-400 p-2 rounded-md mr-4"}
            type={"text"}
            placeholder={"Code"}
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button
            onClick={handleVerify}
            className={"bg-sky-400 text-white p-2 rounded-md"}
          >
            Verify
          </button>
        </div>
      </div>
    </main>
  );
}
