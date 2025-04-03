"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetAllUsers } from "../../../hooks/userService/useGetAllUsers";
import { useCreateFollowRequest } from "../../../hooks/followService/useCreateFollowRequest";
import { useGetFollowingRequests } from "../../../hooks/followService/useGetAllFollowingRequests";
import Button from "../../../components/Button";
import Alert from "../../../components/Alert";
import Image from "next/image";
import Link from "next/link";

const TrendingUsersPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: usersData } = useGetAllUsers();
  const { data: userFollowingRequests } = useGetFollowingRequests();
  const { mutate: createFollowRequest } = useCreateFollowRequest();
  const [alertState, setAlertState] = useState<{
    message: string;
    positive: boolean;
    show: boolean;
  }>({ message: "", positive: true, show: false });

  const handleFollowAction = (followingId: string, userName: string) => {
    createFollowRequest(
      { followerId: user.id, followingId },
      {
        onSuccess: () => {
          setAlertState({
            message: `Follow request sent to ${userName}!`,
            positive: true,
            show: true
          });
          setTimeout(() => setAlertState(prev => ({ ...prev, show: false })), 3000);
        },
        onError: (error) => {
          setAlertState({
            message: error.message || "Failed to send follow request",
            positive: false,
            show: true
          });
          setTimeout(() => setAlertState(prev => ({ ...prev, show: false })), 3000);
        },
      }
    );
  };

  return (
    <div
      id="main-container"
      className="flex flex-col w-full justify-center items-center gap-6"
    >

      {alertState.show && (
        <Alert active={true} positive={alertState.positive}>
          {alertState.message}
        </Alert>
      )}

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
                    onClick={() => handleFollowAction(trendingUser?.id, trendingUser?.name)}
                    size={150}
                    content={isFollowingRequested ? "Request Sent" : "Follow"}
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