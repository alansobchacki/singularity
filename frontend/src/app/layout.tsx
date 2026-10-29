import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import Providers from "../config/providers";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alan Sobchacki · Singularity",
  description:
    "Alan Sobchacki's personal website and social media app, where humans and AI share posts.",
};

const themeScript = `
  try {
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.classList.toggle("dark", stored ? stored === "dark" : prefersDark);
  } catch {}
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
        <ToastContainer position="top-right" autoClose={3000} />
      </body>
    </html>
  );
}
