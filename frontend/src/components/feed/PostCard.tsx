import { useState } from "react";
import { useAtomValue } from "jotai";
import Link from "next/link";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbUpOutlinedIcon from "@mui/icons-material/ThumbUpOutlined";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import { hydratedAuthStateAtom } from "../../state/authState";
import { useGetAllLikedContent } from "../../hooks/likeService/useGetAllLikedContent";
import { useCreateLikeContent } from "../../hooks/likeService/useCreateLikeContent";
import { useDeleteLikeContent } from "../../hooks/likeService/useDeleteLikeContent";
import { useDeletePost } from "../../hooks/postService/useDeletePost";
import { usePinPost } from "../../hooks/postService/usePinPost";
import Post from "../../interfaces/post/Post";
import Avatar from "../Avatar";
import Button from "../Button";
import Modal from "../Modal";
import Skeleton from "../Skeleton";
import ActionButton from "./ActionButton";
import CommentForm from "./CommentForm";
import EditPostModal from "./EditPostModal";
import SkillTags from "./SkillTags";

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

const editedLabels = {
  AUTHOR: "Edited by the author",
  MODERATION: "Edited by the moderation",
};

interface LikeButtonProps {
  count: number;
  liked: boolean;
  loading: boolean;
  disabled: boolean;
  title?: string;
  iconSize: number;
  className?: string;
  onClick: () => void;
}

const LikeButton = ({ count, liked, loading, iconSize, className = "", ...props }: LikeButtonProps) => {
  if (loading) return <Skeleton className={`h-7 w-12 rounded-md ${className}`} />;

  return (
    <ActionButton active={liked} className={className} {...props}>
      {liked ? <ThumbUpIcon sx={{ fontSize: iconSize }} /> : <ThumbUpOutlinedIcon sx={{ fontSize: iconSize }} />}
      {count}
    </ActionButton>
  );
};

const PostCard = ({ post, guess }: PostCardProps) => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data: likedIds, isLoading: isLoadingLikes } = useGetAllLikedContent(user.isAuthenticated);
  const { mutate: likeContent } = useCreateLikeContent();
  const { mutate: unlikeContent } = useDeleteLikeContent();
  const { mutate: deletePost } = useDeletePost();
  const { mutate: pinPost } = usePinPost();
  const [isCommenting, setIsCommenting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isOwner = user.isAuthenticated && user.id === post.author?.id;
  const isAdmin = user.isAuthenticated && user.credentials === "ADMIN";
  const canManage = !post.isDeleted && (isOwner || isAdmin);
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
            <p className="dark:font-mono text-xs text-muted">
              {formatDate(post.createdAt)}
              {post.editedBy && !post.isDeleted && ` · ${editedLabels[post.editedBy]}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {post.isPinned && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-700 dark:bg-emerald-400/10 dark:text-emerald-400">
              <PushPinOutlinedIcon sx={{ fontSize: 14 }} />
              Pinned
            </span>
          )}

          {isAdmin && !post.isDeleted && (
            <ActionButton
              active={post.isPinned}
              onClick={() => pinPost({ postId: post.id, isPinned: !post.isPinned })}
              aria-label={post.isPinned ? "Unpin post" : "Pin post"}
            >
              {post.isPinned ? <PushPinIcon sx={{ fontSize: 18 }} /> : <PushPinOutlinedIcon sx={{ fontSize: 18 }} />}
            </ActionButton>
          )}

          {canManage && (
            <>
              <ActionButton onClick={() => setIsEditing(true)} aria-label="Edit post">
                <EditOutlinedIcon sx={{ fontSize: 18 }} />
              </ActionButton>
              <ActionButton onClick={() => setIsDeleting(true)} aria-label="Delete post">
                <DeleteOutlineIcon sx={{ fontSize: 18 }} />
              </ActionButton>
            </>
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
        </div>
      </header>

      {post.isDeleted ? (
        <p className="mt-3 italic text-muted">This post was deleted by the moderation</p>
      ) : (
        <p className="mt-3 whitespace-pre-wrap break-words leading-relaxed">{post.content}</p>
      )}

      {post.isPinned && post.author?.userType === "ADMIN" && !post.isDeleted && <SkillTags />}

      {!post.isDeleted && (
        <footer className="mt-4 flex items-center gap-1 border-t border-gray-300 pt-3 dark:border-slate-800">
          <LikeButton
            count={post.likes?.length ?? 0}
            liked={isLiked(post.id)}
            loading={isLoadingLikes}
            disabled={!user.isAuthenticated}
            title={memberOnlyTitle}
            iconSize={18}
            onClick={() => toggleLike(post.id, "post")}
          />
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
      )}

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
              <LikeButton
                className="mt-1 -ml-2"
                count={comment.likes?.length ?? 0}
                liked={isLiked(comment.id)}
                loading={isLoadingLikes}
                disabled={!user.isAuthenticated}
                title={memberOnlyTitle}
                iconSize={16}
                onClick={() => toggleLike(comment.id, "comment")}
              />
            </li>
          ))}
        </ul>
      )}

      {isEditing && <EditPostModal post={post} onClose={() => setIsEditing(false)} />}

      {isDeleting && (
        <Modal
          title={isOwner ? "Do you really wish to delete your post?" : "Do you really wish to delete this post?"}
           onClose={() => setIsDeleting(false)}>
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
