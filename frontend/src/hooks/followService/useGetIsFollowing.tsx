import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getIsFollowing = async (id: string): Promise<any> => {
  try {
    const response = await api.get(
      `/api/v1/follow/is-following?followingId=${id}`
    );

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Unable to fetch follow relationship. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetIsFollowing = (id: string) => {
  return useQuery({
    queryKey: ["is-following", id],
    queryFn: () => getIsFollowing(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
