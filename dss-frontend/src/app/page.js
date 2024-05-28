"use client";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    verifySession();
  }, []);

  function verifySession() {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "login";
    }

    fetch("http://localhost:8080/api/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          window.location.href = "login";
        }
      })
      .catch((err) => {
        console.error(err);
        window.location.href = "login";
      });
  }

  return (
    <main>
      <h1>Home page</h1>
    </main>
  );
}
