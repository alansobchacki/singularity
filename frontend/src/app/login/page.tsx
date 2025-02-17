"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // Fake login logic (replace with actual authentication)
    if (username === "admin" && password === "password") {
      router.push("/"); // Redirect to home page
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex flex-row h-screen bg-white">
      <div className="w-1/2 bg-blue-200"></div>
      <div className="w-1/2 flex flex-col justify-center items-center">
        <h1 className="text-xl font-bold text-black">Login</h1>
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
