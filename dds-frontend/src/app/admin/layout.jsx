import { Toaster } from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function Layout({ children }) {
  return (
    <div className="container mx-auto">
      <Navbar />
      <Toaster />
      {children}
    </div>
  );
}
