"use client";

import { useSearchParams } from "next/navigation";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";
import { useGetAllFollowers } from "../../../../hooks/followService/useGetAllFollowers";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const UserProfilePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: user, isLoading: isLoadingUser } = useGetUserDetails(
    id as string
  );
  const { data: followers, isLoading: isLoadingFollowers } = useGetAllFollowers(
    id as string
  );

  return (
    <div>
      {isLoadingUser ? (
        <LoadingSpinner />
      ) : (
        <>
          <p>{user.name}</p>
          <p>Image: {user.profilePicture}</p>
          <p>Bio: {user.bio}</p>
          <p>Location: {user.location}</p>
        </>
      )}

      {isLoadingFollowers ? (
        <LoadingSpinner />
      ) : (
        <p>Followers: {followers.length}</p>
      )}
    </div>
  );
};

export default UserProfilePage;
