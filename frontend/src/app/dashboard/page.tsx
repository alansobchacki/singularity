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
import { Comment } from "../../interfaces/comment/Comment";
import Post from "../../interfaces/post/Post";
import useBotDetectionGame from "../../hooks/utility/useBotDetectionGame";
import TextField from "@mui/material/TextField";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import LoadingSpinner from "../../components/LoadingSpinner";
import CreateContentButton from "../../components/CreateContentButton";
import Button from "../../components/Button";
import Alert from "../../components/Alert";
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
    userLikedContent?.some((like) => like.post?.id === contentId || like.comment?.id === contentId);  
  const { makeGuess, hasGuessedPost, guessedRight } = useBotDetectionGame();
  const [guessed, setGuessed] = useState(false);

  const createContentSchema = Yup.object({
    content: Yup.string()
      .min(4, "Your content must have more than 4 characters")
      .max(255, "Your content must have less than 255 characters")
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

  const handleBotGuess = (author: string, userType: 'BOT' | 'REGULAR', guess: 'BOT' | 'REGULAR') => {
    makeGuess(author, userType, guess);
    setGuessed(true);

    const timer = setTimeout(() => {
      setGuessed(false);
    }, 3000);
  
    return () => clearTimeout(timer);
  }

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
                      { setSubmitting, resetForm, setStatus }
                    ) => {
                      const contentData = { ...values };

                      createPost(contentData, {
                        onSuccess: () => {
                          setStatus({ message: "Post created! 🥳", positive: true });
  
                          setTimeout(() => {
                            resetForm();
                          }, 3000);
                          
                          setTimeout(() => {
                            setIsCreatingPost(false);
                          }, 3000);
  
                          setTimeout(() => setStatus(null), 3000); 
                        },
                        onError: (error) => {
                          setStatus({ message: error.message, positive: false });
                          setTimeout(() => setStatus(null), 3000);
                        },
                        onSettled: () => {
                          setSubmitting(false);
                        },
                      });
                    }}
                  >
                    {({ isSubmitting, isValid, status }) => (
                      <Form className="space-y-4">
                        <div>
                          {status && (
                            <Alert active={true} positive={status.positive}>
                              {status.message}
                            </Alert>
                          )}
                        </div>
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
                            status ||
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
            <div className="flex items-center gap-2">
              <Image
                className="border-2 border-green-500 rounded-full"
                width={42}
                height={42}
                src={"/avatars/adminavatar.jpg"}
                alt="Alan Sobchacki's avatar"
              />
              <p className="font-bold text-black">Alan Sobchacki</p>
            </div>

            <div className="text-black mt-5 mb-5">
              <p>👋 Hello, folks</p>
              <br />
              <p>
                Welcome to my social media app! I built this project because I
                thought it was fun.
              </p>
              <br />
              <p>
                Much like a regular social media app, you are able to create posts, comments,
                like content, follow users, and have followers.
              </p>
              <br />
              {user?.credentials === "SPECTATOR" ? (
                <>
                  <p>
                    Like many popular social media platforms, this space is filled with bots.
                    Here&apos;s the challenge: <b> Can you tell if the users below are real people?</b>
                  </p>
                  <br />
                  <p>
                    Press the 🤖 button if you think they&apos;re AI, 
                    or the 🧑 button if they&apos;re human.
                  </p>
                  <br />
                  <p>
                    Sure, it might be easy since my app is fairly simple 
                    — but what about on other more popular platforms?
                  </p>
                  <br />
                  <p>
                    Anyway, give it a try and see for yourself. Have fun!
                  </p>
                </>
              ) : (
                <>
                  <p>
                    As a regular user, your feed will only show you
                    content that you made, and from users that you follow.
                    Spectators will be able to view and rate your posts.
                  </p>
                  <br />
                  <p>
                    But here&apos;s the challenge: 
                    <b> Can you create content that feels convincingly human?</b>
                  </p>
                  <br />
                  <p>
                    Let&apos;s see if your posts stand out from the AI-generated ones. Have fun! 
                  </p>
                </>
              )}
            </div>

            <span className="block border-t border-gray-300 my-2"></span>

            <p className="text-gray-500 text-center">
              Likes and comments are disabled for this post to protect the
              author&apos;s ego.
            </p>
          </div>

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

                      {user.credentials === "SPECTATOR" && guessed && (
                        <Alert active={true} positive={!!guessedRight}>
                          <p>{guessedRight ? "You guessed right! 🥳" : "You guessed wrong. 😔"}</p>
                        </Alert>
                      )}

                      {user.credentials === "SPECTATOR" && (
                        <div className="flex items-center gap-2">
                          {hasGuessedPost(post.author.id) ? (
                            post.author.userType === 'BOT' ? (
                              <p className="text-black"><b>🤖</b></p>
                            ) : (
                              <p className="text-black"><b>🧑</b></p>
                            )
                          ) : (
                            <>
                              <Button 
                                size={42} 
                                content={"🤖"}
                                onClick={() => {
                                  if (post.author.userType === 'REGULAR' || post.author.userType === 'BOT') {
                                    handleBotGuess(post.author.id, post.author.userType, 'BOT');
                                  }
                                }}
                                disabled={guessed}
                              />
                              <Button 
                                size={42} 
                                content={"🧑"}
                                onClick={() => {
                                  if (post.author.userType === 'REGULAR' || post.author.userType === 'BOT') {
                                    handleBotGuess(post.author.id, post.author.userType, 'REGULAR');
                                  }
                                }}
                                disabled={guessed}
                              />
                            </>
                          )}
                        </div>
                      )}
                    </div>

                    <p className="text-black mb-5">{post.content}</p>
                    <div className="flex gap-2 mb-2">
                      <ThumbUpIcon sx={{ color: "rgb(15, 119, 255)" }} />
                      <p className="text-black">{post.likes?.length ?? 0}</p>
                    </div>

                    {post.comments?.length < 1 &&
                      (user.credentials === "SPECTATOR" ? (
                        <p className="text-gray-500 text-center">
                          No comments yet. Spectators can&apos;t like or create comments.
                        </p>
                      ) : (
                        <p className="text-gray-500 text-center">
                          No comments yet. Be the first to comment!
                        </p>
                      ))
                    }

                    {post.comments?.length > 0 && user.credentials === "SPECTATOR" && (
                      <p className="text-gray-500 text-center">
                        Spectators can&apos;t like or create comments.
                      </p>
                    )}

                    <span className="block border-t border-gray-300 my-2"></span>

                    {activeCommentBox === post.id && (
                      <div className="mt-4 w-full">
                        <Formik
                          initialValues={{ postId: post.id, content: "" }}
                          validationSchema={createContentSchema}
                          onSubmit={(
                            values,
                            { setSubmitting, resetForm, setStatus }
                          ) => {
                            const contentData = { ...values };

                            createComment(contentData, {
                              onSuccess: () => {
                                setStatus({ message: "Comment created! 🥳", positive: true });

                                setTimeout(() => {
                                  resetForm();
                                }, 3000);
                                
                                setTimeout(() => {
                                  setActiveCommentBox(null);
                                }, 3000);

                                setTimeout(() => setStatus(null), 3000); 
                              },
                              onError: (error) => {
                                setStatus({ message: error.message, positive: false });
                                setTimeout(() => setStatus(null), 3000);
                              },
                              onSettled: () => {
                                setSubmitting(false);
                              },
                            });
                          }}
                        >
                          {({ isSubmitting, isValid, status }) => (
                            <Form className="space-y-4">
                              <div>
                                {status && (
                                  <Alert active={true} positive={status.positive}>
                                    {status.message}
                                  </Alert>
                                )}
                              </div>

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
                                  status ||
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

                              <p className="text-black mb-5">{comment.content}</p>

                              <div className="flex gap-2 mb-2">
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
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default HomePage;
