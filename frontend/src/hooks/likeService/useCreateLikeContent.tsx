import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import CreateLikeContentRequest from "../../interfaces/like/CreateLikeContentRequest";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createLikeContent = async (
  data: CreateLikeContentRequest
): Promise<any> => {
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
      try {
        queryClient.invalidateQueries({
          queryKey: ["like", newLike.likeId],
        });
        queryClient.invalidateQueries({ queryKey: ["timeline"] });

        queryClient.setQueryData(["like", newLike.likeId], (oldData: any) => {
          if (!oldData) return [newLike];
          return [...oldData, newLike];
        });
      } catch (err) {
        console.error(unexpectedErrorText);
      }
    },
  });
};
