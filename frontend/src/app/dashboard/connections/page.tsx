"use client";

import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetFollowRequests } from "../../../hooks/followService/useGetAllFollowRequests";
import { useGetAllFollowers } from "../../../hooks/followService/useGetAllFollowers";
import { useUpdateFollowRequest } from "../../../hooks/followService/useUpdateFollowRequest";
import { Follow } from "../../../interfaces/follow/Follow";
import Button from "../../../components/Button";
import Image from "next/image";
import Link from "next/link";

const FollowsPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: followRequests } = useGetFollowRequests();
  const { data: followers } = useGetAllFollowers(user.id);
  const { mutate: updateFollow } = useUpdateFollowRequest();

  const handleFollowAction = (id: string, action: "ACCEPTED" | "REJECTED") => {
    updateFollow(
      { id, followStatus: action },
      {
        onSuccess: () => {
          console.log(`Follow request ${action.toLowerCase()} successfully.`);
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
        {Array.isArray(followRequests) && followRequests?.length > 0 ? (
          followRequests.map((followRequest: Follow, index: number) => (
            <div key={index}>
              <p className="text-black mb-5">
                You have {followRequests.length} new follow requests! 🥳
              </p>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <Image
                    className="rounded-full"
                    width={42}
                    height={42}
                    src={followRequest?.follower.profilePicture}
                    alt={`${followRequest?.follower.name}'s avatar`}
                  />
                  <Link
                    href={`/dashboard/users/profile?id=${followRequest?.follower.id}`}
                    className="font-semibold"
                  >
                    <p className="text-black">{followRequest?.follower.name}</p>
                  </Link>
                  <p className="text-black">wants to follow you.</p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleFollowAction(followRequest.id, "ACCEPTED")
                    }
                    size={150}
                    content={"Accept"}
                  />
                  <Button
                    onClick={() =>
                      handleFollowAction(followRequest.id, "REJECTED")
                    }
                    size={150}
                    content={"Reject"}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black">You have no follow requests.</p>
        )}
      </div>

      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {Array.isArray(followers) && followers?.length > 0 ? (
          <p className="text-black">You have {followers?.length} followers!</p>
        ) : (
          <p className="text-black">You have no followers 😔</p>
        )}

        {Array.isArray(followers) && followers.length > 0 &&
          followers.map((follow: Follow, index: number) => (
            <div
              key={index}
              className="flex items-center p-2 bg-white rounded-md my-1 mt-5 gap-2"
            >
              <Image
                className="rounded-full"
                width={42}
                height={42}
                src={follow.follower?.profilePicture || "/default-avatar.png"}
                alt={`${follow.follower?.name || "User"}'s avatar`}
              />
              <Link
                href={`/dashboard/users/profile?id=${follow.follower?.id}`}
                className="font-semibold"
              >
                <p className="text-black">{follow.follower?.name}</p>
              </Link>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default FollowsPage;
