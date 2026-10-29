"use client";

import { useEffect, useRef } from "react";
import { useAtomValue } from "jotai";
import { hydratedAuthStateAtom } from "../../state/authState";
import { useGetTimeline } from "../../hooks/postService/useGetTimeline";
import useBotDetectionGame from "../../hooks/utility/useBotDetectionGame";
import Post from "../../interfaces/post/Post";
import AboutCard from "../../components/feed/AboutCard";
import CreatePostForm from "../../components/feed/CreatePostForm";
import JoinPrompt from "../../components/feed/JoinPrompt";
import BotGameBanner from "../../components/feed/BotGameBanner";
import PostCard from "../../components/feed/PostCard";
import PostCardSkeleton from "../../components/feed/PostCardSkeleton";

const HomePage = () => {
  const user = useAtomValue(hydratedAuthStateAtom);
  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } = useGetTimeline();
  const { scores, makeGuess, hasGuessedPost } = useBotDetectionGame();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const posts = data?.pages.flatMap((page) => page.posts) ?? [];

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) fetchNextPage();
      },
      { rootMargin: "300px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const guessFor = (post: Post) =>
    user.isAuthenticated
      ? undefined
      : {
          hasGuessed: hasGuessedPost(post.author.id),
          onGuess: (guess: "BOT" | "REGULAR") =>
            makeGuess(post.author.id, post.author.userType, guess),
        };

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <AboutCard />

      {user.isAuthenticated ? <CreatePostForm authorId={user.id} /> : <JoinPrompt />}

      <section className="flex flex-col gap-4">
        <h2 className="section-label">Latest posts</h2>

        {!user.isAuthenticated && <BotGameBanner scores={scores} />}

        {isLoading ? (
          Array.from({ length: 3 }, (_, index) => <PostCardSkeleton key={index} />)
        ) : posts.length ? (
          posts.map((post) => <PostCard key={post.id} post={post} guess={guessFor(post)} />)
        ) : (
          <p className="card text-muted">No posts yet.</p>
        )}

        {isFetchingNextPage && <PostCardSkeleton />}
        <div ref={loadMoreRef} />
      </section>
    </div>
  );
};

export default HomePage;
