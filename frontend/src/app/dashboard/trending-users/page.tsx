"use client";

import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetAllUsers } from "../../../hooks/userService/useGetAllUsers";
import { useCreateFollowRequest } from "../../../hooks/followService/useCreateFollowRequest";
import { useGetFollowingRequests } from "../../../hooks/followService/useGetAllFollowingRequests";
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
    <div id="users-container" className="flex flex-col w-1/5 gap-4">
      <p>Follow more people to see more content!</p>
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
              <Link href={`/dashboard/users/profile?id=${user.id}`}>
                {user.name}
              </Link>
              <p>{user.bio}</p>
              <button
                className={`px-2 py-1 text-sm rounded-full ${
                  isFollowingRequested
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                } text-white`}
                onClick={() => handleFollowAction(user.id)}
                disabled={isFollowingRequested}
              >
                {isFollowingRequested ? "Request Sent" : "Follow"}
              </button>
            </div>
          );
        })}
    </div>
  );
};

export default TrendingUsersPage;
