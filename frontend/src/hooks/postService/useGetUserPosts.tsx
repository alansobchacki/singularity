import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import Post from "../../interfaces/post/Post";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getUserPosts = async (id: string): Promise<Post[]> => {
  try {
    const response = await api.get(`/api/v1/posts/${id}`);

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error(
        `Cannot fetch posts from user ${id}. Please try again later.`
      );
  }

  throw new Error(unexpectedErrorText);
};

export const useGetUserPosts = (id: string) => {
  return useQuery({
    queryKey: ["posts", id],
    queryFn: () => getUserPosts(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
