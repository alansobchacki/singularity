import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import axios from "axios";
import DeleteLikeContentRequest from "../../interfaces/like/DeleteLikeContentRequest";

const unexpectedErrorText = "Unexpected error. Please try again.";

const deleteLikeContent = async (
  data: DeleteLikeContentRequest
): Promise<any> => {
  try {
    const response = await api.delete("/api/v1/likes", {
      data,
    });

    if (response.status === 204) return data.postId || data.commentId;
  } catch (err) {
    if (axios.isAxiosError(err))
      throw new Error("Cannot unlike this content. Try again later.");
  }

  throw new Error(unexpectedErrorText);
};

export const useDeleteLikeContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLikeContent,
    onSuccess: (contentId) => {
      try {
        console.log("COMMENT IS BEING DELETED");
        queryClient.invalidateQueries({ queryKey: ["likes"] });
        queryClient.invalidateQueries({ queryKey: ["timeline"] });

        queryClient.setQueryData(["likes"], (oldData: string[] | undefined) => {
          if (!oldData) return [];
          return oldData.filter((id) => id !== contentId);
        });
      } catch (err) {
        console.error(unexpectedErrorText);
      }
    },
  });
};
