'use client'

import { useEffect } from "react";
import { useGetFollowRequests } from "../../../hooks/followService/useGetAllFollowRequests";

const FollowsPage = () => {
  const { data: followRequests, isLoading } = useGetFollowRequests();

  useEffect(() => { // temporary useEffect for debugging, remove later
    console.log(followRequests);
  }, [followRequests]);

  return (
    <>
      {followRequests?.length > 0? (
        followRequests.map((followRequest: any, index: number) => (
          <div key={index}>
            <p>{followRequest.follower.name}</p>
            <p>{followRequest.following.name}</p>
            <button>Accept</button>
            <button>Reject</button>
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