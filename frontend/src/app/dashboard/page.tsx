"use client";

import { useState } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../state/authState";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useGetAllLikedContent } from "../../hooks/likeService/useGetAllLikedContent";
import { useGetTimeline } from "../../hooks/postService/useGetTimeline";
import { useCreateComment } from "../../hooks/commentService/useCreateComment";
import { useCreatePost } from "../../hooks/postService/useCreatePost";
import { useEditPost } from "../../hooks/postService/useEditPost";
import { useDeletePost } from "../../hooks/postService/useDeletePost";
import { useCreateLikeContent } from "../../hooks/likeService/useCreateLikeContent";
import { useDeleteLikeContent } from "../../hooks/likeService/useDeleteLikeContent";
import { Comment } from "../../interfaces/comment/Comment";
import { toast } from "react-toastify";
import Greetings from "../../components/Greetings";
import Post from "../../interfaces/post/Post";
import useBotDetectionGame from "../../hooks/utility/useBotDetectionGame";
import TextField from "@mui/material/TextField";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CloseIcon from "@mui/icons-material/Close";
import LoadingSpinner from "../../components/LoadingSpinner";
import CreateContentButton from "../../components/CreateContentButton";
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
  const { mutate: editPost } = useEditPost();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: createLikeContent } = useCreateLikeContent();
  const { mutate: deleteLikeContent } = useDeleteLikeContent();
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  const [editingPost, setEditingPost] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [isDeletingContent, setIsDeletingContent] = useState(false);
  const [activePost, setActivePost] = useState("");
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const { makeGuess, hasGuessedPost } = useBotDetectionGame();
  const [guessed, setGuessed] = useState(false);
  const isContentLiked = (contentId: string) => {
    return userLikedContent?.includes(contentId);
  };

  const createContentSchema = Yup.object({
    content: Yup.string()
      .min(4, "Your content must have more than 4 characters")
      .max(255, "Your content must have less than 255 characters")
      .required("You must write something to make a post"),
  });

  const handleCreatePost = () => {
    setIsCreatingPost(!isCreatingPost);
  };

  const handleDeletePost = (postId: string) => {
    setIsDeletingContent(!isDeletingContent);
    deletePost(postId);
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

  const handleBotGuess = (
    author: string,
    userType: "BOT" | "REGULAR",
    guess: "BOT" | "REGULAR"
  ) => {
    makeGuess(author, userType, guess);
    setGuessed(true);

    const timer = setTimeout(() => {
      setGuessed(false);
    }, 3000);

    return () => clearTimeout(timer);
  };

  return (
    <ProtectedRoute>
      <div
        id="main-container"
        className="flex w-full justify-center items-center"
      >
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
                  data-cy="create-post-button"
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
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      const contentData = { ...values };

                      createPost(contentData, {
                        onSuccess: () => {
                          resetForm();
                          setIsCreatingPost(false);
                        },
                        onSettled: () => {
                          setSubmitting(false);
                        },
                      });
                    }}
                  >
                    {({ isSubmitting, isValid, values }) => (
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

                        {user?.credentials !== "SPECTATOR" && (
                          <Button
                            size={150}
                            content={"Create Post"}
                            type="submit"
                            disabled={
                              isSubmitting || !isValid || !values.content.trim()
                            }
                            data-cy="submit-post-button"
                          >
                            {isSubmitting ? "Creating Post..." : "Create Post"}
                          </Button>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          )}

          <Greetings />

          {isLoading ? (
            <div className="flex flex-col border-b p-4 bg-gray-100 rounded-lg shadow-md">
              <LoadingSpinner />
            </div>
          ) : (
            <div id="posts-container" className="flex flex-col gap-10">
              {Array.isArray(timelineData) && timelineData?.length > 0 ? (
                timelineData.map((post: Post, index: number) => (
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

                      {user.id === post.author.id && (
                        <div className="flex items-center gap-2">
                          <EditIcon
                            className="cursor-pointer hover:opacity-70"
                            sx={{ color: "rgb(15, 119, 255)" }}
                            onClick={() => {
                              setIsEditingContent(true);
                              setEditingPost({
                                id: post.id,
                                content: post.content,
                              });
                            }}
                          />
                          <DeleteIcon
                            className="cursor-pointer hover:opacity-70"
                            sx={{ color: "rgb(15, 119, 255)" }}
                            onClick={() => {
                              setActivePost(post.id);
                              setIsDeletingContent(true);
                            }}
                          />
                        </div>
                      )}

                      {user.credentials === "SPECTATOR" && (
                        <div className="flex items-center gap-2">
                          {hasGuessedPost(post.author.id) ? (
                            post.author.userType === "BOT" ? (
                              <p className="text-black">
                                <b>🤖</b>
                              </p>
                            ) : (
                              <p className="text-black">
                                <b>🧑</b>
                              </p>
                            )
                          ) : (
                            <>
                              <Button
                                size={42}
                                content={"🤖"}
                                onClick={() => {
                                  if (
                                    post.author.userType === "REGULAR" ||
                                    post.author.userType === "BOT"
                                  ) {
                                    handleBotGuess(
                                      post.author.id,
                                      post.author.userType,
                                      "BOT"
                                    );
                                  }
                                }}
                                disabled={guessed}
                              />
                              <Button
                                size={42}
                                content={"🧑"}
                                onClick={() => {
                                  if (
                                    post.author.userType === "REGULAR" ||
                                    post.author.userType === "BOT"
                                  ) {
                                    handleBotGuess(
                                      post.author.id,
                                      post.author.userType,
                                      "REGULAR"
                                    );
                                  }
                                }}
                                disabled={guessed}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-black mb-5 break-words">
                      {post.content}
                    </p>
                    <div className="flex gap-2 mb-2">
                      <ThumbUpIcon sx={{ color: "rgb(15, 119, 255)" }} />
                      <p className="text-black">{post.likes?.length ?? 0}</p>
                    </div>

                    {post.comments?.length < 1 &&
                      (user.credentials === "SPECTATOR" ? (
                        <p className="text-gray-500 text-center">
                          No comments yet. Spectators can&apos;t like or create
                          content.
                        </p>
                      ) : (
                        <p className="text-gray-500 text-center">
                          No comments yet. Be the first to comment!
                        </p>
                      ))}

                    {post.comments?.length > 0 &&
                      user.credentials === "SPECTATOR" && (
                        <p className="text-gray-500 text-center">
                          Spectators can&apos;t like or create content.
                        </p>
                      )}

                    <span className="block border-t border-gray-300 my-2"></span>

                    {activeCommentBox === post.id && (
                      <div className="mt-4 w-full">
                        <Formik
                          initialValues={{ postId: post.id, content: "" }}
                          validationSchema={createContentSchema}
                          onSubmit={(values, { setSubmitting, resetForm }) => {
                            const contentData = { ...values };

                            createComment(contentData, {
                              onSuccess: () => {
                                resetForm();
                                setActiveCommentBox(null);
                              },
                              onSettled: () => {
                                setSubmitting(false);
                              },
                            });
                          }}
                        >
                          {({ isSubmitting, isValid, values }) => (
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
                                  !values.content.trim() ||
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

                    {user?.credentials !== "SPECTATOR" && (
                      <div className="flex justify-center gap-5 mt-2">
                        {isContentLiked(post.id) ? (
                          <Button
                            onClick={() => handleUnlikeContent(post.id, "post")}
                            size={150}
                            content={"Unlike this"}
                          />
                        ) : (
                          <Button
                            onClick={() => handleLikeContent(post.id, "post")}
                            size={150}
                            content={"Like this"}
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
                        />
                      </div>
                    )}

                    {post.comments?.length > 0 && (
                      <div className="flex flex-col mt-5 pl-4 border-l gap-5">
                        {post.comments.map(
                          (comment: Comment, commentIndex: number) => (
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
                              </div>

                              <p className="text-black mb-5 break-words">
                                {comment.content}
                              </p>

                              <div className="flex gap-2 mb-2">
                                <ThumbUpIcon
                                  sx={{ color: "rgb(15, 119, 255)" }}
                                />
                                <p className="text-black">
                                  {comment.likes?.length ?? 0}
                                </p>
                              </div>

                              {user?.credentials !== "SPECTATOR" && (
                                <>
                                  {isContentLiked(comment.id) ? (
                                    <Button
                                      onClick={() =>
                                        handleUnlikeContent(
                                          comment.id,
                                          "comment"
                                        )
                                      }
                                      size={150}
                                      content={"Unlike this"}
                                      disabled={
                                        user?.credentials === "SPECTATOR"
                                      }
                                    />
                                  ) : (
                                    <Button
                                      onClick={() =>
                                        handleLikeContent(comment.id, "comment")
                                      }
                                      size={150}
                                      content={"Like this"}
                                      disabled={
                                        user?.credentials === "SPECTATOR"
                                      }
                                    />
                                  )}
                                </>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex flex-col border-b p-4 bg-gray-100 rounded-lg shadow-md">
                  <p className="text-black">
                    No content available. Follow more people to see more stuff,
                    create a post, or enter as a spectator.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {isEditingContent && (
          <>
            <div className="flex flex-col fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 w-[400px] h-[300px] rounded-lg gap-2 p-4 z-10">
              <div className="flex justify-between p-2">
                <h2 className="font-bold mb-2">Editing Content</h2>
                <CloseIcon
                  className="cursor-pointer hover:opacity-70 hover:bg-gray-300 rounded-full p-1 transition"
                  onClick={() => setIsEditingContent(false)}
                />
              </div>
              <Formik
                initialValues={{
                  postId: editingPost?.id,
                  content: editingPost?.content,
                }}
                validationSchema={createContentSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  if (!values.postId || !values.content) {
                    toast.error("Missing post ID or content");
                    setSubmitting(false);
                    return;
                  }

                  editPost(
                    { postId: values.postId, content: values.content },
                    {
                      onSuccess: () => {
                        resetForm();
                        setIsEditingContent(false);
                      },
                      onSettled: () => {
                        setSubmitting(false);
                      },
                    }
                  );
                }}
              >
                {({ isSubmitting, isValid, values }) => (
                  <Form className="space-y-4">
                    <Field
                      as={TextField}
                      label="Edit your post"
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

                    <div className="flex justify-center">
                      <Button
                        size={150}
                        content={"Edit Content"}
                        type="submit"
                        disabled={
                          isSubmitting ||
                          !isValid ||
                          !values.content?.trim() ||
                          user?.credentials === "SPECTATOR"
                        }
                      >
                        {isSubmitting ? "Editing..." : "Edit Content"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>

            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-50 z-9"
              onClick={() => setIsEditingContent(false)}
            />
          </>
        )}

        {isDeletingContent && (
          <>
            <div className="flex flex-col items-center justify-center fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-200 w-[250px] h-[250px] rounded-lg gap-2 z-10">
              <p className="text-black text-center mb-4 p-[10px]">
                Do you really wish to delete your post?
              </p>
              <Button
                onClick={() => handleDeletePost(activePost)}
                size={150}
                content={"Yes"}
              />
              <Button
                onClick={() => setIsDeletingContent(false)}
                size={150}
                content={"No"}
              />
            </div>

            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-50 z-9"
              onClick={() => setIsDeletingContent(false)}
            />
          </>
        )}
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
