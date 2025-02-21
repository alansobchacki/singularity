"use client";

import { useEffect, useState } from "react";
import { useGetAllUsers } from "../hooks/userService/useGetAllUsers";
import { useGetTimeline } from "../hooks/postService/useGetTimeline";
import { useCreateComment } from "../hooks/commentService/useCreateComment";
import ProtectedRoute from "../components/ProtectedRoute";

const HomePage = () => {
  const { data: usersData } = useGetAllUsers();
  const { data: timelineData, isLoading } = useGetTimeline();
  const { mutate: createComment } = useCreateComment();
  const [commentContent, setCommentContent] = useState<string>("");

  // Temporary useEffect for building purposes, remove later
  useEffect(() => {
    console.log(timelineData);
    console.log(usersData);
  }, [timelineData, usersData]);

  const handleCommentSubmit = (postId: string) => {
    if (!commentContent.trim()) return;

    const newComment = { postId, content: commentContent };
    createComment(newComment);

    setCommentContent("");
  };

  return (
    <ProtectedRoute>
      <div className="flex">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#353535] z-50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="flex flex-col w-1/2">
          {timelineData?.length > 0 ? (
            timelineData.map((post: any, index: number) => (
              <div key={index} className="flex flex-col border-b p-4">
                <p className="font-bold">{post.author?.name}</p>
                <p>{post.content}</p>
                <p>Likes: {post.likes?.length ?? 0}</p>
                <button className="border p-3 w-1/5">Like this post</button>

                {post.comments?.length > 0 ? (
                  <div className="mt-2 pl-4 border-l">
                    <p className="font-semibold">Comments:</p>
                    {post.comments.map((comment: any, commentIndex: number) => (
                      <div key={commentIndex} className="mt-1">
                        <p className="text-sm font-medium">
                          {comment.author?.name}
                        </p>
                        <p className="text-sm">{comment.content}</p>
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
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>

        <div className="flex flex-col w-1/2 gap-4">
          <p>Follow more people to see more content!</p>
          {usersData?.length > 0 &&
            usersData.map((user: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center gap-1"
              >
                <p>{user.name}</p>
                <p>{user.bio}</p>
                <button className="px-2 py-1 text-sm rounded-full bg-blue-500 text-white hover:bg-blue-600">
                  Follow
                </button>
              </div>
            ))}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
