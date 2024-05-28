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
  }

  function handleLogout() {
    localStorage.removeItem("token");
    window.location.href = "login";
  }

  return (
    <main className={"container m-auto flex flex-col"}>
      <h1 className={"text-4xl font-bold text-center py-2 text-sky-500"}>
        Home page
      </h1>
      <button onClick={handleLogout} className={"underline text-slate-500"}>
        Logout
      </button>
    </main>
  );
}
