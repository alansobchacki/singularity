"use client";

import ProtectedRoute from "../components/ProtectedRoute";

const HomePage = () => {
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
