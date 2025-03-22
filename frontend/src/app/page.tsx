'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This will / should become a landing page in the future.
// For now, it should only redirect users to the login page
export default function LandingPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    router.replace("/login");
  }, [router]);

  if (!mounted) return null;

  return <p>Redirecting...</p>;
}
