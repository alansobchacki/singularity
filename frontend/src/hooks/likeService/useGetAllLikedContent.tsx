import { useQuery } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import Like from "../../interfaces/like/Like";

const unexpectedErrorText = "Unexpected error. Please try again.";

const getAllLikedContent = async (): Promise<Like[]> => {
  try {
    const response = await api.get("/api/v1/likes");

    if (response.status === 200) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot fetch likes. Please try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useGetAllLikedContent = () => {
  return useQuery({
    queryKey: ["likes"],
    queryFn: getAllLikedContent,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
};
