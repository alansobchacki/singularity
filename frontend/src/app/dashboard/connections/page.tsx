"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetFollowRequests } from "../../../hooks/followService/useGetAllFollowRequests";
import { useGetAllFollowers } from "../../../hooks/followService/useGetAllFollowers";
import { useUpdateFollowRequest } from "../../../hooks/followService/useUpdateFollowRequest";
import Button from "../../../components/Button";

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

  useEffect(() => {
    console.log(followers);
  }, [followers]);

  return (
    <div
      id="main-container"
      className="flex flex-col w-full justify-center items-center gap-6"
    >
      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg">
        {followRequests?.length > 0 ? (
          followRequests.map((followRequest: any, index: number) => (
            <div key={index}>
              <p className="text-black">
                You have {followRequests.length} new follow requests!
              </p>
              <div className="flex justify-between">
                <div className="flex items-center gap-2">
                  <img
                    className="w-[42px] h-[42px] rounded-full"
                    src={followRequest?.follower.profilePicture}
                    alt={`${followRequest?.follower.name}'s avatar`}
                  />
                  <p className="text-black">
                    <b>{followRequest.follower.name}</b> wants to follow you.
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={() =>
                      handleFollowAction(followRequest.id, "ACCEPTED")
                    }
                    size={150}
                    text={"Accept"}
                  />
                  <Button
                    onClick={() =>
                      handleFollowAction(followRequest.id, "REJECTED")
                    }
                    size={150}
                    text={"Reject"}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-black">You have no follow requests.</p>
        )}
      </div>

      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg">
        <p className="text-black mb-5">
          You have {followers.length} followers.
        </p>
        {followers?.length > 0 &&
          followers.map((follower: any, index: number) => (
            <div
              key={index}
              className="flex items-center p-2 bg-white rounded-md my-1 gap-2"
            >
              <img
                className="w-[42px] h-[42px] rounded-full"
                src={follower?.follower.profilePicture}
                alt={`${follower?.follower.name}'s avatar`}
              />
              <p className="text-black font-semibold">
                {follower?.follower.name}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FollowsPage;
