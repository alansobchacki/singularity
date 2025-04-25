import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import { toast } from "react-toastify";
import Post from "../../interfaces/post/Post";

const unexpectedErrorText = "Unexpected error. Please try again.";

const editPost = async ({
  postId,
  content,
}: {
  postId: string;
  content: string;
}): Promise<Post> => {
  try {
    const response = await api.put(`/api/v1/posts/${postId}`, { content });

    if (response.status === 200) return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || unexpectedErrorText;
      throw new Error(errorMessage);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useEditPost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, { postId: string; content: string }>({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      toast.success("Post updated successfully! 🎉");
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update post");
    },
  });
};
