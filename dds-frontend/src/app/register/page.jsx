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
  Spacer,
} from "@nextui-org/react";
import toast from "react-hot-toast";
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

  async function handleRegister() {
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

      const res = await axiosHttp.post("/api/register", {
        email,
        password,
      });

      toast.success(res.data.message);
      toast.success("now you can login");
    } catch (err) {
      toast.error(err.response.data.error);
    }
  }

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <main>
      <Card className="max-w-[400px] mx-auto my-4">
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
          {/* <Input
          label="First Name"
          placeholder="Enter your first name"
          isRequired
          />
          <Spacer y={4} />
          <Input
          label="Last Name"
          placeholder="Enter your last name"
            isRequired
          />
          <Spacer y={4} />
          <DateInput label="Date of Birth" />
          <Spacer y={4} /> */}
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
          <Button onClick={handleRegister} color="primary">
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
          <p className="text-center text-xs">Secure Software Development</p>
        </CardFooter>
      </Card>
    </main>
  );
}
