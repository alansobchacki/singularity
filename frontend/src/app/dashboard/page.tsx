"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../state/authState";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useGetAllLikedContent } from "../../hooks/likeService/useGetAllLikedContent";
import { useGetTimeline } from "../../hooks/postService/useGetTimeline";
import { useCreateComment } from "../../hooks/commentService/useCreateComment";
import { useCreatePost } from "../../hooks/postService/useCreatePost";
import { useCreateLikeContent } from "../../hooks/likeService/useCreateLikeContent";
import { useDeleteLikeContent } from "../../hooks/likeService/useDeleteLikeContent";
import TextField from "@mui/material/TextField";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import CreateContentButton from "../../components/CreateContentButton";
import SmartToyOutlinedIcon from '@mui/icons-material/SmartToyOutlined';
import FaceIcon from '@mui/icons-material/Face';
import Button from "../../components/Button";
import ProtectedRoute from "../../components/ProtectedRoute";
import Link from "next/link";
import Image from "next/image";
import * as Yup from "yup";

const HomePage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: timelineData, isLoading } = useGetTimeline();
  const { data: userLikedContent } = useGetAllLikedContent();
  const { mutate: createComment } = useCreateComment();
  const { mutate: createPost } = useCreatePost();
  const { mutate: createLikeContent } = useCreateLikeContent();
  const { mutate: deleteLikeContent } = useDeleteLikeContent();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const isContentLiked = (contentId: string) =>
    userLikedContent?.includes(contentId);

  const createContentSchema = Yup.object({
    content: Yup.string()
      .min(4, "Your content must have more than 4 characters")
      .required("You must write valid content"),
  });

  const handleCreatePost = () => {
    setIsCreatingPost(!isCreatingPost);
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

        <div
          id="timeline-container"
          className="w-[90%] md:w-[75%] flex flex-col gap-5"
        >
          {user?.credentials === "SPECTATOR" ? (
            <div
              id="create-post-container"
              className="flex flex-col items-center bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <h1 className="text-black font-bold">
                📢 Want to create posts and comments? Create your own account!
              </h1>
            </div>
          ) : (
            <div
              id="create-post-container"
              className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-md"
            >
              <div className="flex items-center justify-center gap-4">
                <CreateContentButton
                  onClick={handleCreatePost}
                  size={48}
                  state={isCreatingPost}
                />
                <h1 className="text-black font-bold">
                  What are you thinking today? Create a new post!
                </h1>
              </div>

              {isCreatingPost && (
                <div className="flex flex-col create-post-textarea gap-5 mt-4">
                  <Formik
                    initialValues={{ authorId: user.id, content: "" }}
                    validationSchema={createContentSchema}
                    onSubmit={(
                      values,
                      { setSubmitting, resetForm, setErrors }
                    ) => {
                      const contentData = { ...values };

                      createPost(contentData, {
                        onSuccess: () => {
                          alert("Post Created!");
                          resetForm();
                          setIsCreatingPost(false);
                        },
                        onError: (error) => {
                          setErrors({ content: error.message });
                        },
                        onSettled: () => {
                          setSubmitting(false);
                        },
                      });
                    }}
                  >
                    {({ isSubmitting, isValid }) => (
                      <Form className="space-y-4">
                        <Field
                          as={TextField}
                          label="What are your thoughts?"
                          name="content"
                          className="w-full p-2 border rounded-md bg-gray-100"
                          multiline
                          rows={4}
                        />
                        <ErrorMessage
                          name="content"
                          component="div"
                          className="text-red-500 text-sm"
                        />

                        <Button
                          size={150}
                          content={"Create Post"}
                          type="submit"
                          disabled={
                            isSubmitting ||
                            !isValid ||
                            user?.credentials === "SPECTATOR"
                          }
                        >
                          {isSubmitting ? "Creating Post..." : "Create Post"}
                        </Button>
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          )}

          <div
            id="disclaimer-container"
            className="flex flex-col border-b p-4 bg-gray-100 rounded-lg shadow-md"
          >
            <div className="flex items-center gap-4">
              <Image
                className="border-2 border-green-500 rounded-full"
                width={42}
                height={42}
                src={"/avatars/adminavatar.jpg"}
                alt="Alan Sobchacki's avatar"
              />
              <p className="font-bold text-black">Alan Sobchacki</p>
            </div>

            <p className="text-black mt-5 mb-5">
              👋 Hello folks,
              <br />
              <br />
              Welcome to my social media app! I built this project because I
              thought it was fun.
              <br />
              <br />
              {user?.credentials === "SPECTATOR" ? (
                <>
                  Like many popular social media platforms, this space is filled with bots.
                  Here's the challenge:
                  <b> Can you tell whether the posts below are written by AI or real people?</b>
                  <br />
                  <br />
                  Sure, you might be able to guess since my app is fairly simple 
                  — but what about on other more popular platforms?
                  <br />
                  <br />
                  Anyway, give it a try and see for yourself. Have fun!
                </>
              ) : (
                <>
                  Much like a regular social media app, you are able to create posts, comments,
                  like content, follow users, and have followers. Your feed will only show you
                  content that you made, and from users that you follow.
                  <br />
                  <br />
                  But here's the challenge: <b>Can you create content that feels convincingly human?</b>
                  <br />
                  <br />
                  Let's see if your posts stand out from the AI-generated ones. Have fun! 
                </>
              )}
            </p>

            <span className="block border-t border-gray-300 my-2"></span>

            <p className="text-gray-500 text-center">
              Likes and comments are disabled for this post to protect the
              author's ego.
            </p>
          </div>

          <div id="posts-container" className="flex flex-col gap-10">
            {timelineData?.length > 0 ? (
              timelineData.map((post: any, index: number) => (
                <div
                  key={index}
                  className="flex flex-col border-b p-4 bg-gray-100 rounded-lg shadow-md"
                >
                  <div className="flex justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <Image
                        className="border-2 border-blue-600 rounded-full"
                        width={42}
                        height={42}
                        src={post.author?.profilePicture}
                        alt={`${post.author?.name}'s avatar`}
                      />
                      <p className="font-bold text-black mt-5 mb-5">
                        <Link
                          href={`/dashboard/users/profile?id=${post.author?.id}`}
                        >
                          {post.author?.name}
                        </Link>
                      </p>
                    </div>

                    {user.credentials === "SPECTATOR" && (
                      <div className="flex items-center gap-2">
                        <Button size={42} content={<SmartToyOutlinedIcon />} />
                        <Button size={42} content={<FaceIcon />} />
                      </div>
                    )}
                  </div>

                  <p className="text-black mb-5">{post.content}</p>
                  <div className="flex gap-2">
                    <ThumbUpIcon sx={{ color: "rgb(15, 119, 255)" }} />
                    <p className="text-black">{post.likes?.length ?? 0}</p>
                  </div>

                  {post.comments?.length < 1 &&
                    (user.credentials === "SPECTATOR" ? (
                      <p className="text-gray-500 text-center">
                        No comments yet. Spectators can't add comments.
                      </p>
                    ) : (
                      <p className="text-gray-500 text-center">
                        No comments yet. Be the first to comment!
                      </p>
                    ))}

                  <span className="block border-t border-gray-300 my-2"></span>

                  {activeCommentBox === post.id && (
                    <div className="mt-4 w-full">
                      <Formik
                        initialValues={{ postId: post.id, content: "" }}
                        validationSchema={createContentSchema}
                        onSubmit={(
                          values,
                          { setSubmitting, resetForm, setErrors }
                        ) => {
                          const contentData = { ...values };

                          createComment(contentData, {
                            onSuccess: () => {
                              alert("Comment Created!");
                              resetForm();
                              setActiveCommentBox(null);
                            },
                            onError: (error) => {
                              setErrors({ content: error.message });
                            },
                            onSettled: () => {
                              setSubmitting(false);
                            },
                          });
                        }}
                      >
                        {({ isSubmitting, isValid }) => (
                          <Form className="space-y-4">
                            <Field
                              as={TextField}
                              label="What are your thoughts?"
                              name="content"
                              className="w-full p-2 border rounded-md bg-gray-100"
                              multiline
                              rows={3}
                            />
                            <ErrorMessage
                              name="content"
                              component="div"
                              className="text-red-500 text-sm"
                            />

                            <Button
                              size={150}
                              content={"Create Comment"}
                              type="submit"
                              disabled={
                                isSubmitting ||
                                !isValid ||
                                user?.credentials === "SPECTATOR"
                              }
                            >
                              {isSubmitting
                                ? "Creating Comment..."
                                : "Create Comment"}
                            </Button>
                          </Form>
                        )}
                      </Formik>
                    </div>
                  )}

                  <div className="flex justify-center gap-5 mt-2">
                    {isContentLiked(post.id) ? (
                      <Button
                        onClick={() => handleUnlikeContent(post.id, "post")}
                        size={150}
                        content={"Unlike this"}
                        disabled={user?.credentials === "SPECTATOR"}
                      />
                    ) : (
                      <Button
                        onClick={() => handleLikeContent(post.id, "post")}
                        size={150}
                        content={"Like this"}
                        disabled={user?.credentials === "SPECTATOR"}
                      />
                    )}
                    <Button
                      onClick={() =>
                        setActiveCommentBox(
                          activeCommentBox === post.id ? null : post.id
                        )
                      }
                      size={150}
                      content={"Comment"}
                      disabled={user?.credentials === "SPECTATOR"}
                    />
                  </div>

                  {post.comments?.length > 0 && (
                    <div className="flex flex-col mt-5 pl-4 border-l gap-5">
                      {post.comments.map(
                        (comment: any, commentIndex: number) => (
                          <div key={commentIndex} className="mt-1">
                            <div className="flex items-center gap-4 mb-2">
                              <Image
                                className="border-2 border-blue-600 rounded-full"
                                width={42}
                                height={42}
                                src={comment.author?.profilePicture}
                                alt={`${comment.author?.name}'s avatar`}
                              />
                              <p className="font-bold text-black">
                                <Link
                                  href={`/dashboard/users/profile?id=${comment.author?.id}`}
                                >
                                  {comment.author?.name}
                                </Link>
                              </p>
                              <div>
                                <Button size={42} content={<SmartToyOutlinedIcon/>} />
                              </div>
                            </div>

                            <p className="text-black mb-5">{comment.content}</p>

                            <div className="flex gap-2">
                              <ThumbUpIcon
                                sx={{ color: "rgb(15, 119, 255)" }}
                              />
                              <p className="text-black">{comment.likes?.length ?? 0}</p>
                            </div>

                            {isContentLiked(comment.id) ? (
                              <Button
                                onClick={() =>
                                  handleUnlikeContent(comment.id, "comment")
                                }
                                size={150}
                                content={"Unlike this"}
                                disabled={user?.credentials === "SPECTATOR"}
                              />
                            ) : (
                              <Button
                                onClick={() =>
                                  handleLikeContent(comment.id, "comment")
                                }
                                size={150}
                                content={"Like this"}
                                disabled={user?.credentials === "SPECTATOR"}
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
