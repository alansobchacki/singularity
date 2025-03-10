"use client";

import { useSearchParams } from "next/navigation";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";
import { useGetAllFollowers } from "../../../../hooks/followService/useGetAllFollowers";
import { useGetUserPosts } from "../../../../hooks/postService/useGetUserPosts";
import { useGetIsFollowing } from "../../../../hooks/followService/useGetIsFollowing";
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
  const { data: isFollowing, isLoading: isLoadingFollowing } =
    useGetIsFollowing(id as string);
  const { data: posts, isLoading: isLoadingPosts } = useGetUserPosts(
    id as string
  );

  return (
    <div>
      {isLoadingUser ? (
        <LoadingSpinner />
      ) : (
        <>
          <p>{user.name}</p>
          <img src={user.profilePicture} alt="" />
          <p>Bio: {user.bio}</p>
          <p>Location: {user.location}</p>
        </>
      )}

      {isLoadingFollowers ? (
        <LoadingSpinner />
      ) : (
        <p>Followers: {followers.length}</p>
      )}

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
                <p>This user has not made any posts yet</p>
              )}
            </>
          )}
        </>
      ) : (
        <p>
          You can view this user's posts if they accept your follow request.
        </p>
      )}
    </div>
  );
};

export default UserProfilePage;
