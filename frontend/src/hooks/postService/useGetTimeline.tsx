import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import Post from "../../interfaces/post/Post";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getTimeline = async (): Promise<Post[]> => {
  try {
    const response = await api.get("/api/v1/posts/timeline");

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch timeline. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetTimeline = () => {
  return useQuery({
    queryKey: ["timeline"],
    queryFn: getTimeline,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
