"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAtomValue } from "jotai";
import Link from "next/link";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetAllUsers } from "../../../hooks/userService/useGetAllUsers";
import { useCreateFollowRequest } from "../../../hooks/followService/useCreateFollowRequest";
import { useGetFollowingRequests } from "../../../hooks/followService/useGetAllFollowingRequests";
import { User } from "../../../interfaces/user/User";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Avatar from "../../../components/Avatar";
import Button from "../../../components/Button";

const TrendingUsersPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const [page, setPage] = useState(1);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const { data: usersData, isLoading } = useGetAllUsers(page);
  const { data: userFollowingRequests } = useGetFollowingRequests(user.isAuthenticated);
  const { mutate: createFollowRequest } = useCreateFollowRequest();

  useEffect(() => {
    if (!usersData || !usersData.users.length) return;

    const { page: currentPage, limit, total } = usersData.pagination;

    if (currentPage * limit >= total) setHasMore(false);

    setDisplayedUsers((prevUsers) => {
      const usersMap = new Map(prevUsers.map((u) => [u.id, u]));

      for (const newUser of usersData.users) {
        if (
          newUser.id !== user.id &&
          newUser.name !== "Spectator" &&
          !usersMap.has(newUser.id)
        ) {
          usersMap.set(newUser.id, newUser);
        }
      }

      return Array.from(usersMap.values());
    });
  }, [usersData, user.id]);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastUserElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <h1 className="text-xl font-semibold">Trending Users</h1>

      <ul className="card divide-y divide-gray-300 p-0 dark:divide-slate-800">
        {displayedUsers.map((trendingUser, index) => {
          const isFollowingRequested = userFollowingRequests?.some(
            (request) => request.following.id === trendingUser.id
          );

          return (
            <li
              key={trendingUser.id}
              ref={index === displayedUsers.length - 1 ? lastUserElementRef : undefined}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <Link
                href={`/dashboard/users/profile?id=${trendingUser.id}`}
                className="flex min-w-0 items-center gap-3"
              >
                <Avatar src={trendingUser.profilePicture} name={trendingUser.name} />
                <div className="min-w-0">
                  <p className="truncate font-semibold hover:underline">{trendingUser.name}</p>
                  {trendingUser.bio && (
                    <p className="truncate text-sm text-muted">{trendingUser.bio}</p>
                  )}
                </div>
              </Link>

              {user.isAuthenticated && (
                <Button
                  variant={isFollowingRequested ? "secondary" : "primary"}
                  onClick={() => createFollowRequest({ followerId: user.id, followingId: trendingUser.id })}
                  disabled={isFollowingRequested}
                  className="shrink-0"
                >
                  {isFollowingRequested ? "Requested" : "Follow"}
                </Button>
              )}
            </li>
          );
        })}
      </ul>

      {isLoading && <LoadingSpinner />}
    </div>
  );
};

export default TrendingUsersPage;
