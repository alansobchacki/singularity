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
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
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
      <div
        id="main-container"
        className="flex w-full justify-center items-center"
      >
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-[#353535] z-50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div id="timeline-container" className="flex flex-col w-[75%] gap-5">
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
                What are you thinking today? Create a new post!
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

          <div id="posts-container" className="flex flex-col gap-10">
            {timelineData?.length > 0 ? (
              timelineData.map((post: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col border-b p-4 bg-gray-100 rounded-lg"
                >
                  <div className="flex gap-2">
                    <img
                      className="w-[42px] h-[42px] rounded-full"
                      src={post.author?.profilePicture}
                      alt={`${post.author?.name}'s avatar`}
                    />
                    <p className="font-bold text-black mb-2">
                      {post.author?.name}
                    </p>
                  </div>

                  <p className="text-black mb-5">{post.content}</p>
                  <div className="flex gap-2">
                    <ThumbUpIcon sx={{ color: "rgb(15, 119, 255)" }} />
                    <p className="text-black">{post.likes?.length ?? 0}</p>
                  </div>

                  {post.comments?.length < 1 && (
                    <p className="text-gray-500 text-center">
                      No comments yet. Be the first to comment!
                    </p>
                  )}

                  <span className="block border-t border-gray-300 my-2"></span>

                  {activeCommentBox === post.id && (
                    <div className="mt-4 w-full">
                      <TextField
                        label="Write your comment"
                        className="w-full p-2 border rounded-md bg-gray-100"
                        multiline
                        rows={4}
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                      />
                      <Button
                        onClick={() => handleCommentSubmit(post.id)}
                        size={150}
                        text={"Create Comment"}
                      />
                    </div>
                  )}

                  <div className="flex justify-center gap-5">
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
                    <Button
                      onClick={() =>
                        setActiveCommentBox(
                          activeCommentBox === post.id ? null : post.id
                        )
                      }
                      size={150}
                      text={"Comment"}
                    />
                  </div>

                  {post.comments?.length > 0 && (
                    <div className="flex flex-col mt-5 pl-4 border-l gap-5">
                      {post.comments.map(
                        (comment: any, commentIndex: number) => (
                          <div key={commentIndex} className="mt-1">
                            <div className="flex gap-2">
                              <img
                                className="w-[42px] h-[42px] rounded-full"
                                src={comment.author?.profilePicture}
                                alt={`${comment.author?.name}'s avatar`}
                              />
                              <p className="text-sm text-black font-semibold">
                                {comment.author?.name}
                              </p>
                            </div>

                            <p className="text-sm text-black ">
                              {comment.content}
                            </p>

                            <div className="flex gap-2">
                              <ThumbUpIcon
                                sx={{ color: "rgb(15, 119, 255)" }}
                              />
                              <p className="text-black">
                                {comment.likes?.length ?? 0}
                              </p>
                            </div>

                            {isContentLiked(comment.id) ? (
                              <Button
                                onClick={() =>
                                  handleUnlikeContent(comment.id, "comment")
                                }
                                size={150}
                                text={"Unlike this"}
                              />
                            ) : (
                              <Button
                                onClick={() =>
                                  handleLikeContent(comment.id, "comment")
                                }
                                size={150}
                                text={"Like this"}
                              />
                            )}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p>No posts available. Follow more people to see more stuff!</p>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
