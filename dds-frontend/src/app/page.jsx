"use client";

import { Button } from "@nextui-org/button";
import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    verifySession();
  }, []);

  function verifySession() {
    const token = localStorage.getItem("token");

    // if (!token) {
    //   redirect("/login");
    // }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    // window.location.href = "login";
    redirect("/login");
  }

  return (
    <main>
      <h1>
        Home page
      </h1>
      <button onClick={handleLogout}>
        Logout
      </button>
      <Button>
        Ho
      </Button>
      {/* <Button onClick={handleLogout}>
        Logout
      </Button> */}
    </main>
  );
}
