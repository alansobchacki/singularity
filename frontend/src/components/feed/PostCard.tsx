import { useState } from "react";
import { useAtomValue } from "jotai";
import Link from "next/link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { hydratedAuthStateAtom } from "../../state/authState";
import { useGetAllLikedContent } from "../../hooks/likeService/useGetAllLikedContent";
import { useCreateLikeContent } from "../../hooks/likeService/useCreateLikeContent";
import { useDeleteLikeContent } from "../../hooks/likeService/useDeleteLikeContent";
import { useDeletePost } from "../../hooks/postService/useDeletePost";
import Post from "../../interfaces/post/Post";
import Avatar from "../Avatar";
import Button from "../Button";
import Modal from "../Modal";
import ActionButton from "./ActionButton";
import CommentForm from "./CommentForm";
import EditPostModal from "./EditPostModal";

type Guess = "BOT" | "REGULAR";

interface PostCardProps {
  post: Post;
  guess?: {
    hasGuessed: boolean;
    onGuess: (guess: Guess) => void;
  };
}

const formatDate = (date?: Date | string) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "";

const profileLink = (userId: string) => `/dashboard/users/profile?id=${userId}`;

const PostCard = ({ post, guess }: PostCardProps) => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: likedIds } = useGetAllLikedContent(user.isAuthenticated);
  const { mutate: likeContent } = useCreateLikeContent();
  const { mutate: unlikeContent } = useDeleteLikeContent();
  const { mutate: deletePost } = useDeletePost();
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user.isAuthenticated && user.id === post.author?.id;
  const authorType = post.author?.userType;
  const canGuess = guess && (authorType === "BOT" || authorType === "REGULAR");
  const memberOnlyTitle = user.isAuthenticated ? undefined : "Sign in to interact";

  const isLiked = (contentId: string) => likedIds?.includes(contentId) ?? false;

  const toggleLike = (contentId: string, type: "post" | "comment") => {
    const data = {
      userId: user.id,
      [type === "post" ? "postId" : "commentId"]: contentId,
    };

    if (isLiked(contentId)) unlikeContent(data);
    else likeContent(data);
  };

  return (
    <article className="card">
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar src={post.author?.profilePicture} name={post.author?.name} />
          <div>
            <Link href={profileLink(post.author?.id)} className="font-semibold hover:underline">
              {post.author?.name}
            </Link>
            <p className="dark:font-mono text-xs text-muted">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-1">
            <ActionButton onClick={() => setIsEditing(true)} aria-label="Edit post">
              <EditOutlinedIcon sx={{ fontSize: 18 }} />
            </ActionButton>
            <ActionButton onClick={() => setIsDeleting(true)} aria-label="Delete post">
              <DeleteOutlineIcon sx={{ fontSize: 18 }} />
            </ActionButton>
          </div>
        )}

        {canGuess &&
          (guess.hasGuessed ? (
            <span className="rounded-full bg-gray-200 px-2.5 py-1 text-xs font-medium dark:bg-slate-800">
              {authorType === "BOT" ? "🤖 Bot" : "🧑 Human"}
            </span>
          ) : (
            <div className="flex gap-1">
              <ActionButton onClick={() => guess.onGuess("BOT")} title="I think this is a bot">
                🤖
              </ActionButton>
              <ActionButton onClick={() => guess.onGuess("REGULAR")} title="I think this is a human">
                🧑
              </ActionButton>
            </div>
          ))}
      </header>

      <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>

      <footer className="mt-4 flex items-center gap-1 border-t border-gray-300 pt-3 dark:border-slate-800">
        <ActionButton
          active={isLiked(post.id)}
          disabled={!user.isAuthenticated}
          title={memberOnlyTitle}
          onClick={() => toggleLike(post.id, "post")}
        >
          {isLiked(post.id) ? (
            <ThumbUpIcon sx={{ fontSize: 18 }} />
          ) : (
            <ThumbUpOutlinedIcon sx={{ fontSize: 18 }} />
          )}
          {post.likes?.length ?? 0}
        </ActionButton>
        <ActionButton
          active={isCommenting}
          disabled={!user.isAuthenticated}
          title={memberOnlyTitle}
          onClick={() => setIsCommenting(!isCommenting)}
        >
          <ChatBubbleOutlineIcon sx={{ fontSize: 18 }} />
          {post.comments?.length ?? 0}
        </ActionButton>
      </footer>

      {isCommenting && <CommentForm postId={post.id} onDone={() => setIsCommenting(false)} />}

      {post.comments?.length > 0 && (
        <ul className="mt-4 space-y-4 border-l-2 border-gray-300 pl-4 dark:border-slate-800">
          {post.comments.map((comment) => (
            <li key={comment.id}>
              <div className="flex items-center gap-2">
                <Avatar src={comment.author?.profilePicture} name={comment.author?.name} size={28} />
                <Link href={profileLink(comment.author?.id)} className="text-sm font-semibold hover:underline">
                  {comment.author?.name}
                </Link>
                <span className="dark:font-mono text-xs text-muted">{formatDate(comment.createdAt)}</span>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm">{comment.content}</p>
              <ActionButton
                className="mt-1 -ml-2"
                active={isLiked(comment.id)}
                disabled={!user.isAuthenticated}
                title={memberOnlyTitle}
                onClick={() => toggleLike(comment.id, "comment")}
              >
                {isLiked(comment.id) ? (
                  <ThumbUpIcon sx={{ fontSize: 16 }} />
                ) : (
                  <ThumbUpOutlinedIcon sx={{ fontSize: 16 }} />
                )}
                {comment.likes?.length ?? 0}
              </ActionButton>
            </li>
          ))}
        </ul>
      )}

      {isEditing && <EditPostModal post={post} onClose={() => setIsEditing(false)} />}

      {isDeleting && (
        <Modal title="Do you really wish to delete your post?" onClose={() => setIsDeleting(false)}>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsDeleting(false)}>
              No
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deletePost(post.id);
                setIsDeleting(false);
              }}
            >
              Yes
            </Button>
          </div>
        </Modal>
      )}
    </article>
  );
};

export default PostCard;
