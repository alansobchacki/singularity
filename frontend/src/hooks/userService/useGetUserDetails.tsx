import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { User } from "../../interfaces/user/User";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getUserDetails = async (id: string): Promise<User> => {
  try {
    const response = await api.get(`/api/v1/users/${id}`);

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(`Cannot fetch user ${id}. Please try again later.`);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useGetUserDetails = (id: string) => {
  return useQuery({
    queryKey: ["user", id],
    queryFn: () => getUserDetails(id),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    enabled: !!id,
  });
};
