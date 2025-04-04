"use client";

import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../../../state/authState";
import { useSearchParams } from "next/navigation";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";
import { useGetAllFollowers } from "../../../../hooks/followService/useGetAllFollowers";
import { useGetUserPosts } from "../../../../hooks/postService/useGetUserPosts";
import { useGetIsFollowing } from "../../../../hooks/followService/useGetIsFollowing";
import { Comment } from "../../../../interfaces/comment/Comment";
import Post from "../../../../interfaces/post/Post";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoadingSpinner from "../../../../components/LoadingSpinner";
import Link from "next/link";
import Image from "next/image";

const UserProfilePage = () => {
  const currentUser = useAtomValue(hydratedAuthStateAtom);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { data: user, isLoading: isLoadingUser } = useGetUserDetails(id as string);
  const { data: followers, isLoading: isLoadingFollowers } = useGetAllFollowers(id as string);
  const { data: isFollowing, isLoading: isLoadingFollowing } = useGetIsFollowing(id as string);
  const { data: posts, isLoading: isLoadingPosts } = useGetUserPosts(id as string);

  return (
    <div id="main-container" className="flex flex-col w-full justify-center items-center gap-6">
      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {isLoadingUser ? (
          <LoadingSpinner />
        ) : (
          <div className="flex items-center gap-5">
            <Image
              className="border-4 border-blue-500 rounded-full"
              width={80}
              height={80}
              src={user?.profilePicture ?? "/default-avatar.png"}
              alt={`${user?.name}'s avatar`}
            />
            <div className="flex flex-col">
              <p className="text-black">
                <b>{user?.name}</b>
              </p>
              <p className="text-black">{user?.bio}</p>
              <p className="text-black">{user?.location}</p>
              {isLoadingFollowers ? <LoadingSpinner /> : <p className="text-black">Followers: {followers?.length ?? 0}</p>}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col w-[75%] bg-gray-100 p-4 rounded-lg shadow-md">
        {(!isLoadingFollowing && isFollowing) || user?.id === currentUser?.id ? (
          isLoadingPosts ? (
            <LoadingSpinner />
          ) : posts?.length > 0 ? (
            <div className="flex flex-col gap-4">
              {posts.map((post: Post) => (
                <div key={post.id} className="flex flex-col border-b p-4 bg-gray-100 rounded-lg shadow-md">
                  <div className="flex items-center gap-2">
                    <Image
                      className="border-2 border-blue-600 rounded-full"
                      width={42}
                      height={42}
                      src={post.author?.profilePicture ?? "/default-avatar.png"}
                      alt={`${post.author?.name}'s avatar`}
                    />
                    <p className="font-bold text-black mt-5 mb-5">
                      <Link href={`/dashboard/users/profile?id=${post.author?.id}`}>{post.author?.name}</Link>
                    </p>
                  </div>

                  <p className="text-black mb-5">{post.content}</p>

                  <div className="flex gap-2 mb-2">
                    <ThumbUpIcon sx={{ color: "rgb(15, 119, 255)" }} />
                    <p className="text-black">{post.likes?.length ?? 0}</p>
                  </div>

                  {post.comments?.length > 0 && (
                    <div className="flex flex-col mt-5 pl-4 border-l gap-5">
                      {post.comments.map((comment: Comment) => (
                        <div key={comment.id} className="mt-1">
                          <div className="flex items-center gap-4 mb-2">
                            <Image
                              className="border-2 border-blue-600 rounded-full"
                              width={42}
                              height={42}
                              src={comment.author?.profilePicture ?? "/default-avatar.png"}
                              alt={`${comment.author?.name}'s avatar`}
                            />
                            <p className="font-bold text-black">
                              <Link href={`/dashboard/users/profile?id=${comment.author?.id}`}>
                                {comment.author?.name}
                              </Link>
                            </p>
                          </div>

                          <p className="text-black mb-5">{comment.content}</p>

                          <div className="flex gap-2 mb-2">
                            <ThumbUpIcon sx={{ color: "rgb(15, 119, 255)" }} />
                            <p className="text-black">{comment.likes?.length ?? 0}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-black">{user?.name} still hasn&apos;t made any posts.</p>
          )
        ) : currentUser?.credentials === "SPECTATOR" ? (
          <p className="text-black">This is where you would see a user&apos;s post history. Remember: Spectators can&apos;t create posts.</p>
        ) : (
          <p className="text-black">
            {user?.name}&apos;s post history is private. You can view this user&apos;s posts if they accept your follow request.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
