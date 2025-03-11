"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../state/authState";
import { useGetAllLikedContent } from "../../hooks/likeService/useGetAllLikedContent";
import { useGetTimeline } from "../../hooks/postService/useGetTimeline";
import { useCreateComment } from "../../hooks/commentService/useCreateComment";
import { useCreateFollowRequest } from "../../hooks/followService/useCreateFollowRequest";
import { useCreatePost } from "../../hooks/postService/useCreatePost";
import { useCreateLikeContent } from "../../hooks/likeService/useCreateLikeContent";
import { useDeleteLikeContent } from "../../hooks/likeService/useDeleteLikeContent";
import ProtectedRoute from "../../components/ProtectedRoute";

const HomePage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: timelineData, isLoading } = useGetTimeline();
  const { data: userLikedContent } = useGetAllLikedContent();
  const { mutate: createFollowRequest } = useCreateFollowRequest();
  const { mutate: createComment } = useCreateComment();
  const { mutate: createPost } = useCreatePost();
  const { mutate: createLikeContent } = useCreateLikeContent();
  const { mutate: deleteLikeContent } = useDeleteLikeContent();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [postContent, setPostContent] = useState<string>("");
  const [commentContent, setCommentContent] = useState<string>("");
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const isContentLiked = (contentId: string) =>
    userLikedContent?.includes(contentId);

  const handleCreatePost = () => {
    setIsCreatingPost(true);
  };

  const handlePostSubmit = () => {
    createPost({ authorId: user.id, content: postContent });
  };

  const handleCommentSubmit = (postId: string) => {
    if (!commentContent.trim()) return;

    createComment({ postId, content: commentContent });

    setCommentContent("");
    setActiveCommentBox(null);
  };

  const handleLikeContent = (contentId: string, type: "post" | "comment") => {
    const data = {
      userId: user.id,
      [type === "post" ? "postId" : "commentId"]: contentId,
    };

    createLikeContent(data);
  };

  const handleUnlikeContent = (contentId: string, type: "post" | "comment") => {
    const data = {
      userId: user.id,
      [type === "post" ? "postId" : "commentId"]: contentId,
    };

    deleteLikeContent(data);
  };

  return (
    <ProtectedRoute>
      <div className="flex justify-between">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#353535] z-50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div id="timeline-container" className="flex flex-col w-1/2">
          <h1>What are you thinking today? Share your thoughts!</h1>

          {!isCreatingPost ? (
            <button className="border p-3 w-1/5" onClick={handleCreatePost}>
              Create Post
            </button>
          ) : (
            <div className="mt-4 w-1/3">
              <textarea
                className="w-full p-2 border rounded-md"
                placeholder="Write your post..."
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
              />
              <button
                className="mt-2 border p-2 w-full bg-blue-500 text-white"
                onClick={() => handlePostSubmit()}
              >
                Create Post
              </button>
            </div>
          )}

          {timelineData?.length > 0 ? (
            timelineData.map((post: any, index: number) => (
              <div key={index} className="flex flex-col border-b p-4">
                <p className="font-bold">{post.author?.name}</p>
                <p>{post.content}</p>
                <p>Likes: {post.likes?.length ?? 0}</p>
                {isContentLiked(post.id) ? (
                  <button
                    className={"border p-3 w-1/5 bg-red-500 text-white"}
                    onClick={() => handleUnlikeContent(post.id, "post")}
                  >
                    Unlike This
                  </button>
                ) : (
                  <button
                    className={"border p-3 w-1/5 bg-blue-500 text-white"}
                    onClick={() => handleLikeContent(post.id, "post")}
                  >
                    Like This
                  </button>
                )}
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
                        {isContentLiked(comment.id) ? (
                          <button
                            className={"border p-3 w-1/5 bg-red-500 text-white"}
                            onClick={() =>
                              handleUnlikeContent(comment.id, "comment")
                            }
                          >
                            Unlike This
                          </button>
                        ) : (
                          <button
                            className={
                              "border p-3 w-1/5 bg-blue-500 text-white"
                            }
                            onClick={() =>
                              handleLikeContent(comment.id, "comment")
                            }
                          >
                            Like This
                          </button>
                        )}
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
            <p>No posts available. Follow more people to see more stuff!</p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
