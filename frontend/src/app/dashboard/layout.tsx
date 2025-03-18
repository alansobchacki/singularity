"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { useRouter } from "next/navigation";
import { authStateAtom } from "../../state/authState";
import { useGetCurrentUserDetails } from "../../hooks/userService/useGetCurrentUserDetails";
import { useQueryClient } from "@tanstack/react-query";
import Button from "../../components/Button";
import FeedIcon from "@mui/icons-material/Feed";
import GroupIcon from "@mui/icons-material/Group";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import LogoutIcon from "@mui/icons-material/Logout";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [authState, setAuthState] = useAtom(authStateAtom);
  const { data: currentUserData } = useGetCurrentUserDetails();
  const queryClient = useQueryClient();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    queryClient.clear();

    setAuthState({ id: "", isAuthenticated: false });

    router.replace("/login");
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen">
        <aside className="flex flex-col justify-between w-64 bg-blue-500 text-white p-4 sticky top-0 h-screen">
          <ul className="flex flex-col gap-2 pl-[20px]">
            <div className="flex mb-6">
              <Link
                href={`/dashboard/users/profile?id=${currentUserData?.id}`}
                className="font-semibold"
              >
                Hello, {currentUserData?.name}
              </Link>
            </div>
            <div className="flex gap-2">
              <FeedIcon />
              <Link href="/dashboard">
                <li className="font-semibold">Timeline</li>
              </Link>
            </div>
            <div className="flex gap-2">
              <GroupIcon />
              <Link href="/dashboard/connections">
                <li className="font-semibold">Connections</li>
              </Link>
            </div>
            <div className="flex gap-2">
              <TrendingUpIcon />
              <Link href="/dashboard/trending-users">
                <li className="font-semibold">Trending Users</li>
              </Link>
            </div>
          </ul>

          {/* Add a settings page later for users to update their account settings
            <Link href="/dashboard/settings">
              <p>Settings</p>
            </Link>
            */}
          <div className="pl-[20px]">
            <div className="flex gap-2">
              <LogoutIcon />
              <button
                className="font-semibold"
                onClick={() => setIsLoggingOut(true)}
              >
                Logout
              </button>
            </div>
          </div>
        </aside>

        <main className="flex flex-col p-6 w-full items-center overflow-auto bg-gray-200">
          {children}
        </main>

        {isLoggingOut && (
          <>
            <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 w-[250px] h-[250px] rounded-lg z-10">
              <p className="text-black mb-6">Do you really wish to logout?</p>
              <Button onClick={handleLogout} size={150} text={"Yes"} />
              <Button
                onClick={() => setIsLoggingOut(false)}
                size={150}
                text={"No"}
              />
            </div>

            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-50 z-9"
              onClick={() => setIsLoggingOut(false)}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
