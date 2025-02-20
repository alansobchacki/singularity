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
      <>
        {isLoading ? (
          <p>Loading data...</p>
        ) : (
          data.map((post: any, index: number) => (
            <div key={index}>
              <p>{post.author.name}</p>
              <p>{post.content}</p>
              <p>Likes: {post.likes.length}</p>
            </div>
          ))
        )}
      </>
    </ProtectedRoute>
  );
};

export default HomePage;
