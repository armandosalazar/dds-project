"use client";

import Link from "next/link";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer } from "@nextui-org/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    try {
      const res = await axios.post("http://localhost:8080/api/register", { email, password })

      toast.success("User register successfully")

    } catch (error) {
      toast.error(error.response.data.error)
    }
  }

  return (
    <main>
      <Toaster
        position="top-right"
      />
      <Card className="max-w-[400px] mx-auto my-40">
        <CardHeader>
          <UsersIcon className="w-8 h-8" />
          <Spacer x={2} />
          <div>
            <h2 className="font-bold text-2xl">Register</h2>
            <p className="text-sm text-gray-500">Register to your account</p>
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
            onClick={handleRegister}
            color="primary"
          >
            Register
          </Button>
          <Spacer y={4} />
          <p className={"text-center text-small"}>
            Already have an account?,{" "}
            <Link href="/login" className={"text-blue-500"}>
              login
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
