"use client";
import { Toaster } from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import Sidebar from "../components/Sidebar";
import useStore from "@/store/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Layout({ children }) {
  const router = useRouter();

  useEffect(() => {
    if (useStore.getState().role !== "admin") {
      console.log("Unauthorized access");
      router.push("/");
    }
  });

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-right" />
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        {children}
      </div>
    </div>
  );
}
