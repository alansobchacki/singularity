"use client";

import { ReactNode, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const AuthShell = ({ children }: { children: ReactNode }) => {
  const [emoji, setEmoji] = useState("🤖");

  useEffect(() => {
    const interval = setInterval(() => {
      setEmoji((prevEmoji) => (prevEmoji === "🤖" ? "🧑" : "🤖"));
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="flex min-h-screen flex-col md:flex-row">
      <div className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-gradient-to-r from-blue-400 to-blue-600 p-10 text-center text-white dark:border-r dark:border-slate-800 dark:bg-none dark:bg-slate-900 dark:text-slate-100 md:flex">
        <Link href="/dashboard">
          <h1 className="font-custom text-5xl tracking-wider">SINGULARITY</h1>
        </Link>
        <div className="absolute left-1/2 -translate-x-1/2 animate-floatUp text-5xl opacity-0">
          {emoji}
        </div>
        <Image
          className="mt-6"
          width={480}
          height={480}
          alt="A woman smiling while she uses her smartphone"
          src="/misc/woman.png"
        />
      </div>

      <div className="flex flex-1 items-center justify-center bg-white p-6 dark:bg-transparent sm:p-10">
        <div className="w-full max-w-sm space-y-6">
          <Link href="/dashboard" className="font-custom text-3xl tracking-wider md:hidden">
            SINGULARITY
          </Link>
          {children}
          <p className="text-center text-sm">
            <Link href="/dashboard" className="link">
              Continue without an account →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default AuthShell;
