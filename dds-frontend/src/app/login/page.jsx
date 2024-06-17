"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spacer,
} from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import { UsersIcon } from "@heroicons/react/24/outline";
import useStore from "../../store/store";
import { EyeFilledIcon } from "../icons/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../icons/EyeSlashFilledIcon";

export default function Login() {
  /* Hooks */
  const router = useRouter();
  const axiosHttp = axios.create({
    baseURL: "http://localhost:8080",
  });
  /* State */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [totp, setTotp] = useState("");
  /* Store */
  const { setToken, setTwoFactorEnabled } = useStore();
  /* Regex */
  const validateEmail = (email) =>
    email.match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}$/i);
  const validatePassword = (password) =>
    password.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    );

  async function handleLogin() {
    try {
      if (!validateEmail(email)) {
        toast.error("Please enter a valid email address.");
        return;
      }

      if (!validatePassword(password)) {
        toast.error(
          "The password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one digit and one special character (@, $, !, %, *, ?, ?, &). Please try again."
        );
        return;
      }

      const response = await axiosHttp.post("/api/login", {
        email,
        password,
      });

      if (response.data.twoFactorEnabled) {
        useStore.setState({ twoFactorEnabled: response.data.twoFactorEnabled });

        setIsOpen(response.data.twoFactorEnabled);
      } else {
        useStore.setState({ token: response.data.token });
        useStore.setState({ role: response.data.role });

        setIsOpen(response.data.twoFactorEnabled);
        toast.success(response.data.message);
        router.push("/");
      }
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  async function handleVerifyCode2FA() {
    try {
      const res = await axiosHttp.post("/api/verify-2fa", {
        email,
        totp,
      });

      useStore.setState({ email: email });
      setToken(res.data.token);
      setTwoFactorEnabled(res.data.twoFactorEnabled);
      useStore.setState({ twoFactorImage: res.data.twoFactorImage });

      router.push("/");
    } catch (error) {
      toast.error(error.response.data.error);
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <main>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalContent>
          <ModalHeader>Two Factor</ModalHeader>
          <ModalBody>
            <Input
              isRequired
              type="text"
              label={"Code"}
              placeholder="Enter your code"
              onValueChange={setTotp}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              color="danger"
              variant="light"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button color="primary" onClick={handleVerifyCode2FA}>
              Verify
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Card className="max-w-[400px] mx-auto my-32">
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
            isInvalid={!validateEmail(email)}
            isClearable
            isRequired
            type="email"
            label="Email"
            placeholder="Enter your email"
            onValueChange={setEmail}
            errorMessage={"Please enter a valid email address."}
          />
          <Spacer y={4} />
          <Input
            isRequired
            isInvalid={!validatePassword(password)}
            type={isVisible ? "text" : "password"}
            label="Password"
            placeholder="Enter your password"
            onValueChange={setPassword}
            errorMessage={
              "The password must be at least 8 characters long, including at least one uppercase letter, one lowercase letter, one digit and one special character (@, $, !, %, *, ?, ?, &). Please try again."
            }
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
          />
          <Spacer y={4} />
          <Button onClick={handleLogin} color="primary">
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
          <p className="text-center text-xs">Secure Software Development</p>
        </CardFooter>
      </Card>
    </main>
  );
}
