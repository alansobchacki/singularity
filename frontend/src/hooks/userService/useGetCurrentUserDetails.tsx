import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { User } from "../../interfaces/user/User";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getCurrentUserDetails = async (): Promise<User> => {
  try {
    const response = await api.get("/api/v1/users/self");

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch the current user. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetCurrentUserDetails = () => {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: getCurrentUserDetails,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
