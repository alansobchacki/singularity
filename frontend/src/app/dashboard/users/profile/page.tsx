"use client";

import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../../state/authState";
import { useSearchParams } from "next/navigation";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";
import { useGetAllFollowers } from "../../../../hooks/followService/useGetAllFollowers";
import { useGetUserPosts } from "../../../../hooks/postService/useGetUserPosts";
import { useGetIsFollowing } from "../../../../hooks/followService/useGetIsFollowing";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const UserProfilePage = () => {
  const currentUser = useAtomValue(hydratedAuthStateAtom);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: user, isLoading: isLoadingUser } = useGetUserDetails(
    id as string
  );
  const { data: followers, isLoading: isLoadingFollowers } = useGetAllFollowers(
    id as string
  );
  const { data: isFollowing, isLoading: isLoadingFollowing } =
    useGetIsFollowing(id as string);
  const { data: posts, isLoading: isLoadingPosts } = useGetUserPosts(
    id as string
  );

  return (
    <div
      id="main-container"
      className="flex flex-col w-full justify-center items-center gap-6"
    >
      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {isLoadingUser ? (
          <LoadingSpinner />
        ) : (
          <div className="flex items-center gap-5">
            <img
              className="w-[80px] h-[80px] border-4 border-blue-500 rounded-full"
              src={user?.profilePicture}
              alt={`${user?.name}'s avatar'`}
            />
            <div className="flex flex-col">
              <p className="text-black">
                <b>{user?.name}</b>
              </p>
              <p className="text-black">{user?.bio}</p>
              <p className="text-black">{user?.location}</p>
              {isLoadingFollowers ? (
                <LoadingSpinner />
              ) : (
                <p className="text-black">Followers: {followers.length}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {!isLoadingFollowing && isFollowing ? (
          <>
            {isLoadingPosts ? (
              <LoadingSpinner />
            ) : (
              <>
                {posts?.length > 0 ? (
                  <>
                    {posts.map((post: any, index: number) => (
                      <div key={index}>
                        <p>{post.content}</p>
                        <p>Likes: {post.likes?.length ?? 0}</p>
                      </div>
                    ))}
                  </>
                ) : (
                  <p className="text-black">
                    {user?.name} still hasn't made any posts.
                  </p>
                )}
              </>
            )}
          </>
        ) : (
          (currentUser.credentials === 'SPECTATOR' ? (
            <p className="text-black">
              This is where you would see a user's post history. 
              Spectators can't create posts.
            </p>
          ) : (
            <p className="text-black">
              {user?.name}'s post history is private. You can view this user's
              posts if they accept your follow request.
           </p>
          ))
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
