"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../state/authState";
import { useGetAllLikedContent } from "../../hooks/likeService/useGetAllLikedContent";
import { useGetTimeline } from "../../hooks/postService/useGetTimeline";
import { useCreateComment } from "../../hooks/commentService/useCreateComment";
import { useCreatePost } from "../../hooks/postService/useCreatePost";
import { useCreateLikeContent } from "../../hooks/likeService/useCreateLikeContent";
import { useDeleteLikeContent } from "../../hooks/likeService/useDeleteLikeContent";
import TextField from "@mui/material/TextField";
import CreateContentButton from "../../components/CreateContentButton";
import Button from "../../components/Button";
import ProtectedRoute from "../../components/ProtectedRoute";

const HomePage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: timelineData, isLoading } = useGetTimeline();
  const { data: userLikedContent } = useGetAllLikedContent();
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
    setIsCreatingPost(!isCreatingPost);
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
      <div id="main-container" className="flex justify-between items-center">
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#353535] z-50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div id="timeline-container" className="flex flex-col w-[75%] gap-10">
          <div
            id="create-post-container"
            className="flex flex-col bg-gray-100 p-4 rounded-lg"
          >
            <div className="flex items-center justify-center gap-4">
              <CreateContentButton
                onClick={handleCreatePost}
                size={48}
                state={isCreatingPost}
              />
              <h1 className="text-black">
                What are you thinking today? Share your thoughts!
              </h1>
            </div>

            {isCreatingPost && (
              <div className="flex flex-col create-post-textarea gap-5 mt-4">
                <TextField
                  label="What are your thoughts?"
                  className="w-full p-2 border rounded-md bg-gray-100"
                  multiline
                  rows={4}
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                />
                <Button
                  onClick={() => handlePostSubmit()}
                  size={150}
                  text={"Create Post"}
                />
              </div>
            )}
          </div>

          {timelineData?.length > 0 ? (
            timelineData.map((post: any, index: number) => (
              <div
                key={index}
                className="flex flex-col border-b p-4 bg-gray-100"
              >
                <p className="font-bold text-black">{post.author?.name}</p>
                <p className="text-black">{post.content}</p>
                <p className="text-black">Likes: {post.likes?.length ?? 0}</p>
                {isContentLiked(post.id) ? (
                  <Button
                    onClick={() => handleUnlikeContent(post.id, "post")}
                    size={150}
                    text={"Unlike this"}
                  />
                ) : (
                  <Button
                    onClick={() => handleLikeContent(post.id, "post")}
                    size={150}
                    text={"Like this"}
                  />
                )}
                <button
                  className="border p-3 "
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
                            className={"border p-3 bg-red-500 text-white"}
                            onClick={() =>
                              handleUnlikeContent(comment.id, "comment")
                            }
                          >
                            Unlike This
                          </button>
                        ) : (
                          <button
                            className={"border p-3 bg-blue-500 text-white"}
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
