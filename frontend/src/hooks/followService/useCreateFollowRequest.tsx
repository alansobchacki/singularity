import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../../config/axios";
import { toast } from "react-toastify";
import axios from "axios";
import CreateFollowRequest from "../../interfaces/follow/CreateFollowRequest";
import { Follow } from "../../interfaces/follow/Follow";

const unexpectedErrorText = "Unexpected error. Please try again.";

const createFollowRequest = async (
  data: CreateFollowRequest
): Promise<Follow> => {
  try {
    const response = await api.post(`/api/v1/follow`, data);

    if (response.status === 201) return response.data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 403)
      throw new Error("Unable to send a follow request. Please try again.");
  }

  throw new Error(unexpectedErrorText);
};

export const useCreateFollowRequest = () => {
  const queryClient = useQueryClient();

  return useMutation<Follow, Error, CreateFollowRequest>({
    mutationFn: createFollowRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["following-requests"] });
      toast.success("Follow request sent! 🥳");
    },
    onError: (error) => {
      toast.error(error.message || "Could not follow user");
    },
  });
};
