import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getAllFollowers = async (id: string): Promise<any> => {
  try {
    const response = await api.get(`/api/v1/follow/${id}/followers`);

    if (response.status === 200 || response.status === 204)
      return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Unable to fetch followers. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetAllFollowers = (id: string) => {
  return useQuery({
    queryKey: ["followers"],
    queryFn: () => getAllFollowers(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
