"use client";

import { useSearchParams } from "next/navigation";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import { useGetUserDetails } from "../../../../hooks/userService/useGetUserDetails";
import { useGetAllFollowers } from "../../../../hooks/followService/useGetAllFollowers";
import { useGetUserPosts } from "../../../../hooks/postService/useGetUserPosts";
import PostCard from "../../../../components/feed/PostCard";
import Avatar from "../../../../components/Avatar";
import LoadingSpinner from "../../../../components/LoadingSpinner";

const UserProfilePage = () => {
  const id = useSearchParams().get("id") as string;
  const { data: user, isLoading: isLoadingUser } = useGetUserDetails(id);
  const { data: followers } = useGetAllFollowers(id);
  const { data: posts, isLoading: isLoadingPosts } = useGetUserPosts(id);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <section className="card">
        {isLoadingUser ? (
          <LoadingSpinner />
        ) : (
          <div className="flex items-center gap-5">
            <Avatar src={user?.profilePicture} name={user?.name} size={80} />
            <div className="min-w-0 space-y-1">
              <h1 className="text-xl font-semibold">{user?.name}</h1>
              {user?.bio && <p className="text-gray-700 dark:text-slate-300">{user.bio}</p>}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                {user?.location && (
                  <span className="inline-flex items-center gap-1">
                    <LocationOnOutlinedIcon sx={{ fontSize: 16 }} />
                    {user.location}
                  </span>
                )}
                <span className="dark:font-mono">{followers?.length ?? 0} followers</span>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="section-label">Posts</h2>

        {isLoadingPosts ? (
          <LoadingSpinner />
        ) : posts?.length ? (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <p className="card text-muted">{user?.name} hasn&apos;t posted anything yet.</p>
        )}
      </section>
    </div>
  );
};

export default UserProfilePage;
