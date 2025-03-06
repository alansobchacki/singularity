import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreatePostRequest from "../../interfaces/post/CreatePostRequest";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createPost = async (data: CreatePostRequest): Promise<any> => {
  try {
    const response = await api.post(`/api/v1/posts`, data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Failed to add post. Try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      try {
        queryClient.invalidateQueries({
          queryKey: ["posts", newPost.postId],
        });
        queryClient.invalidateQueries({ queryKey: ["timeline"] });

        queryClient.setQueryData(["posts", newPost.postId], (oldData: any) => {
          if (!oldData) return [newPost];
          return [...oldData, newPost];
        });
      } catch (err) {
        console.error(unexpectedErrorText);
      }
    },
  });
};
