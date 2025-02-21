import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreateCommentRequest from "../../interfaces/comment/createCommentRequest";

const unexpectedErrorText = "Unexpected error. Please try again.";

// replace promise<any> with a proper<comment> interface later
const createComment = async (data: CreateCommentRequest): Promise<any> => {
  try {
    const response = await api.post(`/api/v1/comment`, data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Failed to add comment. Try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      try {
        queryClient.invalidateQueries({
          queryKey: ["comments", newComment.postId],
        });
        queryClient.invalidateQueries({ queryKey: ["timeline"] });

        queryClient.setQueryData(
          ["comments", newComment.postId],
          (oldData: any) => {
            if (!oldData) return [newComment];
            return [...oldData, newComment];
          }
        );
      } catch (err) {
        console.error(unexpectedErrorText);
      }
    },
  });
};
