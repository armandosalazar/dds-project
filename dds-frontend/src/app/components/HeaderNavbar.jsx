"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useStore from "../../store/store";
import { useRouter } from "next/navigation";

export default function HeaderNavbar() {
  /* Hooks */
  const [isAuth, setIsAuth] = useState(false);
  /* Store */
  const { token, removeToken } = useStore();
  /* Router */
  const router = useRouter();

  useEffect(() => {
    setIsAuth(verifyAuth());
  });

  const verifyAuth = () => token !== "";

  function handleLogout() {
    removeToken();
    router.push("/");
  }

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/">
          <span className="font-bold">Secure Software Development</span>
        </Link>
      </NavbarBrand>
      {isAuth && (
        <>
          <NavbarContent justify="center">
            <NavbarItem>
              <Link href="/">Home</Link>
            </NavbarItem>
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
      {!isAuth && (
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
    </Navbar>
  );
}
