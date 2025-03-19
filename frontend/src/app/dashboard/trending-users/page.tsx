"use client";

import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetAllUsers } from "../../../hooks/userService/useGetAllUsers";
import { useCreateFollowRequest } from "../../../hooks/followService/useCreateFollowRequest";
import { useGetFollowingRequests } from "../../../hooks/followService/useGetAllFollowingRequests";
import Button from "../../../components/Button";
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

  return (
    <div
      id="main-container"
      className="flex flex-col w-full justify-center items-center gap-6"
    >
      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        <h1 className="text-black text-center">
          Follow more people to see more content in your timeline!
        </h1>
      </div>

      <div
        id="trending-users-container"
        className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md gap-5"
      >
        {usersData?.length > 0 &&
          usersData.map((user: any, index: number) => {
            const isFollowingRequested = userFollowingRequests?.some(
              (request: { following: { id: string } }) =>
                request.following.id === user.id
            );

            return (
              <div
                key={index}
                className="flex justify-between items-center gap-1"
              >
                <div className="flex gap-5 items-center">
                  <img
                    className="w-[42px] h-[42px] rounded-full border-2 border-blue-500"
                    src={user?.profilePicture}
                    alt={`${user?.name}'s avatar`}
                  />
                  <Link
                    className="text-black font-semibold"
                    href={`/dashboard/users/profile?id=${user.id}`}
                  >
                    {user.name}
                  </Link>
                </div>

                <Button
                  onClick={() => handleFollowAction(user.id)}
                  disabled={isFollowingRequested}
                  size={150}
                  text={isFollowingRequested ? "Request Sent" : "Follow"}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default TrendingUsersPage;
