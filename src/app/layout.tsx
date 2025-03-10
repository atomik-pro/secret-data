import "./globals.css";
import type { Metadata } from 'next';
import { Providers } from "./Providers";
import Navbar from "@/components/Navbar/Navbar";

export const metadata: Metadata = {
  title: "Secret Data Register",
  description: "Aplicación para el registro de ajustes",
};

export default function RootLayout({ children, }: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className='font-poppins'>
          <Providers>
            <Navbar />
            {children}
          </Providers>
      </body>
    </html>
  );
}