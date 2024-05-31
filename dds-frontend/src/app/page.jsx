"use client";

import useStore from "../store/store";

export default function Home() {
  const { token } = useStore();
  return (
    <main className="container mx-auto">
      <div className="flex justify-between">
        <div className="w-1/2 text-right m-4">
          <h1 className="text-2xl font-bold">Secure Software Development</h1>
          <h1>Best Practices, Frameworks, and Resources</h1>
        </div>
        <p className="m-4 w-1/2">
          Secure software development is the process of developing software in a
          way that protects it from security vulnerabilities and threats. This
          involves identifying potential security risks, implementing security
          controls, and testing the software to ensure that it is secure. Secure
          software development is essential for protecting sensitive data,
          preventing cyber attacks, and maintaining the trust of users. In this
          guide, we will explore best practices, frameworks, and resources for
          secure software development.
        </p>
      </div>
    </main>
  );
}
