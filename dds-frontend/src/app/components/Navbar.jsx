"use client";

import {
  Navbar as Nav,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Divider,
} from "@nextui-org/react";
import Link from "next/link";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const [isLogged, setIsLogged] = useState(false);

  useEffect(() => {
    function verifySession() {
      const token = useStore.getState().token;
      setIsLogged(token !== undefined);
    }

    verifySession();
  }, []);

  function handleLogout() {
    useStore.setState({ token: undefined });
    useStore.setState({ role: undefined });
    useStore.setState({ twoFactorEnabled: undefined });
    useStore.setState({ twoFactorImage: undefined });

    setIsLogged(false);

    router.push("/login");
  }

  return (
    <Nav>
      <NavbarBrand>
        <Link href="/">
          <span className="font-bold">Secure Software Development</span>
        </Link>
      </NavbarBrand>
      {isLogged && (
        <>
          <NavbarContent justify="center">
            <NavbarItem>
              <Link href="/">Home</Link>
            </NavbarItem>
            {useStore.getState().role === "admin" && (
              <NavbarItem>
                <Link href="/admin">Manage</Link>
              </NavbarItem>
            )}
            <NavbarItem>
              <Link href="/profile">Profile</Link>
            </NavbarItem>
          </NavbarContent>
          <NavbarContent justify="end">
            <NavbarItem>
              <Button color="primary" variant="flat" onClick={handleLogout}>
                Logout
              </Button>
            </NavbarItem>
          </NavbarContent>
        </>
      )}
      {!isLogged && (
        <NavbarContent justify="end">
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </NavbarItem>
          <NavbarItem>
            <Button
              color="primary"
              variant="flat"
              onClick={() => router.push("/register")}
            >
              Register
            </Button>
          </NavbarItem>
        </NavbarContent>
      )}
    </Nav>
  );
}
