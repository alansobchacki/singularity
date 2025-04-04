import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreatePostRequest from "../../interfaces/post/CreatePostRequest";
import Post from "../../interfaces/post/Post";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createPost = async (data: CreatePostRequest): Promise<Post> => {
  try {
    const response = await api.post<Post>(`/api/v1/posts`, data);

    if (response.status === 201) return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || unexpectedErrorText;
      throw new Error(errorMessage);
    }
  }

  throw new Error(unexpectedErrorText);
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();

  return useMutation<Post, Error, CreatePostRequest>({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      queryClient.invalidateQueries({
        queryKey: ["posts", newPost.id],
      });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });

      queryClient.setQueryData<Post[]>(["posts", newPost.id], (oldData) => {
        if (!oldData) return [newPost];
        return [...oldData, newPost];
      });
    },
  });
};
