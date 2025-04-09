import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { User } from "../../interfaces/user/User";

const unexpectedErrorText = "Unexpected error. Please try again.";

interface PaginatedUsersResponse {
  data: User[];
  total: number;
  page: number;
  limit: number;
}

const getAllUsers = async (page: number): Promise<PaginatedUsersResponse> => {
  try {
    const response = await api.get(`/api/v1/users/all?page=${page}`);
    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error("Cannot fetch users. Please try again later.");
    }
  }
  throw new Error(unexpectedErrorText);
};

export const useGetAllUsers = (page: number) =>
  useQuery<PaginatedUsersResponse>({
    queryKey: ["all-users", page],
    queryFn: () => getAllUsers(page),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    placeholderData: undefined,
  });
