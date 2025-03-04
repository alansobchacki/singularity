"use client"

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authStateAtom } from "../../state/authState";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authState, setAuthState] = useAtom(authStateAtom);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    setAuthState({id: "", isAuthenticated: false});
  
    router.replace("/login");
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <aside className="w-64 bg-gray-800 text-white p-4 sticky top-0 h-screen">
          <h2 className="text-lg font-bold">Dashboard</h2>
          <ul>
            <li><a href="/dashboard/">Home</a></li>
            <li><a href="/dashboard/settings">Settings</a></li>
            <li><a href="/dashboard/network">Network</a></li>
            <li>
              <button onClick={() => setIsLoggingOut(true)}>Logout</button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6 overflow-auto">{children}</main>

        {isLoggingOut && (
          <>
            <p>Do you really wish to logout?</p>
            <button onClick={handleLogout}>Yes</button>
            <button onClick={() => setIsLoggingOut(false)}>No</button>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
