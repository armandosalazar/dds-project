import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="container mx-auto">
      <Toaster position="top-right" />
      <Navbar />
      {children}
    </div>
  );
}
