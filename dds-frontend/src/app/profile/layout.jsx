import { Toaster } from "react-hot-toast";
import Navbar from "@/app/components/Navbar";
import Sidebar from "../components/Sidebar";

export default function Layout({ children }) {
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
