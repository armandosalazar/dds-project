import { Inter } from "next/font/google";
import "./globals.css";
import { NextUIProvider } from "@nextui-org/react";
import HeaderNavbar from "./components/HeaderNavbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Secure Software Development",
  description: "Secure Software Development",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <NextUIProvider>
          <HeaderNavbar />
          {children}
        </NextUIProvider>
      </body>
    </html>
  );
}
