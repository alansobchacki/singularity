import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";

const unexpectedErrorText = "Unexpected error. Please try again.";

const deletePost = async (id: string): Promise<void> => {
  try {
    const response = await api.delete(`/api/v1/posts/${id}`);

    if (response.status === 204) return;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || unexpectedErrorText;
      throw new Error(errorMessage);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
    },
  });
};
