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
  const [totp, setTotp] = useState("");

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
    try {
      const res = await axios.post("http://localhost:8080/api/verify-2fa", { email, totp })
      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("twoFatEnabled", data.twoFatEnabled);
      localStorage.setItem("image", data.image)
      router.push("/");
    } catch (error) {
      alert("Please enter a valid code");
      return;
    }
  }

  return (
    <main>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Two Factor</ModalHeader>
          <ModalBody>
            <Input isRequired type="text" label={"Code"} placeholder="Enter your code" onValueChange={setTotp} />
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onClick={() => {
              setIsOpen(false);
            }}>
              Cancel
            </Button>
            <Button color="primary" onClick={handleVerifyCode2FA}>
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
