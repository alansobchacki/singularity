"use client";

import { useEffect } from "react";
import { useGetTimeline } from "../hooks/postService/useGetTimeline";
import ProtectedRoute from "../components/ProtectedRoute";

const HomePage = () => {
  const { data, isLoading } = useGetTimeline();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ProtectedRoute>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-[#353535] z-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      {data?.length > 0 ? (
        data.map((post: any, index: number) => (
          <div key={index} className="flex flex-col border-b p-4">
            <p className="font-bold">{post.author?.name}</p>
            <p>{post.content}</p>
            <p>Likes: {post.likes?.length ?? 0}</p>

            {post.comments?.length > 0 ? (
              <div className="mt-2 pl-4 border-l">
                <p className="font-semibold">Comments:</p>
                {post.comments.map((comment: any, commentIndex: number) => (
                  <div key={commentIndex} className="mt-1">
                    <p className="text-sm font-medium">
                      {comment.author?.name}
                    </p>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        ))
      ) : (
        <p>No posts available.</p>
      )}
    </ProtectedRoute>
  );
};

export default HomePage;
