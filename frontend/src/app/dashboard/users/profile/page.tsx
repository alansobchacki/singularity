"use client";

import { useSearchParams } from "next/navigation";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";

const UserProfilePage = () => {
  const searchParams = useSearchParams(); 
  const id = searchParams.get("id");

  const { data: userData, error, isLoading } = useGetUserDetails(id as string);

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
