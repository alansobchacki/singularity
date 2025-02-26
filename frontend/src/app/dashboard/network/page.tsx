'use client'

import { useEffect } from "react";
import { useGetFollowRequests } from "../../../hooks/followService/useGetAllFollowRequests";
import { useUpdateFollowRequest } from "../../../hooks/followService/useUpdateFollowRequest";

const FollowsPage = () => {
  const { data: followRequests, isLoading } = useGetFollowRequests();
  const { mutate: updateFollow } = useUpdateFollowRequest();

  // needs a follower count and a list of all followers

  useEffect(() => { // temporary useEffect for debugging, remove later
    console.log(followRequests);
  }, [followRequests]);

  const handleFollowAction = (id: string, action: "ACCEPTED" | "REJECTED") => {
    updateFollow({ id, followStatus: action }, {
      onSuccess: () => {
        console.log(`Follow request ${action.toLowerCase()} successfully.`);
      },
      onError: (error) => {
        console.error(error.message);
      },
    });
  };

  return (
    <>
      {followRequests?.length > 0? (
        followRequests.map((followRequest: any, index: number) => (
          <div key={index}>
            <p>{followRequest.follower.name} wants to follow you!</p>
            <button onClick={() => handleFollowAction(followRequest.id, "ACCEPTED")}>Accept</button>
            <button onClick={() => handleFollowAction(followRequest.id, "REJECTED")}>Reject</button>
          </div>
        ))
      ) : (
        <>
          You have no follow requests.
        </>
      )}
    </>
  )
}

export default FollowsPage;