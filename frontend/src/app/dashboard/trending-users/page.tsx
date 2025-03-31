"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetAllUsers } from "../../../hooks/userService/useGetAllUsers";
import { useCreateFollowRequest } from "../../../hooks/followService/useCreateFollowRequest";
import { useGetFollowingRequests } from "../../../hooks/followService/useGetAllFollowingRequests";
import Button from "../../../components/Button";
import Image from "next/image";
import Link from "next/link";

const TrendingUsersPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: usersData } = useGetAllUsers();
  const { data: userFollowingRequests } = useGetFollowingRequests();
  const { mutate: createFollowRequest } = useCreateFollowRequest();

  const handleFollowAction = (followingId: string) => {
    createFollowRequest(
      { followerId: user.id, followingId },
      {
        onSuccess: () => {
          console.log("Follow request created successfully.");
        },
        onError: (error) => {
          console.error(error.message);
        },
      }
    );
  };

  useEffect(() => {
    console.log(usersData);
  }, [usersData]);

  return (
    <div
      id="main-container"
      className="flex flex-col w-full justify-center items-center gap-6"
    >
      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {user.credentials === "SPECTATOR" ? (
          <h1 className="text-black text-center">
            You can't follow anyone since you're an spectator 😔
          </h1>
        ) : (
          <h1 className="text-black text-center">
            👥 Follow more people to see more content in your timeline!
          </h1>
        )}
      </div>

      <div
        id="trending-users-container"
        className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md gap-5"
      >
        {usersData?.length > 0 &&
          usersData
            .filter(
              (trendingUser: any) =>
                trendingUser.id !== user.id && trendingUser.name !== "Spectator"
            )
            .map((trendingUser: any, index: number) => {
              const isFollowingRequested = userFollowingRequests?.some(
                (request: { following: { id: string } }) =>
                  request.following.id === trendingUser.id
              );

              return (
                <div
                  key={index}
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
                    text={isFollowingRequested ? "Request Sent" : "Follow"}
                    disabled={
                      isFollowingRequested || user?.credentials === "SPECTATOR"
                    }
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default TrendingUsersPage;
