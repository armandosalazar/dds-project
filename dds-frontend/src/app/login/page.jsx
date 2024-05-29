"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { UsersIcon } from "@heroicons/react/24/outline";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [totp, setTotp] = useState("");

  async function handleLogin() {
    try {
      const res = await axios.post("http://localhost:8080/api/login", { email, password })

      const data = res.data;

      if (data.twoFatEnabled) {
        setIsOpen(true);
      } else {
        localStorage.setItem("token", data.token);
        localStorage.setItem("twoFatEnabled", data.twoFatEnabled);
        router.push("/");
      }
    } catch (error) {
      toast.error(error.response.data.error);
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
      toast.error(error.response.data.error);
      return;
    }
  }

  return (
    <main>
      <Toaster
        position="top-right"
      />
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

      <Card className="max-w-[400px] mx-auto my-40">
        <CardHeader>
          <UsersIcon className="w-8 h-8" />
          <Spacer x={2} />
          <div>
            <h2 className="font-bold text-2xl">Login</h2>
            <p className="text-sm text-gray-500">Login to your account</p>
          </div>
        </CardHeader>
        <Divider />
        <CardBody>
          <Input
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            onValueChange={setEmail}
          />
          <Spacer y={4} />
          <Input
            isRequired
            type="password"
            label="Password"
            placeholder="Enter your password"
            onValueChange={setPassword}
          />
          <Spacer y={4} />
          <Button
            onClick={handleLogin}
            color="primary"
          >
            Login
          </Button>
          <Spacer y={4} />
          <p className={"text-center text-small"}>
            Don't have an account?,{" "}
            <Link href="/register" className="text-blue-500">
              register
            </Link>
          </p>
        </CardBody>
        <Divider />
        <CardFooter>
          <p className="text-center text-xs">
            Secure Software Development
          </p>
        </CardFooter>
      </Card>
    </main>
  );
}
