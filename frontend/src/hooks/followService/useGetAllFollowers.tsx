import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { Follow } from "../../interfaces/follow/Follow";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getAllFollowers = async (id: string): Promise<Follow[]> => {
  try {
    const response = await api.get<Follow[]>(`/api/v1/follow/${id}/followers`);

    if (response.status === 200) return response.data;
    if (response.status === 204) return [];
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Unable to fetch followers. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetAllFollowers = (id: string) => {
  return useQuery<Follow[]>({
    queryKey: ["followers", id],
    queryFn: () => getAllFollowers(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};

