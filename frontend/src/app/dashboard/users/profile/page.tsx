"use client";

import { useSearchParams } from "next/navigation";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const UserProfilePage = () => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: userData, error, isLoading } = useGetUserDetails(id as string);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <p>{userData?.name}</p>
      <p>{userData?.profilePicture}</p>
      <p>{userData?.bio}</p>
      <p>{userData?.location}</p>
    </div>
  );
};

export default UserProfilePage;
