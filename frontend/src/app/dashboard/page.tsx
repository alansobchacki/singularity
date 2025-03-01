"use client";

import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../state/authState";
import { useGetAllUsers } from "../../hooks/userService/useGetAllUsers";
import { useGetTimeline } from "../../hooks/postService/useGetTimeline";
import { useCreateComment } from "../../hooks/commentService/useCreateComment";
import { useCreateFollowRequest } from "../../hooks/followService/useCreateFollowRequest";
import { useGetAllFollowers } from "../../hooks/followService/useGetAllFollowers";
import { useGetFollowingRequests } from "../../hooks/followService/useGetAllFollowingRequests";
import { useCreatePost } from "../../hooks/postService/useCreatePost";
import ProtectedRoute from "../../components/ProtectedRoute";

const HomePage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: usersData } = useGetAllUsers();
  const { data: timelineData, isLoading } = useGetTimeline();
  const { data: userFollowers } = useGetAllFollowers(user.id);
  const { data: userFollowingRequests } = useGetFollowingRequests();
  const { mutate: createFollowRequest } = useCreateFollowRequest();
  const { mutate: createComment } = useCreateComment();
  const { mutate: createPost } = useCreatePost();
  const [commentContent, setCommentContent] = useState<string>("");
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);

  // temp use effect for debugging
  useEffect(() => {
    //console.log(timelineData);
    //console.log(usersData);

    console.log(userFollowingRequests);
  }, [timelineData, usersData, userFollowers, userFollowingRequests]);

  const handleCommentSubmit = (postId: string) => {
    if (!commentContent.trim()) return;

    createComment({ postId, content: commentContent });

    setCommentContent("");
    setActiveCommentBox(null);
  };

  const handleFollowAction = (followingId: string) => {
    createFollowRequest(
      { followerId: user.id, followingId },
      {
        onSuccess: () => {
          console.log("Follow request created successfully.");
        },
        onError: (error) => {
          console.error(error.message);
        },
      }
    );
  };

  return (
    <ProtectedRoute>
      <div className="flex justify-between">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#353535] z-50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="flex flex-col w-1/2">
          <h1>What are you thinking today? Share your thoughts!</h1>
          <button className="border p-3 w-1/5">Create Post</button>

          {timelineData?.length > 0 ? (
            timelineData.map((post: any, index: number) => (
              <div key={index} className="flex flex-col border-b p-4">
                <p className="font-bold">{post.author?.name}</p>
                <p>{post.content}</p>
                <p>Likes: {post.likes?.length ?? 0}</p>
                <button className="border p-3 w-1/5">Like this post</button>
                <button
                  className="border p-3 w-1/5"
                  onClick={() =>
                    setActiveCommentBox(
                      activeCommentBox === post.id ? null : post.id
                    )
                  }
                >
                  Reply
                </button>

                {post.comments?.length > 0 ? (
                  <div className="mt-2 pl-4 border-l">
                    <p className="font-semibold">Comments:</p>
                    {post.comments.map((comment: any, commentIndex: number) => (
                      <div key={commentIndex} className="mt-1">
                        <p className="text-sm font-medium">
                          {comment.author?.name}
                        </p>
                        <p className="text-sm">{comment.content}</p>
                        <p>Likes: {comment.likes?.length ?? 0}</p>
                        <button className="border p-3">
                          Like this comment
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-2">
                    No comments yet. Be the first to comment!
                  </p>
                )}

                {activeCommentBox === post.id && (
                  <div className="mt-4 w-1/3">
                    <textarea
                      className="w-full p-2 border rounded-md"
                      placeholder="Write a comment..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <button
                      className="mt-2 border p-2 w-full bg-blue-500 text-white"
                      onClick={() => handleCommentSubmit(post.id)}
                    >
                      Add Comment
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>

        <div className="flex flex-col w-1/5 gap-4">
          <p>Follow more people to see more content!</p>
          {usersData?.length > 0 &&
            usersData.map((user: any, index: number) => {
              const isFollowingRequested = userFollowingRequests?.some(
                (request: { following: { id: string } }) => request.following.id === user.id
              );

              return (
                <div key={index} className="flex justify-between items-center gap-1">
                  <p>{user.name}</p>
                  <p>{user.bio}</p>
                  <button
                    className={`px-2 py-1 text-sm rounded-full ${
                      isFollowingRequested
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-500 hover:bg-blue-600"
                    } text-white`}
                    onClick={() => handleFollowAction(user.id)}
                    disabled={isFollowingRequested}
                  >
                    {isFollowingRequested ? "Request Sent" : "Follow"}
                  </button>
                </div>
              );
            })}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
