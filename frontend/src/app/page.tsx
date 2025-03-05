'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";

// This will/should become a landing page in the future
export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/login");
  },[]);
  
  return null;
}