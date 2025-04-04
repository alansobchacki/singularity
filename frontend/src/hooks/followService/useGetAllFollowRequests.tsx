import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { Follow } from "../../interfaces/follow/Follow";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getFollowRequests = async (): Promise<Follow[]> => {
  try {
    const response = await api.get<Follow[]>("/api/v1/follow/requests");

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch follow requests. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetFollowRequests = () => {
  return useQuery<Follow[]>({
    queryKey: ["follow-requests"],
    queryFn: getFollowRequests,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
