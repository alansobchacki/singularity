'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Used to fire up the API and help mitigate cold starts
  useEffect(() => {
    setMounted(true);

    fetch(process.env.NEXT_PUBLIC_API_URL + "/api/v1" || "http://localhost:3800/api/v1")
    .then(() => console.log("API warmed up"))
    .catch((err) => console.error("API warm-up failed:", err));

    router.replace("/login");
  }, [router]);

  if (!mounted) return null;

  return <p>Redirecting...</p>;
}
