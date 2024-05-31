"use client";
import useStore from "../../store/store";

export default function Home() {
  return (
    <main className="container mx-auto">
      <h1 className="text-xl font-bold">
        Welcome {useStore((state) => state.email)} to the Secure Software
        Development!
      </h1>
      <p>
        Secure software development is the process of developing software in a
        way that protects it from security vulnerabilities and threats. This
        involves identifying potential security risks, implementing security
        controls, and testing the software to ensure that it is secure. Secure
        software development is essential for protecting sensitive data,
        preventing cyber attacks, and maintaining the trust of users. In this
        guide, we will explore best practices, frameworks, and resources for
        secure software development.
      </p>
    </main>
  );
}
