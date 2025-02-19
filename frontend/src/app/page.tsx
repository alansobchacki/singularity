"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { authStateAtom } from "../state/authState";

const homePage = () => {
  const router = useRouter();
  const [authState] = useAtom(authStateAtom);

  useEffect(() => {
    if (!authState.isAuthenticated) router.push("/login");
  }, [authState.isAuthenticated, router]);

  if (!authState.isAuthenticated) return null;

  return (
    <>
      <h1>It works!</h1>
      <p>And you shouldn't be viewing this if you're not logged in!</p>
    </>
  );
};

export default homePage;
