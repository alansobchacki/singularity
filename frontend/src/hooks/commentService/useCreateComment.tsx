import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreateCommentRequest from "../../interfaces/comment/CreateCommentRequest";
import { Comment } from "../../interfaces/comment/Comment";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createComment = async (data: CreateCommentRequest): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(`/api/v1/comment`, data);
    if (response.status === 201) return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation<Comment, Error, CreateCommentRequest>({
    mutationFn: createComment,
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({
        queryKey: ["comments", newComment.post.id],
      });

      queryClient.invalidateQueries({ queryKey: ["timeline"] });

      queryClient.setQueryData<Comment[]>(
        ["comments", newComment.post.id],
        (oldData) => (oldData ? [...oldData, newComment] : [newComment])
      );
    },
  });
};
