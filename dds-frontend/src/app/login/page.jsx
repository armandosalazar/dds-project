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

    if (data.error) {
      alert(data.error);
      return;
    }

    if (data.twoFatEnabled) {
      setIsOpen(true);
    } else {
      localStorage.setItem("token", data.token);
      localStorage.setItem("twoFatEnabled", data.twoFatEnabled);
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
      <Input
        type="email"
        label="Email"
        placeholder="Enter your email"
        onValueChange={setEmail}
      />
      <Input
        type="password"
        label="Password"
        placeholder="Enter your password"
        onValueChange={setPassword}
      />
      <Button
        onClick={handleLogin}
        color="primary"
      >
        Login
      </Button>
      <p className={"text-center my-2"}>
        Don't have an account?,{" "}
        <Link href="/register" className={"text-sky-300"}>
          Register
        </Link>
      </p>
    </main>
  );
}
