"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@nextui-org/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NavbarComponent() {
  const router = useRouter();

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("twoFatEnabled");
    localStorage.removeItem("image");
    router.push("/login");
  }

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/">
          <span className="font-bold">Secure Software Development</span>
        </Link>
      </NavbarBrand>
      <NavbarContent justify="center">
        <NavbarItem>
          <Link href="/home">Home</Link>
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
    </Navbar>
  );
}
