import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getAllUsers = async (): Promise<any> => {
  try {
    const response = await api.get("/api/v1/users/all");

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch users. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetAllUsers = () => {
  return useQuery({
    queryKey: ["all-users"],
    queryFn: getAllUsers,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
