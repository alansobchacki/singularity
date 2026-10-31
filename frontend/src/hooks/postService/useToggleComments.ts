import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { toast } from "react-toastify";

const unexpectedErrorText = "Unexpected error. Please try again.";

const toggleComments = async ({
  postId,
  commentsDisabled,
}: {
  postId: string;
  commentsDisabled: boolean;
}): Promise<void> => {
  try {
    await api.put(`/api/v1/posts/${postId}/comments`, { commentsDisabled });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || unexpectedErrorText);
    }
    throw new Error(unexpectedErrorText);
  }
};

export const useToggleComments = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { postId: string; commentsDisabled: boolean }>({
    mutationFn: toggleComments,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};
