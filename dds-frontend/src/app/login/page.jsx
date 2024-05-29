"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    const res = await axios.post("http://localhost:8080/api/login", { email, password })
    const data = res.data;

    if (data.twofactor) {
      router.push("/two-factor");
    } else {
      router.push("/");
    }
  }

  return (
    <main className={"container m-auto"}>
      <h1 className={"text-4xl font-bold text-center py-2 text-sky-500"}>
        Login
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
          Login
        </button>
        <p className={"text-center my-2"}>
          Don't have an account?,{" "}
          <Link href="/register" className={"text-sky-300"}>
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
