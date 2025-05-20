"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetAllUsers } from "../../../hooks/userService/useGetAllUsers";
import { useCreateFollowRequest } from "../../../hooks/followService/useCreateFollowRequest";
import { useGetFollowingRequests } from "../../../hooks/followService/useGetAllFollowingRequests";
import { User } from "../../../interfaces/user/User";
import LoadingSpinner from "../../../components/LoadingSpinner";
import Button from "../../../components/Button";
import Image from "next/image";
import Link from "next/link";

const TrendingUsersPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const [page, setPage] = useState(1);
  const [displayedUsers, setDisplayedUsers] = useState<User[]>([]);
  const { data: usersData, isLoading } = useGetAllUsers(page);
  const { data: userFollowingRequests } = useGetFollowingRequests();
  const { mutate: createFollowRequest } = useCreateFollowRequest();
  const [hasMore, setHasMore] = useState(true);

  const handleFollowAction = (followingId: string) => {
    createFollowRequest({ followerId: user.id, followingId });
  };

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
    (node: HTMLDivElement) => {
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
    <div className="flex flex-col w-full justify-center items-center gap-6">
      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {user.credentials === "SPECTATOR" ? (
          <h1 className="text-black text-center">
            You can&apos;t follow anyone since you&apos;re a spectator 😔
          </h1>
        ) : (
          <h1 className="text-black text-center">
            👥 Follow more people to see more content in your timeline!
          </h1>
        )}
      </div>

      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md gap-5">
        {displayedUsers.map((trendingUser: User, index: number) => {
          const isFollowingRequested = userFollowingRequests?.some(
            (request: { following: { id: string } }) =>
              request.following.id === trendingUser.id
          );

          const refProp =
            index === displayedUsers.length - 1
              ? { ref: lastUserElementRef }
              : {};

          return (
            <div
              key={trendingUser.id}
              {...refProp}
              className="flex max-sm:flex-col max-sm:items-start justify-between items-center gap-1"
            >
              <div className="flex gap-5 items-center">
                <Image
                  className="rounded-full border-2 border-blue-500"
                  width={42}
                  height={42}
                  src={trendingUser?.profilePicture}
                  alt={`${trendingUser?.name}'s avatar`}
                />
                <Link
                  className="text-black font-semibold"
                  href={`/dashboard/users/profile?id=${trendingUser.id}`}
                >
                  {trendingUser?.name}
                </Link>
              </div>

              <Button
                onClick={() => handleFollowAction(trendingUser?.id)}
                size={150}
                content={isFollowingRequested ? "Request Sent" : "Follow"}
                disabled={
                  isFollowingRequested || user?.credentials === "SPECTATOR"
                }
              />
            </div>
          );
        })}

        {isLoading && (
          <div className="flex flex-col bg-gray-100 p-4 rounded-lg gap-5">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </div>
  );
};

export default TrendingUsersPage;
