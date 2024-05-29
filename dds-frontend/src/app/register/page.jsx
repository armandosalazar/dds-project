"use client";

import Link from "next/link";
import { useState } from "react";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin() {
    fetch("http://localhost:8080/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.error) {
          alert(res.error);
          return;
        }

        localStorage.setItem("token", res.token);
        window.location.href = "/login";
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred");
      });
  }

  return (
    <main className={"container m-auto"}>
      <h1 className={"text-4xl font-bold text-center py-2 text-sky-500"}>
        Register
      </h1>
      <div
        className={
          "shadow-slate-50 border border-sky-400 flex flex-col p-4 rounded-md"
        }
      >
        <input
          className={"border border-sky-400 p-2 mb-2 rounded-md"}
          type={"text"}
          placeholder={"Email"}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type={"password"}
          className={"border border-sky-400 p-2 mb-2 rounded-md"}
          placeholder={"Password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className={"bg-sky-400 text-white p-2 rounded-md"}
        >
          Register
        </button>
        <p className={"text-center my-2"}>
          Already have an account?,{" "}
          <Link href="/login" className={"text-sky-300"}>
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
