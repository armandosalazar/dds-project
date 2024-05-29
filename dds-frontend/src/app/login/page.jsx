"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@nextui-org/react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  async function handleLogin() {
    const res = await axios.post("http://localhost:8080/api/login", { email, password })
    const data = res.data;

    if (data.twofactor) {
      setIsOpen(true);
    } else {
      router.push("/");
    }
  }

  async function handleVerifyCode2FA() {
    const res = await axios.post("http://localhost:8080/api/verify-2fa", { email, password })
    const data = res.data;

    if (data.twofactor) {
      setIsOpen(true);
    } else {
      router.push("/");
    }
  }

  return (
    <main>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Two Factor</ModalHeader>
          <ModalBody>
            <Input isRequired type="text" label={"Code"} placeholder="Enter your code" />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={() => {
              setIsOpen(false);
            }}>
              Cancel
            </Button>
            <Button color="primary">
              Verify
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <h1>
        Login
      </h1>
      <div>
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
