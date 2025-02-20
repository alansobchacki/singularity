"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { hydratedAuthStateAtom } from "../state/authState";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAtomValue(hydratedAuthStateAtom);
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !auth.isAuthenticated) {
      router.push("/login");
    }
  }, [auth.isAuthenticated, isHydrated, router]);

  if (!isHydrated) return null;

  return <>{children}</>;
}
