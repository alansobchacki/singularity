"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../state/authState";
import { useGetFollowRequests } from "../../../hooks/followService/useGetAllFollowRequests";
import { useGetAllFollowers } from "../../../hooks/followService/useGetAllFollowers";
import { useUpdateFollowRequest } from "../../../hooks/followService/useUpdateFollowRequest";

const FollowsPage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: followRequests } = useGetFollowRequests();
  const { data: followers } = useGetAllFollowers(user.id);
  const { mutate: updateFollow } = useUpdateFollowRequest();

  useEffect(() => {
    // temporary useEffect for debugging, remove later
    console.log(followRequests);
    console.log(followers);
    console.log(user.id);
  }, [followRequests]);

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
    <>
      {followers?.length > 0 ? (
        <p>You have {followers.length} followers!</p>
      ) : (
        <p>You have no followers</p>
      )}

      {followRequests?.length > 0 ? (
        followRequests.map((followRequest: any, index: number) => (
          <div key={index}>
            <p>You have {followRequests.length} new follow requests!</p>
            <p>{followRequest.follower.name} wants to follow you.</p>
            <button
              onClick={() => handleFollowAction(followRequest.id, "ACCEPTED")}
            >
              Accept
            </button>
            <button
              onClick={() => handleFollowAction(followRequest.id, "REJECTED")}
            >
              Reject
            </button>
          </div>
        ))
      ) : (
        <>You have no follow requests.</>
      )}
    </>
  );
};

export default FollowsPage;
