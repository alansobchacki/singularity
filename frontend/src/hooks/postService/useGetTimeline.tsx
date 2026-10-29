import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import TimelinePage from "../../interfaces/post/TimelinePage";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getTimelinePage = async (page: number): Promise<TimelinePage> => {
  try {
    const response = await api.get(`/api/v1/posts/timeline?page=${page}`);

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch timeline. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetTimeline = () => {
  return useInfiniteQuery({
    queryKey: ["timeline"],
    queryFn: ({ pageParam }) => getTimelinePage(pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextPage ?? undefined,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
