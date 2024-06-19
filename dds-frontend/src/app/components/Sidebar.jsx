"use client";

import useStore from "@/store/store";
import {
  AdjustmentsHorizontalIcon,
  HomeIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, MenuItem, Sidebar as Side } from "react-pro-sidebar";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(useStore.getState().role === "admin");
  });

  return (
    <Side
      rootStyles={{
        backgroundColor: "#fff !important",
        color: "#333",
      }}
    >
      <Menu
        menuItemStyles={{
          button: {
            [`&.active`]: {
              backgroundColor: "#13395e",
              color: "#b6c8d9",
            },
          },
        }}
      >
        <MenuItem
          icon={<HomeIcon className="h-6 w-6" />}
          component={<Link href="/" />}
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={<UserIcon className="h-6 w-6" />}
          component={<Link href="/profile" />}
        >
          Profile
        </MenuItem>
        {isAdmin && (
          <MenuItem
            icon={<AdjustmentsHorizontalIcon className="h-6 w-6" />}
            component={<Link href="/admin" />}
          >
            Manage
          </MenuItem>
        )}
      </Menu>
    </Side>
  );
}
