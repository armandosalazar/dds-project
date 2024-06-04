"use client";
import { useEffect } from "react";
import useStore from "../store/store";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const isLoggedIn = useStore.getState().token !== "";

  useEffect(() => {
    verifyAuth();
  }, []);

  function verifyAuth() {
    if (!isLoggedIn) {
      router.push("/auth");
    }
  }

  return (
    <main className="container mx-auto">
      {isLoggedIn && (
        <section>
          <h1 className="text-xl font-bold">
            Welcome {useStore((state) => state.email)} to the Secure Software
            Development!
          </h1>
          <p>
            Secure software development is the process of developing software in
            a way that protects it from security vulnerabilities and threats.
            This involves identifying potential security risks, implementing
            security controls, and testing the software to ensure that it is
            secure. Secure software development is essential for protecting
            sensitive data, preventing cyber attacks, and maintaining the trust
            of users. In this guide, we will explore best practices, frameworks,
            and resources for secure software development.
          </p>
        </section>
      )}
    </main>
  );
}
