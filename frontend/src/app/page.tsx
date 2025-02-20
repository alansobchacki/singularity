"use client";

import { useEffect } from "react";
import { useGetTimeline } from "../hooks/postService/useGetTimeline";
import ProtectedRoute from "../components/ProtectedRoute";

const HomePage = () => {
  const { data } = useGetTimeline();

  useEffect(() => {
    console.log(data);
  }, [data]);

  return (
    <ProtectedRoute>
      <>
        <h1>It works!</h1>
        <p>And you shouldn't be viewing this if you're not logged in!</p>
      </>
    </ProtectedRoute>
  );
};

export default HomePage;
