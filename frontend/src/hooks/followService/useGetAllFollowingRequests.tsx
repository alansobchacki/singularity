import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getFollowingRequests = async (): Promise<any> => {
  try {
    const response = await api.get("/api/v1/follow/following");

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch follow requests. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetFollowingRequests = () => {
  return useQuery({
    queryKey: ["following-requests"],
    queryFn: getFollowingRequests,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
