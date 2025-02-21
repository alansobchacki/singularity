import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

// to be rewritten - found a bug on the backend logic

const unexpectedErrorText = "Unexpected error. Please try again.";

const getTimeline = async (): Promise<any> => {
  try {
    const response = await api.post("/api/v1/like");

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot like this content. Try again later.");
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
