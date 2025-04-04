import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreateLikeContentRequest from "../../interfaces/like/CreateLikeContentRequest";
import Like from "../../interfaces/like/Like";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createLikeContent = async (
  data: CreateLikeContentRequest
): Promise<Like> => {
  try {
    const response = await api.post("/api/v1/likes", data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot like this content. Try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useCreateLikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLikeContent,
    onSuccess: (newLike) => {
      queryClient.invalidateQueries({ queryKey: ["like", newLike.id] });
      queryClient.invalidateQueries({ queryKey: ["timeline"] });
      queryClient.invalidateQueries({ queryKey: ["likes"] });

      queryClient.setQueryData<Like[]>(["like", newLike.id], (oldData) => {
        if (!oldData) return [newLike];
        return [...oldData, newLike];
      });
    },
  });
};
