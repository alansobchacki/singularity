"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import FeedOutlinedIcon from "@mui/icons-material/FeedOutlined";
import GroupOutlinedIcon from "@mui/icons-material/GroupOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SportsEsportsOutlinedIcon from "@mui/icons-material/SportsEsportsOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { authStateAtom } from "../../state/authState";
import { api } from "../../config/axios";
import { useGetCurrentUserDetails } from "../../hooks/userService/useGetCurrentUserDetails";
import Avatar from "../../components/Avatar";
import Button from "../../components/Button";
import Modal from "../../components/Modal";
import ThemeToggle from "../../components/ThemeToggle";

const navItems = [
  { href: "/dashboard", label: "Timeline", icon: FeedOutlinedIcon, membersOnly: false },
  { href: "/dashboard/trending-users", label: "Trending users", icon: TrendingUpIcon, membersOnly: false },
  { href: "/dashboard/games", label: "Games", icon: SportsEsportsOutlinedIcon, membersOnly: false },
  { href: "/dashboard/connections", label: "Connections", icon: GroupOutlinedIcon, membersOnly: true },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useAtom(authStateAtom);
  const { data: currentUser } = useGetCurrentUserDetails(authState.isAuthenticated);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const queryClient = useQueryClient();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await api.post("/api/v1/auth/logout");
    queryClient.clear();
    setAuthState({ id: "", credentials: "", isAuthenticated: false });
    setIsLoggingOut(false);
    router.replace("/dashboard");
  };

  const sidebar = (
    <div className="flex h-full flex-col justify-between gap-8">
      <div className="flex flex-col gap-8">
        <Link href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
          <p className="font-custom text-2xl tracking-wider">SINGULARITY</p>
        </Link>

        <nav className="flex flex-col gap-1">
          {navItems
            .filter((item) => !item.membersOnly || authState.isAuthenticated)
            .map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition ${
                  pathname === href || (href === "/dashboard/games" && pathname.startsWith(href))
                    ? "bg-white/20 text-white dark:bg-slate-800 dark:text-white"
                    : "text-white hover:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                <Icon fontSize="small" />
                {label}
              </Link>
            ))}
          <a
            href="https://www.redbubble.com/people/Ripper19/shop?ref=account-nav-dropdown"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white transition hover:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <StorefrontOutlinedIcon fontSize="small" />
            Merch
          </a>
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        {authState.isAuthenticated ? (
          <Link
            href={`/dashboard/users/profile?id=${authState.id}`}
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/10 dark:hover:bg-slate-800"
          >
            <Avatar src={currentUser?.profilePicture} name={currentUser?.name} size={32} />
            <span className="truncate text-sm font-medium">{currentUser?.name}</span>
          </Link>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-center text-sm font-medium text-blue-600 hover:bg-blue-50 dark:bg-emerald-500 dark:text-slate-950 dark:hover:bg-emerald-400"
            >
              Sign up
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-white/60 px-4 py-2 text-center text-sm font-medium text-white hover:bg-white/10 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Sign in
            </Link>
          </div>
        )}

        <div className="border-t border-white/20 pt-3 dark:border-slate-800">
          <ThemeToggle />
          {authState.isAuthenticated && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsLoggingOut(true);
              }}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-white hover:bg-white/10 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <LogoutIcon fontSize="small" />
              Log out
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 p-5 bg-gradient-to-t from-blue-500 to-blue-400 text-white dark:bg-none dark:bg-slate-900 dark:text-slate-100 dark:border-r dark:border-slate-800 md:block">
        {sidebar}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between bg-blue-500 px-4 py-3 text-white backdrop-blur dark:border-b dark:border-slate-800 dark:bg-slate-900/80 dark:text-slate-100 md:hidden">
          <Link href="/dashboard" className="font-custom text-xl tracking-wider">
            SINGULARITY
          </Link>
          <button
            id="hamburger-menu-button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open menu"
            className="rounded-lg p-2 hover:bg-white/10 dark:hover:bg-slate-800"
          >
            <MenuIcon />
          </button>
        </header>

        <main className="flex-1 px-4 py-8 sm:px-6">{children}</main>
      </div>

      {isMobileMenuOpen && (
        <div id="mobile-menu" className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-gray-950/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative h-full w-72 p-5 bg-gradient-to-t from-blue-500 to-blue-400 text-white dark:bg-none dark:bg-slate-900 dark:text-slate-100">
            <button
              id="close-mobile-menu-button"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              className="absolute right-4 top-4 rounded-lg p-1 hover:bg-white/10 dark:hover:bg-slate-800"
            >
              <CloseIcon fontSize="small" />
            </button>
            {sidebar}
          </div>
        </div>
      )}

      {isLoggingOut && (
        <Modal title="Do you really wish to logout?" onClose={() => setIsLoggingOut(false)}>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsLoggingOut(false)}>
              No
            </Button>
            <Button onClick={handleLogout}>Yes</Button>
          </div>
        </Modal>
      )}
    </div>
  );
}
